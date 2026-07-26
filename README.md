# Apple Notes to PDF

**Export Apple Notes to PDF, Markdown, HTML, and plain text on macOS — fully local, no cloud upload.**

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![macOS](https://img.shields.io/badge/macOS-12%2B-black)](https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF)
[![Version](https://img.shields.io/badge/version-7.0.1-informational)](VERSION)
[![Privacy](https://img.shields.io/badge/privacy-100%25%20local-success)](SECURITY.md)

**Features infographic:** [SVG](docs/launch/features-infographic.svg) · [PNG](docs/launch/features-infographic.png)

**Website:** [Project docs & landing](docs/index.html) · **Release:** [Latest on GitHub](https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF/releases/latest)

Apple Notes to PDF is a free, open-source macOS tool that bulk-exports your Notes.app library into:

| Format | What you get |
|--------|----------------|
| **Master PDF** | Searchable archive of all notes as styled cards |
| **Per-note PDFs** | One PDF per note in a mirrored folder tree |
| **Markdown** | Obsidian/Logseq-ready `.md` with YAML frontmatter |
| **HTML** | Per-note pages + `master.html` with search & dark mode |
| **TXT + JSON** | Plain text dump + `index.json` / `manifest.json` |
| **Attachments** | Images, docs, audio, video in organized folders |

Everything runs on your Mac with **zsh + JXA + AppleScript** — no accounts, no telemetry, no third-party servers.

If you searched for *export Apple Notes to PDF*, *backup Notes.app without iCloud*, *Apple Notes to Markdown Obsidian*, or *bulk export Notes.app locally*, this is that workflow.

---

## Quick start

1. Download the **[latest release](https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF/releases/latest)**.
2. Unzip and keep these together:
   - `Apple Notes to PDF.app` (if included)
   - `export-apple-notes.sh`
   - `render-note-to-pdf.applescript`
   - `lib/` (required)
3. Double-click **Apple Notes to PDF.app**, or run:

```bash
chmod +x export-apple-notes.sh
./export-apple-notes.sh --limit 5
```

First run prompts for **Automation** access to Notes. The tool opens the correct System Settings pane.

---

## Output layout (v7)

Creates `~/Desktop/Apple_Notes_Export_YYYY-MM-DD/` (or `--output-dir`):

```
Apple_Notes_Export_YYYY-MM-DD/
  Apple_Notes_Master.pdf
  master.html              # search, TOC, dark mode
  notes.txt
  index.json
  manifest.json
  skipped.json             # locked / failed notes
  write-failures.json      # filesystem write issues (if any)
  notes/
    iCloud/
      Work/
        Meeting-notes.md
        Meeting-notes.html
        Meeting-notes.pdf
        Meeting-notes.txt
  attachments/
    images/ documents/ audio/ video/ other/
```

---

## CLI

```bash
./export-apple-notes.sh --help
./export-apple-notes.sh --version
./export-apple-notes.sh --limit 5
./export-apple-notes.sh --folder Work --format md,html
./export-apple-notes.sh --account iCloud --incremental
./export-apple-notes.sh --include-deleted   # include Recently Deleted
./export-apple-notes.sh --since 2025-01-01 --zip
```

| Flag | Purpose |
|------|---------|
| `--output-dir DIR` | Custom export folder |
| `--limit N` | First N matching notes (smoke test) |
| `--folder NAME` | Folder path substring filter |
| `--account NAME` | Account name substring filter |
| `--since DATE` | Only notes modified on/after date |
| `--format LIST` | `pdf`, `md`, `html`, `txt`, `json`, or `all` |
| `--incremental` | Skip unchanged notes (state file) |
| `--dry-run` | Plan only → `dry-run.json` |
| `--no-attachments` | Skip media export |
| `--zip` | Also create a zip of the export |
| `--quiet` | Less console output |
| `--no-progress` | Hide floating progress window |
| `--config FILE` | Load key=value config |
| `--version` / `--help` | Version / usage |

### Config file

Optional: `~/.config/apple-notes-to-pdf/config` — see [`config.example`](config.example).

Incremental state: `~/.config/apple-notes-to-pdf/state.json`.

---

## From source

```bash
git clone https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF.git
cd Apple-Notes-to-PDF
chmod +x export-apple-notes.sh export-apple-notes.command
./export-apple-notes.sh --limit 5
```

**Requirements:** macOS 12+, Notes.app, `zsh` (default on modern macOS).

---

## Why this exists

Apple does not ship a reliable “export everything” path for Notes. People usually want:

1. A **local backup** they control (not only iCloud).
2. A **searchable PDF** they can archive or print offline.
3. **Markdown** for Obsidian / Logseq / plain-file workflows.
4. **HTML** that opens in any browser years later.

This project stitches Notes → rich HTML → multi-format export **on-device** so your notes never leave the machine during export.

### Compared to alternatives

| | Apple Notes to PDF | Paid exporters | Other open tools |
|--|-------------------|----------------|------------------|
| Price | Free (MIT) | Paid | Free |
| 100% local / no account | Yes | Often yes | Varies |
| Zero third-party deps | Yes (shell + JXA) | App binary | Sometimes Swift/Node |
| Rich HTML body | Yes (v7) | Yes | Often |
| MD + PDF + HTML + JSON | Yes | Often | Partial |
| Incremental | Yes | Often | Sometimes |
| Telemetry | None | Check vendor | Check project |

We aim to be the **best free local** option: privacy-first, multi-format, hierarchy-preserving, and simple to audit.

---

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Permission dialog / empty export | System Settings → Privacy & Security → **Automation** → allow Terminal (or the `.app`) to control **Notes** |
| Attachments missing | Re-run without `--no-attachments`; optionally grant **Full Disk Access** for Media-store fallback |
| Locked notes missing | Unlock in Notes.app, or accept entries in `skipped.json` |
| PDF looks sparse | Open `master.html` in Safari → **File → Print → Save as PDF** |
| Huge libraries | Start with `--limit 20`, then `--folder`, then full run; use `--incremental` next time |
| Wrong version string | `cat VERSION` and `./export-apple-notes.sh --version` should both show **7.0.0** |

---

## FAQ

### Does this upload my notes to the cloud?

**No.** The export reads Notes locally and writes only to the folder you choose. See [SECURITY.md](SECURITY.md).

### Does it work with iCloud Notes?

Yes, for notes already synced into Notes.app on the Mac. The tool does not call iCloud APIs.

### Can I export only some notes?

`--limit`, `--folder`, `--account`, `--since`, and `--incremental`.

### What about rich formatting and checklists?

v7 reads `note.body` (HTML). Bold/italic/lists/tables/links are preserved when Notes exposes them. Checklists are mapped to Markdown task lists when markers are present. Apple’s Automation API has limits (drawings and some embeds may be incomplete).

### Is there telemetry?

No analytics, accounts, or crash-reporting endpoints in this repository.

---

## Privacy & security

Reads Notes **only on your machine**. No network calls for export. [SECURITY.md](SECURITY.md).

---

## International docs

- [Español](docs/i18n/README.es.md) · [Français](docs/i18n/README.fr.md) · [Deutsch](docs/i18n/README.de.md)
- [日本語](docs/i18n/README.ja.md) · [简体中文](docs/i18n/README.zh-CN.md) · [Português](docs/i18n/README.pt.md)
- [한국어](docs/i18n/README.ko.md) · [Italiano](docs/i18n/README.it.md) · [Русский](docs/i18n/README.ru.md)

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Keep the product **local-first**: no cloud backends, no forced accounts.

---

## License

MIT — see [LICENSE](LICENSE).

---

## Support

Bug reports and features: [GitHub Issues](https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF/issues).

**Free and open source.** Stars and constructive PRs help others find a private Notes backup path.

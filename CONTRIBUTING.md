# Contributing

Thanks for helping improve **Apple Notes to PDF**.

## Non-negotiables

1. **Local-first privacy** — no network calls, telemetry, accounts, or external APIs in the export path.
2. **MIT license** for contributions.
3. **macOS 12+** as the primary target; keep pure zsh + JXA + AppleScript unless there is a strong reason.
4. **No secrets or personal note content** in commits, issues, or fixtures.

## Dev setup

```bash
git clone https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF.git
cd Apple-Notes-to-PDF
chmod +x export-apple-notes.sh export-apple-notes.command
./export-apple-notes.sh --help
./export-apple-notes.sh --limit 3
```

Unit tests (Node, no Notes.app):

```bash
node tests/html-to-markdown.test.js
```

## Project layout

| Path | Role |
|------|------|
| `export-apple-notes.sh` | CLI, config, progress UI, launches engine |
| `lib/export-engine.jxa.js` | Notes extraction + multi-format writers |
| `lib/html-to-markdown.js` | HTML → Markdown (JXA + Node) |
| `render-note-to-pdf.applescript` | HTML → PDF (AppKit) |
| `docs/` | Landing page, i18n, launch assets |
| `tests/` | CI-safe tests |

## Pull requests

- Keep changes focused; update `VERSION` + `CHANGELOG.md` for user-visible work.
- Align version strings: `VERSION`, script help, README badges.
- Add or extend tests when changing `html-to-markdown.js`.
- Do not add package managers or cloud SDKs for core export.

## Code of conduct

See [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).

# Architecture — Apple Notes to PDF v7

## Invariants

- **100% local** — no network, telemetry, accounts, or external APIs during export
- **MIT** open source
- **macOS 12+** via Notes.app Automation (primary path)
- **Zero third-party runtime deps** beyond macOS (zsh + JXA + AppleScript + AppKit)

## Pipeline

```
CLI (export-apple-notes.sh)
  → parse flags + optional config (~/.config/apple-notes-to-pdf/config)
  → permission probe (Notes Automation)
  → progress UI (floating AppKit window)
  → JXA engine (lib/export-engine.jxa.js)
       → walk accounts → folders (recursive) → notes
       → filter: --account, --folder, --since, --limit, --incremental
       → for each note: id, title, body HTML, plaintext, dates, path, attachments
       → write hierarchy + formats
  → render PDFs (render-note-to-pdf.applescript via NSAttributedString)
  → optional ZIP
  → state file update (incremental)
```

## Extraction fidelity

| Source | Use |
|--------|-----|
| `note.body` | Primary rich HTML (headings, bold/italic, lists, colors, links, tables) |
| `note.plaintext` | Fallback + TXT export + checklist marker recovery |
| `note.id` | Stable unique key for incremental + JSON index |
| `creationDate` / `modificationDate` | Metadata, frontmatter, --since, incremental |
| `attachments` + `content identifier` | Save files; rewrite `cid:` / object tags in HTML |
| Optional Media store | FDA path fallback when Automation save fails |

Locked notes: catch Automation errors, skip with warning, list in `skipped.json`.

## Output layout

```
Apple_Notes_Export_YYYY-MM-DD/
  index.json                 # full metadata index
  manifest.json              # run options + counts + version
  skipped.json               # locked / failed notes
  master.html                # searchable archive + TOC + dark mode
  Apple_Notes_Master.pdf     # master PDF from master HTML
  notes.txt                  # concatenated plaintext
  notes/
    <Account>/
      <Folder>/.../
        <slug>.html
        <slug>.md
        <slug>.txt
        <slug>.pdf           # if format includes pdf
  attachments/
    images/ documents/ audio/ video/ other/
  .export-state.json         # written into output (copy also to config state)
```

## Formats

- **HTML** — note.body cleaned + CSS; archive with client-side search
- **Markdown** — pure JS converter (Obsidian YAML frontmatter, GFM checklists, relative images)
- **PDF** — per-note + master via AppKit print-to-PDF
- **TXT** — plaintext
- **JSON** — index + manifest

## Incremental

State: `~/.config/apple-notes-to-pdf/state.json` mapping `note.id → modificationDate`.
`--incremental` skips notes whose mod date is unchanged. `--since YYYY-MM-DD` filters by mod date.

## Packaging

- Shell + JXA + AppleScript sources (primary)
- `Apple Notes to PDF.app` (AppleScript applet launcher)
- Homebrew formula (tap-ready)
- GitHub Release zip + SHA256
- Landing site in `docs/` (GitHub Pages / Cloudflare)

## Privacy

No outbound network in export path. Config and state stay under user home. See SECURITY.md.

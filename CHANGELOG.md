# Changelog

All notable changes to **Apple Notes to PDF** are documented here.

## [7.0.1] — 2026-07-25

### Fixed
- **JXA crash** on plain-text export: `String(new Array(n)).join` is not a function in JavaScript for Automation — replaced with a literal separator
- **Case-insensitive filename collisions on APFS** (e.g. `TO DO` vs `To Do`, `Orphaned by Indifference` vs `Orphaned by indifference`) overwriting each other — slugs are now unique case-insensitively via `lib/path-utils.js`
- Export index could list paths that the filesystem folded together; writes are verified and reported in `write-failures.json`

### Improved
- **Recently Deleted** notes are skipped by default; pass `--include-deleted` to export them
- Shared `lib/path-utils.js` (NFC normalize, safer filenames) with Node unit tests
- Manifest includes `write_failure_count` and `include_deleted`
- Features infographic asset under `docs/launch/`

### Packaging
- Release zip `Apple-Notes-to-PDF-v7.0.1.zip` + SHA-256

## [7.0.0] — 2026-07-24

### Major — best free local Apple Notes exporter

#### Extraction & fidelity
- Switch from **plaintext-only** to full **rich HTML** via `note.body`
- Preserve headings, bold/italic/underline/strikethrough, colors, lists, tables, hyperlinks where Notes exposes them
- Checklist recovery (Unicode ☐/☑ and list heuristics) → GFM `- [ ]` / `- [x]` in Markdown
- Attachment pipeline: extract into `attachments/{images,documents,audio,video,other}/`, rewrite `cid:` / object tags to relative paths
- Optional Media-store fallback when Automation save fails (may need Full Disk Access)
- Locked / inaccessible notes skipped with warnings in `skipped.json`
- Multi-account support with `--account` filter; full folder path hierarchy preserved on disk
- Metadata: creation/modification dates, folder path, note id, account

#### Output formats (all local)
- **Master PDF** (`Apple_Notes_Master.pdf`) from styled master HTML
- **Per-note PDFs** under mirrored `notes/<Account>/<Folder>/`
- **Markdown** with YAML frontmatter (Obsidian / Logseq ready)
- **Clean HTML** per note + **searchable master.html** (TOC, search box, dark/light toggle, print-friendly)
- **Plain text** + **index.json** + **manifest.json**
- Optional **ZIP** of the export folder (`--zip`)

#### CLI & UX
- New flags: `--account`, `--since`, `--format`, `--incremental`, `--zip`, `--quiet`, `--no-progress`, `--config`
- Config file: `~/.config/apple-notes-to-pdf/config` (see `config.example`)
- Incremental export via `~/.config/apple-notes-to-pdf/state.json`
- Dry-run writes structured `dry-run.json`
- Improved floating progress window (accurate counts)
- Version single-sourced from `VERSION` file

#### Packaging & docs
- Homepage / landing page under `docs/` (GitHub Pages ready)
- Homebrew formula stub under `homebrew/`
- Expanded CI: ShellCheck, version gates, Markdown converter unit tests
- SECURITY.md, CONTRIBUTING.md, CODE_OF_CONDUCT.md refreshed
- Multi-language README stubs under `docs/i18n/`
- Launch marketing pack under `docs/launch/`

#### Bug fixes (from 6.x)
- Fixed master HTML **CSS class mismatch** (styles never applied to note cards)
- Attachment directories are actually populated
- `DRY_RUN` / attachment flags honored in the export engine
- Removed aggressive `killall Finder` side effect
- Heredoc-unsafe note body writes replaced with Foundation UTF-8 file writes
- VERSION / README / window title alignment

### Privacy
- Still **zero network** during export. No telemetry. MIT.

## [6.1.0] — prior

- CLI flags: limit, folder, output-dir, dry-run, no-attachments, version, help
- Master PDF + HTML via NSAttributedString pipeline
- Progress window (basic)

## [6.0.2] — prior

- Release packaging and docs polish

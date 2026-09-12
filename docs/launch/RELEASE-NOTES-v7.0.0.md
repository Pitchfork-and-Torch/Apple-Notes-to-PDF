# Apple Notes to PDF v7.0.0

**The free, local-first bulk exporter for Notes.app — major fidelity upgrade.**

## Highlights

- **Rich HTML extraction** via `note.body` (not plaintext-only)
- **Multi-format:** master PDF, per-note PDFs, Markdown (YAML frontmatter), HTML archive, TXT, JSON
- **Attachments** into organized folders with HTML rewrite for `cid:` embeds
- **Folder hierarchy** mirrored under `notes/<Account>/<Folder>/`
- **Incremental** exports + `--since` / `--account` / `--format` / `--zip`
- **Searchable master.html** with TOC, search, dark mode
- Still **100% local** — no cloud, no telemetry, MIT

## Install

1. Download `Apple-Notes-to-PDF-v7.0.0.zip`
2. Unzip; keep `export-apple-notes.sh`, `render-note-to-pdf.applescript`, and `lib/` together
3. `chmod +x export-apple-notes.sh` then `./export-apple-notes.sh --limit 5`
4. Or double-click **Apple Notes to PDF.app** if included

## Permissions

System Settings → Privacy & Security → **Automation** → allow control of **Notes**.  
Full Disk Access is optional (helps some attachment recovery).

## Verify

```text
SHA256  (see Apple-Notes-to-PDF-v7.0.0.sha256 in assets)
```

## Links

- README · SECURITY.md · docs/ landing page  
- https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF

## License

MIT © Pitchfork and Torch

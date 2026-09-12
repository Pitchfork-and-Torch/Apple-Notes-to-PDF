# Launch pack — Apple Notes to PDF v7.0.0

## Primary X / Twitter post

**Hook (280-safe draft):**

> Your Apple Notes are trapped in Notes.app.
>
> Free, open-source, 100% local exporter just hit v7:
>
> • Searchable master PDF  
> • Per-note PDFs  
> • Obsidian Markdown + YAML  
> • HTML archive with search  
> • Attachments + folder hierarchy  
> • Incremental backups  
>
> No cloud. No account. No telemetry. MIT.
>
> github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF

**Thread (5 posts):**

1. **Problem:** Apple still won’t give you a one-click “export all notes with formatting.” People rely on screenshots, copy-paste, or paid apps.
2. **Solution:** Apple Notes to PDF v7 runs entirely on your Mac (zsh + JXA + AppleScript). Automation permission only for the core path.
3. **Formats:** Master PDF, per-note PDF, Markdown (Obsidian-ready), HTML (search + dark mode), TXT, JSON index, organized attachments.
4. **Privacy:** Zero network during export. Audit the shell scripts in five minutes. MIT license.
5. **CTA:** Download the release, run `--limit 5`, star the repo if it saves you a weekend. Feedback welcome via Issues.

**Alt text for infographic (1200×675):**  
Diagram titled “From Notes lock-in to local freedom.” Left: locked Notes.app icon with “trapped knowledge.” Arrow through “rich HTML extraction” into outputs: searchable PDF, Markdown vault, HTML archive, attachments folders. Badge strip: “100% local · MIT · Free forever · macOS 12+.” Footer: github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF

## Reddit / HN blurb

**Title options:**
- Show HN: Apple Notes to PDF v7 — free local export to PDF, Markdown, HTML (no cloud)
- I open-sourced a 100% local Apple Notes bulk exporter (PDF + Obsidian MD)

**Body:**

Apple Notes to PDF is a MIT-licensed macOS tool that bulk-exports Notes.app using only Automation (no iCloud API, no account, no telemetry).

v7 adds rich HTML body extraction (not just plaintext), attachments, mirrored folder hierarchy, per-note PDFs, Obsidian-ready Markdown with YAML frontmatter, searchable master HTML, incremental mode, and a small static landing page.

```bash
./export-apple-notes.sh --limit 5
./export-apple-notes.sh --format md,html --folder Work
```

Repo: https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF  

Happy to hear edge cases: locked notes, huge libraries, multi-account setups.

## Subreddits (manual post)

- r/MacOS, r/apple, r/MacApps, r/privacy, r/ObsidianMD, r/selfhosted (if relevant), r/opensource

## GitHub Release body template

See `docs/launch/RELEASE-NOTES-v7.0.0.md`.

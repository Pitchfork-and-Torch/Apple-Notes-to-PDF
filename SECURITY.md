# Security Policy

## What this tool does

**Apple Notes to PDF** runs entirely on your Mac. It reads your local Apple Notes library via **Notes.app Automation** (AppleScript/JXA) and writes exports to a folder you choose (default: Desktop).

It does **not**:

- Upload notes, credentials, or exports to any server
- Require an account or API key
- Include analytics, telemetry, or “phone home” endpoints
- Need internet access once macOS permissions are granted

## Permissions

| Permission | Required? | Why |
|------------|-----------|-----|
| **Automation → Notes** | Yes (core) | Read titles, folder paths, HTML body, dates, attachment metadata |
| **Full Disk Access** | Optional | Improves recovery of attachment binaries from the Notes Media store when Automation `save` is incomplete |
| Network | No | Not used by the export path |

Grant only what you need. Smoke-test with:

```bash
./export-apple-notes.sh --limit 5 --dry-run
./export-apple-notes.sh --limit 5
```

## Trust boundaries

- **Input:** Notes.app scripting interface (user’s own library)
- **Output:** User-selected directory (path traversal: note titles and folder names are sanitized for filesystem use)
- **State:** `~/.config/apple-notes-to-pdf/state.json` (modification dates only + ids — not full note bodies)
- **Temp progress:** `/tmp/apple-notes-to-pdf-progress.txt` (title snippets for UI only)

## What we never collect

- No analytics or crash reporters in source
- No API keys or cloud credentials in this repository
- No sample private note content in releases

## Locked notes

Password-protected notes may be unreadable via Automation. The exporter skips them and records entries in `skipped.json` rather than failing the whole run.

## Reporting a vulnerability

1. Prefer [GitHub private vulnerability reporting](https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF/security) if enabled.
2. Or open a [GitHub issue](https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF/issues) **without** exploit details for critical issues until a fix is available.

Please include macOS version, tool version (`./export-apple-notes.sh --version`), and reproduction steps.

## Installing safely

1. Download only from [official GitHub releases](https://github.com/Pitchfork-and-Torch/Apple-Notes-to-PDF/releases).
2. Prefer cloning and reading `export-apple-notes.sh` + `lib/` before first run.
3. Do not run unsigned scripts from third-party mirrors.
4. Optional: verify release asset SHA-256 sums published with the release.

## Codesigning / notarization (distributors)

Upstream releases may ship as unsigned or ad-hoc signed AppleScript applets. For organizational distribution, sign with your Developer ID and notarize per Apple’s current guidance. The export logic itself does not require a special entitlement beyond Automation.

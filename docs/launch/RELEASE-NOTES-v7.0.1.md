# Apple Notes to PDF v7.0.1

Reliability release after full-library testing (340 notes on macOS).

## Fixes
- JXA plain-text export crash (`String(new Array).join`)
- Case-insensitive filename collisions on APFS (`TO DO` / `To Do`, etc.)
- Recently Deleted notes excluded by default (`--include-deleted` to include)
- Write verification → `write-failures.json`

## Assets
- Features infographic: `docs/launch/features-infographic.svg` / `.png`
- Poster: `docs/launch/features-infographic-poster.jpg`

## Verify
```bash
shasum -a 256 -c Apple-Notes-to-PDF-v7.0.1.sha256
```

#!/bin/zsh
# Build a clean release zip on macOS (preferred).
# Usage: ./scripts/build-release.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
VERSION="$(tr -d ' \r\n' < "$ROOT/VERSION")"
DIST="$ROOT/dist"
STAGE="$DIST/Apple-Notes-to-PDF-v${VERSION}"
ZIP="$DIST/Apple-Notes-to-PDF-v${VERSION}.zip"

rm -rf "$STAGE"
mkdir -p "$STAGE"

for f in export-apple-notes.sh export-apple-notes.command render-note-to-pdf.applescript \
  README.md LICENSE SECURITY.md VERSION CHANGELOG.md config.example logo.png logo.icns; do
  [[ -f "$ROOT/$f" ]] && cp "$ROOT/$f" "$STAGE/"
done
cp -R "$ROOT/lib" "$STAGE/lib"

# Optional .app if present in dist previous or local
if [[ -d "$ROOT/Apple Notes to PDF.app" ]]; then
  cp -R "$ROOT/Apple Notes to PDF.app" "$STAGE/"
elif [[ -d "$ROOT/dist/Apple-Notes-to-PDF-v6.0.2/Apple Notes to PDF.app" ]]; then
  cp -R "$ROOT/dist/Apple-Notes-to-PDF-v6.0.2/Apple Notes to PDF.app" "$STAGE/"
  # Refresh icon if available
  if [[ -f "$ROOT/logo.icns" ]]; then
    cp "$ROOT/logo.icns" "$STAGE/Apple Notes to PDF.app/Contents/Resources/applet.icns" 2>/dev/null || true
  fi
fi

chmod +x "$STAGE/export-apple-notes.sh" "$STAGE/export-apple-notes.command" 2>/dev/null || true

rm -f "$ZIP"
(
  cd "$DIST"
  ditto -c -k --sequesterRsrc --keepParent "Apple-Notes-to-PDF-v${VERSION}" "Apple-Notes-to-PDF-v${VERSION}.zip"
)

shasum -a 256 "$ZIP" | tee "$DIST/Apple-Notes-to-PDF-v${VERSION}.sha256"
echo "Built: $ZIP"

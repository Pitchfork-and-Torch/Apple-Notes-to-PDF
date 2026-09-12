# Builds a clean release zip (no .DS_Store, no __MACOSX).
# Usage: .\scripts\build-release.ps1 [-AppSource "path\to\Apple Notes to PDF.app"]

param(
    [string]$AppSource = "",
    [string]$Version = (Get-Content (Join-Path $PSScriptRoot "..\VERSION") -Raw).Trim()
)

$ErrorActionPreference = "Stop"
$root = Resolve-Path (Join-Path $PSScriptRoot "..")
$dist = Join-Path $root "dist"
$staging = Join-Path $dist "Apple-Notes-to-PDF-v$Version"
$zipPath = Join-Path $dist "Apple-Notes-to-PDF-v$Version.zip"

if (Test-Path $staging) { Remove-Item $staging -Recurse -Force }
New-Item -ItemType Directory -Path $staging -Force | Out-Null
New-Item -ItemType Directory -Path (Join-Path $staging "lib") -Force | Out-Null

$include = @(
    "export-apple-notes.sh",
    "export-apple-notes.command",
    "render-note-to-pdf.applescript",
    "README.md",
    "LICENSE",
    "SECURITY.md",
    "VERSION",
    "CHANGELOG.md",
    "config.example",
    "logo.png",
    "logo.icns"
)

foreach ($item in $include) {
    $src = Join-Path $root $item
    if (Test-Path $src) {
        Copy-Item $src (Join-Path $staging $item)
    }
}

Copy-Item (Join-Path $root "lib\*") (Join-Path $staging "lib") -Recurse

if (-not $AppSource) {
    $fallback = Join-Path $root "dist\Apple-Notes-to-PDF-v6.0.2\Apple Notes to PDF.app"
    if (Test-Path $fallback) { $AppSource = $fallback }
}

if ($AppSource -and (Test-Path $AppSource)) {
    Copy-Item -Path $AppSource -Destination (Join-Path $staging "Apple Notes to PDF.app") -Recurse
    $icns = Join-Path $root "logo.icns"
    if (Test-Path $icns) {
        $destIcns = Join-Path $staging "Apple Notes to PDF.app\Contents\Resources\applet.icns"
        if (Test-Path (Split-Path $destIcns)) {
            Copy-Item $icns $destIcns -Force
        }
    }
} else {
    Write-Host "Note: No .app bundle included (provide -AppSource on macOS build if needed)."
}

if (Test-Path $zipPath) { Remove-Item $zipPath -Force }
Compress-Archive -Path (Join-Path $staging "*") -DestinationPath $zipPath -CompressionLevel Optimal

$hash = (Get-FileHash -Algorithm SHA256 $zipPath).Hash.ToLower()
$hashFile = Join-Path $dist "Apple-Notes-to-PDF-v$Version.sha256"
Set-Content -Path $hashFile -Value "$hash  Apple-Notes-to-PDF-v$Version.zip" -NoNewline
Write-Host "Built: $zipPath"
Write-Host "SHA256: $hash"

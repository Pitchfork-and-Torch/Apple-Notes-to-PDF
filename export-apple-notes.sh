#!/bin/zsh
# Apple Notes to PDF v7 — local-first exporter (zsh + JXA + AppleScript)
# No network, no telemetry, no accounts. MIT License.

set -euo pipefail

# Resolve install directory (symlink / alias / .app-adjacent resilient)
_SCRIPT_SRC="${(%):-%N}"
if [[ -z "${_SCRIPT_SRC}" || "${_SCRIPT_SRC}" == "zsh" ]]; then
  _SCRIPT_SRC="$0"
fi
SCRIPT_DIR="$(cd "$(dirname "$_SCRIPT_SRC")" 2>/dev/null && pwd)"
# Walk up if launched from a nested path
while [[ ! -f "$SCRIPT_DIR/export-apple-notes.sh" || ! -f "$SCRIPT_DIR/render-note-to-pdf.applescript" ]]; do
  PARENT="$(dirname "$SCRIPT_DIR")"
  if [[ "$PARENT" == "$SCRIPT_DIR" || "$PARENT" == "/" ]]; then
    echo "Error: Could not locate export-apple-notes.sh and render-note-to-pdf.applescript" >&2
    exit 127
  fi
  SCRIPT_DIR="$PARENT"
done
cd "$SCRIPT_DIR" || exit 1

# Capture CLI name before functions (zsh rebinds $0 inside functions named like `usage`)
CLI_NAME="${0:t}"
[[ -z "$CLI_NAME" || "$CLI_NAME" == "zsh" ]] && CLI_NAME="export-apple-notes.sh"

# Version: prefer VERSION file, fall back to embedded
if [[ -f "$SCRIPT_DIR/VERSION" ]]; then
  VERSION="$(tr -d ' \r\n' < "$SCRIPT_DIR/VERSION")"
else
  VERSION="7.0.1"
fi

RENDER_SCRIPT="$SCRIPT_DIR/render-note-to-pdf.applescript"
ENGINE_SCRIPT="$SCRIPT_DIR/lib/export-engine.jxa.js"
CONFIG_DIR="${XDG_CONFIG_HOME:-$HOME/.config}/apple-notes-to-pdf"
CONFIG_FILE="$CONFIG_DIR/config"
STATE_FILE="$CONFIG_DIR/state.json"
PROGRESS_FILE="/tmp/apple-notes-to-pdf-progress.txt"

# Defaults (overridable by config then CLI)
OUTPUT_DIR=""
DRY_RUN=false
LIMIT=0
EXPORT_ATTACHMENTS=true
FOLDER_FILTER=""
ACCOUNT_FILTER=""
SINCE=""
FORMAT="all"
INCREMENTAL=false
QUIET=false
DO_ZIP=false
NO_PROGRESS=false
SHOW_WINDOW=true
INCLUDE_DELETED=false

log_info()    { [[ "$QUIET" == true ]] || echo "🍎 [INFO] $1"; }
log_warn()    { echo "⚠️  [WARN] $1" >&2; }
log_error()   { echo "❌ [ERROR] $1" >&2; }
log_success() { [[ "$QUIET" == true ]] || echo "✅ [SUCCESS] $1"; }

usage() {
  cat <<EOF
Apple Notes to PDF v${VERSION}

Export Apple Notes locally to PDF, Markdown, HTML, plain text, and JSON.
100% on-device. No cloud upload. Requires macOS Notes.app + Automation permission.

Usage:
  ${CLI_NAME} [options]

Options:
  --output-dir DIR     Write export here (default: ~/Desktop/Apple_Notes_Export_YYYY-MM-DD)
  --limit N            Export only the first N matching notes (smoke test)
  --folder NAME        Only notes whose folder path contains NAME (case-insensitive)
  --account NAME       Only notes in accounts whose name contains NAME
  --since DATE         Only notes modified on/after DATE (YYYY-MM-DD or ISO-8601)
  --format LIST        pdf,md,html,txt,json,all (comma-separated; default: all)
  --incremental        Skip notes unchanged since last export (state file)
  --dry-run            List matching notes; write dry-run.json only
  --no-attachments     Skip attachment extraction
  --zip                Create a .zip next to the export folder
  --quiet              Less console output
  --no-progress        Do not show floating progress window
  --include-deleted    Include notes in "Recently Deleted" (excluded by default)
  --config FILE        Load key=value config from FILE
  --version            Print version and exit
  --help               Show this help

Config file (optional):
  ${CONFIG_FILE}
  Keys: output_dir, limit, folder, account, since, format, incremental,
        attachments (true/false), zip (true/false), quiet (true/false)

Examples:
  ${CLI_NAME} --limit 5
  ${CLI_NAME} --folder Work --format md,html
  ${CLI_NAME} --incremental --since 2025-01-01
  ${CLI_NAME} --account iCloud --output-dir ~/Backups/notes --zip
  ${CLI_NAME} --include-deleted

Permissions:
  System Settings → Privacy & Security → Automation → allow Terminal (or this app) → Notes
  Full Disk Access is optional (improves attachment recovery from the Media store).

See README.md and SECURITY.md.
EOF
}

# --- config file (simple key=value, # comments) ---
load_config() {
  local file="$1"
  [[ -f "$file" ]] || return 0
  local key val
  while IFS= read -r line || [[ -n "$line" ]]; do
    line="${line%%#*}"
    line="${line#"${line%%[![:space:]]*}"}"
    line="${line%"${line##*[![:space:]]}"}"
    [[ -z "$line" ]] && continue
    key="${line%%=*}"
    val="${line#*=}"
    key="${key#"${key%%[![:space:]]*}"}"
    key="${key%"${key##*[![:space:]]}"}"
    val="${val#"${val%%[![:space:]]*}"}"
    val="${val%"${val##*[![:space:]]}"}"
    val="${val#\"}"
    val="${val%\"}"
    case "$key" in
      output_dir|OUTPUT_DIR) OUTPUT_DIR="$val" ;;
      limit|LIMIT) LIMIT="$val" ;;
      folder|FOLDER) FOLDER_FILTER="$val" ;;
      account|ACCOUNT) ACCOUNT_FILTER="$val" ;;
      since|SINCE) SINCE="$val" ;;
      format|FORMAT) FORMAT="$val" ;;
      incremental|INCREMENTAL)
        [[ "$val" == "1" || "$val" == "true" || "$val" == "yes" ]] && INCREMENTAL=true || INCREMENTAL=false
        ;;
      attachments|ATTACHMENTS)
        [[ "$val" == "0" || "$val" == "false" || "$val" == "no" ]] && EXPORT_ATTACHMENTS=false || EXPORT_ATTACHMENTS=true
        ;;
      zip|ZIP)
        [[ "$val" == "1" || "$val" == "true" || "$val" == "yes" ]] && DO_ZIP=true || DO_ZIP=false
        ;;
      quiet|QUIET)
        [[ "$val" == "1" || "$val" == "true" || "$val" == "yes" ]] && QUIET=true || QUIET=false
        ;;
    esac
  done < "$file"
}

require_arg() {
  if [[ -z "${2:-}" || "${2:-}" == --* ]]; then
    log_error "Option $1 requires a value"
    usage >&2
    exit 2
  fi
}

# Pre-load default config if present
[[ -f "$CONFIG_FILE" ]] && load_config "$CONFIG_FILE"

while [[ $# -gt 0 ]]; do
  case $1 in
    --output-dir)
      require_arg "$1" "${2:-}"
      OUTPUT_DIR="$2"
      shift 2
      ;;
    --limit)
      require_arg "$1" "${2:-}"
      if ! [[ "$2" =~ ^[0-9]+$ ]]; then
        log_error "--limit must be a non-negative integer"
        exit 2
      fi
      LIMIT="$2"
      shift 2
      ;;
    --folder)
      require_arg "$1" "${2:-}"
      FOLDER_FILTER="$2"
      shift 2
      ;;
    --account)
      require_arg "$1" "${2:-}"
      ACCOUNT_FILTER="$2"
      shift 2
      ;;
    --since)
      require_arg "$1" "${2:-}"
      SINCE="$2"
      shift 2
      ;;
    --format)
      require_arg "$1" "${2:-}"
      FORMAT="$2"
      shift 2
      ;;
    --config)
      require_arg "$1" "${2:-}"
      load_config "$2"
      shift 2
      ;;
    --dry-run) DRY_RUN=true; shift ;;
    --no-attachments) EXPORT_ATTACHMENTS=false; shift ;;
    --incremental) INCREMENTAL=true; shift ;;
    --zip) DO_ZIP=true; shift ;;
    --quiet) QUIET=true; shift ;;
    --no-progress) SHOW_WINDOW=false; NO_PROGRESS=true; shift ;;
    --include-deleted) INCLUDE_DELETED=true; shift ;;
    --version) echo "Apple Notes to PDF v${VERSION}"; exit 0 ;;
    --help|-h) usage; exit 0 ;;
    *)
      log_error "Unknown option: $1"
      usage >&2
      exit 2
      ;;
  esac
done

if [[ -z "$OUTPUT_DIR" ]]; then
  OUTPUT_DIR="$HOME/Desktop/Apple_Notes_Export_$(date +%Y-%m-%d)"
fi

if [[ ! -f "$RENDER_SCRIPT" ]]; then
  log_error "Missing render-note-to-pdf.applescript next to this script"
  exit 1
fi
if [[ ! -f "$ENGINE_SCRIPT" ]]; then
  log_error "Missing lib/export-engine.jxa.js"
  exit 1
fi
if [[ ! -f "$SCRIPT_DIR/lib/html-to-markdown.js" ]]; then
  log_error "Missing lib/html-to-markdown.js"
  exit 1
fi

log_info "Apple Notes to PDF v${VERSION}"
log_info "Output: $OUTPUT_DIR"
[[ -n "$FOLDER_FILTER" ]] && log_info "Folder filter: $FOLDER_FILTER"
[[ -n "$ACCOUNT_FILTER" ]] && log_info "Account filter: $ACCOUNT_FILTER"
[[ -n "$SINCE" ]] && log_info "Since: $SINCE"
[[ "$INCREMENTAL" == true ]] && log_info "Incremental: on"
log_info "Format: $FORMAT"

# --- Permission check ---
if ! osascript -e 'tell application "Notes" to get name of note 1' >/dev/null 2>&1; then
  log_warn "Automation permission for Notes is required."
  osascript -e '
    tell application "System Events"
      display dialog "Apple Notes to PDF needs Automation access to Notes.

System Settings → Privacy & Security → Automation
→ enable Notes for Terminal (or Apple Notes to PDF).

Click OK to open Settings, then re-run the export." buttons {"OK"} default button "OK" with title "Permission needed"
    end tell
  ' 2>/dev/null || true
  open "x-apple.systempreferences:com.apple.preference.security?Privacy_Automation" 2>/dev/null \
    || open "x-apple.systempreferences:com.apple.settings.PrivacySecurity.extension?Privacy_Automation" 2>/dev/null \
    || true
  log_info "Grant Automation → Notes, then re-run."
  exit 1
fi

mkdir -p "$CONFIG_DIR" 2>/dev/null || true
mkdir -p "$OUTPUT_DIR" 2>/dev/null || true

# --- Progress window ---
WINDOW_PID=""
if [[ "$SHOW_WINDOW" == true && "$NO_PROGRESS" == false ]]; then
  WINDOW_SCRIPT="$(mktemp /tmp/antp_win_XXXXXX.scpt)"
  cat > "$WINDOW_SCRIPT" << 'ASW'
use AppleScript version "2.4"
use framework "Foundation"
use framework "AppKit"
use scripting additions

on run
  set progressPath to "/tmp/apple-notes-to-pdf-progress.txt"
  set sf to POSIX file progressPath
  set w to current application's NSWindow's alloc()'s initWithContentRect:(current application's NSMakeRect(200, 300, 420, 100)) styleMask:7 backing:2 defer:false
  w's setTitle:"Apple Notes to PDF"
  w's setLevel:(current application's NSFLoatingWindowLevel)
  w's setMovable:true
  set cv to w's contentView()
  set tf to current application's NSTextField's alloc()'s initWithFrame:(current application's NSMakeRect(12, 70, 396, 22))
  tf's setStringValue:"Starting export…"
  tf's setBezeled:false
  tf's setDrawsBackground:false
  tf's setEditable:false
  cv's addSubview:tf
  set pb to current application's NSProgressIndicator's alloc()'s initWithFrame:(current application's NSMakeRect(12, 32, 396, 20))
  pb's setIndeterminate:false
  pb's setMinValue:0
  pb's setMaxValue:100
  cv's addSubview:pb
  w's center()
  w's makeKeyAndOrderFront:me
  set my pb to pb
  set my tf to tf
  repeat
    try
      set st to (read sf as «class utf8»)
      set AppleScript's text item delimiters to "|"
      set p to every text item of st
      set AppleScript's text item delimiters to ""
      if (count of p) ≥ 3 then
        set cur to (item 1 of p) as number
        set tot to (item 2 of p) as number
        if tot ≤ 0 then set tot to 1
        my pb's setDoubleValue:((cur / tot) * 100)
        set label to (item 3 of p) as text
        if (count of p) ≥ 4 then set label to label & "  " & (item 4 of p)
        my tf's setStringValue:label
        if cur ≥ tot and label contains "Done" then exit repeat
        if label contains "Complete" then exit repeat
      end if
    end try
    delay 0.4
  end repeat
  delay 0.8
  w's orderOut:me
end run
ASW
  printf '%s\n' "0|1|Starting…|" > "$PROGRESS_FILE"
  osascript "$WINDOW_SCRIPT" >/dev/null 2>&1 &
  WINDOW_PID=$!
  sleep 0.3
  rm -f "$WINDOW_SCRIPT" 2>/dev/null || true
fi

# --- Export env for JXA engine ---
export ANTP_OUTPUT_DIR="$OUTPUT_DIR"
export ANTP_SCRIPT_DIR="$SCRIPT_DIR"
export ANTP_RENDER_SCRIPT="$RENDER_SCRIPT"
export ANTP_LIMIT="$LIMIT"
export ANTP_DRY_RUN=$([[ "$DRY_RUN" == true ]] && echo 1 || echo 0)
export ANTP_ATTACHMENTS=$([[ "$EXPORT_ATTACHMENTS" == true ]] && echo 1 || echo 0)
export ANTP_FOLDER="$FOLDER_FILTER"
export ANTP_ACCOUNT="$ACCOUNT_FILTER"
export ANTP_SINCE="$SINCE"
export ANTP_FORMAT="$FORMAT"
export ANTP_INCREMENTAL=$([[ "$INCREMENTAL" == true ]] && echo 1 || echo 0)
export ANTP_QUIET=$([[ "$QUIET" == true ]] && echo 1 || echo 0)
export ANTP_ZIP=$([[ "$DO_ZIP" == true ]] && echo 1 || echo 0)
export ANTP_INCLUDE_DELETED=$([[ "$INCLUDE_DELETED" == true ]] && echo 1 || echo 0)
export ANTP_STATE_PATH="$STATE_FILE"
export ANTP_VERSION="$VERSION"

set +e
osascript -l JavaScript "$ENGINE_SCRIPT"
ENGINE_RC=$?
set -e

# Cleanup progress
if [[ -n "${WINDOW_PID}" ]]; then
  wait "$WINDOW_PID" 2>/dev/null || true
fi
rm -f "$PROGRESS_FILE" 2>/dev/null || true

if [[ $ENGINE_RC -ne 0 ]]; then
  log_error "Export engine failed (exit $ENGINE_RC). Check Automation permissions and Notes.app."
  exit "$ENGINE_RC"
fi

if [[ "$DRY_RUN" == true ]]; then
  log_success "Dry run complete → $OUTPUT_DIR/dry-run.json"
else
  log_success "Export complete → $OUTPUT_DIR"
  log_info "Look for master.html, Apple_Notes_Master.pdf, notes/, index.json"
fi

exit 0

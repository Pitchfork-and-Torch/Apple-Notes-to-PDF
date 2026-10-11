#!/bin/zsh
# Double-click launcher — Apple Notes to PDF v7.0.1
cd "$(cd "$(dirname "$0")" && pwd)" || exit 1
exec ./export-apple-notes.sh "$@"

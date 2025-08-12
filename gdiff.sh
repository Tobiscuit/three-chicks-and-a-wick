#!/usr/bin/env bash

# Human-readable summary of additions and deletions for a file in Git

set -euo pipefail

if [ "${1-}" = "" ]; then
  echo "Usage: $0 <path_to_file> [--staged]" >&2
  exit 1
fi

FILE_PATH="$1"
FLAG="diff"
if [ "${2-}" = "--staged" ]; then
  FLAG="diff --staged"
fi

echo "🔍 Analyzing changes for: $FILE_PATH"
echo "--------------------------------------------------"

# -U0 shows zero lines of context so we only see changed lines
git $FLAG -U0 -- "$FILE_PATH" | while IFS= read -r line; do
  case "$line" in
    ("diff --git"*|"index"*|"---"*|"+++"*)
      continue ;;
    (@@*)
      # Extract starting line number from the new-file hunk header
      line_num=$(echo "$line" | sed -n 's/^@@ .* +\([0-9]\{1,\}\).*/\1/p')
      echo -e "\n-- Changes starting around line $line_num --"
      ;;
    (+*)
      echo -e "✅ Added:   ${line:1}" ;;
    (-*)
      echo -e "❌ Deleted: ${line:1}" ;;
  esac
done

echo "--------------------------------------------------"
echo "Analysis complete."



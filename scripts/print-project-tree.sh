#!/usr/bin/env bash

set -euo pipefail

# Prints the project directory tree while excluding non-essential folders.
#
# Usage:
#   scripts/print-project-tree.sh [ROOT_DIR]
#
# Notes:
# - If ROOT_DIR is not provided, the script will use the Git repo root if available,
#   otherwise the current working directory.
# - You can add more exclusions via the EXTRA_EXCLUDES environment variable
#   as a comma-separated list. Example:
#     EXTRA_EXCLUDES="cypress,.storybook" scripts/print-project-tree.sh

ROOT_DIR="${1-}"
if [ -z "$ROOT_DIR" ]; then
  if git rev-parse --show-toplevel >/dev/null 2>&1; then
    ROOT_DIR="$(git rev-parse --show-toplevel)"
  else
    ROOT_DIR="$(pwd)"
  fi
fi

cd "$ROOT_DIR"

# Default exclusions (names match anywhere in the tree)
EXCLUDES=(
  ".git"
  "node_modules"
  ".next"
  "out"
  "dist"
  "build"
  ".turbo"
  ".vercel"
  ".amplify"
  ".terraform"
  ".cache"
  "coverage"
  ".vscode"
  ".idea"
  ".pnpm-store"
  ".yarn"
  ".venv"
  "__pycache__"
  ".pytest_cache"
  ".mypy_cache"
  ".DS_Store"
)

# Allow caller to add more exclusions via env var (comma-separated)
if [ -n "${EXTRA_EXCLUDES-}" ]; then
  IFS="," read -r -a EXTRA_ARR <<< "$EXTRA_EXCLUDES"
  EXCLUDES+=("${EXTRA_ARR[@]}")
fi

echo "📁 Project tree for: $ROOT_DIR"
echo "(excluding: ${EXCLUDES[*]})"
echo "--------------------------------------------------"

if command -v tree >/dev/null 2>&1; then
  # Build pipe-delimited ignore pattern for `tree -I`
  I_PATTERN=""
  for name in "${EXCLUDES[@]}"; do
    if [ -z "$I_PATTERN" ]; then
      I_PATTERN="$name"
    else
      I_PATTERN+="|$name"
    fi
  done
  # -a show hidden (we filter via -I), -F append / to dirs
  tree -a -F -I "$I_PATTERN"
else
  # Portable fallback using find + sed to approximate a tree
  # Build a safe array of find arguments to avoid eval/quoting issues
  FIND_ARGS=(.)
  FIND_ARGS+=(\()
  for name in "${EXCLUDES[@]}"; do
    FIND_ARGS+=(-name "$name" -o)
  done
  # Remove the last -o
  unset 'FIND_ARGS[${#FIND_ARGS[@]}-1]'
  FIND_ARGS+=(\) -prune -o -print)

  # shellcheck disable=SC2016
  find "${FIND_ARGS[@]}" \
    | sed -e 's|^\./||' \
          -e 's|[^/][^/]*/|   |g' \
          -e 's|\(.*\)/$|\1/|' \
          -e 's|^|└── |'
fi

echo "--------------------------------------------------"
echo "Done."



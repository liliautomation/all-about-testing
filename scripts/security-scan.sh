#!/bin/sh

set -eu

base_ref="${1:-origin/main}"

if ! command -v gitleaks >/dev/null 2>&1; then
  printf '%s\n' "gitleaks is required. Install it with: brew install gitleaks" >&2
  exit 1
fi

if ! git rev-parse --verify --quiet "$base_ref" >/dev/null; then
  printf 'Git revision not found: %s\n' "$base_ref" >&2
  printf '%s\n' "Fetch the remote or pass an existing base revision." >&2
  exit 1
fi

merge_base="$(git merge-base "$base_ref" HEAD)"

printf '%s\n' "Scanning commits since $merge_base for secrets..."
gitleaks git --redact --log-opts="$merge_base..HEAD"

printf '%s\n' "Scanning the working tree for secrets..."
gitleaks dir --redact .

printf '%s\n' "Scanning committed and working-tree additions since $merge_base for PII..."
python3 scripts/scan-pii.py "$merge_base"

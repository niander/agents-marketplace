#!/usr/bin/env bash

set -u

script_dir="$(
  cd "$(dirname "${BASH_SOURCE[0]}")" 2>/dev/null && pwd
)" || {
  printf '%s\n' \
    'claude-memory-loader: could not resolve the bundled hook directory' >&2
  exit 2
}
script="$script_dir/inject_claude_memory.py"

if command -v python3 >/dev/null 2>&1 &&
  python3 -c 'import sys; raise SystemExit(sys.version_info.major != 3)' </dev/null; then
  python3 "$script"
  status=$?
  if [ "$status" -eq 0 ] || [ "$status" -eq 2 ]; then
    exit "$status"
  fi
  printf 'claude-memory-loader: Python injector exited with status %s\n' \
    "$status" >&2
  exit 2
fi

if command -v python >/dev/null 2>&1 &&
  python -c 'import sys; raise SystemExit(sys.version_info.major != 3)' </dev/null; then
  python "$script"
  status=$?
  if [ "$status" -eq 0 ] || [ "$status" -eq 2 ]; then
    exit "$status"
  fi
  printf 'claude-memory-loader: Python injector exited with status %s\n' \
    "$status" >&2
  exit 2
fi

printf '%s\n' \
  'claude-memory-loader: Python 3 was not found; install python3 (or a Python 3 python executable)' >&2
exit 2

#!/usr/bin/env bash
# Generic fresh-worktree bootstrap template for Cindy-managed Pi tasks.
set -euo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [ "${WITH_TOOL_PATH_ACTIVE:-0}" -ne 1 ] && [ -f "$REPO_ROOT/scripts/with-tool-path.sh" ]; then
  export WITH_TOOL_PATH_ACTIVE=1
  exec bash "$REPO_ROOT/scripts/with-tool-path.sh" bash "${BASH_SOURCE[0]}" "$@"
fi

if [ ! -f "$REPO_ROOT/scripts/with-tool-path.sh" ]; then
  echo "WARN: scripts/with-tool-path.sh not found; continuing with current PATH" >&2
fi

# Replace with project dependency sync & verification doctor commands:
uv sync --frozen
# (cd frontend && bun install --frozen-lockfile)

COMMON_GIT_DIR="$(git rev-parse --path-format=absolute --git-common-dir)"
if [ -x "$COMMON_GIT_DIR/hooks/pre-commit" ]; then
  echo "HOOK_STATUS pre-commit=installed path=$COMMON_GIT_DIR/hooks/pre-commit"
else
  echo "HOOK_STATUS pre-commit=missing (install prek/pre-commit in primary checkout when authorized)"
fi
echo "BOOTSTRAP_READY repo=$REPO_ROOT"

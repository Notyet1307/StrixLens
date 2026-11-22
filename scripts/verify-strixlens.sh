#!/usr/bin/env bash
# CI-aligned local verification runner for StrixLens.
# Mirrors .github/workflows/ci.yml and .github/workflows/pr-delivery-guardrail.yml
# while explicitly skipping pyright (upstream has ~945 pre-existing errors and CI does not run it).
set -uo pipefail

REPO_ROOT="$(git rev-parse --show-toplevel)"
cd "$REPO_ROOT"

if [ "${WITH_TOOL_PATH_ACTIVE:-0}" -ne 1 ] && [ -f "$REPO_ROOT/scripts/with-tool-path.sh" ]; then
  export WITH_TOOL_PATH_ACTIVE=1
  exec bash "$REPO_ROOT/scripts/with-tool-path.sh" bash "${BASH_SOURCE[0]}" "$@"
fi

RUN_LINT=0
RUN_PYTEST_FULL=0
RUN_VIEWER=0
RUN_TUI=0
RUN_HYGIENE=1
REQUIRE_CLEAN=0
SCREENSHOT_DIR=""
RECEIPT_PATH=""
PYTEST_TARGETS=()

usage() {
  cat <<'EOF'
Usage: bash scripts/verify-strixlens.sh [options]

Suite selectors (default when none given: --lint + hygiene):
  --ci                           Run full CI parity (lint, pytest 3.12 filtered, viewer, tui, hygiene)
  --lint                         Run uv lock --check, ruff check/format, mypy strix/, bandit -r strix/
  --pytest                       Run CI-filtered pytest on Python 3.12 (ignores 11 upstream broken files)
  --pytest-targets <p1> [p2...]  Run targeted pytest paths on Python 3.12
  --viewer                       Run viewer frontend npm ci + npm run build and verify static/ parity
  --viewer-screenshots <dir>     Capture 4 synthetic viewer PNGs via scripts/capture-viewer-screenshots.mjs
  --tui                          Run gofmt, go vet, go build, and go test -race in strix/interface/tui
  --no-hygiene                   Skip check-verify-map.py and check-pr-delivery.py --self-test
  --require-clean                Fail if git working tree has uncommitted changes (for HEAD-bound verification)
  --receipt <path>               Write HEAD-bound verification receipt JSON (for check-pr-delivery.py)
  -h, --help                     Show this help message
EOF
}

while [ "$#" -gt 0 ]; do
  case "$1" in
    --ci)
      RUN_LINT=1
      RUN_PYTEST_FULL=1
      RUN_VIEWER=1
      RUN_TUI=1
      ;;
    --lint) RUN_LINT=1 ;;
    --pytest) RUN_PYTEST_FULL=1 ;;
    --pytest-targets)
      shift
      while [ "$#" -gt 0 ] && [[ "$1" != --* ]]; do
        PYTEST_TARGETS+=("$1")
        shift
      done
      continue
      ;;
    --viewer) RUN_VIEWER=1 ;;
    --viewer-screenshots)
      shift
      SCREENSHOT_DIR="${1:-}"
      if [ -z "$SCREENSHOT_DIR" ]; then
        echo "ERROR: --viewer-screenshots requires a directory path" >&2
        exit 2
      fi
      ;;
    --tui) RUN_TUI=1 ;;
    --no-hygiene) RUN_HYGIENE=0 ;;
    --require-clean) REQUIRE_CLEAN=1 ;;
    --receipt)
      shift
      RECEIPT_PATH="${1:-}"
      if [ -z "$RECEIPT_PATH" ]; then
        echo "ERROR: --receipt requires a file path" >&2
        exit 2
      fi
      ;;
    -h|--help) usage; exit 0 ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
  shift
done

if [ "$RUN_LINT" -eq 0 ] && [ "$RUN_PYTEST_FULL" -eq 0 ] && [ "${#PYTEST_TARGETS[@]}" -eq 0 ] \
   && [ "$RUN_VIEWER" -eq 0 ] && [ "$RUN_TUI" -eq 0 ] && [ -z "$SCREENSHOT_DIR" ]; then
  RUN_LINT=1
fi

HEAD_SHA="$(git rev-parse HEAD)"
DIRTY=0
if [ -n "$(git status --porcelain)" ]; then
  DIRTY=1
fi

if [ "$REQUIRE_CLEAN" -eq 1 ] && [ "$DIRTY" -eq 1 ]; then
  echo "FAIL: working tree is dirty under --require-clean (commit candidate before HEAD-bound verify)" >&2
  git status --short >&2
  exit 1
fi

RESULTS_TMP="$(mktemp "${TMPDIR:-/tmp}/verify-strixlens-checks.XXXXXX")"
trap 'rm -f "$RESULTS_TMP"' EXIT
OVERALL_FAIL=0

record_check() {
  local name="$1"
  local status="$2"
  local duration_ms="$3"
  printf '%s\t%s\t%s\n' "$name" "$status" "$duration_ms" >> "$RESULTS_TMP"
  printf '[%s] %s (%sms)\n' "$status" "$name" "$duration_ms"
}

run_step() {
  local name="$1"
  shift
  local t0 t1 dur
  t0="$(python3 -c 'import time; print(int(time.time() * 1000))')"
  if "$@"; then
    t1="$(python3 -c 'import time; print(int(time.time() * 1000))')"
    dur=$((t1 - t0))
    record_check "$name" "PASS" "$dur"
    return 0
  else
    t1="$(python3 -c 'import time; print(int(time.time() * 1000))')"
    dur=$((t1 - t0))
    record_check "$name" "FAIL" "$dur"
    OVERALL_FAIL=1
    return 1
  fi
}

run_lint_suite() {
  uv lock --check &&
    uv run --frozen ruff check . &&
    uv run --frozen ruff format --check . &&
    uv run --frozen mypy strix/ &&
    uv run --frozen bandit -r strix/ -c pyproject.toml
}

run_pytest_full() {
  uv run --frozen --python 3.12 pytest -q \
    --ignore=tests/test_budget_pause_policy.py \
    --ignore=tests/test_dedupe_decisions.py \
    --ignore=tests/test_e2e_budget_lifecycle.py \
    --ignore=tests/test_list_reports.py \
    --ignore=tests/test_mcp_auth.py \
    --ignore=tests/test_mcp_resilience.py \
    --ignore=tests/test_pricing.py \
    --ignore=tests/test_report_coverage.py \
    --ignore=tests/test_reporting_fields.py \
    --ignore=tests/test_skill_dir_extension.py \
    --ignore=tests/test_tool_call_ids_providers.py
}

run_pytest_targeted() {
  uv run --frozen --python 3.12 pytest -q "${PYTEST_TARGETS[@]}"
}

run_viewer_build() {
  (cd "$REPO_ROOT/strix/interface/viewer/frontend" && npm ci --no-audit --no-fund && npm run build) &&
    git -C "$REPO_ROOT" diff --exit-code --stat -- strix/interface/viewer/static &&
    test -z "$(git -C "$REPO_ROOT" status --porcelain -- strix/interface/viewer/static)"
}

run_viewer_screenshots() {
  node "$REPO_ROOT/scripts/capture-viewer-screenshots.mjs" --out-dir "$SCREENSHOT_DIR"
}

run_tui_suite() {
  (
    cd "$REPO_ROOT/strix/interface/tui" &&
      test -z "$(gofmt -l .)" &&
      go vet ./... &&
      CGO_ENABLED=0 go build -trimpath -o /dev/null ./cmd/strix-tui &&
      go test -race ./...
  )
}

run_hygiene_suite() {
  python3 "$REPO_ROOT/scripts/check-verify-map.py" &&
    python3 "$REPO_ROOT/scripts/check-pr-delivery.py" --self-test
}

if [ "$RUN_LINT" -eq 1 ]; then
  run_step "lint" run_lint_suite
else
  record_check "lint" "NOT_RUN" "0"
fi

if [ "$RUN_PYTEST_FULL" -eq 1 ]; then
  run_step "pytest_ci_3_12" run_pytest_full
elif [ "${#PYTEST_TARGETS[@]}" -gt 0 ]; then
  run_step "pytest_targeted" run_pytest_targeted
else
  record_check "pytest" "NOT_RUN" "0"
fi

if [ "$RUN_VIEWER" -eq 1 ]; then
  run_step "viewer_build_and_static_parity" run_viewer_build
else
  record_check "viewer_build_and_static_parity" "NOT_RUN" "0"
fi

if [ -n "$SCREENSHOT_DIR" ]; then
  run_step "viewer_screenshots" run_viewer_screenshots
else
  record_check "viewer_screenshots" "NOT_RUN" "0"
fi

if [ "$RUN_TUI" -eq 1 ]; then
  run_step "tui" run_tui_suite
else
  record_check "tui" "NOT_RUN" "0"
fi

if [ "$RUN_HYGIENE" -eq 1 ]; then
  run_step "hygiene" run_hygiene_suite
else
  record_check "hygiene" "NOT_RUN" "0"
fi

# Note: pyright is intentionally NOT_RUN (disabled in CI; upstream baseline has ~945 errors).
record_check "pyright" "NOT_RUN" "0"

OVERALL_STATUS="PASS"
if [ "$OVERALL_FAIL" -ne 0 ]; then
  OVERALL_STATUS="FAIL"
fi

if [ -n "$RECEIPT_PATH" ]; then
  python3 - "$RECEIPT_PATH" "$HEAD_SHA" "$OVERALL_STATUS" "$DIRTY" "$RESULTS_TMP" <<'PY'
import datetime, json, sys
from pathlib import Path

receipt_path = Path(sys.argv[1])
head_sha = sys.argv[2]
status = sys.argv[3]
dirty = sys.argv[4] == "1"
rows = Path(sys.argv[5]).read_text(encoding="utf-8").splitlines()

checks = []
for row in rows:
    if not row.strip():
        continue
    name, c_status, dur = row.split("\t", 2)
    checks.append({"name": name, "status": c_status, "duration_ms": int(dur)})

receipt = {
    "product_head": head_sha,
    "status": status,
    "checked_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
    "dirty": dirty,
    "checks": checks,
}
receipt_path.parent.mkdir(parents=True, exist_ok=True)
receipt_path.write_text(json.dumps(receipt, indent=2) + "\n", encoding="utf-8")
print(f"RECEIPT_WRITTEN path={receipt_path} status={status} head={head_sha}")
PY
fi

echo "VERIFY_STRIXLENS_STATUS=$OVERALL_STATUS head=$HEAD_SHA"
[ "$OVERALL_FAIL" -eq 0 ]

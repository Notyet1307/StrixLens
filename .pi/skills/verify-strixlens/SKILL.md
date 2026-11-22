---
name: verify-strixlens
description: StrixLens CI-aligned verification and 4-view local report viewer screenshot workflow; replaces generic `make check-all` and prohibits `pyright`.
---

# StrixLens Verification Skill

## Hard Rules

1. **NEVER run `pyright` or `make check-all`**: upstream `strix/` has ~945 pre-existing Pyright errors, and GitHub Actions CI does **not** run Pyright. Mark `pyright` as `NOT_RUN`.
2. **Pin Python 3.12** for `pytest`: CI runs `pytest` on Python `3.12` and explicitly ignores 11 pre-existing broken/hanging upstream test files.
3. **Commit before HEAD-bound verification**: create the candidate commit on the isolated task branch, then run `scripts/verify-strixlens.sh --require-clean --receipt <tmp>/receipt.json` on that exact `HEAD`. Any `HEAD` rewrite invalidates prior receipts.
4. **Never run live scans or install Playwright**: use `scripts/capture-viewer-screenshots.mjs`, which serves a deterministic synthetic run via `strix.interface.viewer.server.serve()` and drives local Chrome/Chromium over Node built-in `WebSocket` CDP.
5. **Public repo privacy**: PR bodies, titles, and commit messages must contain zero local user paths, host identifiers, or Cindy IDs. Validate before opening a PR with `scripts/check-pr-delivery.py --require-manifest --require-pass`.

## One-Command Verification Recipes (`scripts/verify-strixlens.sh`)

Run inside a clean worktree after `bash scripts/wt-bootstrap.sh`:

| Change scope | Command |
|---|---|
| **Viewer / frontend** | `bash scripts/verify-strixlens.sh --lint --viewer --viewer-screenshots .audit/viewer-screenshots --pytest-targets tests/test_viewer.py tests/test_viewer_auth.py tests/test_viewer_runs_gating.py --require-clean --receipt /tmp/strixlens-receipt.json` |
| **Python core / PDF** | `bash scripts/verify-strixlens.sh --lint --pytest --require-clean --receipt /tmp/strixlens-receipt.json` |
| **Go TUI (`strix/interface/tui`)** | `bash scripts/verify-strixlens.sh --lint --tui --require-clean --receipt /tmp/strixlens-receipt.json` |
| **Full CI parity** | `bash scripts/verify-strixlens.sh --ci --viewer-screenshots .audit/viewer-screenshots --require-clean --receipt /tmp/strixlens-receipt.json` |

## Exact CI-Aligned Individual Commands

- **Lint, format, mypy, bandit** (matches `.github/workflows/ci.yml` `lint` job):
  ```bash
  uv lock --check
  uv run --frozen ruff check .
  uv run --frozen ruff format --check .
  uv run --frozen mypy strix/
  uv run --frozen bandit -r strix/ -c pyproject.toml
  ```
- **CI-filtered pytest (Python 3.12)** (matches `.github/workflows/ci.yml` `pytest (3.12)` job):
  ```bash
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
  ```
- **Viewer frontend build & static parity** (matches `.github/workflows/ci.yml` `viewer` job):
  ```bash
  (cd strix/interface/viewer/frontend && npm ci --no-audit --no-fund && npm run build)
  git diff --exit-code --stat -- strix/interface/viewer/static
  test -z "$(git status --porcelain -- strix/interface/viewer/static)"
  ```
- **Go TUI** (matches `.github/workflows/ci.yml` `tui` job):
  ```bash
  (cd strix/interface/tui && test -z "$(gofmt -l .)" && go vet ./... && CGO_ENABLED=0 go build -trimpath -o /dev/null ./cmd/strix-tui && go test -race ./...)
  ```

## Viewer 4-View Synthetic Screenshots

Check prerequisites (read-only):

```bash
node scripts/capture-viewer-screenshots.mjs --doctor
```

Capture the 4 deterministic views against a fresh synthetic run:

```bash
node scripts/capture-viewer-screenshots.mjs --out-dir .audit/viewer-screenshots
```

Output files in `--out-dir`:
1. `01-desktop-overview.png` (`1440x900` desktop overview)
2. `02-mobile-overview.png` (`390x844` mobile overview)
3. `03-collapsed-sidebar.png` (`1440x900` sidebar collapsed)
4. `04-finding-detail.png` (`1440x900` finding detail open)
5. `manifest.json` (status, title, byte sizes, `console_errors`, `page_errors`, `external_requests`)

When handing back multiple screenshots in Gate 2 `[ready]` reports, list every image explicitly on its own line as `文件名 = cindy-media://...` so captions never misalign.

## PR Delivery Guardrail

Before `git push` / `gh pr create`:

```bash
python3 scripts/check-pr-delivery.py \
  --pr-body /tmp/pr-body.md \
  --frozen-manifest /tmp/strixlens-receipt.json \
  --head "$(git rev-parse HEAD)" \
  --require-manifest \
  --require-pass
```

## Feature Map

- [Feature Map Index](features/README.md)
- [CI Checks & Guardrails](features/ci-checks.md)
- [Local Report Viewer](features/viewer.md)

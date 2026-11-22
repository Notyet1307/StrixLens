# CI Checks & Guardrails

Maps local verification commands directly to `.github/workflows/ci.yml` and `.github/workflows/pr-delivery-guardrail.yml`.

## Surfaces

- **Workflows**: `.github/workflows/ci.yml`, `.github/workflows/pr-delivery-guardrail.yml`
- **Unified runner**: `scripts/verify-strixlens.sh`
- **Worktree bootstrap**: `scripts/wt-bootstrap.sh` (pins Python 3.12 via `uv sync --frozen --python 3.12`)
- **Guardrails**: `scripts/check-pr-delivery.py`, `scripts/check-verify-map.py`, `scripts/with-tool-path.sh`

## Rules

- `lint` runs `uv lock --check`, `ruff check .`, `ruff format --check .`, `mypy strix/`, and `bandit -r strix/ -c pyproject.toml` (configured in `pyproject.toml`).
- `pyright` is `NOT_RUN` by policy (upstream baseline has ~945 errors; CI omits it).
- `pytest` runs on Python 3.12 with the 11 broken/hanging upstream test files ignored inside `scripts/verify-strixlens.sh`.
- `tui` runs `gofmt`, `go vet`, `go build`, and `go test -race` in `strix/interface/tui`.
- PR bodies must pass `scripts/check-pr-delivery.py --require-manifest --require-pass` against a clean HEAD receipt.

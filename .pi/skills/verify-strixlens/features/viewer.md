# Local Report Viewer (SIlens)

Covers the local static SPA, Python HTTP server, PDF export, and zero-dependency synthetic 4-view screenshot verification.

## Surfaces

- **Specification**: `docs/specs/viewer-branding.md`
- **Python server & transcript**: `strix/interface/viewer/server.py`, `strix/interface/viewer/transcript.py`, `strix/interface/viewer/report_pdf.py`
- **Frontend SPA & built assets**: `strix/interface/viewer/frontend/package.json`, `strix/interface/viewer/frontend/src/App.tsx`, `strix/interface/viewer/frontend/src/components/Sidebar.tsx`, `strix/interface/viewer/static/index.html`
- **4-view screenshot harness**: `scripts/capture-viewer-screenshots.mjs`
- **Tests**: `tests/test_viewer.py`, `tests/test_viewer_auth.py`, `tests/test_viewer_runs_gating.py`, `tests/test_report_pdf.py`

## Verification Contract

1. Rebuild SPA bundle with `(cd strix/interface/viewer/frontend && npm ci --no-audit --no-fund && npm run build)` and verify `strix/interface/viewer/static` has no unexpected uncommitted diff.
2. Run viewer unit tests (`tests/test_viewer.py`, `tests/test_viewer_auth.py`, `tests/test_viewer_runs_gating.py`).
3. Capture and inspect all 4 synthetic report views (`01-desktop-overview.png`, `02-mobile-overview.png`, `03-collapsed-sidebar.png`, `04-finding-detail.png`) with zero console errors, zero page errors, and zero external HTTP requests via `scripts/capture-viewer-screenshots.mjs`.

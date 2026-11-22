#!/usr/bin/env node
/**
 * Zero-dependency 4-view synthetic report screenshot capture for the local SIlens viewer.
 *
 * Starts the real local Python viewer server (`strix.interface.viewer.server.serve`)
 * against a deterministic synthetic run fixture (or --run-dir) and drives headless
 * Chrome/Chromium over native WebSocket CDP (Node 22+ built-in WebSocket, no Playwright).
 *
 * Captures 4 views:
 *   01-desktop-overview.png   (1440x900 desktop overview)
 *   02-mobile-overview.png    (390x844 mobile overview)
 *   03-collapsed-sidebar.png  (1440x900 with sidebar collapsed)
 *   04-finding-detail.png     (1440x900 with finding detail open)
 *
 * Exit codes: 0 = PASS, 1 = FAIL, 2 = BLOCKED (missing Chrome/Python/static bundle).
 */

import { spawn } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(SCRIPT_DIR, "..");

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

function printHelp() {
  console.log(`Usage: node scripts/capture-viewer-screenshots.mjs [options]

Options:
  --out-dir <dir>   Directory to write PNGs + manifest.json (default: .audit/viewer-screenshots/<ts>)
  --python <path>   Python interpreter with strix deps (default: .venv/bin/python or python3)
  --chrome <path>   Chrome/Chromium executable (auto-detected if omitted)
  --run-dir <path>  Use an existing strix run directory instead of the built-in synthetic fixture
  --doctor          Check runtime prerequisites without launching a server or browser
  -h, --help        Show this help message
`);
}

function parseArgs(argv) {
  const opts = {
    outDir: null,
    python: null,
    chrome: null,
    runDir: null,
    doctor: false,
    help: false,
  };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      opts.help = true;
    } else if (arg === "--doctor") {
      opts.doctor = true;
    } else if (arg === "--out-dir" && argv[i + 1]) {
      opts.outDir = argv[++i];
    } else if (arg === "--python" && argv[i + 1]) {
      opts.python = argv[++i];
    } else if (arg === "--chrome" && argv[i + 1]) {
      opts.chrome = argv[++i];
    } else if (arg === "--run-dir" && argv[i + 1]) {
      opts.runDir = argv[++i];
    } else {
      throw new Error(`Unknown or incomplete argument: ${arg}`);
    }
  }
  return opts;
}

function resolvePython(explicit) {
  if (explicit) return explicit;
  const venvPy = path.join(REPO_ROOT, ".venv", "bin", "python");
  if (fs.existsSync(venvPy)) return venvPy;
  return "python3";
}

function findPlaywrightChromiumInCache() {
  const cacheDirs = [
    path.join(os.homedir(), "Library", "Caches", "ms-playwright"),
    path.join(os.homedir(), ".cache", "ms-playwright"),
  ];
  for (const dir of cacheDirs) {
    if (!fs.existsSync(dir)) continue;
    let entries = [];
    try {
      entries = fs.readdirSync(dir).filter((name) => name.startsWith("chromium-")).sort().reverse();
    } catch {
      continue;
    }
    for (const entry of entries) {
      const candidates = [
        path.join(dir, entry, "chrome-mac-arm64", "Google Chrome for Testing.app", "Contents", "MacOS", "Google Chrome for Testing"),
        path.join(dir, entry, "chrome-mac", "Chromium.app", "Contents", "MacOS", "Chromium"),
        path.join(dir, entry, "chrome-linux", "chrome"),
      ];
      for (const c of candidates) {
        if (fs.existsSync(c)) return c;
      }
    }
  }
  return null;
}

function resolveChrome(explicit) {
  const candidates = [
    explicit,
    process.env.STRIX_CHROME_BIN,
    process.env.CHROME_BIN,
    process.env.WEB_CONTROL_CHROME_BIN,
    process.env.PILOT_CHROME_BIN,
    ...CHROME_CANDIDATES,
  ].filter(Boolean);
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }
  return findPlaywrightChromiumInCache();
}

function utcStamp() {
  return new Date().toISOString().replace(/[:.]/g, "").replace("T", "T").slice(0, 16) + "Z";
}

function createSyntheticRun(baseTmp) {
  const runsRoot = path.join(baseTmp, "strix_runs");
  const runDir = path.join(runsRoot, "synthetic-demo-run");
  const stateDir = path.join(runDir, ".state");
  fs.mkdirSync(stateDir, { recursive: true });

  const runJson = {
    run_id: "synthetic-demo-run",
    run_name: "synthetic-demo-run",
    targets_info: [{ original: "https://demo.example.invalid" }],
    scan_mode: "quick",
    status: "completed",
    start_time: "2026-01-15T10:00:00Z",
    end_time: "2026-01-15T10:12:34Z",
    mcp_connection_status: [],
    scan_results: {
      executive_summary:
        "Synthetic baseline assessment of https://demo.example.invalid completed with 3 findings (1 critical, 1 high, 1 medium). All artifacts are synthetic test fixtures.",
      methodology:
        "Automated local viewer verification fixture covering overview summary, mobile navigation, sidebar collapse/expand, and finding detail rendering.",
      technical_analysis:
        "Primary high-risk issue involves unparameterized query construction on the authentication handler alongside stored XSS in user profile rendering.",
      recommendations:
        "1. Enforce parameterized SQL queries.\n2. Sanitize and encode untrusted profile bio HTML.\n3. Add per-IP and per-account rate limiting on password reset.",
    },
  };
  fs.writeFileSync(path.join(runDir, "run.json"), JSON.stringify(runJson, null, 2) + "\n", "utf8");

  const vulns = [
    {
      id: "STRIX-001",
      title: "SQL Injection in Login Endpoint",
      severity: "critical",
      cvss: 9.8,
      timestamp: "2026-01-15T10:04:12Z",
      target: "https://demo.example.invalid",
      endpoint: "/api/v1/login",
      method: "POST",
      cwe: "CWE-89",
      description:
        "Unsanitized `username` input is interpolated directly into an authentication SQL query, allowing full authentication bypass and database extraction (STRIX-001).",
      impact:
        "An unauthenticated remote attacker can bypass login controls and read sensitive account records.",
      technical_analysis:
        "The login handler formats user-supplied JSON fields directly into a SQL statement without bound parameters.",
      poc_description: "Submit a tautology payload in the `username` JSON field.",
      poc_script_code:
        "POST /api/v1/login HTTP/1.1\nContent-Type: application/json\n\n{\"username\":\"' OR 1=1 --\",\"password\":\"x\"}",
      evidence: "HTTP 200 OK with administrative session token issued for synthetic user.",
      remediation_steps:
        "Use parameterized queries / prepared statements for all database lookups and add regression tests for quote characters.",
    },
    {
      id: "STRIX-002",
      title: "Stored Cross-Site Scripting in Profile Bio",
      severity: "high",
      cvss: 7.4,
      timestamp: "2026-01-15T10:07:45Z",
      target: "https://demo.example.invalid",
      endpoint: "/profile",
      method: "PUT",
      cwe: "CWE-79",
      description:
        "HTML markup stored in the profile `bio` field is rendered without output encoding on the profile page (STRIX-002).",
      impact: "Allows arbitrary script execution in the browser session of any user viewing the profile.",
      remediation_steps: "Escape HTML entities on render and enforce a strict Content-Security-Policy.",
    },
    {
      id: "STRIX-003",
      title: "Missing Rate Limiting on Password Reset",
      severity: "medium",
      cvss: 5.3,
      timestamp: "2026-01-15T10:10:18Z",
      target: "https://demo.example.invalid",
      endpoint: "/api/v1/reset",
      method: "POST",
      cwe: "CWE-307",
      description:
        "The password reset endpoint accepts unlimited consecutive requests without throttling or backoff (STRIX-003).",
      impact: "Enables brute-force reset token guessing and email flooding.",
      remediation_steps: "Apply sliding-window rate limits per account and source IP.",
    },
  ];
  fs.writeFileSync(path.join(runDir, "vulnerabilities.json"), JSON.stringify(vulns, null, 2) + "\n", "utf8");

  const reportMd = [
    "# Penetration Test Report",
    "",
    "Synthetic baseline run for local viewer screenshot verification.",
    "",
    "## Summary",
    "- Critical: 1",
    "- High: 1",
    "- Medium: 1",
  ].join("\n") + "\n";
  fs.writeFileSync(path.join(runDir, "penetration_test_report.md"), reportMd, "utf8");

  const agentsJson = {
    statuses: { root: "completed", recon: "completed" },
    names: { root: "Coordinator", recon: "Web Recon" },
    parent_of: { root: null, recon: "root" },
    metadata: {
      root: { task: "Coordinate synthetic verification run", skills: [] },
      recon: { task: "Inspect local routes", skills: [] },
    },
  };
  fs.writeFileSync(path.join(stateDir, "agents.json"), JSON.stringify(agentsJson, null, 2) + "\n", "utf8");

  return runDir;
}

function startViewerServer(pythonBin, runDir) {
  return new Promise((resolve, reject) => {
    const pyCode = [
      "import json, signal, sys",
      "from pathlib import Path",
      "from strix.interface.viewer.server import authorized_url, serve",
      "run_dir = Path(sys.argv[1]).resolve()",
      "httpd, url, token = serve(run_dir, host='127.0.0.1', port=0, open_browser=False)",
      "print(json.dumps({'url': url, 'authorized_url': authorized_url(url, token)}), flush=True)",
      "def _stop(*_a):",
      "    raise SystemExit(0)",
      "signal.signal(signal.SIGTERM, _stop)",
      "try:",
      "    sys.stdin.read()",
      "except KeyboardInterrupt:",
      "    pass",
      "finally:",
      "    httpd.shutdown()",
      "    httpd.server_close()",
    ].join("\n");

    const proc = spawn(pythonBin, ["-u", "-c", pyCode, runDir], {
      cwd: REPO_ROOT,
      stdio: ["pipe", "pipe", "pipe"],
    });

    let stdoutBuf = "";
    let stderrBuf = "";
    let settled = false;

    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`Timed out starting viewer server. stderr: ${stderrBuf}`));
      }
    }, 15000);

    proc.stdout.on("data", (chunk) => {
      stdoutBuf += chunk.toString("utf8");
      const newline = stdoutBuf.indexOf("\n");
      if (newline !== -1 && !settled) {
        settled = true;
        clearTimeout(timer);
        const line = stdoutBuf.slice(0, newline).trim();
        try {
          const info = JSON.parse(line);
          resolve({ proc, info });
        } catch (err) {
          reject(new Error(`Invalid server handshake "${line}": ${err.message}`));
        }
      }
    });

    proc.stderr.on("data", (chunk) => {
      stderrBuf += chunk.toString("utf8");
    });

    proc.on("exit", (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`Viewer server exited early (code=${code}). stderr: ${stderrBuf}`));
      }
    });
  });
}

function launchChrome(chromeBin, userDataDir) {
  return new Promise((resolve, reject) => {
    const args = [
      "--headless=new",
      "--remote-debugging-port=0",
      `--user-data-dir=${userDataDir}`,
      "--no-first-run",
      "--no-default-browser-check",
      "--disable-gpu",
      "--disable-background-networking",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--window-size=1440,900",
    ];
    if (process.platform === "linux") {
      args.push("--no-sandbox");
    }
    args.push("about:blank");

    const proc = spawn(chromeBin, args, {
      stdio: ["ignore", "ignore", "pipe"],
    });

    let stderrBuf = "";
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        reject(new Error(`Timed out waiting for Chrome DevTools URL. stderr: ${stderrBuf.slice(-400)}`));
      }
    }, 15000);

    proc.stderr.on("data", (chunk) => {
      stderrBuf += chunk.toString("utf8");
      const m = /DevTools listening on (ws:\/\/[^\s]+)/.exec(stderrBuf);
      if (m && !settled) {
        settled = true;
        clearTimeout(timer);
        resolve({ proc, browserWsUrl: m[1] });
      }
    });

    proc.on("exit", (code) => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error(`Chrome exited early (code=${code}). stderr: ${stderrBuf.slice(-400)}`));
      }
    });
  });
}

async function getPageWsUrl(browserWsUrl) {
  const parsed = new URL(browserWsUrl);
  const httpBase = `http://${parsed.host}`;
  const deadline = Date.now() + 10000;
  while (Date.now() < deadline) {
    try {
      const resp = await fetch(`${httpBase}/json/list`);
      const targets = await resp.json();
      const page = targets.find((t) => t.type === "page" && t.webSocketDebuggerUrl);
      if (page) return page.webSocketDebuggerUrl;
    } catch {
      // retry until DevTools HTTP endpoint responds
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Timed out discovering CDP page target");
}

function createCdpClient(wsUrl) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl);
    let nextId = 1;
    const pending = new Map();
    const listeners = new Map();

    ws.addEventListener("open", () => {
      resolve({
        send(method, params = {}) {
          const id = nextId++;
          return new Promise((res, rej) => {
            pending.set(id, { res, rej, method });
            ws.send(JSON.stringify({ id, method, params }));
          });
        },
        on(event, fn) {
          if (!listeners.has(event)) listeners.set(event, []);
          listeners.get(event).push(fn);
        },
        close() {
          try {
            ws.close();
          } catch {}
        },
      });
    });

    ws.addEventListener("message", (evt) => {
      const msg = JSON.parse(String(evt.data));
      if (msg.id) {
        const entry = pending.get(msg.id);
        if (!entry) return;
        pending.delete(msg.id);
        if (msg.error) {
          entry.rej(new Error(`CDP ${entry.method} failed: ${msg.error.message}`));
        } else {
          entry.res(msg.result || {});
        }
      } else if (msg.method) {
        const fns = listeners.get(msg.method) || [];
        for (const fn of fns) fn(msg.params || {});
      }
    });

    ws.addEventListener("error", (err) => {
      reject(new Error(`CDP WebSocket error: ${err?.message || "unknown"}`));
    });
  });
}

async function evalJs(cdp, expression) {
  const res = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true,
  });
  if (res.exceptionDetails) {
    throw new Error(`Page eval exception: ${JSON.stringify(res.exceptionDetails)}`);
  }
  return res.result ? res.result.value : undefined;
}

async function waitFor(fn, description, timeoutMs = 15000) {
  const deadline = Date.now() + timeoutMs;
  let lastErr = null;
  while (Date.now() < deadline) {
    try {
      const val = await fn();
      if (val) return val;
    } catch (err) {
      lastErr = err;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`Timed out waiting for: ${description}${lastErr ? ` (${lastErr.message})` : ""}`);
}

async function setViewport(cdp, width, height, mobile) {
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
  });
}

async function capturePng(cdp, outPath) {
  const { data } = await cdp.send("Page.captureScreenshot", { format: "png" });
  const buf = Buffer.from(data, "base64");
  fs.writeFileSync(outPath, buf);
  const size = fs.statSync(outPath).size;
  if (size < 5000) {
    throw new Error(`Captured screenshot ${path.basename(outPath)} is suspiciously small (${size} bytes)`);
  }
  return size;
}

async function terminateProcess(proc) {
  if (!proc || proc.killed || proc.exitCode !== null) return;
  try {
    proc.kill("SIGTERM");
  } catch {
    return;
  }
  const exited = await new Promise((resolve) => {
    const t = setTimeout(() => resolve(false), 3000);
    proc.once("exit", () => {
      clearTimeout(t);
      resolve(true);
    });
  });
  if (!exited && proc.exitCode === null) {
    try {
      proc.kill("SIGKILL");
    } catch {}
  }
}

async function runDoctor(opts) {
  const pythonBin = resolvePython(opts.python);
  const chromeBin = resolveChrome(opts.chrome);
  const staticIndex = path.join(REPO_ROOT, "strix", "interface", "viewer", "static", "index.html");
  const hasWebSocket = typeof globalThis.WebSocket === "function";

  let serverImportOk = false;
  let serverImportError = null;
  const pyCheck = await new Promise((resolve) => {
    const proc = spawn(pythonBin, ["-c", "import strix.interface.viewer.server; print('OK')"], {
      cwd: REPO_ROOT,
      stdio: ["ignore", "pipe", "pipe"],
    });
    let err = "";
    proc.stderr.on("data", (d) => {
      err += d.toString("utf8");
    });
    proc.on("exit", (code) => resolve({ code, err }));
  });
  if (pyCheck.code === 0) {
    serverImportOk = true;
  } else {
    serverImportError = pyCheck.err.trim();
  }

  const ok = hasWebSocket && Boolean(chromeBin) && serverImportOk && fs.existsSync(staticIndex);
  const report = {
    status: ok ? "PASS" : "BLOCKED",
    node: process.version,
    has_websocket: hasWebSocket,
    chrome_bin: chromeBin,
    python_bin: pythonBin,
    viewer_server_import_ok: serverImportOk,
    viewer_server_import_error: serverImportError,
    static_bundle_exists: fs.existsSync(staticIndex),
  };
  console.log(JSON.stringify(report, null, 2));
  process.exitCode = ok ? 0 : 2;
}

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (opts.help) {
    printHelp();
    return;
  }
  if (opts.doctor) {
    await runDoctor(opts);
    return;
  }

  const startedAt = Date.now();
  if (typeof globalThis.WebSocket !== "function") {
    console.error(JSON.stringify({ status: "BLOCKED", error: "Node global WebSocket is unavailable (requires Node 22+)" }));
    process.exitCode = 2;
    return;
  }

  const chromeBin = resolveChrome(opts.chrome);
  if (!chromeBin) {
    console.error(JSON.stringify({ status: "BLOCKED", error: "No Chrome/Chromium binary found (pass --chrome or set STRIX_CHROME_BIN)" }));
    process.exitCode = 2;
    return;
  }

  const staticIndex = path.join(REPO_ROOT, "strix", "interface", "viewer", "static", "index.html");
  if (!fs.existsSync(staticIndex)) {
    console.error(JSON.stringify({ status: "BLOCKED", error: "Prebuilt viewer bundle missing at strix/interface/viewer/static/index.html" }));
    process.exitCode = 2;
    return;
  }

  const pythonBin = resolvePython(opts.python);
  const outDir = path.resolve(
    opts.outDir || path.join(REPO_ROOT, ".audit", "viewer-screenshots", utcStamp())
  );
  fs.mkdirSync(outDir, { recursive: true });

  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), "strixlens-viewer-cap-"));
  const userDataDir = path.join(tmpRoot, "chrome-profile");
  fs.mkdirSync(userDataDir, { recursive: true });

  const runDir = opts.runDir ? path.resolve(opts.runDir) : createSyntheticRun(tmpRoot);

  let serverProc = null;
  let chromeProc = null;
  let cdp = null;

  try {
    const srv = await startViewerServer(pythonBin, runDir);
    serverProc = srv.proc;
    const { url: baseUrl, authorized_url: authUrl } = srv.info;

    const chrome = await launchChrome(chromeBin, userDataDir);
    chromeProc = chrome.proc;
    const pageWsUrl = await getPageWsUrl(chrome.browserWsUrl);
    cdp = await createCdpClient(pageWsUrl);

    await cdp.send("Page.enable");
    await cdp.send("Runtime.enable");
    await cdp.send("Network.enable");

    const consoleErrors = [];
    const pageErrors = [];
    const externalRequests = [];

    cdp.on("Runtime.consoleAPICalled", (p) => {
      if (p.type === "error") {
        consoleErrors.push((p.args || []).map((a) => a.value ?? a.description ?? "").join(" "));
      }
    });
    cdp.on("Runtime.exceptionThrown", (p) => {
      pageErrors.push(p.exceptionDetails?.text || "Uncaught page exception");
    });
    cdp.on("Network.requestWillBeSent", (p) => {
      const reqUrl = p.request?.url || "";
      if (/^https?:\/\//i.test(reqUrl)) {
        try {
          const host = new URL(reqUrl).hostname;
          if (host !== "127.0.0.1" && host !== "localhost") {
            externalRequests.push(reqUrl);
          }
        } catch {}
      }
    });

    await setViewport(cdp, 1440, 900, false);
    await cdp.send("Page.navigate", { url: authUrl });

    await waitFor(async () => {
      return evalJs(cdp, `(() => {
        const t = document.body?.innerText || "";
        return t.includes("Pentest Overview") && t.includes("SIlens") && !t.includes("Loading run data");
      })()`);
    }, "initial overview render");
    await new Promise((r) => setTimeout(r, 400));

    const title = await evalJs(cdp, "document.title");
    const views = [];

    // 1. Desktop overview (1440x900)
    const p1 = path.join(outDir, "01-desktop-overview.png");
    views.push({
      name: "01-desktop-overview.png",
      label: "Desktop overview (1440x900)",
      viewport: "1440x900",
      bytes: await capturePng(cdp, p1),
    });

    // 2. Mobile overview (390x844)
    await setViewport(cdp, 390, 844, true);
    await waitFor(async () => {
      return evalJs(cdp, `(() => {
        const aside = document.getElementById("viewer-sidebar");
        const style = aside ? getComputedStyle(aside) : null;
        return window.innerWidth === 390 && (!style || style.display === "none");
      })()`);
    }, "mobile layout");
    await new Promise((r) => setTimeout(r, 400));
    const p2 = path.join(outDir, "02-mobile-overview.png");
    views.push({
      name: "02-mobile-overview.png",
      label: "Mobile overview (390x844)",
      viewport: "390x844",
      bytes: await capturePng(cdp, p2),
    });

    // 3. Collapsed sidebar (1440x900)
    await setViewport(cdp, 1440, 900, false);
    await waitFor(async () => {
      return evalJs(cdp, `Boolean(document.querySelector('button[aria-label="Collapse sidebar"]'))`);
    }, "desktop sidebar expanded");
    await evalJs(cdp, `document.querySelector('button[aria-label="Collapse sidebar"]').click()`);
    await waitFor(async () => {
      return evalJs(cdp, `(() => {
        const expand = document.querySelector('button[aria-label="Expand sidebar"]');
        const aside = document.getElementById("viewer-sidebar");
        if (!expand || !aside) return false;
        return aside.getBoundingClientRect().width <= 2;
      })()`);
    }, "sidebar collapsed");
    await new Promise((r) => setTimeout(r, 350));
    const p3 = path.join(outDir, "03-collapsed-sidebar.png");
    views.push({
      name: "03-collapsed-sidebar.png",
      label: "Collapsed sidebar (1440x900)",
      viewport: "1440x900",
      bytes: await capturePng(cdp, p3),
    });

    // 4. Finding detail (expand sidebar -> Issues -> first finding)
    await evalJs(cdp, `document.querySelector('button[aria-label="Expand sidebar"]').click()`);
    await waitFor(async () => {
      return evalJs(cdp, `(() => {
        const aside = document.getElementById("viewer-sidebar");
        return Boolean(aside && aside.getBoundingClientRect().width >= 150);
      })()`);
    }, "sidebar re-expanded");
    await evalJs(cdp, `(() => {
      const buttons = Array.from(document.querySelectorAll("#viewer-sidebar nav button"));
      const issuesBtn = buttons.find((b) => (b.innerText || "").trim().startsWith("Issues"));
      if (!issuesBtn) throw new Error("Issues nav button not found");
      issuesBtn.click();
    })()`);
    await waitFor(async () => {
      return evalJs(cdp, `(() => {
        const buttons = Array.from(document.querySelectorAll("button"));
        return buttons.some((b) => (b.innerText || "").includes("SQL Injection in Login Endpoint"));
      })()`);
    }, "findings list render");
    await evalJs(cdp, `(() => {
      const buttons = Array.from(document.querySelectorAll("button"));
      const item = buttons.find((b) => (b.innerText || "").includes("SQL Injection in Login Endpoint"));
      if (!item) throw new Error("Target finding button not found");
      item.click();
    })()`);
    await waitFor(async () => {
      return evalJs(cdp, `(() => {
        const t = document.body?.innerText || "";
        return t.includes("Back to all findings") && t.includes("SQL Injection in Login Endpoint") && t.includes("TL;DR");
      })()`);
    }, "finding detail render");
    await new Promise((r) => setTimeout(r, 400));
    const p4 = path.join(outDir, "04-finding-detail.png");
    views.push({
      name: "04-finding-detail.png",
      label: "Finding detail (1440x900)",
      viewport: "1440x900",
      bytes: await capturePng(cdp, p4),
    });

    const ok = consoleErrors.length === 0 && pageErrors.length === 0 && externalRequests.length === 0;
    const manifest = {
      status: ok ? "PASS" : "FAIL",
      title,
      base_url: baseUrl,
      out_dir: outDir,
      views,
      console_errors: consoleErrors,
      page_errors: pageErrors,
      external_requests: externalRequests,
      duration_ms: Date.now() - startedAt,
    };
    fs.writeFileSync(path.join(outDir, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n", "utf8");
    console.log(JSON.stringify(manifest, null, 2));
    if (!ok) process.exitCode = 1;
  } finally {
    if (cdp) cdp.close();
    if (serverProc && serverProc.stdin) {
      try {
        serverProc.stdin.end();
      } catch {}
    }
    await terminateProcess(serverProc);
    await terminateProcess(chromeProc);
    try {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    } catch {}
  }
}

main().catch((err) => {
  console.error(JSON.stringify({ status: "FAIL", error: err?.message || String(err) }));
  process.exitCode = 1;
});

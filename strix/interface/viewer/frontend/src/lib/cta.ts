// Anonymous metadata only: never pass PII (no email, code, or report content).
export function track(event: string, props: Record<string, string | undefined> = {}): void {
  try {
    const body: Record<string, string> = { event };
    for (const [key, value] of Object.entries(props)) {
      if (value !== undefined) body[key] = value;
    }
    const payload = JSON.stringify(body);
    if (typeof navigator !== "undefined" && navigator.sendBeacon) {
      navigator.sendBeacon("/api/event", payload);
    } else {
      void fetch("/api/event", { method: "POST", body: payload, keepalive: true });
    }
  } catch {
    /* analytics is best-effort */
  }
}

export function trackCta(cta: string, surface?: string): void {
  track("cta_clicked", { cta, surface });
}

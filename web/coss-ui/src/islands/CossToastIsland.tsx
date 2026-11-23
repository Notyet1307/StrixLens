import { useEffect } from "react";
import { ToastProvider, toastManager } from "@/components/ui/toast";

declare global {
  interface Window {
    showNotification?: (message: string, type?: string) => void;
    showCossToast?: (message: string, type?: "info" | "success" | "warning" | "error" | "loading") => void;
  }
}

function normalizeToastType(
  raw?: string,
): "info" | "success" | "warning" | "error" | "loading" {
  switch (String(raw || "info").toLowerCase()) {
    case "success":
    case "ok":
      return "success";
    case "error":
    case "danger":
    case "fail":
      return "error";
    case "warning":
    case "warn":
      return "warning";
    case "loading":
      return "loading";
    default:
      return "info";
  }
}

export function CossToastIsland() {
  useEffect(() => {
    const pushToast = (message: string, type = "info") => {
      const text = String(message ?? "").trim();
      if (!text) return;
      toastManager.add({
        title: text,
        type: normalizeToastType(type),
        timeout: type === "error" ? 5000 : 3200,
      });
    };

    window.showCossToast = (message, type = "info") => pushToast(message, type);
    window.showNotification = pushToast;

    const legacyContainer = document.getElementById("toast-notification-container");
    if (legacyContainer) {
      legacyContainer.style.display = "none";
    }
  }, []);

  return <ToastProvider position="bottom-right" />;
}

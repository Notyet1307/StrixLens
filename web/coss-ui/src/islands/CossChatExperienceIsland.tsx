import { useEffect, useState } from "react";
import { ChatTypingIndicator } from "@/components/chat/chat-typing-indicator";

function computeStreamingActive(): boolean {
  const stopBtn = document.getElementById("stop-chat-btn") as HTMLElement | null;
  if (stopBtn && !stopBtn.hidden) {
    const cs = window.getComputedStyle(stopBtn);
    if (cs.display !== "none" && cs.visibility !== "hidden") {
      return true;
    }
  }
  const chatMessages = document.getElementById("chat-messages");
  if (!chatMessages) return false;
  if (chatMessages.querySelector(".typing-indicator, .message.assistant.is-streaming, .streaming-indicator")) {
    return true;
  }
  return false;
}

function getThinkingLabel(): string {
  if (typeof window.t === "function") {
    const val = window.t("chat.thinking");
    if (val && val !== "chat.thinking") return String(val);
  }
  return document.documentElement.lang?.startsWith("zh") ? "正在思考与执行" : "Thinking";
}

export function CossChatExperienceIsland() {
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState(getThinkingLabel);

  useEffect(() => {
    const sync = () => {
      setVisible(computeStreamingActive());
      setLabel(getThinkingLabel());
    };
    sync();

    const observer = new MutationObserver(sync);
    const chatPage = document.getElementById("page-chat");
    if (chatPage) {
      observer.observe(chatPage, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["style", "hidden", "class"],
      });
    }

    const onLang = () => setLabel(getThinkingLabel());
    window.addEventListener("languageChanged", onLang);
    return () => {
      observer.disconnect();
      window.removeEventListener("languageChanged", onLang);
    };
  }, []);

  return (
    <div className="coss-island flex items-center justify-start px-4 pb-1.5 pointer-events-none">
      <ChatTypingIndicator label={label} visible={visible} />
    </div>
  );
}

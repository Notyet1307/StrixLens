import "./styles/coss-islands.css";
import { MotionConfig } from "motion/react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CossChatExperienceIsland } from "@/islands/CossChatExperienceIsland";
import { CossCommandPaletteIsland } from "@/islands/CossCommandPaletteIsland";
import { CossSwarmControlsIsland } from "@/islands/CossSwarmControlsIsland";
import { CossToastIsland } from "@/islands/CossToastIsland";

function mountIsland(id: string, element: React.ReactElement) {
  const el = document.getElementById(id);
  if (!el) return;
  createRoot(el).render(
    <StrictMode>
      <MotionConfig reducedMotion="user">{element}</MotionConfig>
    </StrictMode>,
  );
}

function bootCossIslands() {
  mountIsland("sl-coss-cmdk-root", <CossCommandPaletteIsland />);
  mountIsland("sl-coss-toast-root", <CossToastIsland />);
  mountIsland("sl-coss-chat-typing-root", <CossChatExperienceIsland />);
  mountIsland("sl-coss-swarm-status-root", <CossSwarmControlsIsland />);
  document.documentElement.dataset.cossReady = "1";
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", bootCossIslands);
} else {
  bootCossIslands();
}

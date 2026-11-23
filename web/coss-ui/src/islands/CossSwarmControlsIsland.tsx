import {
  ActivityIcon,
  CheckCircle2Icon,
  CircleAlertIcon,
  NetworkIcon,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface SwarmSummary {
  total: number;
  running: number;
  completed: number;
  failed: number;
}

function readSwarmDomCounts(): SwarmSummary {
  const root = document.getElementById("swarm-page-root");
  if (!root) return { total: 0, running: 0, completed: 0, failed: 0 };
  const cards = root.querySelectorAll(".swarm-agent-card");
  let running = 0;
  let completed = 0;
  let failed = 0;
  cards.forEach((el) => {
    const status = (el.getAttribute("data-status") || el.className || "").toLowerCase();
    if (status.includes("running") || status.includes("active")) running += 1;
    else if (status.includes("completed") || status.includes("done")) completed += 1;
    else if (status.includes("failed") || status.includes("error")) failed += 1;
  });
  return { total: cards.length, running, completed, failed };
}

export function CossSwarmControlsIsland() {
  const [counts, setCounts] = useState<SwarmSummary>(readSwarmDomCounts);

  useEffect(() => {
    const sync = () => setCounts(readSwarmDomCounts());
    sync();

    const swarmRoot = document.getElementById("swarm-page-root");
    const observer = new MutationObserver(sync);
    if (swarmRoot) {
      observer.observe(swarmRoot, { childList: true, subtree: true, attributes: true });
    }
    window.addEventListener("si-lens-swarm-event", sync);
    window.addEventListener("si-lens-page-changed", sync);
    return () => {
      observer.disconnect();
      window.removeEventListener("si-lens-swarm-event", sync);
      window.removeEventListener("si-lens-page-changed", sync);
    };
  }, []);

  if (counts.total === 0) return null;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="coss-island mb-3 flex flex-wrap items-center gap-2 rounded-xl border bg-card px-3.5 py-2 text-xs text-card-foreground shadow-xs/5"
      initial={{ opacity: 0, y: 4 }}
      transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <span className="inline-flex items-center gap-1.5 font-medium text-foreground">
        <NetworkIcon className="size-3.5 text-muted-foreground" />
        Swarm Telemetry
      </span>
      <Badge size="sm" variant="secondary">
        {counts.total} agents
      </Badge>
      {counts.running > 0 && (
        <Badge size="sm" variant="info">
          <ActivityIcon className="size-3" />
          {counts.running} running
        </Badge>
      )}
      {counts.completed > 0 && (
        <Badge size="sm" variant="success">
          <CheckCircle2Icon className="size-3" />
          {counts.completed} done
        </Badge>
      )}
      {counts.failed > 0 && (
        <Badge size="sm" variant="error">
          <CircleAlertIcon className="size-3" />
          {counts.failed} failed
        </Badge>
      )}
    </motion.div>
  );
}

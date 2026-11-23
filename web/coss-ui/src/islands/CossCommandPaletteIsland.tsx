import {
  ActivityIcon,
  ArrowDownIcon,
  ArrowUpIcon,
  BookOpenIcon,
  BotIcon,
  CheckSquareIcon,
  CornerDownLeftIcon,
  DatabaseIcon,
  FileTextIcon,
  FolderKanbanIcon,
  GitBranchIcon,
  KeyRoundIcon,
  LayoutDashboardIcon,
  MessageSquareIcon,
  NetworkIcon,
  PanelLeftIcon,
  PlusIcon,
  RadarIcon,
  RadioIcon,
  ServerIcon,
  SettingsIcon,
  ShieldAlertIcon,
  ShieldCheckIcon,
  SparklesIcon,
  SunMoonIcon,
  TerminalIcon,
  UserCheckIcon,
  WrenchIcon,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandCollection,
  CommandDialog,
  CommandDialogPopup,
  CommandEmpty,
  CommandFooter,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandList,
  CommandPanel,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface CommandEntry {
  value: string;
  label: string;
  subtitle?: string;
  badge?: string;
  shortcut?: string;
  searchText: string;
  icon: LucideIcon;
  run: () => void;
}

interface CommandGroupBucket {
  value: string;
  items: CommandEntry[];
}

interface ConversationRecord {
  id: string;
  title?: string;
  agent_mode?: string;
}

declare global {
  interface Window {
    t?: (key: string, params?: Record<string, unknown>) => string;
    canAccessPage?: (pageId: string) => boolean;
    switchPage?: (pageId: string) => void;
    startNewConversation?: () => void;
    openSwarmDashboard?: (cid: string, title: string) => Promise<void> | void;
    cycleThemePreference?: () => void;
    toggleSidebar?: () => void;
    navigateToConversation?: (cid: string) => void;
    loadConversation?: (cid: string) => Promise<void> | void;
    apiFetch?: (url: string, init?: RequestInit) => Promise<Response>;
    currentConversationId?: string;
    openCommandPalette?: () => void;
    closeCommandPalette?: () => void;
    openCossCommandPalette?: () => void;
  }
}

function tr(key: string, fallback: string): string {
  if (typeof window.t === "function") {
    const val = window.t(key);
    if (val && val !== key) return String(val);
  }
  return fallback;
}

const PAGE_DEFS: ReadonlyArray<{
  id: string;
  i18nKey: string;
  fallback: string;
  keywords: string;
  icon: LucideIcon;
}> = [
  { id: "dashboard", i18nKey: "nav.dashboard", fallback: "仪表盘", keywords: "home overview metrics kpi 首页 概览", icon: LayoutDashboardIcon },
  { id: "chat", i18nKey: "nav.chat", fallback: "对话", keywords: "agent task pentest ai 对话 渗透 测试", icon: MessageSquareIcon },
  { id: "agents-swarm", i18nKey: "nav.agentsSwarm", fallback: "蜂群看板", keywords: "swarm multiagent topology graph 蜂群 拓扑 多代理", icon: NetworkIcon },
  { id: "agents-management", i18nKey: "nav.agentsManagement", fallback: "智能体管理", keywords: "agents markdown subagent 智能体 子代理", icon: BotIcon },
  { id: "vulnerabilities", i18nKey: "nav.vulnerabilities", fallback: "漏洞管理", keywords: "vuln finding cve severity 漏洞 风险", icon: ShieldAlertIcon },
  { id: "projects", i18nKey: "nav.projects", fallback: "项目管理", keywords: "project workspace fact 项目 工作区", icon: FolderKanbanIcon },
  { id: "asset-overview", i18nKey: "nav.assetOverview", fallback: "资产概览", keywords: "assets dashboard 资产 概览", icon: RadarIcon },
  { id: "asset-library", i18nKey: "nav.assetLibrary", fallback: "资产库", keywords: "assets host domain port ip 资产库 主机 域名", icon: DatabaseIcon },
  { id: "info-collect", i18nKey: "nav.infoCollect", fallback: "信息收集", keywords: "fofa recon subdomain 信息收集 侦察", icon: ActivityIcon },
  { id: "tasks", i18nKey: "nav.tasks", fallback: "任务管理", keywords: "batch queue jobs 任务 队列", icon: CheckSquareIcon },
  { id: "workflows", i18nKey: "nav.workflows", fallback: "工作流", keywords: "workflow dag automation 工作流", icon: GitBranchIcon },
  { id: "hitl", i18nKey: "nav.hitl", fallback: "人机协同", keywords: "hitl approval review 审批 人机协同", icon: UserCheckIcon },
  { id: "tool-guard", i18nKey: "nav.toolGuard", fallback: "调用拦截", keywords: "guard policy security 拦截 规则", icon: ShieldCheckIcon },
  { id: "mcp-monitor", i18nKey: "nav.mcpMonitor", fallback: "MCP监控", keywords: "mcp monitor calls 监控", icon: ServerIcon },
  { id: "mcp-management", i18nKey: "nav.mcpManagement", fallback: "MCP管理", keywords: "mcp tools server 工具", icon: WrenchIcon },
  { id: "skills-monitor", i18nKey: "nav.skillsMonitor", fallback: "技能状态", keywords: "skills status 技能 状态", icon: SparklesIcon },
  { id: "skills-management", i18nKey: "nav.skillsManagement", fallback: "技能管理", keywords: "skills package 技能 管理", icon: BookOpenIcon },
  { id: "knowledge-management", i18nKey: "nav.knowledgeManagement", fallback: "知识管理", keywords: "rag kb docs 知识库", icon: BookOpenIcon },
  { id: "knowledge-retrieval-logs", i18nKey: "nav.knowledgeRetrievalLogs", fallback: "检索历史", keywords: "rag logs retrieval 检索 历史", icon: FileTextIcon },
  { id: "webshell", i18nKey: "nav.webshell", fallback: "WebShell管理", keywords: "shell terminal webshell", icon: TerminalIcon },
  { id: "chat-files", i18nKey: "nav.chatFiles", fallback: "文件管理", keywords: "files artifacts 文件", icon: FileTextIcon },
  { id: "c2-listeners", i18nKey: "nav.c2Listeners", fallback: "C2 · 监听器", keywords: "c2 listeners 监听", icon: RadioIcon },
  { id: "c2-sessions", i18nKey: "nav.c2Sessions", fallback: "C2 · 会话", keywords: "c2 sessions 会话", icon: TerminalIcon },
  { id: "c2-tasks", i18nKey: "nav.c2Tasks", fallback: "C2 · 任务", keywords: "c2 tasks 任务", icon: CheckSquareIcon },
  { id: "c2-payloads", i18nKey: "nav.c2Payloads", fallback: "C2 · Payload", keywords: "c2 payloads 载荷", icon: WrenchIcon },
  { id: "c2-events", i18nKey: "nav.c2Events", fallback: "C2 · 事件", keywords: "c2 events 事件", icon: ActivityIcon },
  { id: "c2-profiles", i18nKey: "nav.c2Profiles", fallback: "C2 · 流量伪装", keywords: "c2 profiles 伪装", icon: ShieldCheckIcon },
  { id: "roles-management", i18nKey: "nav.rolesManagement", fallback: "角色管理", keywords: "roles prompt 角色", icon: KeyRoundIcon },
  { id: "platform-rbac", i18nKey: "nav.platformRbac", fallback: "平台权限", keywords: "rbac users auth 权限 用户", icon: KeyRoundIcon },
  { id: "settings", i18nKey: "nav.settings", fallback: "系统设置", keywords: "settings config model ai 设置 模型 配置", icon: SettingsIcon },
];

function isPageAccessible(pageId: string): boolean {
  if (typeof window.canAccessPage === "function" && !window.canAccessPage(pageId)) {
    return false;
  }
  const navEl = document.querySelector(
    `.nav-item[data-page="${pageId}"], .nav-submenu-item[data-page="${pageId}"]`,
  ) as HTMLElement | null;
  if (navEl && (navEl.hidden || navEl.style.display === "none")) {
    return false;
  }
  return true;
}

export function CossCommandPaletteIsland() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [langRev, setLangRev] = useState(0);
  const [conversations, setConversations] = useState<ConversationRecord[]>([]);

  const fetchConversations = useCallback(async () => {
    if (typeof window.apiFetch !== "function") return;
    try {
      const res = await window.apiFetch("/api/conversations?limit=8&offset=0");
      if (res && res.ok) {
        const data = (await res.json()) as { conversations?: ConversationRecord[] };
        setConversations(Array.isArray(data.conversations) ? data.conversations : []);
      }
    } catch {
      // ignore offline or unauthenticated transient fetch failure
    }
  }, []);

  const openPalette = useCallback(() => {
    setQuery("");
    setOpen(true);
    const legacy = document.getElementById("sl-cmdk-overlay");
    if (legacy) legacy.hidden = true;
    void fetchConversations();
  }, [fetchConversations]);

  const closePalette = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    window.openCommandPalette = openPalette;
    window.closeCommandPalette = closePalette;
    window.openCossCommandPalette = openPalette;

    const legacy = document.getElementById("sl-cmdk-overlay");
    if (legacy) {
      legacy.hidden = true;
    }

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.isComposing) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        e.stopImmediatePropagation();
        setOpen((prev) => {
          const next = !prev;
          if (next) {
            setQuery("");
            void fetchConversations();
          }
          return next;
        });
      }
    };

    const onLang = () => setLangRev((r) => r + 1);
    document.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("languageChanged", onLang);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("languageChanged", onLang);
    };
  }, [openPalette, closePalette, fetchConversations]);

  const groupedItems = useMemo<CommandGroupBucket[]>(() => {
    void langRev;
    const actionLabel = tr("commandPalette.groupActions", "快捷操作");
    const pageLabel = tr("commandPalette.groupPages", "页面导航");
    const convLabel = tr("commandPalette.groupConversations", "最近对话");

    const actions: CommandEntry[] = [
      {
        value: "action:new-chat",
        label: tr("commandPalette.actionNewChat", "新建安全测试任务"),
        subtitle: tr("commandPalette.actionNewChatDesc", "切换到对话工作台并开启新会话"),
        badge: tr("commandPalette.badgeAction", "操作"),
        searchText: "new chat task pentest 新建 任务 对话 " + tr("commandPalette.actionNewChat", "新建安全测试任务"),
        icon: PlusIcon,
        run: () => {
          window.switchPage?.("chat");
          window.startNewConversation?.();
        },
      },
      {
        value: "action:open-swarm",
        label: tr("commandPalette.actionOpenSwarm", "打开多代理蜂群看板"),
        subtitle: tr("commandPalette.actionOpenSwarmDesc", "查看当前或最近一次对话的拓扑与协作轨迹"),
        badge: tr("commandPalette.badgeSwarm", "Swarm"),
        searchText: "swarm topology agent graph 蜂群 看板 拓扑 " + tr("commandPalette.actionOpenSwarm", "打开多代理蜂群看板"),
        icon: NetworkIcon,
        run: () => {
          const cid = typeof window.currentConversationId === "string" ? window.currentConversationId.trim() : "";
          if (cid && typeof window.openSwarmDashboard === "function") {
            void window.openSwarmDashboard(cid, "");
          } else {
            window.switchPage?.("agents-swarm");
          }
        },
      },
      {
        value: "action:toggle-theme",
        label: tr("commandPalette.actionToggleTheme", "切换界面主题"),
        subtitle: tr("commandPalette.actionToggleThemeDesc", "在浅色 / 暗色 / 跟随系统之间循环切换"),
        badge: tr("commandPalette.badgeTheme", "主题"),
        searchText: "theme light dark mode 主题 浅色 深色 暗色 " + tr("commandPalette.actionToggleTheme", "切换界面主题"),
        icon: SunMoonIcon,
        run: () => window.cycleThemePreference?.(),
      },
      {
        value: "action:toggle-sidebar",
        label: tr("commandPalette.actionToggleSidebar", "折叠 / 展开侧边栏"),
        subtitle: tr("commandPalette.actionToggleSidebarDesc", "调整主工作区可视空间"),
        badge: tr("commandPalette.badgeLayout", "布局"),
        searchText: "sidebar collapse expand 侧边栏 折叠 " + tr("commandPalette.actionToggleSidebar", "折叠 / 展开侧边栏"),
        icon: PanelLeftIcon,
        run: () => window.toggleSidebar?.(),
      },
    ];

    const pages: CommandEntry[] = PAGE_DEFS.filter((p) => isPageAccessible(p.id)).map((p) => {
      const title = tr(p.i18nKey, p.fallback);
      return {
        value: `page:${p.id}`,
        label: title,
        subtitle: `#${p.id}`,
        badge: tr("commandPalette.badgePage", "页面"),
        searchText: `${title} #${p.id} ${p.keywords}`,
        icon: p.icon,
        run: () => window.switchPage?.(p.id),
      };
    });

    const convItems: CommandEntry[] = conversations
      .filter((c) => c && c.id)
      .map((c) => {
        const title = c.title || tr("chat.unnamedConversation", "未命名对话");
        return {
          value: `conv:${c.id}`,
          label: title,
          subtitle: `${c.agent_mode || "single"} · ${String(c.id).slice(0, 8)}`,
          badge: tr("commandPalette.badgeConversation", "对话"),
          searchText: `${title} ${c.id} ${c.agent_mode || ""}`,
          icon: MessageSquareIcon,
          run: () => {
            if (typeof window.navigateToConversation === "function") {
              window.navigateToConversation(c.id);
            } else {
              window.switchPage?.("chat");
              void window.loadConversation?.(c.id);
            }
          },
        };
      });

    const groups: CommandGroupBucket[] = [
      { value: actionLabel, items: actions },
      { value: pageLabel, items: pages },
    ];
    if (convItems.length > 0) {
      groups.push({ value: convLabel, items: convItems });
    }
    return groups;
  }, [conversations, langRev]);

  const handleSelect = (item: CommandEntry) => {
    setOpen(false);
    try {
      item.run();
    } catch (err) {
      console.warn("Command execution failed:", err);
    }
  };

  return (
    <CommandDialog onOpenChange={setOpen} open={open}>
      <CommandDialogPopup className="coss-island z-12060!">
        <Command
          filter={(item, q) => {
            const needle = String(q || "").trim().toLowerCase();
            if (!needle) return true;
            const entry = item as CommandEntry;
            return (entry.searchText || entry.label).toLowerCase().includes(needle);
          }}
          items={groupedItems}
          itemToStringValue={(item) => (item as CommandEntry).label}
          onValueChange={setQuery}
          value={query}
        >
          <CommandInput
            placeholder={tr("commandPalette.placeholder", "输入页面名称、命令或对话标题…")}
          />
          <CommandPanel>
            <CommandEmpty>
              {tr("commandPalette.empty", "没有匹配的页面、命令或对话")}
            </CommandEmpty>
            <CommandList>
              {(group: CommandGroupBucket, idx: number) => (
                <Fragment key={group.value}>
                  {idx > 0 && <CommandSeparator />}
                  <CommandGroup items={group.items}>
                    <CommandGroupLabel>{group.value}</CommandGroupLabel>
                    <CommandCollection>
                      {(item: CommandEntry) => {
                        const Icon = item.icon;
                        return (
                          <CommandItem
                            key={item.value}
                            onClick={() => handleSelect(item)}
                            value={item}
                          >
                            <span className="flex items-center gap-2.5 min-w-0 flex-1">
                              <Icon className="size-4 shrink-0 text-muted-foreground" />
                              <span className="flex flex-col min-w-0">
                                <span className="truncate font-medium text-foreground">
                                  {item.label}
                                </span>
                                {item.subtitle && (
                                  <span className="truncate text-xs text-muted-foreground">
                                    {item.subtitle}
                                  </span>
                                )}
                              </span>
                            </span>
                            {item.badge && (
                              <Badge className="ms-2 shrink-0" size="sm" variant="secondary">
                                {item.badge}
                              </Badge>
                            )}
                            {item.shortcut && <CommandShortcut>{item.shortcut}</CommandShortcut>}
                          </CommandItem>
                        );
                      }}
                    </CommandCollection>
                  </CommandGroup>
                </Fragment>
              )}
            </CommandList>
          </CommandPanel>
          <CommandFooter className="flex-nowrap whitespace-nowrap">
            <div className="flex items-center gap-3 sm:gap-4 shrink-0">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <KbdGroup>
                  <Kbd>
                    <ArrowUpIcon />
                  </Kbd>
                  <Kbd>
                    <ArrowDownIcon />
                  </Kbd>
                </KbdGroup>
                <span className="whitespace-nowrap">{tr("commandPalette.hintNavigate", "选择")}</span>
              </div>
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <Kbd>
                  <CornerDownLeftIcon />
                </Kbd>
                <span className="whitespace-nowrap">{tr("commandPalette.hintOpen", "打开")}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="hidden sm:inline whitespace-nowrap">
                {tr("commandPalette.brandFoot", "SI-Lens Workspace")}
              </span>
              <Kbd>Esc</Kbd>
            </div>
          </CommandFooter>
        </Command>
      </CommandDialogPopup>
    </CommandDialog>
  );
}

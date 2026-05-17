"use client";

import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useVendorAuth } from "@/contexts/VendorAuth";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import { CRMUserGroup } from "@/lib/crm-types";
import {
  LayoutDashboard,
  Users,
  Map,
  PhoneIncoming,
  TrendingUp,
  MessageSquare,
  MessagesSquare,
  ClipboardList,
  Building2,
  LogOut,
  MoreHorizontal,
  ChevronRight,
  UserCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ElementType;
  group?: CRMUserGroup;
  tier: "primary" | "secondary";
}

const NAV_ITEMS: SidebarItem[] = [
  { key: "dashboard",     label: "Dashboard",     icon: LayoutDashboard, group: "CRM_DASHBOARDS",    tier: "primary"   },
  { key: "profile",       label: "Profile",       icon: UserCircle,                                  tier: "primary"   },
  { key: "leads",         label: "Leads",         icon: PhoneIncoming,   group: "CRM_LEADS",         tier: "primary"   },
  { key: "opportunities", label: "Opportunities", icon: TrendingUp,      group: "CRM_OPPORTUNITIES", tier: "primary"   },
  { key: "discussions",   label: "Discussions",   icon: MessagesSquare,                              tier: "primary"   },
  { key: "chat",          label: "Chat",          icon: MessageSquare,   group: "CRM_CHATS",         tier: "primary"   },
  { key: "worklist",      label: "Work List",     icon: ClipboardList,   group: "CRM_WORKLIST",      tier: "primary"   },
  { key: "resources",     label: "Resources",     icon: Users,           group: "CRM_RESOURCES",     tier: "secondary" },
  { key: "territories",   label: "Territories",   icon: Map,             group: "CRM_TERRITORIES",   tier: "secondary" },
];

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
  /** mobile = render as a flat list (mobile overlay) instead of elastic pill sidebar */
  mobile?: boolean;
}

export default function CRMSidebar({ activeTab, onTabChange, onClose, mobile }: Props) {
  const { vendor, signOut: vendorSignOut } = useVendorAuth();
  const { resource, isAdmin, hasGroup, signOut: resourceSignOut } = useResourceAuth();
  const router = useRouter();
  const sidebarRef = useRef<HTMLElement>(null);
  const navScrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [isMoreHovered, setIsMoreHovered] = useState(false);

  const isOwner = !!vendor;
  const displayName = vendor?.brand_name || resource?.resource_name || "Unknown";
  const displayRole = vendor ? "Vendor Owner" : resource?.email || "";
  const initials = displayName.split(" ").slice(0, 2).map((w: string) => w[0]?.toUpperCase() ?? "").join("");

  const handleSignOut = () => {
    if (vendor) vendorSignOut();
    else resourceSignOut();
    router.push(vendor ? "/vendor/login" : "/vendor/resource/login");
  };

  const visibleItems = NAV_ITEMS.filter((item) => {
    if (isOwner) return true;
    if (!item.group) return true;
    return hasGroup(item.group);
  });

  const primaryItems = visibleItems.filter((i) => i.tier === "primary");
  const secondaryItems = visibleItems.filter((i) => i.tier === "secondary");
  const isSecondaryActive = secondaryItems.some((i) => i.key === activeTab);

  // Proximity scroll for desktop sidebar
  useEffect(() => {
    const sidebar = sidebarRef.current;
    if (!sidebar || mobile) return;
    let dir = 0;
    let speed = 2;
    const tick = () => {
      const el = navScrollRef.current;
      if (!el || dir === 0) { scrollRafRef.current = null; return; }
      el.scrollTop += dir * speed;
      scrollRafRef.current = requestAnimationFrame(tick);
    };
    const onMouseMove = (e: MouseEvent) => {
      const el = navScrollRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const inZone = e.clientY >= rect.top && e.clientY <= rect.bottom;
      if (!inZone) { dir = 0; return; }
      const relY = e.clientY - rect.top;
      const h = rect.height;
      const deadStart = h * 0.25, deadEnd = h * 0.75;
      if (relY >= deadStart && relY <= deadEnd) { dir = 0; return; }
      const newDir = relY < deadStart ? -1 : 1;
      const edgeDist = newDir === -1 ? deadStart - relY : relY - deadEnd;
      const maxDist = newDir === -1 ? deadStart : h - deadEnd;
      speed = 1 + (edgeDist / maxDist) * 5;
      if (dir !== newDir) { dir = newDir; if (scrollRafRef.current === null) scrollRafRef.current = requestAnimationFrame(tick); }
    };
    const onMouseLeave = () => { dir = 0; };
    sidebar.addEventListener("mousemove", onMouseMove);
    sidebar.addEventListener("mouseleave", onMouseLeave);
    return () => {
      sidebar.removeEventListener("mousemove", onMouseMove);
      sidebar.removeEventListener("mouseleave", onMouseLeave);
      if (scrollRafRef.current !== null) { cancelAnimationFrame(scrollRafRef.current); scrollRafRef.current = null; }
    };
  }, [mobile]);

  // Close more menu on outside click
  useEffect(() => {
    if (!isMoreOpen) return;
    const handler = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setIsMoreOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isMoreOpen]);

  const navigate = (key: string) => {
    onTabChange(key);
    setIsMoreOpen(false);
    onClose?.();
  };

  // ── Mobile flat list ──────────────────────────────────────────────────────
  if (mobile) {
    const groups = [
      { label: "Overview",       keys: ["dashboard", "profile"] },
      { label: "Sales",          keys: ["leads", "opportunities"] },
      { label: "Communications", keys: ["discussions", "chat"] },
      { label: "Management",     keys: ["worklist", "resources", "territories"] },
    ];
    const visibleKeys = new Set(visibleItems.map((i) => i.key));

    return (
      <div className="flex h-full flex-col" style={{ background: "var(--bg2)" }}>
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: "1px solid var(--border3)" }}>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold"
            style={{ background: "var(--bg3)", border: "1.5px solid var(--gold)", color: "var(--gold)" }}>
            {initials || <Building2 size={18} />}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--text)" }}>{displayName}</p>
            <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>{displayRole}</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {groups.map((g) => {
            const items = g.keys.map((k) => NAV_ITEMS.find((i) => i.key === k)).filter((i): i is SidebarItem => !!i && visibleKeys.has(i.key));
            if (!items.length) return null;
            return (
              <div key={g.label} className="mb-4">
                <p className="mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-widest" style={{ color: "var(--text-muted)", opacity: 0.6 }}>{g.label}</p>
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = activeTab === item.key;
                  return (
                    <button key={item.key} onClick={() => navigate(item.key)}
                      className="relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium mb-0.5 transition-colors"
                      style={{ background: active ? "rgba(201,168,76,0.08)" : "transparent", color: active ? "var(--gold)" : "var(--text-muted)" }}>
                      {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 rounded-r-full" style={{ width: 3, height: "60%", background: "var(--gold)" }} />}
                      <Icon size={18} />
                      <span className="flex-1 text-left text-[13px]">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="px-3 pb-4 pt-3" style={{ borderTop: "1px solid var(--border3)" }}>
          <button onClick={handleSignOut} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            <LogOut size={14} /><span>Sign Out</span>
          </button>
        </div>
      </div>
    );
  }

  // ── Desktop elastic pill sidebar ──────────────────────────────────────────
  return (
    <aside
      ref={sidebarRef}
      className="hidden md:flex fixed left-2 top-2 bottom-2 h-[calc(100vh-1rem)] w-20 flex-col items-center rounded-3xl z-50 pt-4 pb-6 overflow-visible"
      style={{ background: "var(--gold)", boxShadow: "0 20px 60px rgba(201,168,76,0.25)" }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center gap-4 shrink-0 w-full">
        <div className="flex items-center justify-center cursor-pointer select-none px-1" style={{ width: 68 }}>
          <img
            src="/logo.svg"
            alt="Happy Moments"
            style={{ width: 60, height: "auto", filter: "brightness(0) invert(1)", opacity: 0.95 }}
          />
        </div>
        <div className="w-8 h-0.5 bg-white/40 rounded-full" />
      </div>

      {/* Nav Items */}
      <div className="mt-4 flex-1 min-h-0 w-full overflow-visible">
        <nav className="h-full w-full overflow-visible">
          <div ref={navScrollRef} className="h-full w-[17.5rem] overflow-y-auto overflow-x-hidden scrollbar-hide pointer-events-none">
            <div className="flex min-h-full flex-col gap-3 w-full items-center pt-2 pb-2">
              {primaryItems.map((item) => {
                const Icon = item.icon;
                const active = activeTab === item.key;
                return (
                  <div key={item.key} className="relative flex items-center justify-start h-12 w-full pl-4 group pointer-events-none">
                    <button
                      onClick={() => navigate(item.key)}
                      aria-label={item.label}
                      className={`
                        pointer-events-auto absolute left-4
                        h-12 flex items-center overflow-hidden origin-left
                        z-50 w-12 group-hover:w-auto group-hover:pr-5
                        rounded-full group-hover:rounded-3xl shadow-lg
                        transition-all duration-500 will-change-[width,border-radius,background-color]
                        ${active ? "bg-white text-[#c9a84c] shadow-black/10" : "hover:shadow-md"}
                      `}
                      style={{
                        [active ? "" : "backgroundColor"]: active ? undefined : "rgba(255,255,255,0.25)",
                        color: active ? "var(--gold)" : "white",
                        transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
                      }}
                    >
                      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                        <Icon size={22} />
                      </div>
                      <div className="overflow-hidden flex items-center max-w-0 group-hover:max-w-xs transition-all duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)" }}>
                        <span className="whitespace-nowrap flex items-center opacity-0 group-hover:opacity-100 font-semibold translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 delay-75 text-sm">
                          {item.label}
                        </span>
                      </div>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom: Setups + Logout */}
      <div className="mt-auto pt-4 mb-2 flex flex-col gap-3 items-center justify-center pointer-events-none w-full shrink-0">
        {/* Secondary items (Setups) */}
        {secondaryItems.length > 0 && (
          <div ref={moreRef} className="relative flex items-center justify-start h-12 w-full pl-4 pointer-events-none">
            <button
              aria-label="Setups"
              onClick={() => setIsMoreOpen((o) => !o)}
              onMouseEnter={() => setIsMoreHovered(true)}
              onMouseLeave={() => setIsMoreHovered(false)}
              className={`
                pointer-events-auto absolute left-4
                h-12 flex items-center overflow-hidden origin-left shadow-lg z-50
                transition-all duration-500 will-change-[width,border-radius,background-color]
                ${isSecondaryActive || isMoreOpen ? "bg-white text-[#c9a84c]" : ""}
                ${isMoreHovered && !isMoreOpen ? "w-auto pr-5 rounded-3xl" : "w-12 rounded-full"}
              `}
              style={{
                backgroundColor: isSecondaryActive || isMoreOpen ? undefined : "rgba(255,255,255,0.25)",
                color: isSecondaryActive || isMoreOpen ? "var(--gold)" : "white",
                transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)",
              }}
            >
              <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
                <MoreHorizontal size={20} />
              </div>
              <div className={`overflow-hidden flex items-center transition-all duration-500 ${isMoreHovered && !isMoreOpen ? "max-w-xs" : "max-w-0"}`} style={{ transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)" }}>
                <span className={`whitespace-nowrap font-semibold text-sm transition-all duration-300 delay-75 ${isMoreHovered && !isMoreOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
                  Setups
                </span>
              </div>
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 20, scaleY: 0.75 }}
                  animate={{ opacity: 1, y: 0, scaleY: 1 }}
                  exit={{ opacity: 0, y: 20, scaleY: 0.75 }}
                  transition={{ duration: 0.25, ease: [0.2, 0.8, 0.2, 1] }}
                  className="pointer-events-auto absolute left-full bottom-0 ml-2 w-56 rounded-[1.75rem] p-2.5 shadow-2xl ring-1 z-[60]"
                  style={{ background: "var(--bg2)", border: "1px solid var(--border3)", boxShadow: "0 22px 60px -18px rgba(0,0,0,0.4)", transformOrigin: "bottom left" }}
                >
                  <p className="px-2 pb-1.5 pt-1 text-[10px] font-semibold uppercase tracking-[0.18em]" style={{ color: "var(--text-muted)" }}>Setups</p>
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    const active = activeTab === item.key;
                    return (
                      <button key={item.key} onClick={() => navigate(item.key)}
                        className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-all duration-200 rounded-2xl"
                        style={{
                          background: active ? "var(--gold)" : "transparent",
                          color: active ? "#000" : "var(--text-muted)",
                        }}>
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full`}
                          style={{ background: active ? "rgba(255,255,255,0.2)" : "rgba(201,168,76,0.1)", color: active ? "#000" : "var(--gold)" }}>
                          <Icon size={15} />
                        </div>
                        <span className="flex-1 text-sm font-semibold">{item.label}</span>
                        <ChevronRight size={13} style={{ opacity: 0.5 }} />
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Logout */}
        <div className="relative flex items-center justify-start h-12 w-full pl-4 group pointer-events-none">
          <button
            aria-label="Log out"
            onClick={handleSignOut}
            className="
              pointer-events-auto absolute left-4
              h-12 flex items-center overflow-hidden origin-left shadow-lg z-50
              w-12 group-hover:w-auto group-hover:pr-5
              rounded-full group-hover:rounded-3xl
              transition-all duration-500 will-change-[width,border-radius,background-color]
              hover:bg-red-500 hover:text-white hover:shadow-red-500/30
            "
            style={{ backgroundColor: "rgba(255,255,255,0.25)", color: "white", transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)" }}
          >
            <div className="w-12 h-12 flex items-center justify-center flex-shrink-0">
              <LogOut size={18} />
            </div>
            <div className="overflow-hidden flex items-center max-w-0 group-hover:max-w-xs transition-all duration-500" style={{ transitionTimingFunction: "cubic-bezier(0.2,0.8,0.2,1)" }}>
              <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 font-semibold translate-x-[-10px] group-hover:translate-x-0 transition-all duration-300 delay-75 text-sm">
                Log Out
              </span>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
}

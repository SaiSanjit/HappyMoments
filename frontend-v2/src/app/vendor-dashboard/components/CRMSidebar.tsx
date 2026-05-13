"use client";

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
  X,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface SidebarItem {
  key: string;
  label: string;
  icon: React.ElementType;
  group?: CRMUserGroup;
}

const NAV_ITEMS: SidebarItem[] = [
  { key: "dashboard", label: "Dashboard", icon: LayoutDashboard, group: "CRM_DASHBOARDS" },
  { key: "leads", label: "Leads", icon: PhoneIncoming, group: "CRM_LEADS" },
  { key: "opportunities", label: "Opportunities", icon: TrendingUp, group: "CRM_OPPORTUNITIES" },
  { key: "discussions", label: "Discussions", icon: MessagesSquare },
  { key: "chat", label: "Chat", icon: MessageSquare, group: "CRM_CHATS" },
  { key: "worklist", label: "Work List", icon: ClipboardList, group: "CRM_WORKLIST" },
  { key: "resources", label: "Resources", icon: Users, group: "CRM_RESOURCES" },
  { key: "territories", label: "Territories", icon: Map, group: "CRM_TERRITORIES" },
];

interface CRMSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onClose?: () => void;
}

export default function CRMSidebar({ activeTab, onTabChange, onClose }: CRMSidebarProps) {
  const { vendor, signOut: vendorSignOut } = useVendorAuth();
  const { resource, isAdmin, hasGroup, signOut: resourceSignOut } = useResourceAuth();
  const router = useRouter();

  const isOwner = !!vendor;
  const displayName = vendor?.brand_name || resource?.resource_name || "Unknown";
  const displayRole = vendor ? "Vendor Owner" : resource?.email || "";

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

  return (
    <div className="flex h-full flex-col" style={{ background: "var(--bg2)" }}>
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4"
        style={{ borderBottom: "1px solid var(--border3)" }}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-lg"
            style={{ background: "var(--gold-soft)" }}
          >
            <Building2 size={18} style={{ color: "var(--gold)" }} />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold" style={{ color: "var(--text)" }}>
              {displayName}
            </p>
            <p className="truncate text-xs" style={{ color: "var(--text-muted)" }}>
              {displayRole}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="flex flex-col gap-0.5">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const active = activeTab === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => {
                    onTabChange(item.key);
                    onClose?.();
                  }}
                  className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all"
                  style={{
                    background: active ? "var(--gold-soft)" : "transparent",
                    color: active ? "var(--gold)" : "var(--text-muted)",
                  }}
                >
                  <Icon size={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {active && <ChevronRight size={14} style={{ color: "var(--gold)" }} />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="px-3 pb-4" style={{ borderTop: "1px solid var(--border3)" }}>
        <button
          onClick={handleSignOut}
          className="mt-4 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:opacity-80"
          style={{ color: "var(--text-muted)" }}
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}

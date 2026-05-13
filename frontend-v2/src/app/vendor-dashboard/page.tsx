"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Menu } from "lucide-react";
import { useVendorAuth } from "@/contexts/VendorAuth";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import CRMSidebar from "./components/CRMSidebar";
import DashboardPage from "@/features/dashboard/DashboardPage";
import LeadsPage from "@/features/leads/LeadsPage";
import OpportunitiesPage from "@/features/opportunities/OpportunitiesPage";
import ResourcesPage from "@/features/resources/ResourcesPage";
import TerritoriesPage from "@/features/territories/TerritoriesPage";
import ChatsPage from "@/features/chats/ChatsPage";
import WorkListPage from "@/features/worklist/WorkListPage";
import DiscussionsPage from "@/features/discussions/DiscussionsPage";

type Tab = "dashboard" | "leads" | "opportunities" | "discussions" | "chat" | "worklist" | "resources" | "territories";

function VendorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { vendor, loading: vendorLoading } = useVendorAuth();
  const { resource, loading: resourceLoading } = useResourceAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) || "dashboard");

  const loading = vendorLoading || resourceLoading;
  const isAuthenticated = !!vendor || !!resource;
  const vendorId = vendor?.vendor_id || resource?.vendor_id || "";

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/vendor/login");
    }
  }, [loading, isAuthenticated, router]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab as Tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.replace(`/vendor-dashboard?${params.toString()}`, { scroll: false });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard":     return <DashboardPage vendorId={vendorId} />;
      case "leads":         return <LeadsPage vendorId={vendorId} />;
      case "opportunities": return <OpportunitiesPage vendorId={vendorId} />;
      case "discussions":   return (
        <DiscussionsPage
          vendorId={vendorId}
          vendorName={vendor?.brand_name || "Your Venue"}
        />
      );
      case "chat":          return <ChatsPage vendorId={vendorId} />;
      case "worklist":      return <WorkListPage vendorId={vendorId} />;
      case "resources":     return <ResourcesPage vendorId={vendorId} />;
      case "territories":   return <TerritoriesPage vendorId={vendorId} />;
      default:              return <DashboardPage vendorId={vendorId} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 shrink-0 border-r lg:block" style={{ borderColor: "var(--border3)" }}>
        <CRMSidebar activeTab={activeTab} onTabChange={handleTabChange} />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-64 shadow-2xl">
            <CRMSidebar
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onClose={() => setSidebarOpen(false)}
            />
          </aside>
        </div>
      )}

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile header */}
        <div
          className="flex items-center gap-3 px-4 py-3 lg:hidden"
          style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}
        >
          <button onClick={() => setSidebarOpen(true)} style={{ color: "var(--text-muted)" }}>
            <Menu size={22} />
          </button>
          <span className="text-sm font-semibold capitalize" style={{ color: "var(--text)" }}>
            {activeTab.replace("-", " ")}
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          {renderTab()}
        </div>
      </main>
    </div>
  );
}

export default function VendorDashboardShell() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
          <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
        </div>
      }
    >
      <VendorDashboardContent />
    </Suspense>
  );
}

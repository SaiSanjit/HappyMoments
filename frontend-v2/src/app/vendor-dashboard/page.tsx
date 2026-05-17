"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useVendorAuth } from "@/contexts/VendorAuth";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import CRMSidebar from "./components/CRMSidebar";
import CRMTopBar from "./components/CRMTopBar";
import DashboardPage from "@/features/dashboard/DashboardPage";
import LeadsPage from "@/features/leads/LeadsPage";
import OpportunitiesPage from "@/features/opportunities/OpportunitiesPage";
import ResourcesPage from "@/features/resources/ResourcesPage";
import TerritoriesPage from "@/features/territories/TerritoriesPage";
import ChatsPage from "@/features/chats/ChatsPage";
import WorkListPage from "@/features/worklist/WorkListPage";
import DiscussionsPage from "@/features/discussions/DiscussionsPage";
import ProfilePage from "@/features/profile/ProfilePage";

type Tab = "dashboard" | "leads" | "opportunities" | "discussions" | "chat" | "worklist" | "resources" | "territories" | "profile";

const PAGE_TITLES: Record<Tab, string> = {
  dashboard:     "Dashboard",
  leads:         "Leads",
  opportunities: "Opportunities",
  discussions:   "Discussions",
  chat:          "Chat",
  worklist:      "Work List",
  resources:     "Resources",
  territories:   "Territories",
  profile:       "Studio Profile",
};

function VendorDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { vendor, loading: vendorLoading } = useVendorAuth();
  const { resource, loading: resourceLoading } = useResourceAuth();

  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>((searchParams.get("tab") as Tab) || "dashboard");

  const loading = vendorLoading || resourceLoading;
  const isAuthenticated = !!vendor || !!resource;
  const vendorId = String(vendor?.vendor_id || resource?.vendor_id || "");

  useEffect(() => {
    if (!loading && !isAuthenticated) router.replace("/vendor/login");
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
      case "discussions":   return <DiscussionsPage vendorId={vendorId} vendorName={vendor?.brand_name || "Your Venue"} />;
      case "chat":          return <ChatsPage vendorId={vendorId} />;
      case "worklist":      return <WorkListPage vendorId={vendorId} />;
      case "resources":     return <ResourcesPage vendorId={vendorId} />;
      case "territories":   return <TerritoriesPage vendorId={vendorId} />;
      case "profile":       return <ProfilePage vendorId={vendorId} />;
      default:              return <DashboardPage vendorId={vendorId} />;
    }
  };

  return (
    <div className="h-screen overflow-hidden" style={{ background: "var(--bg)" }}>
      {/* Desktop elastic pill sidebar */}
      <CRMSidebar activeTab={activeTab} onTabChange={handleTabChange} />

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileSidebarOpen(false)} />
          <aside className="relative w-72 shadow-2xl">
            <CRMSidebar activeTab={activeTab} onTabChange={handleTabChange} onClose={() => setMobileSidebarOpen(false)} mobile />
          </aside>
        </div>
      )}

      {/* Content area offset to the right of the desktop sidebar */}
      <div className="flex flex-col h-full md:pl-[88px]">
        {/* Top bar */}
        <CRMTopBar
          title={PAGE_TITLES[activeTab]}
          onMobileMenuOpen={() => setMobileSidebarOpen(true)}
          vendor={vendor}
          resource={resource}
        />

        {/* Page content — offset top by topbar height */}
        <main className="flex-1 overflow-y-auto pt-[72px] md:pt-[88px]">
          {renderTab()}
        </main>
      </div>
    </div>
  );
}

export default function VendorDashboardShell() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center" style={{ background: "var(--bg)" }}>
        <div className="h-8 w-8 animate-spin rounded-full border-2" style={{ borderColor: "var(--gold)", borderTopColor: "transparent" }} />
      </div>
    }>
      <VendorDashboardContent />
    </Suspense>
  );
}

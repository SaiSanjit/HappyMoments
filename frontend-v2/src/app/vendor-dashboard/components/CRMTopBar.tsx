"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, Search, LogOut, Settings } from "lucide-react";
import { useRouter } from "next/navigation";
import { useVendorAuth } from "@/contexts/VendorAuth";
import { useResourceAuth } from "@/contexts/ResourceAuth";

interface Props {
  title: string;
  onMobileMenuOpen: () => void;
  vendor: any;
  resource: any;
}

function getInitials(name?: string | null): string {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).map((w) => w[0]).join("").toUpperCase().slice(0, 2);
}

export default function CRMTopBar({ title, onMobileMenuOpen, vendor, resource }: Props) {
  const { signOut: vendorSignOut } = useVendorAuth();
  const { signOut: resourceSignOut } = useResourceAuth();
  const router = useRouter();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  const displayName = vendor?.brand_name || resource?.resource_name || "User";
  const displayRole = vendor ? "Vendor Owner" : resource?.email || "Resource";
  const initials = getInitials(displayName);

  const handleSignOut = () => {
    setProfileOpen(false);
    if (vendor) vendorSignOut();
    else resourceSignOut();
    router.push(vendor ? "/vendor/login" : "/vendor/resource/login");
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 md:px-6
        h-16 md:h-20
        md:top-2 md:left-[96px] md:right-2
        md:rounded-3xl
        transition-all duration-300"
      style={{
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border3)",
        // desktop: no border-bottom, use subtle shadow instead
      }}
    >
      {/* Left: mobile menu + title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMobileMenuOpen}
          className="md:hidden p-2 rounded-xl transition-colors"
          style={{ color: "var(--text-muted)", background: "var(--bg3)" }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>
        <div>
          <span
            className="hidden md:block text-[22px] font-black tracking-[0.06em] select-none"
            style={{ fontFamily: '"Ethnocentric Rg", system-ui, sans-serif', color: "var(--gold)" }}
          >
            HAPPYMOMENTS
          </span>
          <span className="md:hidden text-sm font-semibold" style={{ color: "var(--text)" }}>{title}</span>
        </div>
      </div>

      {/* Right: profile */}
      <div className="flex items-center gap-3">
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setProfileOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-2xl px-2 py-1.5 transition-all duration-200"
            style={{
              background: profileOpen ? "var(--bg3)" : "transparent",
              border: `1px solid ${profileOpen ? "var(--border)" : "var(--border3)"}`,
            }}
          >
            <div className="w-8 h-8 md:w-9 md:h-9 rounded-full flex shrink-0 items-center justify-center text-xs font-bold"
              style={{ background: "var(--gold)", color: "#000" }}>
              {initials}
            </div>
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-semibold leading-tight max-w-[120px] truncate" style={{ color: "var(--text)" }}>{displayName}</span>
              <span className="text-xs leading-tight max-w-[120px] truncate" style={{ color: "var(--text-muted)" }}>{displayRole}</span>
            </div>
            <ChevronDown size={14} className={`hidden md:block transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} style={{ color: "var(--text-muted)" }} />
          </button>

          <AnimatePresence>
            {profileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden shadow-2xl ring-1 z-[9999] origin-top-right"
                style={{ background: "var(--bg2)", border: "1px solid var(--border3)", boxShadow: "0 8px 40px rgba(0,0,0,0.35)" }}
              >
                {/* User header */}
                <div className="flex items-center gap-3 px-4 py-4" style={{ borderBottom: "1px solid var(--border3)" }}>
                  <div className="w-10 h-10 rounded-full flex shrink-0 items-center justify-center text-sm font-bold"
                    style={{ background: "var(--gold)", color: "#000" }}>
                    {initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>{displayName}</p>
                    <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>{displayRole}</p>
                  </div>
                </div>

                {/* Sign out */}
                <div className="p-2">
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors"
                    style={{ color: "#ef4444" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.08)")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "transparent")}
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}

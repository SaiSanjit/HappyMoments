"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Store, Tag, Settings,
  Bell, Search, TrendingUp, CheckCircle, XCircle,
  Clock, Star, MapPin, ChevronRight, BarChart3,
  Activity, Shield, AlertCircle,
} from "lucide-react";

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", id: "dashboard" }],
  },
  {
    label: "Management",
    items: [
      { icon: Store, label: "Vendors", id: "vendors" },
      { icon: Users, label: "Customers", id: "customers" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: Tag, label: "Categories", id: "categories" },
      { icon: BarChart3, label: "Analytics", id: "analytics" },
    ],
  },
  {
    label: "System",
    items: [
      { icon: Bell, label: "Notifications", id: "notifications" },
      { icon: Settings, label: "Settings", id: "settings" },
    ],
  },
];

const STAT_CARDS = [
  { label: "Total Vendors", value: "4,832", change: "+12%", color: "#c9a84c", icon: Store },
  { label: "Active Customers", value: "28,491", change: "+8%", color: "#4ade80", icon: Users },
  { label: "Bookings This Month", value: "1,247", change: "+24%", color: "#60a5fa", icon: CheckCircle },
  { label: "Pending Approvals", value: "38", change: "-5", color: "#f97316", icon: AlertCircle },
];

const PENDING_VENDORS = [
  { name: "Luminara Photography", category: "Photography", city: "Hyderabad", submitted: "2h ago", rating: 4.8 },
  { name: "The Bloom Atelier", category: "Decorators", city: "Bangalore", submitted: "4h ago", rating: 4.6 },
  { name: "Saffron Events", category: "Catering", city: "Mumbai", submitted: "6h ago", rating: 4.9 },
  { name: "Opal Venues", category: "Venues", city: "Delhi NCR", submitted: "1d ago", rating: 4.7 },
];

const RECENT_BOOKINGS = [
  { vendor: "Atelier Frame Co.", customer: "Priya Mehta", event: "Wedding", amount: "₹1.2L", status: "confirmed" },
  { vendor: "Bloom Decor Studio", customer: "Rahul Singh", event: "Engagement", amount: "₹48K", status: "pending" },
  { vendor: "Opal Gardens", customer: "Neha Kapoor", event: "Corporate", amount: "₹3.5L", status: "confirmed" },
  { vendor: "Saffron Feast", customer: "Amit Patel", event: "Birthday", amount: "₹92K", status: "negotiating" },
  { vendor: "Halo Bridal", customer: "Sneha Roy", event: "Wedding", amount: "₹65K", status: "confirmed" },
];

const ACTIVITY_FEED = [
  { type: "approval", text: "Vendor 'Velvet Bloom Studio' approved", time: "10 min ago" },
  { type: "booking", text: "New booking by Priya Mehta · ₹1.2L", time: "24 min ago" },
  { type: "signup", text: "New customer registered: Rahul S.", time: "38 min ago" },
  { type: "rejection", text: "Vendor 'Xyz Events' application rejected", time: "1h ago" },
  { type: "booking", text: "Booking confirmed: Opal Gardens · ₹3.5L", time: "2h ago" },
];

const STATUS_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  confirmed: { bg: "rgba(74,222,128,0.1)", color: "#4ade80", label: "Confirmed" },
  pending: { bg: "rgba(251,191,36,0.1)", color: "#fbbf24", label: "Pending" },
  negotiating: { bg: "rgba(96,165,250,0.1)", color: "#60a5fa", label: "Negotiating" },
};

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      {/* ── Sidenav ─────────────────────────────────────────────── */}
      <aside className="hidden w-[220px] shrink-0 flex-col border-r border-[var(--border3)] bg-[var(--bg2)] lg:flex">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-[var(--border3)] px-5 py-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#c9a84c] text-[10px] font-bold text-[var(--bg)]">
            HM
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text)]">
              Admin
            </p>
            <p className="text-[9px] text-[var(--text3)]">Happy Moments</p>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-5">
              <p className="mb-2 px-5 text-[9px] font-bold uppercase tracking-[0.25em] text-[var(--text4)]">
                {section.label}
              </p>
              {section.items.map(({ icon: Icon, label, id }) => (
                <button
                  key={id}
                  onClick={() => setActiveNav(id)}
                  className="flex w-full items-center gap-3 px-5 py-2.5 text-xs font-medium transition"
                  style={{
                    background: activeNav === id ? "rgba(201,168,76,0.12)" : "transparent",
                    color: activeNav === id ? "#c9a84c" : "var(--text3)",
                    borderRight: activeNav === id ? "2px solid #c9a84c" : "2px solid transparent",
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              ))}
            </div>
          ))}
        </nav>

        <div className="border-t border-[var(--border3)] p-5">
          <Link
            href="/"
            className="flex items-center gap-2 text-[10px] font-semibold text-[var(--text3)] transition hover:text-[var(--text2)]"
          >
            <Shield size={11} className="text-[#c9a84c]" /> Back to site
          </Link>
        </div>
      </aside>

      {/* ── Main content ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center gap-4 border-b border-[var(--border3)] bg-[var(--bg2)] px-6 py-4">
          <div>
            <h1 className="text-sm font-semibold text-[var(--text)]">Dashboard</h1>
            <p className="text-[10px] text-[var(--text3)]">Overview & management</p>
          </div>

          <div className="ml-auto flex items-center gap-3">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text3)]" />
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 rounded-xl border border-[var(--border2)] bg-[var(--border3)] py-2 pl-9 pr-3 text-xs text-[var(--text)] placeholder:text-[var(--text4)] focus:border-[rgba(201,168,76,0.3)] focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-[var(--border2)] px-3 py-1.5 text-[10px] text-[var(--text3)]">
              <Clock size={11} />
              Today
            </div>
            <button className="relative flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border2)] bg-[var(--border3)] text-[var(--text3)] transition hover:text-[var(--text2)]">
              <Bell size={14} />
              <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[#c9a84c]" />
            </button>
          </div>
        </header>

        {/* Dashboard body */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Stat cards */}
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STAT_CARDS.map((card) => (
              <div
                key={card.label}
                className="rounded-2xl border border-[var(--border3)] bg-[var(--bg2)] p-5"
                style={{ borderTop: `2px solid ${card.color}` }}
              >
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--text3)]">
                    {card.label}
                  </p>
                  <card.icon size={14} style={{ color: card.color }} />
                </div>
                <p className="text-2xl font-semibold text-[var(--text)]">{card.value}</p>
                <p className="mt-1 text-[10px]" style={{ color: card.color }}>
                  {card.change} vs last month
                </p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_320px]">
            {/* Left column */}
            <div className="space-y-6">
              {/* Revenue chart placeholder */}
              <div className="rounded-2xl border border-[var(--border3)] bg-[var(--bg2)] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text)]">Revenue Overview</p>
                  <div className="flex items-center gap-2 text-[10px] text-[var(--text3)]">
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#c9a84c]" /> Bookings
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-[#60a5fa]" /> Revenue
                    </span>
                  </div>
                </div>
                <div className="flex h-40 items-end gap-2">
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"].map((m, i) => {
                    const heights = [40, 55, 45, 70, 60, 85, 75];
                    const heights2 = [30, 45, 35, 55, 50, 70, 60];
                    return (
                      <div key={m} className="flex flex-1 flex-col items-center gap-1">
                        <div className="flex w-full items-end gap-0.5">
                          <div
                            className="flex-1 rounded-t-md bg-[#c9a84c]/60 transition hover:bg-[#c9a84c]"
                            style={{ height: `${heights[i]}%` }}
                          />
                          <div
                            className="flex-1 rounded-t-md bg-[#60a5fa]/40 transition hover:bg-[#60a5fa]/70"
                            style={{ height: `${heights2[i]}%` }}
                          />
                        </div>
                        <span className="text-[9px] text-[var(--text4)]">{m}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Vendor approval queue */}
              <div className="rounded-2xl border border-[var(--border3)] bg-[var(--bg2)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text)]">Pending Approvals</p>
                  <span className="rounded-full bg-[rgba(249,115,22,0.12)] px-2.5 py-1 text-[10px] font-bold text-[#f97316]">
                    {PENDING_VENDORS.length} pending
                  </span>
                </div>
                <div className="space-y-3">
                  {PENDING_VENDORS.map((vendor) => (
                    <div
                      key={vendor.name}
                      className="flex items-center gap-3 rounded-xl border border-[var(--border3)] bg-[rgba(232,221,208,0.02)] px-4 py-3"
                    >
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[rgba(201,168,76,0.15)] bg-[rgba(201,168,76,0.07)] text-sm font-bold text-[#c9a84c]">
                        {vendor.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-xs font-semibold text-[var(--text)]">{vendor.name}</p>
                        <div className="mt-0.5 flex items-center gap-2 text-[10px] text-[var(--text3)]">
                          <span>{vendor.category}</span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <MapPin size={9} /> {vendor.city}
                          </span>
                          <span>·</span>
                          <span className="flex items-center gap-0.5">
                            <Star size={9} className="fill-[#c9a84c] text-[#c9a84c]" /> {vendor.rating}
                          </span>
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] text-[var(--text4)]">{vendor.submitted}</span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        <button className="flex items-center gap-1 rounded-lg bg-[rgba(74,222,128,0.1)] px-2.5 py-1.5 text-[10px] font-semibold text-[#4ade80] transition hover:bg-[rgba(74,222,128,0.2)]">
                          <CheckCircle size={10} /> Approve
                        </button>
                        <button className="flex items-center gap-1 rounded-lg bg-[rgba(248,113,113,0.08)] px-2.5 py-1.5 text-[10px] font-semibold text-[#f87171] transition hover:bg-[rgba(248,113,113,0.18)]">
                          <XCircle size={10} /> Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bookings table */}
              <div className="rounded-2xl border border-[var(--border3)] bg-[var(--bg2)] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="text-sm font-semibold text-[var(--text)]">Recent Bookings</p>
                  <button className="flex items-center gap-1 text-[10px] font-semibold text-[#c9a84c] transition hover:text-[#e8d5a3]">
                    View all <ChevronRight size={11} />
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-[var(--border3)]">
                        {["Vendor", "Customer", "Event", "Amount", "Status"].map((h) => (
                          <th key={h} className="pb-3 text-left font-semibold uppercase tracking-wider text-[var(--text4)]" style={{ fontSize: "9px" }}>
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border3)]">
                      {RECENT_BOOKINGS.map((b, i) => {
                        const s = STATUS_STYLES[b.status];
                        return (
                          <tr key={i} className="group transition hover:bg-[rgba(232,221,208,0.02)]">
                            <td className="py-3 font-medium text-[var(--text)]">{b.vendor}</td>
                            <td className="py-3 text-[var(--text3)]">{b.customer}</td>
                            <td className="py-3 text-[var(--text3)]">{b.event}</td>
                            <td className="py-3 font-semibold text-[#c9a84c]">{b.amount}</td>
                            <td className="py-3">
                              <span
                                className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
                                style={{ background: s.bg, color: s.color }}
                              >
                                {s.label}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Category donut chart placeholder */}
              <div className="rounded-2xl border border-[var(--border3)] bg-[var(--bg2)] p-5">
                <p className="mb-4 text-sm font-semibold text-[var(--text)]">By Category</p>
                <div className="flex items-center justify-center py-6">
                  <div className="relative h-32 w-32">
                    <svg viewBox="0 0 36 36" className="h-32 w-32 -rotate-90">
                      {[
                        { pct: 30, color: "#c9a84c", offset: 0 },
                        { pct: 22, color: "#60a5fa", offset: 30 },
                        { pct: 18, color: "#4ade80", offset: 52 },
                        { pct: 15, color: "#f97316", offset: 70 },
                        { pct: 15, color: "#a78bfa", offset: 85 },
                      ].map(({ pct, color, offset }, i) => (
                        <circle
                          key={i}
                          cx="18" cy="18" r="14"
                          fill="none"
                          stroke={color}
                          strokeWidth="4"
                          strokeDasharray={`${pct * 0.88} 88`}
                          strokeDashoffset={`${-offset * 0.88}`}
                        />
                      ))}
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-lg font-semibold text-[var(--text)]">4,832</p>
                      <p className="text-[9px] text-[var(--text3)]">vendors</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Photography", pct: "30%", color: "#c9a84c" },
                    { label: "Venues", pct: "22%", color: "#60a5fa" },
                    { label: "Catering", pct: "18%", color: "#4ade80" },
                    { label: "Decorators", pct: "15%", color: "#f97316" },
                    { label: "Others", pct: "15%", color: "#a78bfa" },
                  ].map(({ label, pct, color }) => (
                    <div key={label} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full" style={{ background: color }} />
                        <span className="text-[10px] text-[var(--text3)]">{label}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[var(--text2)]">{pct}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Activity feed */}
              <div className="rounded-2xl border border-[var(--border3)] bg-[var(--bg2)] p-5">
                <p className="mb-4 text-sm font-semibold text-[var(--text)]">Activity Feed</p>
                <div className="space-y-4">
                  {ACTIVITY_FEED.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div
                        className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                        style={{
                          background:
                            item.type === "approval"
                              ? "rgba(74,222,128,0.1)"
                              : item.type === "rejection"
                              ? "rgba(248,113,113,0.1)"
                              : item.type === "booking"
                              ? "rgba(201,168,76,0.1)"
                              : "rgba(96,165,250,0.1)",
                        }}
                      >
                        <Activity
                          size={11}
                          style={{
                            color:
                              item.type === "approval"
                                ? "#4ade80"
                                : item.type === "rejection"
                                ? "#f87171"
                                : item.type === "booking"
                                ? "#c9a84c"
                                : "#60a5fa",
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] leading-5 text-[var(--text2)]">{item.text}</p>
                        <p className="mt-0.5 text-[10px] text-[var(--text4)]">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

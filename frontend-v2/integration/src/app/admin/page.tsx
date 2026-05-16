"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Store, Tag, Settings, Bell, Search, CheckCircle, XCircle,
  Star, MapPin, ChevronRight, BarChart3, Camera, Inbox, ShoppingBag, Wallet,
  TrendingUp, Sparkles, MoreHorizontal, Shield, Filter, Plus, Download,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StatusPill } from "@/components/ui/StatusPill";
import { Avatar } from "@/components/ui/Avatar";
import { Sparkline } from "@/components/ui/Sparkline";
import { BarChart, Donut, ProgressBar } from "@/components/ui/Charts";

/* ─────────────────────────────────────────────────────────────────────
   Static demo data — replace with real queries via your services layer.
   ───────────────────────────────────────────────────────────────────── */

const NAV_SECTIONS = [
  {
    label: "Overview",
    items: [{ icon: LayoutDashboard, label: "Dashboard", id: "dashboard" }, { icon: Sparkles, label: "Insights", id: "insights" }],
  },
  {
    label: "Marketplace",
    items: [
      { icon: Store, label: "Vendors", id: "vendors", count: "4.8k" },
      { icon: Users, label: "Customers", id: "customers", count: "28k" },
      { icon: Inbox, label: "Approvals", id: "approvals", count: 38 },
      { icon: ShoppingBag, label: "Bookings", id: "bookings" },
    ],
  },
  {
    label: "Content",
    items: [
      { icon: Tag, label: "Categories", id: "categories" },
      { icon: Camera, label: "Portfolios", id: "portfolios" },
      { icon: Star, label: "Reviews", id: "reviews" },
    ],
  },
  {
    label: "Operations",
    items: [
      { icon: Bell, label: "Notifications", id: "notifications" },
      { icon: Settings, label: "Settings", id: "settings" },
    ],
  },
] as const;

const STATS = [
  { label: "Total vendors", value: "4,832", delta: "+12.4%", spark: [3,5,4,6,7,6,8,9,11,10,12,14] },
  { label: "Active customers", value: "28,491", delta: "+8.1%", spark: [10,12,11,14,13,15,16,15,18,17,19,21] },
  { label: "Bookings · 30d", value: "1,247", delta: "+24%", spark: [4,6,5,8,7,9,11,10,13,12,15,18] },
  { label: "GMV · 30d", value: "₹4.86 Cr", delta: "+18%", spark: [12,14,13,15,17,16,19,18,21,20,23,25] },
];

const PENDING_VENDORS = [
  { name: "Luminara Photography",  cat: "Photography",  city: "Hyderabad",  time: "2h ago", rating: 4.8, portfolio: 124 },
  { name: "The Bloom Atelier",     cat: "Decorators",   city: "Bangalore",  time: "4h ago", rating: 4.6, portfolio: 87 },
  { name: "Saffron Events",        cat: "Catering",     city: "Mumbai",     time: "6h ago", rating: 4.9, portfolio: 211 },
  { name: "Opal Garden Venues",    cat: "Venues",       city: "Delhi NCR",  time: "1d ago", rating: 4.7, portfolio: 56 },
  { name: "Vellore Card Studio",   cat: "Invitations",  city: "Chennai",    time: "1d ago", rating: 4.5, portfolio: 42 },
];

const RECENT_BOOKINGS = [
  { v: "Atelier Frame Co.", c: "Priya Mehta",  e: "Wedding",    d: "Nov 12", a: "₹1.20 L",  s: "confirmed" as const },
  { v: "Bloom Decor Studio",c: "Rahul Singh",  e: "Engagement", d: "Nov 18", a: "₹48,000",  s: "pending" as const },
  { v: "Opal Gardens",      c: "Neha Kapoor",  e: "Corporate",  d: "Dec 04", a: "₹3.50 L",  s: "confirmed" as const },
  { v: "Saffron Feast",     c: "Amit Patel",   e: "Birthday",   d: "Nov 26", a: "₹92,000",  s: "negotiation" as const },
  { v: "Halo Bridal",       c: "Sneha Roy",    e: "Wedding",    d: "Jan 14", a: "₹65,000",  s: "confirmed" as const },
];

const TOP_CITIES = [
  { c: "Hyderabad",  v: "₹1.42 Cr", p: 100 },
  { c: "Mumbai",     v: "₹1.10 Cr", p: 78 },
  { c: "Bangalore",  v: "₹84.2 L",  p: 60 },
  { c: "Delhi NCR",  v: "₹62.0 L",  p: 44 },
  { c: "Chennai",    v: "₹48.6 L",  p: 34 },
];

const ACTIVITY = [
  { kind: "approved" as const,  who: "Velvet Bloom Studio",       sub: "vendor approved by Rashmi K.", t: "10 min" },
  { kind: "booking"  as const,  who: "Priya Mehta",                sub: "booked Atelier Frame Co. · ₹1.20 L", t: "24 min" },
  { kind: "signup"   as const,  who: "Rahul S.",                   sub: "joined as customer", t: "38 min" },
  { kind: "rejected" as const,  who: "Xyz Events",                 sub: "application declined — incomplete", t: "1 h" },
  { kind: "booking"  as const,  who: "Neha Kapoor",                sub: "booked Opal Gardens · ₹3.50 L", t: "2 h" },
  { kind: "review"   as const,  who: "Amit Patel",                 sub: "left ★ 5.0 for Saffron Feast", t: "3 h" },
];

const ACTIVITY_STYLES = {
  approved: { icon: CheckCircle, bg: "var(--crm-status-won-bg)", fg: "var(--crm-status-won-text)" },
  rejected: { icon: XCircle,     bg: "var(--crm-status-lost-bg)", fg: "var(--crm-status-lost-text)" },
  booking:  { icon: Wallet,      bg: "var(--crm-accent-soft)",   fg: "var(--crm-accent)" },
  signup:   { icon: Users,       bg: "var(--crm-status-new-bg)", fg: "var(--crm-status-new-text)" },
  review:   { icon: Star,        bg: "var(--crm-status-progress-bg)", fg: "var(--crm-status-progress-text)" },
} as const;

/* ─────────────────────────────────────────────────────────────────── */

export default function AdminPage() {
  const [activeNav, setActiveNav] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex min-h-screen" style={{ background: "var(--bg)" }}>
      {/* ── Sidenav ───────────────────────────────────────────── */}
      <aside
        className="hidden w-[248px] shrink-0 flex-col lg:flex"
        style={{ background: "var(--bg2)", borderRight: "1px solid var(--border)" }}
      >
        <div className="flex items-center gap-3 px-5 py-5" style={{ borderBottom: "1px solid var(--border2)" }}>
          <div
            className="flex h-8 w-8 items-center justify-center text-[var(--bg2)] font-display"
            style={{ background: "var(--text)", borderRadius: 8, fontSize: 19, lineHeight: 1 }}
          >
            <span style={{ marginTop: -2 }}>h</span>
          </div>
          <div className="leading-tight">
            <p className="text-[15px] font-display tracking-tight" style={{ color: "var(--text)" }}>happy moments</p>
            <p className="text-[9px] font-semibold tracking-[0.22em] uppercase mt-[3px]" style={{ color: "var(--text3)" }}>admin · console</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-2">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label} className="mb-2">
              <p className="px-[26px] py-[10px] text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: "var(--text4)" }}>
                {section.label}
              </p>
              <div className="px-[14px]">
                {section.items.map(({ icon: Icon, label, id, count }: any) => {
                  const active = activeNav === id;
                  return (
                    <button
                      key={id}
                      onClick={() => setActiveNav(id)}
                      className="flex w-full items-center gap-[10px] rounded-[10px] px-3 py-2 text-[13px] transition"
                      style={{
                        background: active ? "var(--text)" : "transparent",
                        color: active ? "var(--bg2)" : "var(--text2)",
                      }}
                    >
                      <Icon size={14} />
                      <span>{label}</span>
                      {count !== undefined && (
                        <span
                          className="ml-auto rounded-full px-[7px] py-px text-[11px] font-medium"
                          style={{
                            background: active ? "rgba(255,255,255,0.14)" : "var(--bg3)",
                            color:      active ? "rgba(255,255,255,0.85)" : "var(--text3)",
                          }}
                        >
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3" style={{ borderTop: "1px solid var(--border2)" }}>
          <div className="flex items-center gap-3 rounded-[10px] p-2">
            <Avatar name="Rashmi Kapoor" tone="accent" size={32} />
            <div className="min-w-0 flex-1 leading-tight">
              <div className="text-[12px] font-medium" style={{ color: "var(--text)" }}>Rashmi Kapoor</div>
              <div className="text-[10px]" style={{ color: "var(--text3)" }}>Platform admin</div>
            </div>
            <Link href="/" className="text-[10px]" style={{ color: "var(--text3)" }} title="Back to site">
              <Shield size={13} style={{ color: "var(--crm-accent)" }} />
            </Link>
          </div>
        </div>
      </aside>

      {/* ── Main ──────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header
          className="flex items-center gap-4 px-7 py-[18px]"
          style={{ background: "var(--bg2)", borderBottom: "1px solid var(--border2)" }}
        >
          <div>
            <h1 className="text-[18px] font-medium tracking-tight" style={{ color: "var(--text)" }}>
              Today, a quiet good day.
            </h1>
            <p className="text-[12px] mt-0.5" style={{ color: "var(--text3)" }}>
              38 pending reviews · 1,247 active bookings · platform health 99.4%
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text3)" }} />
              <input
                type="text"
                placeholder="Search vendors, customers, bookings…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-[320px] rounded-[14px] py-2 pl-9 pr-12 text-[13px] outline-none"
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--text)" }}
              />
              <kbd
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded px-[6px] py-[2px] font-mono text-[10px]"
                style={{ background: "var(--bg3)", color: "var(--text4)", border: "1px solid var(--border2)" }}
              >
                ⌘K
              </kbd>
            </div>
            <Button variant="ghost" size="icon"><Bell size={15} /></Button>
            <Button variant="primary"><Plus size={14} /> Invite vendor</Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-7">
          {/* KPI strip */}
          <div className="mb-[22px] grid grid-cols-1 gap-[14px] sm:grid-cols-2 xl:grid-cols-4">
            {STATS.map((s) => (
              <Card key={s.label} padded compact>
                <div className="flex items-start justify-between gap-2">
                  <p className="eyebrow">{s.label}</p>
                  <span className="flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--crm-status-won-text)" }}>
                    <TrendingUp size={12} /> {s.delta}
                  </span>
                </div>
                <p className="font-display mt-3" style={{ fontSize: 30, letterSpacing: "-0.02em", color: "var(--text)" }}>{s.value}</p>
                <div className="mt-2">
                  <Sparkline values={s.spark} width={240} height={32} />
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-[18px] xl:grid-cols-[1.5fr_1fr]">
            {/* Left column */}
            <div className="space-y-[18px]">
              {/* Revenue */}
              <Card padded>
                <div className="mb-[18px] flex items-end justify-between">
                  <div>
                    <p className="eyebrow">Gross merchandise value</p>
                    <div className="mt-1.5 flex items-baseline gap-3">
                      <span className="font-display" style={{ fontSize: 32, letterSpacing: "-0.02em" }}>₹4.86 Cr</span>
                      <span className="text-[12px] font-semibold" style={{ color: "var(--crm-status-won-text)" }}>+18% vs prev. 30d</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {["7d", "30d", "90d", "1y"].map((p, i) => (
                      <button
                        key={p}
                        className="rounded-[10px] px-3 py-1 text-[12px] font-medium transition"
                        style={{
                          background: i === 1 ? "var(--text)" : "transparent",
                          color:      i === 1 ? "var(--bg2)" : "var(--text3)",
                          border: "1px solid " + (i === 1 ? "var(--text)" : "var(--border)"),
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-2 flex items-center gap-4">
                  <Legend color="var(--crm-accent)" label="Bookings" />
                  <Legend color="var(--text)" label="GMV" />
                  <span className="ml-auto text-[11px]" style={{ color: "var(--text4)" }}>Updated 4 min ago</span>
                </div>
                <BarChart
                  data={[
                    {label:"Jan",a:42,b:38},{label:"Feb",a:55,b:48},{label:"Mar",a:48,b:52},
                    {label:"Apr",a:67,b:60},{label:"May",a:71,b:62},{label:"Jun",a:82,b:73},
                    {label:"Jul",a:78,b:71},{label:"Aug",a:88,b:79},{label:"Sep",a:92,b:81},
                    {label:"Oct",a:104,b:95},{label:"Nov",a:118,b:108},{label:"Dec",a:132,b:124},
                  ]}
                  height={200}
                />
              </Card>

              {/* Approval queue */}
              <Card>
                <div className="flex items-center px-[22px] py-[18px]" style={{ borderBottom: "1px solid var(--border2)" }}>
                  <div>
                    <div className="text-[15px] font-medium" style={{ color: "var(--text)" }}>Vendor approval queue</div>
                    <div className="text-[12px] mt-0.5" style={{ color: "var(--text3)" }}>
                      5 of 38 awaiting review · prioritized by trust score
                    </div>
                  </div>
                  <div className="ml-auto flex gap-2">
                    <Button variant="ghost" size="sm"><Filter size={12} /> Filter</Button>
                    <Button variant="ghost" size="sm">View all <ChevronRight size={12} /></Button>
                  </div>
                </div>
                <div>
                  {PENDING_VENDORS.map((v, i) => (
                    <div
                      key={v.name}
                      className="flex items-center gap-[14px] px-[22px] py-[14px]"
                      style={{
                        borderBottom: i === PENDING_VENDORS.length - 1 ? "none" : "1px solid var(--border2)",
                      }}
                    >
                      <Avatar name={v.name} size={40} />
                      <div className="flex-1 min-w-0">
                        <div className="text-[14px] font-medium" style={{ color: "var(--text)" }}>{v.name}</div>
                        <div className="mt-1 flex items-center gap-2.5 text-[12px]" style={{ color: "var(--text3)" }}>
                          <span>{v.cat}</span>
                          <span style={{ color: "var(--text4)" }}>·</span>
                          <span className="flex items-center gap-1"><MapPin size={11} /> {v.city}</span>
                          <span style={{ color: "var(--text4)" }}>·</span>
                          <span>{v.portfolio} portfolio</span>
                        </div>
                      </div>
                      <div className="text-right mr-1">
                        <div className="flex items-center justify-end gap-1 text-[13px] font-medium" style={{ color: "var(--text)" }}>
                          <Star size={12} fill="#b8763a" style={{ color: "#b8763a" }} /> {v.rating}
                        </div>
                        <div className="text-[11px] mt-0.5" style={{ color: "var(--text4)" }}>{v.time}</div>
                      </div>
                      <Button variant="accent" size="sm">Approve</Button>
                      <Button variant="ghost" size="sm">Decline</Button>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent bookings */}
              <Card>
                <div className="flex items-center px-[22px] py-[18px]" style={{ borderBottom: "1px solid var(--border2)" }}>
                  <div className="text-[15px] font-medium" style={{ color: "var(--text)" }}>Recent bookings</div>
                  <Button variant="quiet" size="sm" className="ml-auto">View all <ChevronRight size={12} /></Button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-[13px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
                    <thead>
                      <tr>
                        {["Vendor", "Customer", "Event", "Date", "Amount", "Status"].map((h, i) => (
                          <th
                            key={h}
                            className="px-[14px] py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em]"
                            style={{ color: "var(--text4)", textAlign: i === 4 ? "right" : "left" }}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {RECENT_BOOKINGS.map((b, i) => (
                        <tr key={i} style={{ borderTop: "1px solid var(--border2)" }}>
                          <td className="px-[14px] py-[14px] font-medium" style={{ color: "var(--text)" }}>{b.v}</td>
                          <td className="px-[14px] py-[14px]" style={{ color: "var(--text2)" }}>{b.c}</td>
                          <td className="px-[14px] py-[14px]" style={{ color: "var(--text2)" }}>{b.e}</td>
                          <td className="px-[14px] py-[14px]" style={{ color: "var(--text3)" }}>{b.d}</td>
                          <td className="px-[14px] py-[14px] text-right font-medium tabular-nums" style={{ color: "var(--text)" }}>{b.a}</td>
                          <td className="px-[14px] py-[14px]">
                            <StatusPill kind={b.s === "negotiation" ? "negotiation" : b.s === "pending" ? "proposal" : "won"}>
                              {b.s[0].toUpperCase() + b.s.slice(1)}
                            </StatusPill>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* Right column */}
            <div className="space-y-[18px]">
              {/* Category donut */}
              <Card padded>
                <div className="flex items-center">
                  <div>
                    <p className="eyebrow">By category</p>
                    <div className="text-[15px] font-medium mt-1" style={{ color: "var(--text)" }}>Vendor distribution</div>
                  </div>
                  <Button variant="ghost" size="icon-sm" className="ml-auto"><MoreHorizontal size={14} /></Button>
                </div>
                <div className="mt-[18px] flex items-center gap-6">
                  <Donut
                    size={150}
                    thickness={18}
                    segments={[
                      { value: 30, color: "#c96442" },
                      { value: 22, color: "#5a6f8a" },
                      { value: 18, color: "#6b7a3f" },
                      { value: 15, color: "#b8763a" },
                      { value: 15, color: "#7a4d63" },
                    ]}
                    centerLabel={
                      <>
                        <div className="font-display" style={{ fontSize: 26, letterSpacing: "-0.02em" }}>4,832</div>
                        <div className="text-[11px]" style={{ color: "var(--text3)" }}>vendors</div>
                      </>
                    }
                  />
                  <div className="flex-1">
                    {[
                      { l: "Photography", v: "30%", c: "#c96442" },
                      { l: "Venues",      v: "22%", c: "#5a6f8a" },
                      { l: "Catering",    v: "18%", c: "#6b7a3f" },
                      { l: "Decorators",  v: "15%", c: "#b8763a" },
                      { l: "Others",      v: "15%", c: "#7a4d63" },
                    ].map((c) => (
                      <div key={c.l} className="flex items-center py-1.5">
                        <span className="mr-2.5 w-2 h-2 rounded-full" style={{ background: c.c }} />
                        <span className="text-[12px]" style={{ color: "var(--text2)" }}>{c.l}</span>
                        <span className="ml-auto text-[12px] tabular-nums" style={{ color: "var(--text3)" }}>{c.v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Top cities */}
              <Card padded>
                <p className="eyebrow">Top cities · GMV</p>
                <div className="mt-[14px] grid gap-3">
                  {TOP_CITIES.map((r) => (
                    <div key={r.c}>
                      <div className="flex justify-between text-[12px] mb-1.5">
                        <span className="font-medium" style={{ color: "var(--text2)" }}>{r.c}</span>
                        <span className="font-mono" style={{ color: "var(--text3)" }}>{r.v}</span>
                      </div>
                      <ProgressBar value={r.p} />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Activity feed */}
              <Card padded>
                <div className="flex items-center">
                  <p className="eyebrow">Live activity</p>
                  <span
                    className="ml-2 w-1.5 h-1.5 rounded-full"
                    style={{ background: "var(--crm-status-won-dot)", animation: "pulse 2s ease-in-out infinite" }}
                  />
                  <Button variant="quiet" size="sm" className="ml-auto !px-0">View all</Button>
                </div>
                <div className="mt-[14px] relative">
                  <div className="absolute left-3 top-1.5 bottom-1.5 w-px" style={{ background: "var(--border2)" }} />
                  {ACTIVITY.map((a, i) => {
                    const S = ACTIVITY_STYLES[a.kind];
                    const Icon = S.icon;
                    return (
                      <div key={i} className="flex gap-3.5 py-2 relative">
                        <div
                          className="w-[25px] h-[25px] rounded-full flex items-center justify-center shrink-0 relative z-[1]"
                          style={{ background: S.bg, color: S.fg, border: "2px solid var(--crm-surface)" }}
                        >
                          <Icon size={12} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[12.5px] leading-snug" style={{ color: "var(--text2)" }}>
                            <span className="font-medium" style={{ color: "var(--text)" }}>{a.who}</span>{" "}{a.sub}
                          </div>
                          <div className="text-[11px] mt-0.5" style={{ color: "var(--text4)" }}>{a.t} ago</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--text3)" }}>
      <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

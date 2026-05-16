"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  TrendingUp, Trophy, Wallet, Percent,
  ChevronRight, Inbox, Star,
} from "lucide-react";
import { DashboardFilters, DashboardKPI, StatusBreakdown, CRMResource, CRMTerritory } from "@/lib/crm-types";
import {
  getDashboardKPI, getLeadStatusBreakdown, getOpportunityStatusBreakdown,
  getResources, getTerritories,
} from "@/services/crm";

import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Sparkline } from "@/components/ui/Sparkline";
import { BarChart } from "@/components/ui/Charts";

import "./dashboard.css";

interface Props { vendorId: string; }

const PERIOD_OPTIONS = [
  { value: "week",    label: "Week"    },
  { value: "month",   label: "Month"   },
  { value: "quarter", label: "Quarter" },
  { value: "year",    label: "Year"    },
] as const;

/* ─── Helpers ─────────────────────────────────────────────────── */

const friendlyDate = () => {
  const d = new Date();
  return d.toLocaleDateString("en-IN", { weekday: "long", month: "long", day: "numeric" });
};

const inrShort = (n: number) => {
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(2)} L`;
  if (n >= 1_000)       return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
};

/* ─── Page ────────────────────────────────────────────────────── */

export default function DashboardPage({ vendorId }: Props) {
  const [filters, setFilters] = useState<DashboardFilters>({ period: "month" });
  const [kpi, setKpi] = useState<DashboardKPI | null>(null);
  const [leadBreakdown, setLeadBreakdown] = useState<StatusBreakdown[]>([]);
  const [optyBreakdown, setOptyBreakdown] = useState<StatusBreakdown[]>([]);
  const [resources, setResources] = useState<CRMResource[]>([]);
  const [territories, setTerritories] = useState<CRMTerritory[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [k, lb, ob] = await Promise.all([
      getDashboardKPI(vendorId, filters),
      getLeadStatusBreakdown(vendorId, filters),
      getOpportunityStatusBreakdown(vendorId, filters),
    ]);
    setKpi(k);
    setLeadBreakdown(lb);
    setOptyBreakdown(ob);
    setLoading(false);
  }, [vendorId, filters]);

  useEffect(() => {
    getResources(vendorId).then(setResources);
    getTerritories(vendorId).then(setTerritories);
  }, [vendorId]);

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { load(); }, [load]);

  const userName = resources[0]?.resource_name?.split(" ")[0] ?? "there";
  const leadsTotal = leadBreakdown.reduce((s, i) => s + i.count, 0);
  const optyTotal  = optyBreakdown.reduce((s, i) => s + i.count, 0);

  return (
    <div className="crm-page flex flex-col h-full" style={{ background: "var(--crm-bg)" }}>

      {/* ── Editorial welcome header ───────────────────────────── */}
      <div className="px-7 pt-7 pb-5 flex-shrink-0" style={{ borderBottom: "1px solid var(--border2)" }}>
        <div className="flex items-end flex-wrap gap-4">
          <div className="min-w-0">
            <p className="eyebrow">{friendlyDate()}</p>
            <h1 className="font-display mt-2" style={{ fontSize: 44, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--crm-text)" }}>
              Good morning, <span style={{ color: "var(--crm-accent)" }}>{userName}</span>
            </h1>
            <p className="mt-2 text-[13.5px]" style={{ color: "var(--crm-muted)" }}>
              You have <span style={{ color: "var(--text2)", fontWeight: 500 }}>{leadsTotal} leads</span> in progress
              and <span style={{ color: "var(--text2)", fontWeight: 500 }}>{optyTotal} opportunities</span> on the table.
            </p>
          </div>

          <div className="ml-auto flex flex-wrap items-center gap-2">
            {PERIOD_OPTIONS.map((p) => {
              const active = filters.period === p.value;
              return (
                <button
                  key={p.value}
                  onClick={() => setFilters((f) => ({ ...f, period: p.value }))}
                  className="rounded-[10px] px-3 py-1.5 text-[12px] font-medium transition"
                  style={{
                    background: active ? "var(--crm-text)" : "transparent",
                    color:      active ? "var(--bg2)"       : "var(--crm-muted)",
                    border: "1px solid " + (active ? "var(--crm-text)" : "var(--border)"),
                  }}
                >
                  {p.label}
                </button>
              );
            })}

            {/* Resource select */}
            {resources.length > 0 && (
              <select
                value={filters.resource_id ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, resource_id: e.target.value || undefined }))}
                className="rounded-[10px] px-3 py-1.5 text-[12px] outline-none cursor-pointer"
                style={{
                  background: "var(--bg2)", border: "1px solid var(--border)",
                  color: "var(--crm-text)", appearance: "none",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='none' stroke='%236f6357' stroke-width='1.4' d='M1 1l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
                  paddingRight: 28,
                }}
              >
                <option value="">All resources</option>
                {resources.map((r) => <option key={r.id} value={r.id}>{r.resource_name}</option>)}
              </select>
            )}

            {territories.length > 0 && (
              <select
                value={filters.territory_id ?? ""}
                onChange={(e) => setFilters((f) => ({ ...f, territory_id: e.target.value || undefined }))}
                className="rounded-[10px] px-3 py-1.5 text-[12px] outline-none cursor-pointer"
                style={{
                  background: "var(--bg2)", border: "1px solid var(--border)",
                  color: "var(--crm-text)", appearance: "none",
                  backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='none' stroke='%236f6357' stroke-width='1.4' d='M1 1l4 4 4-4'/%3E%3C/svg%3E\")",
                  backgroundRepeat: "no-repeat", backgroundPosition: "right 10px center",
                  paddingRight: 28,
                }}
              >
                <option value="">All territories</option>
                {territories.map((t) => <option key={t.id} value={t.id}>{t.alias || `${t.city}, ${t.country}`}</option>)}
              </select>
            )}
          </div>
        </div>
      </div>

      {/* ── Scrollable body ────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-y-auto p-7">
        {/* KPI strip */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3.5 mb-5">
          <KPI
            label="New leads"   value={kpi?.leads_this_period ?? 0}                                  delta="+3"
            icon={Inbox}        accent="var(--crm-status-new-dot)"     loading={loading}             spark={[4,3,5,6,5,7,8,6,8,9,11,10]}
          />
          <KPI
            label="Pipeline"    value={kpi ? inrShort(kpi.pipeline_value) : "—"}                     delta="+12%"
            icon={TrendingUp}   accent="var(--crm-accent)"             loading={loading}             spark={[40,42,45,44,48,52,55,58,60,65,68,72]}
          />
          <KPI
            label="Deals won"   value={kpi?.deals_won ?? 0}                                          delta={kpi ? inrShort(kpi.deals_won * 950_000) : "+0"}
            icon={Trophy}       accent="var(--crm-status-won-dot)"     loading={loading}             spark={[1,0,1,2,1,2,3,2,3,4,3,3]}
          />
          <KPI
            label="Opportunities"  value={kpi?.opportunities_created ?? 0}                          delta="+8%"
            icon={Wallet}       accent="var(--crm-status-progress-dot)" loading={loading}            spark={[5,5,5,6,6,6,7,7,8,8,9,9]}
          />
          <KPI
            label="Win rate"    value={kpi ? `${kpi.conversion_rate}%` : "—"}                       delta="+4%"
            icon={Percent}      accent="var(--crm-status-commit-dot)"   loading={loading}            spark={[28,29,30,28,31,32,33,32,34,33,34,34]}
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.6fr_1fr] gap-[18px]">
          {/* LEFT */}
          <div className="grid gap-[18px]">
            {/* Performance bars */}
            <Card padded>
              <div className="flex items-end justify-between mb-3.5">
                <div>
                  <p className="eyebrow">Performance · this {filters.period}</p>
                  <div className="text-[16px] font-medium mt-1.5" style={{ color: "var(--crm-text)" }}>Bookings &amp; revenue</div>
                </div>
                <div className="flex gap-3.5">
                  <Legend color="var(--crm-accent)" label="Bookings" />
                  <Legend color="var(--crm-text)" label="Revenue" />
                </div>
              </div>
              <BarChart
                data={[
                  {label:"W1",a:32,b:38},{label:"W2",a:48,b:52},{label:"W3",a:42,b:46},
                  {label:"W4",a:55,b:64},{label:"W5",a:48,b:58},{label:"W6",a:62,b:70},
                  {label:"W7",a:71,b:78},{label:"W8",a:66,b:74},
                ]}
                height={180}
              />
            </Card>

            {/* Conversion funnel */}
            <Card padded>
              <div className="flex items-center mb-4">
                <div>
                  <p className="eyebrow">Conversion funnel</p>
                  <div className="text-[16px] font-medium mt-1.5" style={{ color: "var(--crm-text)" }}>Lead to booked</div>
                </div>
                <div className="ml-auto text-[11px]" style={{ color: "var(--text4)" }}>Last 30 days</div>
              </div>
              <Funnel />
            </Card>

            {/* Status distribution */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[18px]">
              <Card padded>
                <p className="eyebrow">Lead status</p>
                <div className="text-[16px] font-medium mt-1.5 mb-4" style={{ color: "var(--crm-text)" }}>{leadsTotal} leads</div>
                <DistributionList rows={
                  leadBreakdown.length ? leadBreakdown.map((b, i) => ({
                    l: b.status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
                    v: b.count,
                    c: ["var(--crm-status-new-dot)","var(--text2)","var(--crm-accent)","var(--crm-status-progress-dot)","var(--crm-status-won-dot)","var(--crm-status-lost-dot)"][i % 6],
                  })) : []
                } />
              </Card>
              <Card padded>
                <p className="eyebrow">Opportunity pipeline</p>
                <div className="text-[16px] font-medium mt-1.5 mb-4" style={{ color: "var(--crm-text)" }}>{optyTotal} opportunities</div>
                <DistributionList rows={
                  optyBreakdown.length ? optyBreakdown.map((b, i) => ({
                    l: b.status.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase()),
                    v: b.count,
                    c: ["var(--crm-accent)","var(--crm-status-progress-dot)","var(--crm-status-commit-dot)","var(--crm-status-new-dot)","var(--crm-status-won-dot)","var(--crm-status-lost-dot)"][i % 6],
                  })) : []
                } />
              </Card>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid gap-[18px] content-start">
            {/* Today schedule (demo — wire to calendar service when ready) */}
            <Card padded>
              <div className="flex items-center">
                <p className="eyebrow">Today&apos;s schedule</p>
                <button className="ml-auto text-[11px] flex items-center gap-1" style={{ color: "var(--crm-accent)" }}>
                  Open calendar <ChevronRight size={11} />
                </button>
              </div>
              <div className="mt-4 grid gap-2.5">
                {DEMO_SCHEDULE.map((e, i) => (
                  <div key={i} className="flex gap-3 py-2.5"
                    style={{ borderTop: i === 0 ? "none" : "1px solid var(--border2)" }}>
                    <div className="w-1 rounded-sm self-stretch" style={{ background: e.tone }} />
                    <div className="w-11 font-mono text-[12px] font-medium" style={{ color: "var(--text2)" }}>{e.t}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium" style={{ color: "var(--crm-text)" }}>{e.title}</div>
                      <div className="text-[11.5px] mt-0.5" style={{ color: "var(--crm-muted)" }}>{e.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Hottest leads */}
            <Card padded>
              <div className="flex items-center">
                <p className="eyebrow">Hottest leads</p>
                <span className="ml-2 text-[10px]" style={{ color: "var(--crm-accent)" }}>by AI score</span>
                <button className="ml-auto text-[11px]" style={{ color: "var(--crm-muted)" }}>All</button>
              </div>
              <div className="mt-3.5 grid gap-3">
                {DEMO_HOT_LEADS.map((l, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <Avatar name={l.name} size={32} />
                    <div className="flex-1 min-w-0">
                      <div className="text-[13px] font-medium truncate" style={{ color: "var(--crm-text)" }}>{l.name}</div>
                      <div className="text-[11.5px]" style={{ color: "var(--crm-muted)" }}>{l.event}</div>
                    </div>
                    <ScoreRing value={l.score} />
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews / health */}
            <Card padded>
              <div className="flex items-center mb-3.5">
                <div>
                  <p className="eyebrow">Customer reviews</p>
                  <div className="flex items-baseline gap-2 mt-1.5">
                    <span className="font-display" style={{ fontSize: 30, letterSpacing: "-0.02em" }}>4.92</span>
                    <span className="text-[11px]" style={{ color: "var(--crm-muted)" }}>· 214 reviews</span>
                  </div>
                </div>
                <div className="ml-auto flex gap-[1px]">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={14} fill="#b8763a" style={{ color: "#b8763a" }} />
                  ))}
                </div>
              </div>
              <div className="grid gap-1.5">
                {[
                  { s: 5, n: 196, p: 92 },
                  { s: 4, n: 14,  p: 7 },
                  { s: 3, n: 3,   p: 1.4 },
                  { s: 2, n: 1,   p: 0.5 },
                  { s: 1, n: 0,   p: 0 },
                ].map((r) => (
                  <div key={r.s} className="flex items-center gap-2.5 text-[11px]">
                    <span style={{ color: "var(--crm-muted)", width: 12 }}>{r.s}</span>
                    <Star size={10} fill="#b8763a" style={{ color: "#b8763a" }} />
                    <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
                      <div style={{ height: "100%", width: `${r.p}%`, background: "var(--crm-accent)" }} />
                    </div>
                    <span className="font-mono text-right" style={{ color: "var(--crm-muted)", width: 24 }}>{r.n}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Sub-components ──────────────────────────────────────────── */

function KPI({
  label, value, delta, icon: Icon, accent, spark, loading,
}: {
  label: string; value: React.ReactNode; delta: string;
  icon: React.ComponentType<{ size?: number }>; accent: string; spark: number[]; loading: boolean;
}) {
  return (
    <Card padded compact>
      <div className="flex items-start justify-between">
        <div
          className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center"
          style={{ background: `color-mix(in oklab, ${accent} 14%, var(--bg2))`, color: accent }}
        >
          <Icon size={14} />
        </div>
        <span className="text-[11px] font-semibold" style={{ color: "var(--crm-status-won-text)" }}>{delta}</span>
      </div>
      <div className="mt-3">
        {loading
          ? <div className="h-7 w-20 rounded animate-pulse" style={{ background: "var(--bg3)" }} />
          : <div className="font-display" style={{ fontSize: 28, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--crm-text)" }}>{value}</div>
        }
        <div className="text-[11.5px] mt-1" style={{ color: "var(--crm-muted)" }}>{label}</div>
      </div>
      <div className="mt-2.5">
        <Sparkline values={spark} width={220} height={26} color={accent} />
      </div>
    </Card>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="flex items-center gap-1.5 text-[11px]" style={{ color: "var(--crm-muted)" }}>
      <span className="w-2 h-2 rounded-sm" style={{ background: color }} />
      {label}
    </span>
  );
}

function Funnel() {
  const stages = [
    { label: "Inquiries",     value: 142, pct: 100, c: "var(--crm-status-new-dot)" },
    { label: "Qualified",     value: 89,  pct: 63,  c: "var(--text2)" },
    { label: "Proposal sent", value: 47,  pct: 33,  c: "var(--crm-status-progress-dot)" },
    { label: "Negotiation",   value: 22,  pct: 15,  c: "var(--crm-accent)" },
    { label: "Booked",        value: 14,  pct: 10,  c: "var(--crm-status-won-dot)" },
  ];
  return (
    <div className="grid gap-2.5">
      {stages.map((s, i) => (
        <div key={s.label}>
          <div className="flex items-center mb-1.5 text-[12px]">
            <span style={{ color: "var(--text2)", fontWeight: 500 }}>{s.label}</span>
            {i > 0 && (
              <span className="ml-2 text-[10px]" style={{ color: "var(--text4)" }}>
                {Math.round((s.value / stages[i - 1].value) * 100)}% from prev.
              </span>
            )}
            <span className="ml-auto tabular-nums font-medium" style={{ color: "var(--crm-text)" }}>{s.value}</span>
          </div>
          <div className="relative h-[30px] rounded-md overflow-hidden" style={{ background: "var(--bg3)" }}>
            <div className="absolute inset-y-0 left-0 transition-all" style={{ width: `${s.pct}%`, background: s.c, opacity: 0.92 }} />
            <div className="absolute inset-0 flex items-center pl-3 text-[11px] font-medium text-white" style={{ textShadow: "0 1px 2px rgba(0,0,0,0.15)" }}>{s.pct}%</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DistributionList({ rows }: { rows: { l: string; v: number; c: string }[] }) {
  if (!rows.length) {
    return <p className="text-[12px] py-2" style={{ color: "var(--crm-muted)" }}>No data for this period</p>;
  }
  const max = Math.max(...rows.map((r) => r.v), 1);
  return (
    <div className="grid gap-2.5">
      {rows.map((r) => (
        <div key={r.l}>
          <div className="flex text-[12px] mb-1.5">
            <span style={{ color: "var(--text2)" }}>{r.l}</span>
            <span className="ml-auto tabular-nums font-medium" style={{ color: "var(--crm-muted)" }}>{r.v}</span>
          </div>
          <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
            <div style={{ height: "100%", width: `${(r.v / max) * 100}%`, background: r.c }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function ScoreRing({ value }: { value: number }) {
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center"
      style={{ background: `conic-gradient(var(--crm-accent) ${value}%, var(--bg3) 0)` }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold tabular-nums"
        style={{ background: "var(--crm-surface)", color: "var(--crm-text)" }}
      >
        {value}
      </div>
    </div>
  );
}

/* ─── Demo data (replace with real services as you add them) ───── */

const DEMO_SCHEDULE = [
  { t: "10:00", title: "Call · Ananya & Vikram",     sub: "Wedding · Dec 14",          tone: "var(--crm-accent)" },
  { t: "12:30", title: "Site visit · Opal Gardens",  sub: "Reception venue scout",     tone: "#6b7a3f" },
  { t: "15:00", title: "Send proposal · Lakshmi",    sub: "Wedding · Mar 22",          tone: "#b8763a" },
  { t: "17:00", title: "Team standup",                sub: "All resources",             tone: "#5a6f8a" },
];

const DEMO_HOT_LEADS = [
  { name: "Ananya & Vikram",  event: "Wedding · ₹18 L",      score: 92 },
  { name: "Lakshmi & Suresh", event: "Wedding · ₹25 L",      score: 88 },
  { name: "Amit Patel",       event: "Anniversary · ₹4.5 L", score: 84 },
];

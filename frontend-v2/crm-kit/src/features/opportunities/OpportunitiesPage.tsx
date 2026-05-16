"use client";

import { useEffect, useState, useCallback } from "react";
import { CRMOpportunity, OpportunityStatus } from "@/lib/crm-types";
import { getOpportunities } from "@/services/crm";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import OptyWizard from "./components/OptyWizard";
import OptyDetailFull from "./components/OptyDetailFull";
import { Plus, LayoutGrid, Table2, Search, Filter, MapPin, Check } from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";

interface Props { vendorId: string; }

const KANBAN_COLS: OpportunityStatus[] = [
  "prospect", "proposal", "negotiation", "verbal_commit", "closed_won", "closed_lost",
];

const STATUS_LABELS: Record<OpportunityStatus, string> = {
  prospect:      "Prospect",
  proposal:      "Proposal",
  negotiation:   "Negotiation",
  verbal_commit: "Verbal commit",
  closed_won:    "Closed won",
  closed_lost:   "Closed lost",
};

const STATUS_DOT: Record<OpportunityStatus, string> = {
  prospect:      "var(--crm-status-new-dot)",
  proposal:      "var(--crm-status-progress-dot)",
  negotiation:   "var(--crm-accent)",
  verbal_commit: "var(--crm-status-commit-dot)",
  closed_won:    "var(--crm-status-won-dot)",
  closed_lost:   "var(--crm-status-lost-dot)",
};

const STATUS_KIND: Record<OpportunityStatus, "new"|"proposal"|"negotiation"|"commit"|"won"|"lost"> = {
  prospect:      "new",
  proposal:      "proposal",
  negotiation:   "negotiation",
  verbal_commit: "commit",
  closed_won:    "won",
  closed_lost:   "lost",
};

const inrShort = (n?: number) => {
  if (!n) return "—";
  if (n >= 1_00_00_000) return `₹${(n / 1_00_00_000).toFixed(2)} Cr`;
  if (n >= 1_00_000)    return `₹${(n / 1_00_000).toFixed(1)} L`;
  if (n >= 1_000)       return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
};

export default function OpportunitiesPage({ vendorId }: Props) {
  const { resource } = useResourceAuth();
  const [opties, setOpties] = useState<CRMOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "kanban">("kanban");
  const [showWizard, setShowWizard] = useState(false);
  const [selected, setSelected] = useState<CRMOpportunity | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getOpportunities(vendorId, resource?.resource_id);
    setOpties(data);
    setLoading(false);
  }, [vendorId, resource?.resource_id]);

  useEffect(() => { load(); }, [load]);

  const filtered = opties.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.customer_name?.toLowerCase().includes(q) || o.opty_number?.toLowerCase().includes(q);
  });

  const pipelineValue = opties
    .filter((o) => !["closed_won", "closed_lost"].includes(o.opty_status))
    .reduce((sum, o) => sum + (o.deal_value || 0), 0);

  return (
    <div className="crm-page flex flex-col h-full" style={{ background: "var(--crm-bg)" }}>

      {/* ── Editorial header ────────────────────────────────────── */}
      <div className="px-7 pt-7 pb-5 flex-shrink-0" style={{ borderBottom: "1px solid var(--border2)" }}>
        <div className="flex items-end flex-wrap gap-4">
          <div>
            <p className="eyebrow">{opties.length} opportunities · {inrShort(pipelineValue)} pipeline</p>
            <h1 className="font-display mt-1.5" style={{ fontSize: 44, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--crm-text)" }}>
              Pipeline
            </h1>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--crm-muted)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search opportunities…"
                className="rounded-[14px] pl-8 pr-3 py-2 text-[13px] outline-none w-60 transition-all focus:w-72"
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--crm-text)" }}
              />
            </div>

            <div className="flex rounded-[14px] p-[3px] gap-0.5" style={{ background: "var(--bg3)" }}>
              <button
                onClick={() => setView("table")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-medium transition"
                style={{
                  background: view === "table" ? "var(--crm-surface)" : "transparent",
                  border: view === "table" ? "1px solid var(--border)" : "1px solid transparent",
                  color: view === "table" ? "var(--crm-text)" : "var(--crm-muted)",
                }}
              >
                <Table2 size={13} /> Table
              </button>
              <button
                onClick={() => setView("kanban")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-[12px] font-medium transition"
                style={{
                  background: view === "kanban" ? "var(--crm-surface)" : "transparent",
                  border: view === "kanban" ? "1px solid var(--border)" : "1px solid transparent",
                  color: view === "kanban" ? "var(--crm-text)" : "var(--crm-muted)",
                }}
              >
                <LayoutGrid size={13} /> Kanban
              </button>
            </div>

            <Button variant="ghost"><Filter size={13} /> Filters</Button>
            <Button variant="primary" onClick={() => setShowWizard(true)}>
              <Plus size={14} /> New opportunity
            </Button>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {loading ? (
          <div className="p-7 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-14 rounded-[var(--r-lg)] animate-pulse" style={{ background: "var(--bg3)" }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <p className="text-[13px] font-medium" style={{ color: "var(--crm-muted)" }}>No opportunities yet</p>
          </div>
        ) : view === "kanban" ? (
          <Kanban opties={filtered} onSelect={setSelected} />
        ) : (
          <OptyTable opties={filtered} onSelect={setSelected} />
        )}
      </div>

      {/* Modals — your existing components, untouched */}
      {showWizard && (
        <OptyWizard vendorId={vendorId}
          onSave={() => { setShowWizard(false); load(); }}
          onClose={() => setShowWizard(false)} />
      )}
      {selected && (
        <OptyDetailFull opty={selected} vendorId={vendorId}
          onClose={() => setSelected(null)}
          onRefresh={() => { load(); setSelected(null); }} />
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────
   Kanban
   ──────────────────────────────────────────────────────────────── */

function Kanban({ opties, onSelect }: { opties: CRMOpportunity[]; onSelect: (o: CRMOpportunity) => void }) {
  return (
    <div className="h-full overflow-x-auto p-7 flex gap-3.5">
      {KANBAN_COLS.map((status) => {
        const colOpties = opties.filter((o) => o.opty_status === status);
        const value = colOpties.reduce((s, o) => s + (o.deal_value ?? 0), 0);
        return (
          <div key={status} className="w-[280px] shrink-0 flex flex-col gap-2.5">
            <div className="flex items-center gap-2 pb-2"
              style={{ borderBottom: `2px solid ${STATUS_DOT[status]}` }}>
              <span className="w-2 h-2 rounded-full" style={{ background: STATUS_DOT[status] }} />
              <span className="text-[13px] font-medium" style={{ color: "var(--crm-text)" }}>{STATUS_LABELS[status]}</span>
              <span className="text-[11px] ml-1" style={{ color: "var(--crm-muted)" }}>{colOpties.length}</span>
              <span className="ml-auto text-[11px] tabular-nums" style={{ color: "var(--crm-muted)" }}>{inrShort(value)}</span>
              <button className="ml-1 w-[22px] h-[22px] rounded-md flex items-center justify-center transition"
                style={{ color: "var(--crm-muted)" }}>
                <Plus size={11} />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 overflow-y-auto pb-3 flex-1">
              {colOpties.map((o) => <DealCard key={o.id} o={o} onSelect={onSelect} />)}
              {colOpties.length === 0 && (
                <div className="rounded-[var(--r-md)] py-4 text-center text-[11px]"
                  style={{ border: "1px dashed var(--border)", color: "var(--crm-muted)" }}>
                  Empty
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DealCard({ o, onSelect }: { o: CRMOpportunity; onSelect: (o: CRMOpportunity) => void }) {
  const isHot  = o.opty_status === "negotiation" && o.opty_priority === "high";
  const isWon  = o.opty_status === "closed_won";
  const isLost = o.opty_status === "closed_lost";

  return (
    <button onClick={() => onSelect(o)} className="text-left">
      <Card padded compact className="relative hover:-translate-y-px transition-transform">
        {isHot && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-[2px] rounded-full text-[10px] font-semibold"
            style={{ background: "var(--crm-accent)", color: "#fff" }}>
            <span className="w-1 h-1 rounded-full bg-white" style={{ animation: "pulse 1.5s ease-in-out infinite" }} />
            HOT
          </div>
        )}
        {isWon && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-1.5 py-[2px] rounded-full text-[10px] font-semibold"
            style={{ background: "var(--crm-status-won-bg)", color: "var(--crm-status-won-text)" }}>
            <Check size={10} /> Won
          </div>
        )}

        <div className="flex items-center gap-2 pr-12">
          <Avatar name={o.customer_name} size={26} />
          <div className="text-[13px] font-medium truncate" style={{ color: "var(--crm-text)" }}>
            {o.customer_name}
          </div>
        </div>
        {o.event_type && (
          <div className="text-[11.5px] mt-1.5" style={{ color: "var(--crm-muted)" }}>
            {o.event_type}{o.event_date && ` · ${new Date(o.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
          </div>
        )}
        <div className="flex items-center gap-2 mt-2.5">
          <span className="font-mono text-[13px] font-semibold" style={{ color: "var(--crm-text)" }}>{inrShort(o.deal_value)}</span>
          {o.opty_number && (
            <span className="font-mono text-[10px] rounded px-1.5 py-0.5 ml-auto"
              style={{ background: "var(--bg3)", color: "var(--crm-muted)" }}>
              {o.opty_number}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-2.5 pt-2.5"
          style={{ borderTop: "1px solid var(--border2)" }}>
          <PriorityBadge p={o.opty_priority} />
          <div className="ml-auto text-[11px] font-medium tabular-nums" style={{ color: "var(--crm-muted)" }}>
            {o.win_probability}%
          </div>
          <div className="w-12 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
            <div style={{ height: "100%", width: `${o.win_probability}%`, background: STATUS_DOT[o.opty_status] }} />
          </div>
        </div>
      </Card>
    </button>
  );
}

function PriorityBadge({ p }: { p: "high" | "medium" | "low" }) {
  const map = {
    high:   { bg: "var(--crm-priority-high-bg)",  fg: "var(--crm-priority-high-text)",  label: "high"   },
    medium: { bg: "var(--crm-priority-med-bg)",   fg: "var(--crm-priority-med-text)",   label: "medium" },
    low:    { bg: "var(--crm-priority-low-bg)",   fg: "var(--crm-priority-low-text)",   label: "low"    },
  } as const;
  const c = map[p] ?? map.medium;
  return (
    <span className="text-[10px] font-semibold px-1.5 py-[2px] rounded-full"
      style={{ background: c.bg, color: c.fg }}>
      {c.label}
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────
   Table
   ──────────────────────────────────────────────────────────────── */

function OptyTable({ opties, onSelect }: { opties: CRMOpportunity[]; onSelect: (o: CRMOpportunity) => void }) {
  return (
    <div className="h-full overflow-hidden p-7">
      <div className="rounded-[var(--r-lg)] overflow-hidden h-full flex flex-col"
        style={{ background: "var(--crm-surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
        <div className="overflow-auto flex-1">
          <table className="w-full text-[13px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
            <thead className="sticky top-0 z-10"
              style={{ background: "var(--crm-surface)", borderBottom: "1px solid var(--border)" }}>
              <tr>
                {["Opportunity", "Event", "Deal value", "Win %", "Stage", "Close date"].map((h, i) => (
                  <th key={h}
                    className="px-3.5 py-3 text-[11px] font-semibold uppercase tracking-[0.08em]"
                    style={{ color: "var(--text4)", textAlign: i === 2 ? "right" : "left", paddingLeft: i === 0 ? 20 : 14 }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {opties.map((o, idx) => (
                <tr key={o.id} onClick={() => onSelect(o)}
                  className="cursor-pointer transition-colors"
                  style={{ borderBottom: idx < opties.length - 1 ? "1px solid var(--border2)" : undefined }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg2)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = "transparent"; }}
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={o.customer_name} size={32} />
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-medium" style={{ color: "var(--crm-text)" }}>{o.customer_name}</div>
                        {o.opty_number && (
                          <div className="font-mono text-[11px] mt-0.5" style={{ color: "var(--text4)" }}>{o.opty_number}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-3.5 py-3.5 text-[13px]" style={{ color: "var(--text2)" }}>{o.event_type ?? "—"}</td>
                  <td className="px-3.5 py-3.5 text-right font-medium tabular-nums" style={{ color: "var(--crm-text)" }}>
                    {inrShort(o.deal_value)}
                  </td>
                  <td className="px-3.5 py-3.5">
                    <div className="flex items-center gap-2 min-w-[90px]">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
                        <div style={{ height: "100%", width: `${o.win_probability}%`, background: STATUS_DOT[o.opty_status] }} />
                      </div>
                      <span className="font-mono text-[11px] font-medium tabular-nums" style={{ color: "var(--text2)" }}>{o.win_probability}%</span>
                    </div>
                  </td>
                  <td className="px-3.5 py-3.5">
                    <StatusPill kind={STATUS_KIND[o.opty_status]}>{STATUS_LABELS[o.opty_status]}</StatusPill>
                  </td>
                  <td className="px-3.5 py-3.5 text-[13px] whitespace-nowrap" style={{ color: "var(--crm-muted)" }}>
                    {o.close_date
                      ? new Date(o.close_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

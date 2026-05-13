"use client";

import { useEffect, useState, useCallback } from "react";
import { CRMOpportunity, OpportunityStatus } from "@/lib/crm-types";
import { getOpportunities } from "@/services/crm";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import OptyWizard from "./components/OptyWizard";
import OptyDetailFull from "./components/OptyDetailFull";
import { Plus, TrendingUp, LayoutGrid, Table2 } from "lucide-react";

interface Props { vendorId: string; }

const STATUS_COLORS: Record<OpportunityStatus, { bg: string; text: string }> = {
  prospect:      { bg: "#e0f2fe", text: "#0369a1" },
  proposal:      { bg: "#fef9c3", text: "#854d0e" },
  negotiation:   { bg: "#ede9fe", text: "#6d28d9" },
  verbal_commit: { bg: "#dbeafe", text: "#1d4ed8" },
  closed_won:    { bg: "#dcfce7", text: "#15803d" },
  closed_lost:   { bg: "#fee2e2", text: "#b91c1c" },
};

const KANBAN_COLS: { status: OpportunityStatus; label: string }[] = [
  { status: "prospect",      label: "Prospect" },
  { status: "proposal",      label: "Proposal" },
  { status: "negotiation",   label: "Negotiation" },
  { status: "verbal_commit", label: "Verbal Commit" },
  { status: "closed_won",    label: "Won" },
  { status: "closed_lost",   label: "Lost" },
];

export default function OpportunitiesPage({ vendorId }: Props) {
  const { resource } = useResourceAuth();
  const [opties, setOpties] = useState<CRMOpportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "kanban">("table");
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
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="mr-auto">
          <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Opportunities</h1>
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            Pipeline: ₹{(pipelineValue / 100000).toFixed(1)}L
          </p>
        </div>

        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…"
          className="rounded-lg px-3 py-2 text-sm outline-none w-40"
          style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }} />

        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border3)" }}>
          <button onClick={() => setView("table")} className="p-2 transition-colors"
            style={{ background: view === "table" ? "var(--gold)" : "var(--bg2)", color: view === "table" ? "#000" : "var(--text-muted)" }}>
            <Table2 size={16} />
          </button>
          <button onClick={() => setView("kanban")} className="p-2 transition-colors"
            style={{ background: view === "kanban" ? "var(--gold)" : "var(--bg2)", color: view === "kanban" ? "#000" : "var(--text-muted)" }}>
            <LayoutGrid size={16} />
          </button>
        </div>

        <button onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: "var(--gold)", color: "#000" }}>
          <Plus size={16} /> New Opportunity
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "var(--bg2)" }} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <TrendingUp size={40} style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>No opportunities yet</p>
        </div>
      ) : view === "kanban" ? (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {KANBAN_COLS.map((col) => {
            const colOpties = filtered.filter((o) => o.opty_status === col.status);
            const colors = STATUS_COLORS[col.status];
            return (
              <div key={col.status} className="w-64 shrink-0">
                <div className="mb-2 flex items-center justify-between">
                  <span className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                    style={{ background: colors.bg, color: colors.text }}>
                    {col.label}
                  </span>
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>{colOpties.length}</span>
                </div>
                <div className="flex flex-col gap-2">
                  {colOpties.map((o) => (
                    <button key={o.id} onClick={() => setSelected(o)}
                      className="w-full rounded-xl p-3 text-left hover:opacity-90 transition-opacity"
                      style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}>
                      <p className="text-xs font-medium" style={{ color: "var(--text)" }}>{o.customer_name}</p>
                      {o.deal_value > 0 && (
                        <p className="text-xs mt-0.5 font-semibold" style={{ color: "var(--gold)" }}>
                          ₹{(o.deal_value / 1000).toFixed(0)}K
                        </p>
                      )}
                      <div className="mt-1 flex items-center gap-1">
                        <div className="flex-1 h-1 rounded-full" style={{ background: "var(--border3)" }}>
                          <div className="h-1 rounded-full" style={{ background: "#10b981", width: `${o.win_probability}%` }} />
                        </div>
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>{o.win_probability}%</span>
                      </div>
                    </button>
                  ))}
                  {colOpties.length === 0 && (
                    <div className="rounded-xl p-4 text-center text-xs"
                      style={{ border: "1px dashed var(--border3)", color: "var(--text-muted)" }}>
                      Empty
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border3)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}>
                {["Opty #", "Customer", "Event", "Deal Value", "Win%", "Stage", "Close Date"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => {
                const colors = STATUS_COLORS[o.opty_status];
                return (
                  <tr key={o.id} onClick={() => setSelected(o)}
                    className="cursor-pointer hover:opacity-90 transition-opacity"
                    style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}>
                    <td className="px-4 py-3">
                      <span className="text-xs font-mono" style={{ color: "var(--gold)" }}>
                        {o.opty_number || o.id.slice(0, 8)}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>{o.customer_name}</td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>{o.event_type || "—"}</td>
                    <td className="px-4 py-3 font-semibold" style={{ color: "var(--gold)" }}>
                      {o.deal_value > 0 ? `₹${(o.deal_value / 1000).toFixed(0)}K` : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <div className="w-16 h-1.5 rounded-full" style={{ background: "var(--border3)" }}>
                          <div className="h-1.5 rounded-full" style={{ background: "#10b981", width: `${o.win_probability}%` }} />
                        </div>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>{o.win_probability}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                        style={{ background: colors.bg, color: colors.text }}>
                        {o.opty_status.replace("_", " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                      {o.close_date ? new Date(o.close_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" }) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

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

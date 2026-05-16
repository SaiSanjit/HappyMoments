"use client";

import { useEffect, useState, useCallback } from "react";
import { CRMLead } from "@/lib/crm-types";
import { getLeads } from "@/services/crm";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import LeadTable from "./components/LeadTable";
import LeadWizard from "./components/LeadWizard";
import LeadDetailFull from "./components/LeadDetailFull";
import { Plus, LayoutGrid, Table2, Search, Filter, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props { vendorId: string; }

export default function LeadsPage({ vendorId }: Props) {
  const { resource } = useResourceAuth();
  const [leads, setLeads] = useState<CRMLead[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"table" | "kanban">("table");
  const [showWizard, setShowWizard] = useState(false);
  const [selectedLead, setSelectedLead] = useState<CRMLead | null>(null);
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getLeads(vendorId, resource?.resource_id);
    setLeads(data);
    setLoading(false);
  }, [vendorId, resource?.resource_id]);

  useEffect(() => { load(); }, [load]);

  const filtered = leads.filter((l) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      l.customer_name?.toLowerCase().includes(q) ||
      l.lead_number?.toLowerCase().includes(q) ||
      l.event_type?.toLowerCase().includes(q)
    );
  });

  // Stage counts
  const stages = [
    { key: "new_lead",         label: "New",          dot: "var(--crm-status-new-dot)" },
    { key: "contacted",        label: "Contacted",    dot: "var(--text2)" },
    { key: "proposal_sent",    label: "Proposal",     dot: "var(--crm-status-progress-dot)" },
    { key: "negotiation",      label: "Negotiating",  dot: "var(--crm-accent)" },
    { key: "advance_received", label: "Won",          dot: "var(--crm-status-won-dot)" },
  ];

  const stageCounts = Object.fromEntries(
    stages.map((s) => [s.key, leads.filter((l) => l.status === (s.key as any)).length])
  ) as Record<string, number>;

  return (
    <div className="flex flex-col h-full" style={{ background: "var(--crm-bg)" }}>
      {/* ── Editorial header ────────────────────────────────────── */}
      <div className="px-6 pt-6 pb-3 flex-shrink-0">
        <div className="flex items-end flex-wrap gap-4">
          <div>
            <p className="eyebrow">Pipeline · {leads.length} leads</p>
            <h1 className="font-display mt-1.5" style={{ fontSize: 44, letterSpacing: "-0.025em", lineHeight: 1, color: "var(--crm-text)" }}>
              Leads
            </h1>
            <p className="mt-2 text-[13.5px]" style={{ color: "var(--crm-muted)" }}>
              Every conversation that could turn into a celebration.
            </p>
          </div>

          <div className="ml-auto flex items-center gap-2.5">
            {/* View toggle */}
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

            <Button variant="ghost"><Download size={13} /> Export</Button>
            <Button variant="primary" onClick={() => setShowWizard(true)}>
              <Plus size={14} /> New lead
            </Button>
          </div>
        </div>

        {/* Stage filters + search */}
        <div className="mt-5 flex flex-wrap items-center gap-2">
          <button
            className="rounded-full px-3.5 py-1.5 text-[12px] font-medium"
            style={{ background: "var(--crm-text)", color: "var(--bg2)" }}
          >
            All <span className="ml-1.5 opacity-70 text-[11px]">{leads.length}</span>
          </button>
          {stages.map((s) => (
            <button
              key={s.key}
              className="rounded-full px-3.5 py-1.5 text-[12px] font-medium flex items-center gap-2"
              style={{ background: "var(--crm-surface2)", color: "var(--crm-text)", border: "1px solid var(--border2)" }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
              {s.label}
              <span style={{ color: "var(--crm-label)" }}>{stageCounts[s.key] ?? 0}</span>
            </button>
          ))}

          <div className="ml-auto flex items-center gap-2">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--crm-muted)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, event, city…"
                className="rounded-[14px] pl-8 pr-3 py-2 text-[13px] outline-none w-60 transition-all focus:w-72"
                style={{ background: "var(--bg2)", border: "1px solid var(--border)", color: "var(--crm-text)" }}
              />
            </div>
            <Button variant="ghost" size="sm"><Filter size={12} /> Filters</Button>
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────── */}
      <div className="flex-1 min-h-0 overflow-hidden p-6 pt-3">
        <LeadTable leads={filtered} loading={loading} view={view} onSelect={setSelectedLead} onRefresh={load} />
      </div>

      {showWizard && (
        <LeadWizard vendorId={vendorId} onSave={() => { setShowWizard(false); load(); }} onClose={() => setShowWizard(false)} />
      )}

      {selectedLead && (
        <LeadDetailFull lead={selectedLead} vendorId={vendorId} onClose={() => setSelectedLead(null)} onRefresh={() => { load(); setSelectedLead(null); }} />
      )}
    </div>
  );
}

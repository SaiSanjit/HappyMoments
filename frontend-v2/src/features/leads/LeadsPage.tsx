"use client";

import { useEffect, useState, useCallback } from "react";
import { CRMLead } from "@/lib/crm-types";
import { getLeads } from "@/services/crm";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import LeadTable from "./components/LeadTable";
import LeadWizard from "./components/LeadWizard";
import LeadDetailFull from "./components/LeadDetailFull";
import { Plus, LayoutGrid, Table2 } from "lucide-react";

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

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-bold mr-auto" style={{ color: "var(--text)" }}>Leads</h1>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search leads…"
          className="rounded-lg px-3 py-2 text-sm outline-none w-48"
          style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }}
        />

        <div className="flex rounded-lg overflow-hidden border" style={{ borderColor: "var(--border3)" }}>
          <button
            onClick={() => setView("table")}
            className="p-2 transition-colors"
            style={{ background: view === "table" ? "var(--gold)" : "var(--bg2)", color: view === "table" ? "#000" : "var(--text-muted)" }}
          >
            <Table2 size={16} />
          </button>
          <button
            onClick={() => setView("kanban")}
            className="p-2 transition-colors"
            style={{ background: view === "kanban" ? "var(--gold)" : "var(--bg2)", color: view === "kanban" ? "#000" : "var(--text-muted)" }}
          >
            <LayoutGrid size={16} />
          </button>
        </div>

        <button
          onClick={() => setShowWizard(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: "var(--gold)", color: "#000" }}
        >
          <Plus size={16} /> New Lead
        </button>
      </div>

      <LeadTable
        leads={filtered}
        loading={loading}
        view={view}
        onSelect={setSelectedLead}
        onRefresh={load}
      />

      {showWizard && (
        <LeadWizard
          vendorId={vendorId}
          onSave={() => { setShowWizard(false); load(); }}
          onClose={() => setShowWizard(false)}
        />
      )}

      {selectedLead && (
        <LeadDetailFull
          lead={selectedLead}
          vendorId={vendorId}
          onClose={() => setSelectedLead(null)}
          onRefresh={() => { load(); setSelectedLead(null); }}
        />
      )}
    </div>
  );
}

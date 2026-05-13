"use client";

import { CRMLead, LeadStatus } from "@/lib/crm-types";
import { PhoneIncoming } from "lucide-react";

interface Props {
  leads: CRMLead[];
  loading: boolean;
  view: "table" | "kanban";
  onSelect: (lead: CRMLead) => void;
  onRefresh: () => void;
}

const STATUS_COLORS: Record<LeadStatus, { bg: string; text: string }> = {
  new:         { bg: "#e0f2fe", text: "#0369a1" },
  contacted:   { bg: "#fef9c3", text: "#854d0e" },
  qualified:   { bg: "#dbeafe", text: "#1d4ed8" },
  negotiation: { bg: "#ede9fe", text: "#6d28d9" },
  booked:      { bg: "#dcfce7", text: "#15803d" },
  lost:        { bg: "#fee2e2", text: "#b91c1c" },
  on_hold:     { bg: "#f3f4f6", text: "#4b5563" },
};

const KANBAN_COLUMNS: { status: LeadStatus; label: string }[] = [
  { status: "new", label: "New" },
  { status: "contacted", label: "Contacted" },
  { status: "qualified", label: "Qualified" },
  { status: "negotiation", label: "Negotiation" },
  { status: "booked", label: "Booked" },
  { status: "lost", label: "Lost" },
  { status: "on_hold", label: "On Hold" },
];

export default function LeadTable({ leads, loading, view, onSelect }: Props) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-xl animate-pulse" style={{ background: "var(--bg2)" }} />
        ))}
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <PhoneIncoming size={40} style={{ color: "var(--text-muted)" }} />
        <p style={{ color: "var(--text-muted)" }}>No leads found</p>
      </div>
    );
  }

  if (view === "kanban") {
    return (
      <div className="flex gap-4 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.status);
          const colors = STATUS_COLORS[col.status];
          return (
            <div key={col.status} className="w-64 shrink-0">
              <div className="mb-2 flex items-center justify-between">
                <span
                  className="rounded-full px-2.5 py-0.5 text-xs font-medium"
                  style={{ background: colors.bg, color: colors.text }}
                >
                  {col.label}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>{colLeads.length}</span>
              </div>
              <div className="flex flex-col gap-2">
                {colLeads.map((lead) => (
                  <button
                    key={lead.id}
                    onClick={() => onSelect(lead)}
                    className="w-full rounded-xl p-3 text-left transition-opacity hover:opacity-90"
                    style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
                  >
                    <p className="text-xs font-medium" style={{ color: "var(--text)" }}>
                      {lead.customer_name}
                    </p>
                    {lead.event_type && (
                      <p className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {lead.event_type}
                        {lead.event_date && ` · ${new Date(lead.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                      </p>
                    )}
                    {lead.lead_number && (
                      <p className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                        #{lead.lead_number}
                      </p>
                    )}
                  </button>
                ))}
                {colLeads.length === 0 && (
                  <div
                    className="rounded-xl p-4 text-center text-xs"
                    style={{ border: "1px dashed var(--border3)", color: "var(--text-muted)" }}
                  >
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

  return (
    <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border3)" }}>
      <table className="w-full text-sm">
        <thead>
          <tr style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}>
            {["Lead #", "Customer", "Event", "Event Date", "Status", "Source", "Created"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {leads.map((lead) => {
            const colors = STATUS_COLORS[lead.status] || { bg: "#f3f4f6", text: "#4b5563" };
            return (
              <tr
                key={lead.id}
                onClick={() => onSelect(lead)}
                className="cursor-pointer hover:opacity-90 transition-opacity"
                style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}
              >
                <td className="px-4 py-3">
                  <span className="text-xs font-mono" style={{ color: "var(--gold)" }}>
                    {lead.lead_number || lead.id.slice(0, 8)}
                  </span>
                </td>
                <td className="px-4 py-3 font-medium" style={{ color: "var(--text)" }}>
                  {lead.customer_name}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                  {lead.event_type || "—"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                  {lead.event_date
                    ? new Date(lead.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                    style={{ background: colors.bg, color: colors.text }}
                  >
                    {lead.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                  {lead.lead_source || "Platform"}
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                  {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

"use client";

import { CRMLead, LeadStatus } from "@/lib/crm-types";
import { PhoneIncoming } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { StatusPill } from "@/components/ui/StatusPill";

interface Props {
  leads: CRMLead[];
  loading: boolean;
  view: "table" | "kanban";
  onSelect: (lead: CRMLead) => void;
  onRefresh: () => void;
}

const STATUS_LABELS: Record<LeadStatus, string> = {
  new_lead:         "New",
  contacted:        "Contacted",
  negotiation:      "Negotiating",
  proposal_sent:    "Proposal",
  advance_received: "Won",
  lost:             "Lost",
};

const STATUS_KIND: Record<LeadStatus, "new"|"contacted"|"proposal"|"negotiation"|"won"|"lost"> = {
  new_lead:         "new",
  contacted:        "contacted",
  negotiation:      "negotiation",
  proposal_sent:    "proposal",
  advance_received: "won",
  lost:             "lost",
};

const STATUS_DOT: Record<LeadStatus, string> = {
  new_lead:         "var(--crm-status-new-dot)",
  contacted:        "var(--text2)",
  negotiation:      "var(--crm-accent)",
  proposal_sent:    "var(--crm-status-progress-dot)",
  advance_received: "var(--crm-status-won-dot)",
  lost:             "var(--crm-status-lost-dot)",
};

const KANBAN_COLS: { status: LeadStatus; label: string }[] = [
  { status: "new_lead",         label: "New" },
  { status: "contacted",        label: "Contacted" },
  { status: "proposal_sent",    label: "Proposal" },
  { status: "negotiation",      label: "Negotiating" },
  { status: "advance_received", label: "Won" },
  { status: "lost",             label: "Lost" },
];

/** Lead score heuristic — derived from budget + recency. Replace with real ML score. */
function deriveScore(lead: CRMLead): number {
  let s = 50;
  if (lead.budget_max && lead.budget_max > 500_000) s += 25;
  else if (lead.budget_max && lead.budget_max > 100_000) s += 15;
  if (lead.event_date) {
    const days = Math.max(0, (new Date(lead.event_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (days < 30) s += 15;
    else if (days < 90) s += 10;
  }
  if (lead.status === "proposal_sent")   s += 5;
  if (lead.status === "negotiation")     s += 12;
  if (lead.status === "advance_received") s = 100;
  if (lead.status === "lost")            s = Math.min(s, 30);
  return Math.min(100, Math.max(0, Math.round(s)));
}

function scoreColor(v: number): string {
  if (v >= 85) return "var(--crm-status-won-dot)";
  if (v >= 65) return "var(--crm-accent)";
  if (v >= 45) return "var(--crm-status-progress-dot)";
  return "var(--crm-status-lost-dot)";
}

function inrShort(n?: number) {
  if (!n) return "—";
  if (n >= 1_00_000) return `₹${(n / 1_00_000).toFixed(1)} L`;
  if (n >= 1_000)    return `₹${(n / 1_000).toFixed(0)}K`;
  return `₹${n}`;
}

function formatDate(s?: string) {
  if (!s) return "—";
  return new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function LeadTable({ leads, loading, view, onSelect }: Props) {

  /* ── Loading skeleton ─────────────────────────────────────── */
  if (loading) {
    return (
      <div className="rounded-[var(--r-lg)] overflow-hidden h-full flex flex-col"
        style={{ background: "var(--crm-surface)", border: "1px solid var(--border)" }}>
        <div className="px-5 py-3.5" style={{ background: "var(--crm-surface)", borderBottom: "1px solid var(--border2)" }}>
          <div className="flex gap-6">
            {["w-16","w-28","w-20","w-24","w-20","w-16","w-16","w-20"].map((w, i) => (
              <div key={i} className={`h-3 ${w} rounded animate-pulse`} style={{ background: "var(--bg3)" }} />
            ))}
          </div>
        </div>
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5"
            style={{ borderBottom: "1px solid var(--border2)", opacity: 1 - i * 0.08 }}>
            <div className="w-9 h-9 rounded-full animate-pulse" style={{ background: "var(--bg3)" }} />
            <div className="flex-1 h-3 rounded animate-pulse" style={{ background: "var(--bg3)" }} />
            <div className="w-24 h-3 rounded animate-pulse" style={{ background: "var(--bg3)" }} />
            <div className="w-20 h-3 rounded animate-pulse" style={{ background: "var(--bg3)" }} />
          </div>
        ))}
      </div>
    );
  }

  /* ── Empty state ───────────────────────────────────────────── */
  if (leads.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-24">
        <div className="rounded-full p-5"
          style={{ background: "var(--crm-surface)", border: "1px solid var(--border)" }}>
          <PhoneIncoming size={28} style={{ color: "var(--crm-muted)" }} />
        </div>
        <p className="text-[13px] font-medium" style={{ color: "var(--crm-muted)" }}>No leads found</p>
        <p className="text-[11px]" style={{ color: "var(--crm-label)" }}>Create your first lead to get started</p>
      </div>
    );
  }

  /* ── Kanban view ───────────────────────────────────────────── */
  if (view === "kanban") {
    return (
      <div className="flex gap-3 overflow-x-auto pb-4 h-full">
        {KANBAN_COLS.map((col) => {
          const colLeads = leads.filter((l) => l.status === col.status);
          const value = colLeads.reduce((s, l) => s + (l.budget_max ?? 0), 0);
          return (
            <div key={col.status} className="w-[280px] shrink-0 flex flex-col">
              <div className="flex items-center gap-2 pb-2 mb-2"
                style={{ borderBottom: `2px solid ${STATUS_DOT[col.status]}` }}>
                <span className="w-2 h-2 rounded-full" style={{ background: STATUS_DOT[col.status] }} />
                <span className="text-[13px] font-medium" style={{ color: "var(--crm-text)" }}>{col.label}</span>
                <span className="text-[11px] ml-1" style={{ color: "var(--crm-muted)" }}>{colLeads.length}</span>
                <span className="ml-auto text-[11px] tabular-nums" style={{ color: "var(--crm-muted)" }}>{inrShort(value)}</span>
              </div>
              <div className="flex flex-col gap-2.5 flex-1">
                {colLeads.map((lead) => {
                  const score = deriveScore(lead);
                  return (
                    <button key={lead.id} onClick={() => onSelect(lead)}
                      className="w-full text-left rounded-[var(--r-md)] p-3.5 transition-all hover:-translate-y-px"
                      style={{
                        background: "var(--crm-surface)", border: "1px solid var(--border)",
                        boxShadow: "var(--card-shadow)",
                      }}>
                      <div className="flex items-center gap-2 mb-1">
                        <Avatar name={lead.customer_name} size={26} />
                        <p className="text-[13px] font-medium truncate" style={{ color: "var(--crm-text)" }}>{lead.customer_name}</p>
                      </div>
                      {lead.event_type && (
                        <p className="text-[11.5px] mt-1" style={{ color: "var(--crm-muted)" }}>
                          {lead.event_type}{lead.event_date && ` · ${new Date(lead.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-2.5 pt-2.5"
                        style={{ borderTop: "1px solid var(--border2)" }}>
                        <span className="font-mono text-[12px] font-medium" style={{ color: "var(--crm-text)" }}>
                          {inrShort(lead.budget_max)}
                        </span>
                        {lead.lead_number && (
                          <span className="font-mono text-[10px] ml-auto rounded-md px-1.5 py-0.5"
                            style={{ background: "var(--bg3)", color: "var(--crm-muted)" }}>
                            #{lead.lead_number}
                          </span>
                        )}
                        <span className="ml-auto text-[11px] font-medium tabular-nums" style={{ color: scoreColor(score) }}>
                          {score}
                        </span>
                      </div>
                    </button>
                  );
                })}
                {colLeads.length === 0 && (
                  <div className="rounded-[var(--r-md)] p-5 text-center text-[11px] flex-1"
                    style={{ border: "1px dashed var(--border)", color: "var(--crm-muted)", minHeight: 80 }}>
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

  /* ── Table view ────────────────────────────────────────────── */
  return (
    <div className="rounded-[var(--r-lg)] overflow-hidden h-full flex flex-col"
      style={{ background: "var(--crm-surface)", border: "1px solid var(--border)", boxShadow: "var(--card-shadow)" }}>
      <div className="overflow-auto flex-1">
        <table className="w-full text-[13px]" style={{ borderCollapse: "separate", borderSpacing: 0 }}>
          <thead className="sticky top-0 z-10"
            style={{ background: "var(--crm-surface)", borderBottom: "1px solid var(--border)" }}>
            <tr>
              <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text4)" }}>Lead</th>
              <th className="px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text4)" }}>Event</th>
              <th className="px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text4)" }}>Date · Guests</th>
              <th className="px-3.5 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text4)" }}>Budget</th>
              <th className="px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text4)" }}>Status</th>
              <th className="px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text4)" }}>Score</th>
              <th className="px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text4)" }}>Source</th>
              <th className="px-3.5 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.08em]" style={{ color: "var(--text4)" }}>Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => {
              const score = deriveScore(lead);
              const guests = lead.qualification?.guest_count;
              return (
                <tr
                  key={lead.id}
                  onClick={() => onSelect(lead)}
                  className="cursor-pointer transition-colors group"
                  style={{ borderBottom: idx < leads.length - 1 ? "1px solid var(--border2)" : undefined }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = "var(--bg2)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLTableRowElement).style.background = "transparent";
                  }}
                >
                  {/* Lead column */}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <Avatar name={lead.customer_name} size={36} />
                      <div className="min-w-0">
                        <div className="text-[13.5px] font-medium" style={{ color: "var(--crm-text)" }}>
                          {lead.customer_name}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 text-[11.5px]" style={{ color: "var(--text4)" }}>
                          {lead.lead_number && <span className="font-mono">#{lead.lead_number}</span>}
                          {lead.lead_source && <>
                            <span>·</span>
                            <span>{lead.lead_source[0].toUpperCase() + lead.lead_source.slice(1)}</span>
                          </>}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Event */}
                  <td className="px-3.5 py-3.5">
                    <div className="text-[13px] font-medium" style={{ color: "var(--text2)" }}>{lead.event_type || "—"}</div>
                    {lead.event_venue && (
                      <div className="text-[11.5px] mt-0.5" style={{ color: "var(--crm-muted)" }}>{lead.event_venue}</div>
                    )}
                  </td>

                  {/* Date · Guests */}
                  <td className="px-3.5 py-3.5 tabular-nums">
                    <div className="text-[13px]" style={{ color: "var(--text2)" }}>{formatDate(lead.event_date)}</div>
                    {guests && (
                      <div className="text-[11.5px] mt-0.5" style={{ color: "var(--crm-muted)" }}>{guests} guests</div>
                    )}
                  </td>

                  {/* Budget */}
                  <td className="px-3.5 py-3.5 text-right">
                    <span className="font-medium tabular-nums text-[14px]" style={{ color: "var(--crm-text)" }}>
                      {inrShort(lead.budget_max)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-3.5 py-3.5">
                    <StatusPill kind={STATUS_KIND[lead.status]}>
                      {STATUS_LABELS[lead.status]}
                    </StatusPill>
                  </td>

                  {/* Score */}
                  <td className="px-3.5 py-3.5">
                    <div className="flex items-center gap-2 min-w-[90px]">
                      <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: "var(--bg3)" }}>
                        <div style={{ height: "100%", width: `${score}%`, background: scoreColor(score) }} />
                      </div>
                      <span className="font-mono text-[11px] font-medium" style={{ color: "var(--text2)" }}>{score}</span>
                    </div>
                  </td>

                  {/* Source */}
                  <td className="px-3.5 py-3.5 text-[13px]" style={{ color: "var(--crm-muted)" }}>
                    {lead.lead_source ? lead.lead_source[0].toUpperCase() + lead.lead_source.slice(1) : "—"}
                  </td>

                  {/* Created */}
                  <td className="px-3.5 py-3.5 text-[13px] whitespace-nowrap" style={{ color: "var(--crm-muted)" }}>
                    {new Date(lead.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

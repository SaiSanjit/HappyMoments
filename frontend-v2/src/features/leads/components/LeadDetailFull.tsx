"use client";

import { useState } from "react";
import { CRMLead, LeadStatus } from "@/lib/crm-types";
import { updateLead } from "@/services/crm";
import { X, TrendingUp } from "lucide-react";

interface Props {
  lead: CRMLead;
  vendorId: string;
  onClose: () => void;
  onRefresh: () => void;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new_lead",         label: "New Lead"         },
  { value: "contacted",        label: "Contacted"        },
  { value: "negotiation",      label: "Negotiation"      },
  { value: "proposal_sent",    label: "Proposal Sent"    },
  { value: "advance_received", label: "Advance Received" },
  { value: "lost",             label: "Lost"             },
];

const STATUS_STYLES: Record<LeadStatus, string> = {
  new_lead:         "var(--crm-status-new-bg)",
  contacted:        "var(--crm-status-progress-bg)",
  negotiation:      "var(--crm-status-commit-bg)",
  proposal_sent:    "var(--crm-status-proposal-bg)",
  advance_received: "var(--crm-status-won-bg)",
  lost:             "var(--crm-status-lost-bg)",
};

const STATUS_TEXT: Record<LeadStatus, string> = {
  new_lead:         "var(--crm-status-new-text)",
  contacted:        "var(--crm-status-progress-text)",
  negotiation:      "var(--crm-status-commit-text)",
  proposal_sent:    "var(--crm-status-proposal-text)",
  advance_received: "var(--crm-status-won-text)",
  lost:             "var(--crm-status-lost-text)",
};

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--crm-label)" }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: "var(--crm-text)" }}>{value || "—"}</p>
    </div>
  );
}

export default function LeadDetailFull({ lead, vendorId, onClose, onRefresh }: Props) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.initial_notes || "");
  const [saving, setSaving] = useState(false);

  const canConvert = ["negotiation", "proposal_sent"].includes(status);

  const handleSave = async () => {
    setSaving(true);
    await updateLead(lead.id, { status, initial_notes: notes });
    setSaving(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: "var(--crm-overlay)", backdropFilter: "blur(6px)" }}>
      <div
        className="w-full sm:max-w-2xl rounded-t-[28px] sm:rounded-[28px] flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          background: "var(--crm-modal-bg)",
          border: "1px solid var(--crm-modal-border)",
          boxShadow: "0 34px 90px rgba(0,0,0,0.24), 0 12px 32px rgba(0,0,0,0.14)",
        }}>

        {/* Decorative inner border */}
        <div className="absolute inset-4 rounded-[24px] pointer-events-none z-0 hidden sm:block"
          style={{ border: "1px solid rgba(255,255,255,0.52)" }} />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--crm-border2)" }}>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold" style={{ color: "var(--crm-text)" }}>{lead.customer_name}</h2>
              {lead.lead_number && (
                <span className="text-xs font-mono rounded-md px-2 py-0.5 font-semibold"
                  style={{ background: "var(--crm-accent-soft)", color: "var(--crm-accent)" }}>
                  #{lead.lead_number}
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--crm-muted)" }}>
              {lead.event_type || "Event"}
              {lead.event_date && ` · ${new Date(lead.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl transition-colors" style={{ color: "var(--crm-muted)" }}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Status */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--crm-label)" }}>Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setStatus(opt.value)}
                  className="rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200"
                  style={{
                    background: status === opt.value ? "var(--crm-accent)" : "var(--crm-input-bg)",
                    color: status === opt.value ? "#fff" : "var(--crm-muted)",
                    border: `1.5px solid ${status === opt.value ? "var(--crm-accent)" : "var(--crm-border)"}`,
                    boxShadow: status === opt.value ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="rounded-2xl p-4 grid grid-cols-2 gap-4"
            style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}>
            <InfoField label="Phone" value={lead.customer_phone} />
            <InfoField label="Email" value={lead.customer_email} />
            <InfoField label="Source" value={lead.lead_source ? lead.lead_source.charAt(0).toUpperCase() + lead.lead_source.slice(1) : undefined} />
            <InfoField label="Created" value={new Date(lead.created_at).toLocaleDateString("en-IN")} />
          </div>

          {/* Qualification */}
          {lead.qualification && Object.values(lead.qualification).some(Boolean) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--crm-label)" }}>Qualification</p>
              <div className="rounded-2xl p-4 grid grid-cols-2 gap-4"
                style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}>
                {lead.qualification.budget_min && <InfoField label="Min Budget" value={`₹${lead.qualification.budget_min.toLocaleString("en-IN")}`} />}
                {lead.qualification.budget_max && <InfoField label="Max Budget" value={`₹${lead.qualification.budget_max.toLocaleString("en-IN")}`} />}
                {lead.qualification.guest_count && <InfoField label="Guests" value={String(lead.qualification.guest_count)} />}
                {lead.qualification.venue_preference && <InfoField label="Venue" value={lead.qualification.venue_preference} />}
              </div>
            </div>
          )}

          {/* Services */}
          {lead.services && lead.services.filter((s) => s.selected).length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--crm-label)" }}>Services</p>
              <div className="flex flex-wrap gap-2">
                {lead.services.filter((s) => s.selected).map((s) => (
                  <span key={s.name} className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ background: "var(--crm-accent-soft)", color: "var(--crm-accent)", border: "1px solid var(--crm-accent-border)" }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {lead.contacts && lead.contacts.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--crm-label)" }}>Contacts</p>
              <div className="space-y-2">
                {lead.contacts.map((c, i) => (
                  <div key={i} className="rounded-xl p-3" style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}>
                    <p className="text-sm font-semibold" style={{ color: "var(--crm-text)" }}>{c.name}</p>
                    {c.phone && <p className="text-xs" style={{ color: "var(--crm-muted)" }}>{c.phone}</p>}
                    {c.email && <p className="text-xs" style={{ color: "var(--crm-muted)" }}>{c.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--crm-label)" }}>Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200"
              style={{
                background: "var(--crm-input-bg)",
                border: "1.5px solid var(--crm-border)",
                color: "var(--crm-text)",
              }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--crm-accent-border)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--crm-accent-focus)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--crm-border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--crm-border2)", background: "var(--crm-modal-footer)" }}>
          {canConvert && (
            <button
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: "var(--crm-accent)", color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
              <TrendingUp size={15} /> Convert to Opty
            </button>
          )}
          <div className="flex-1" />
          <button onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{ border: "1.5px solid var(--crm-border)", color: "var(--crm-muted)" }}>
            Close
          </button>
          <button onClick={handleSave} disabled={saving}
            className="rounded-xl px-5 py-2.5 text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all"
            style={{ background: "var(--crm-accent)", color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

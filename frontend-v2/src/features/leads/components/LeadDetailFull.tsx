"use client";

import { useState, useEffect } from "react";
import { CRMLead, LeadStatus } from "@/lib/crm-types";
import { updateLead } from "@/services/crm";
import { X, TrendingUp, MessageSquare } from "lucide-react";

interface Props {
  lead: CRMLead;
  vendorId: string;
  onClose: () => void;
  onRefresh: () => void;
}

const STATUS_OPTIONS: { value: LeadStatus; label: string }[] = [
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "qualified", label: "Qualified" },
  { value: "negotiation", label: "Negotiation" },
  { value: "booked", label: "Booked" },
  { value: "lost", label: "Lost" },
  { value: "on_hold", label: "On Hold" },
];

export default function LeadDetailFull({ lead, vendorId, onClose, onRefresh }: Props) {
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [notes, setNotes] = useState(lead.notes || "");
  const [saving, setSaving] = useState(false);

  const canConvert = ["negotiation", "booked"].includes(status);

  const handleSave = async () => {
    setSaving(true);
    await updateLead(lead.id, { status, notes });
    setSaving(false);
    onRefresh();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div
        className="w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh]"
        style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border3)" }}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
                {lead.customer_name}
              </h2>
              {lead.lead_number && (
                <span className="text-xs font-mono" style={{ color: "var(--gold)" }}>
                  #{lead.lead_number}
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {lead.event_type || "Event"}
              {lead.event_date && ` · ${new Date(lead.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Status */}
          <div>
            <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Status</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setStatus(opt.value)}
                  className="rounded-full px-3 py-1 text-xs font-medium"
                  style={{ background: status === opt.value ? "var(--gold)" : "var(--bg)", color: status === opt.value ? "#000" : "var(--text-muted)", border: "1px solid var(--border3)" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <InfoField label="Phone" value={lead.customer_phone} />
            <InfoField label="Email" value={lead.customer_email} />
            <InfoField label="Source" value={lead.lead_source} />
            <InfoField label="Created" value={new Date(lead.created_at).toLocaleDateString("en-IN")} />
          </div>

          {/* Qualification */}
          {lead.qualification && Object.keys(lead.qualification).some((k) => (lead.qualification as Record<string, unknown>)[k]) && (
            <div>
              <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Qualification</p>
              <div
                className="rounded-lg p-3 grid grid-cols-2 gap-2 text-sm"
                style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}
              >
                {lead.qualification.budget_min && (
                  <InfoField label="Min Budget" value={`₹${lead.qualification.budget_min.toLocaleString("en-IN")}`} />
                )}
                {lead.qualification.budget_max && (
                  <InfoField label="Max Budget" value={`₹${lead.qualification.budget_max.toLocaleString("en-IN")}`} />
                )}
                {lead.qualification.guest_count && (
                  <InfoField label="Guests" value={String(lead.qualification.guest_count)} />
                )}
                {lead.qualification.venue_preference && (
                  <InfoField label="Venue" value={lead.qualification.venue_preference} />
                )}
              </div>
            </div>
          )}

          {/* Services */}
          {lead.services && lead.services.filter((s) => s.selected).length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Services</p>
              <div className="flex flex-wrap gap-2">
                {lead.services.filter((s) => s.selected).map((s) => (
                  <span key={s.name} className="rounded-full px-2.5 py-1 text-xs"
                    style={{ background: "var(--gold-soft)", color: "var(--gold)" }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {lead.contacts && lead.contacts.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Contacts</p>
              <div className="space-y-2">
                {lead.contacts.map((c, i) => (
                  <div key={i} className="rounded-lg p-3 text-sm"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}>
                    <p className="font-medium" style={{ color: "var(--text)" }}>{c.name}</p>
                    {c.phone && <p style={{ color: "var(--text-muted)" }}>{c.phone}</p>}
                    {c.email && <p style={{ color: "var(--text-muted)" }}>{c.email}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--border3)" }}>
          {canConvert && (
            <button
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "#6366f1", color: "#fff" }}
              title="Convert to Opportunity"
            >
              <TrendingUp size={16} /> Convert to Opty
            </button>
          )}
          <div className="flex-1" />
          <button onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ border: "1px solid var(--border3)", color: "var(--text-muted)" }}>
            Close
          </button>
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
            style={{ background: "var(--gold)", color: "#000" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] font-medium mb-0.5" style={{ color: "var(--text-muted)" }}>{label}</p>
      <p className="text-sm" style={{ color: "var(--text)" }}>{value || "—"}</p>
    </div>
  );
}

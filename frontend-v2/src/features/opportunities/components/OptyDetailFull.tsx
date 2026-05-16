"use client";

import { useState } from "react";
import { CRMOpportunity, OpportunityStatus } from "@/lib/crm-types";
import { updateOpportunity } from "@/services/crm";
import { X } from "lucide-react";

interface Props {
  opty: CRMOpportunity;
  vendorId: string;
  onClose: () => void;
  onRefresh: () => void;
}

const STATUS_OPTIONS: { value: OpportunityStatus; label: string }[] = [
  { value: "prospect",      label: "Prospect"      },
  { value: "proposal",      label: "Proposal"      },
  { value: "negotiation",   label: "Negotiation"   },
  { value: "verbal_commit", label: "Verbal Commit" },
  { value: "closed_won",    label: "Closed Won"    },
  { value: "closed_lost",   label: "Closed Lost"   },
];

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-wider mb-0.5" style={{ color: "var(--crm-label)" }}>{label}</p>
      <p className="text-sm font-medium" style={{ color: "var(--crm-text)" }}>{value || "—"}</p>
    </div>
  );
}

export default function OptyDetailFull({ opty, vendorId, onClose, onRefresh }: Props) {
  const [status, setStatus] = useState<OpportunityStatus>(opty.opty_status);
  const [statusRemarks, setStatusRemarks] = useState(opty.status_remarks || "");
  const [dealValue, setDealValue] = useState(opty.deal_value);
  const [winProbability, setWinProbability] = useState(opty.win_probability);
  const [notes, setNotes] = useState(opty.notes || "");
  const [saving, setSaving] = useState(false);
  const [showRemarksDialog, setShowRemarksDialog] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OpportunityStatus | null>(null);

  const handleStatusChange = (s: OpportunityStatus) => {
    if (s === "closed_won" || s === "closed_lost") {
      setPendingStatus(s);
      setShowRemarksDialog(true);
      return;
    }
    setStatus(s);
  };

  const handleRemarksConfirm = () => {
    if (pendingStatus) setStatus(pendingStatus);
    setShowRemarksDialog(false);
    setPendingStatus(null);
  };

  const handleSave = async () => {
    setSaving(true);
    await updateOpportunity(opty.id, {
      opty_status: status,
      status_remarks: statusRemarks,
      deal_value: dealValue,
      win_probability: winProbability,
      notes,
    });
    setSaving(false);
    onRefresh();
  };

  const inputStyle = {
    background: "var(--crm-input-bg)",
    border: "1.5px solid var(--crm-border)",
    color: "var(--crm-text)",
  };

  const inputClass = "w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200";

  const handleInputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--crm-accent-border)";
    e.currentTarget.style.boxShadow = "0 0 0 3px var(--crm-accent-focus)";
  };

  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = "var(--crm-border)";
    e.currentTarget.style.boxShadow = "none";
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: "var(--crm-overlay)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full sm:max-w-2xl rounded-t-[28px] sm:rounded-[28px] flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          background: "var(--crm-modal-bg)",
          border: "1px solid var(--crm-modal-border)",
          boxShadow: "0 34px 90px rgba(0,0,0,0.24), 0 12px 32px rgba(0,0,0,0.14)",
        }}
      >
        {/* Decorative inner border */}
        <div className="absolute inset-4 rounded-[24px] pointer-events-none z-0 hidden sm:block"
          style={{ border: "1px solid rgba(255,255,255,0.52)" }} />

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--crm-border2)" }}>
          <div>
            <div className="flex items-center gap-2.5">
              <h2 className="text-base font-bold" style={{ color: "var(--crm-text)" }}>{opty.customer_name}</h2>
              {opty.opty_number && (
                <span className="text-xs font-mono rounded-md px-2 py-0.5 font-semibold"
                  style={{ background: "var(--crm-accent-soft)", color: "var(--crm-accent)" }}>
                  #{opty.opty_number}
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--crm-muted)" }}>
              {opty.event_type || "Opportunity"}
              {opty.event_date && ` · ${new Date(opty.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl transition-colors" style={{ color: "var(--crm-muted)" }}>
            <X size={17} />
          </button>
        </div>

        {/* Body */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 space-y-5">

          {/* Stage */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--crm-label)" }}>Stage</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => handleStatusChange(opt.value)}
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

          {/* Deal metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--crm-label)" }}>Deal Value (₹)</label>
              <input type="number" value={dealValue} onChange={(e) => setDealValue(Number(e.target.value))}
                className={inputClass} style={inputStyle}
                onFocus={handleInputFocus} onBlur={handleInputBlur} />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--crm-label)" }}>Win Probability %</label>
              <input type="number" min={0} max={100} value={winProbability} onChange={(e) => setWinProbability(Number(e.target.value))}
                className={inputClass} style={inputStyle}
                onFocus={handleInputFocus} onBlur={handleInputBlur} />
            </div>
          </div>

          {/* Contact info */}
          <div className="rounded-2xl p-4 grid grid-cols-2 gap-4"
            style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}>
            <InfoField label="Phone" value={opty.customer_phone} />
            <InfoField label="Email" value={opty.customer_email} />
          </div>

          {/* Key dates */}
          {(opty.site_visit_date || opty.proposal_due_date || opty.decision_date || opty.close_date) && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--crm-label)" }}>Key Dates</p>
              <div className="rounded-2xl p-4 grid grid-cols-2 gap-4"
                style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}>
                {opty.site_visit_date && <InfoField label="Site Visit" value={new Date(opty.site_visit_date).toLocaleDateString("en-IN")} />}
                {opty.proposal_due_date && <InfoField label="Proposal Due" value={new Date(opty.proposal_due_date).toLocaleDateString("en-IN")} />}
                {opty.decision_date && <InfoField label="Decision" value={new Date(opty.decision_date).toLocaleDateString("en-IN")} />}
                {opty.close_date && <InfoField label="Close Date" value={new Date(opty.close_date).toLocaleDateString("en-IN")} />}
              </div>
            </div>
          )}

          {/* Services */}
          {opty.services && opty.services.filter((s) => s.selected).length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--crm-label)" }}>Services</p>
              <div className="flex flex-wrap gap-2">
                {opty.services.filter((s) => s.selected).map((s) => (
                  <span key={s.name} className="rounded-full px-3 py-1.5 text-xs font-semibold"
                    style={{ background: "var(--crm-accent-soft)", color: "var(--crm-accent)", border: "1px solid var(--crm-accent-border)" }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {opty.contacts && opty.contacts.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-2.5" style={{ color: "var(--crm-label)" }}>Contacts</p>
              <div className="space-y-2">
                {opty.contacts.map((c, i) => (
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
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
              className="w-full rounded-xl px-4 py-3 text-sm resize-none outline-none transition-all duration-200"
              style={inputStyle}
              onFocus={handleInputFocus} onBlur={handleInputBlur} />
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--crm-border2)", background: "var(--crm-modal-footer)" }}>
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

      {/* Status Remarks Dialog */}
      {showRemarksDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center px-4"
          style={{ background: "var(--crm-overlay)", backdropFilter: "blur(4px)" }}>
          <div className="w-full max-w-sm rounded-[24px] p-6"
            style={{
              background: "var(--crm-modal-bg)",
              border: "1px solid var(--crm-modal-border)",
              boxShadow: "0 24px 60px rgba(0,0,0,0.22)",
            }}>
            <h3 className="text-base font-bold mb-1" style={{ color: "var(--crm-text)" }}>
              {pendingStatus === "closed_won" ? "🎉 Closed Won!" : "Closed Lost"}
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--crm-muted)" }}>
              Please add remarks for this status change.
            </p>
            <textarea
              value={statusRemarks}
              onChange={(e) => setStatusRemarks(e.target.value)}
              rows={3}
              placeholder="Add remarks…"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none resize-none transition-all duration-200 mb-4"
              style={{ background: "var(--crm-input-bg)", border: "1.5px solid var(--crm-border)", color: "var(--crm-text)" }}
              onFocus={(e) => { e.currentTarget.style.borderColor = "var(--crm-accent-border)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--crm-accent-focus)"; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = "var(--crm-border)"; e.currentTarget.style.boxShadow = "none"; }}
            />
            <div className="flex gap-3">
              <button onClick={() => setShowRemarksDialog(false)}
                className="flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors"
                style={{ border: "1.5px solid var(--crm-border)", color: "var(--crm-muted)" }}>
                Cancel
              </button>
              <button onClick={handleRemarksConfirm}
                className="flex-1 rounded-xl py-2.5 text-sm font-bold hover:opacity-90 transition-all"
                style={{
                  background: pendingStatus === "closed_won"
                    ? "var(--crm-status-won-dot)"
                    : "var(--crm-status-lost-dot)",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(0,0,0,0.2)",
                }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  { value: "prospect",      label: "Prospect" },
  { value: "proposal",      label: "Proposal" },
  { value: "negotiation",   label: "Negotiation" },
  { value: "verbal_commit", label: "Verbal Commit" },
  { value: "closed_won",    label: "Closed Won" },
  { value: "closed_lost",   label: "Closed Lost" },
];

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

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 px-0 sm:px-4">
      <div
        className="w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl flex flex-col max-h-[90vh]"
        style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
      >
        <div className="flex items-start justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border3)" }}>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
                {opty.customer_name}
              </h2>
              {opty.opty_number && (
                <span className="text-xs font-mono" style={{ color: "#6366f1" }}>
                  #{opty.opty_number}
                </span>
              )}
            </div>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {opty.event_type || "Opportunity"}
              {opty.event_date && ` · ${new Date(opty.event_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}`}
            </p>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-5">
          {/* Stage */}
          <div>
            <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Stage</label>
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => handleStatusChange(opt.value)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                  style={{
                    background: status === opt.value ? "#6366f1" : "var(--bg)",
                    color: status === opt.value ? "#fff" : "var(--text-muted)",
                    border: "1px solid var(--border3)",
                  }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Deal metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Deal Value (₹)</label>
              <input type="number" value={dealValue} onChange={(e) => setDealValue(Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Win Probability %</label>
              <input type="number" min={0} max={100} value={winProbability} onChange={(e) => setWinProbability(Number(e.target.value))}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <InfoField label="Phone" value={opty.customer_phone} />
            <InfoField label="Email" value={opty.customer_email} />
          </div>

          {/* Key dates */}
          {(opty.site_visit_date || opty.proposal_due_date || opty.decision_date || opty.close_date) && (
            <div>
              <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Key Dates</p>
              <div className="grid grid-cols-2 gap-3">
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
              <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Services</p>
              <div className="flex flex-wrap gap-2">
                {opty.services.filter((s) => s.selected).map((s) => (
                  <span key={s.name} className="rounded-full px-2.5 py-1 text-xs"
                    style={{ background: "#ede9fe", color: "#6d28d9" }}>
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contacts */}
          {opty.contacts && opty.contacts.length > 0 && (
            <div>
              <p className="mb-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>Contacts</p>
              {opty.contacts.map((c, i) => (
                <div key={i} className="rounded-lg p-3 text-sm mb-2"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}>
                  <p className="font-medium" style={{ color: "var(--text)" }}>{c.name}</p>
                  {c.phone && <p style={{ color: "var(--text-muted)" }}>{c.phone}</p>}
                </div>
              ))}
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

        <div className="flex items-center gap-3 px-6 py-4" style={{ borderTop: "1px solid var(--border3)" }}>
          <div className="flex-1" />
          <button onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium"
            style={{ border: "1px solid var(--border3)", color: "var(--text-muted)" }}>
            Close
          </button>
          <button onClick={handleSave} disabled={saving}
            className="rounded-lg px-4 py-2 text-sm font-medium disabled:opacity-50"
            style={{ background: "#6366f1", color: "#fff" }}>
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Status Remarks Dialog */}
      {showRemarksDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/60 px-4">
          <div
            className="w-full max-w-sm rounded-2xl p-6"
            style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
          >
            <h3 className="text-base font-semibold mb-1" style={{ color: "var(--text)" }}>
              {pendingStatus === "closed_won" ? "🎉 Closed Won" : "Closed Lost"}
            </h3>
            <p className="text-xs mb-4" style={{ color: "var(--text-muted)" }}>
              Please add remarks for this status change.
            </p>
            <textarea value={statusRemarks} onChange={(e) => setStatusRemarks(e.target.value)} rows={3}
              placeholder="Add remarks…"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none mb-4"
              style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
            <div className="flex gap-3">
              <button onClick={() => setShowRemarksDialog(false)}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium"
                style={{ border: "1px solid var(--border3)", color: "var(--text-muted)" }}>
                Cancel
              </button>
              <button onClick={handleRemarksConfirm}
                className="flex-1 rounded-lg py-2.5 text-sm font-medium"
                style={{ background: pendingStatus === "closed_won" ? "#10b981" : "#ef4444", color: "#fff" }}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
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

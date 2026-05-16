"use client";

import { useState } from "react";
import { CRMOpportunity, EventType, Priority } from "@/lib/crm-types";
import { createOpportunity } from "@/services/crm";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

interface Props {
  vendorId: string;
  initialData?: Partial<CRMOpportunity>;
  onSave: (opty: CRMOpportunity) => void;
  onClose: () => void;
}

const STEPS = ["Summary", "Services", "Qualification", "Contacts", "Key Dates", "Review"];
const EVENT_TYPES: EventType[] = ["Wedding", "Engagement", "Corporate", "Birthday", "Anniversary", "Other"];
const PRIORITIES: Priority[] = ["high", "medium", "low"];
const SERVICE_OPTIONS = ["Photography", "Videography", "Decoration", "Catering", "Venue", "DJ/Music", "Mehendi", "Makeup", "Florist", "Invitations"];

function GlassInput({ label, required, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--crm-label)" }}>
        {label}{required && <span style={{ color: "var(--crm-accent)" }}> *</span>}
      </label>
      <input
        {...props}
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
        style={{
          background: "var(--crm-input-bg)",
          border: "1.5px solid var(--crm-border)",
          color: "var(--crm-text)",
          ...(props.style || {}),
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--crm-accent-border)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--crm-accent-focus)"; props.onFocus?.(e); }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--crm-border)"; e.currentTarget.style.boxShadow = "none"; props.onBlur?.(e); }}
      />
    </div>
  );
}

function GlassTextarea({ label, rows = 3, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--crm-label)" }}>{label}</label>
      <textarea
        {...props}
        rows={rows}
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none transition-all duration-200"
        style={{
          background: "var(--crm-input-bg)",
          border: "1.5px solid var(--crm-border)",
          color: "var(--crm-text)",
          ...(props.style || {}),
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--crm-accent-border)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--crm-accent-focus)"; props.onFocus?.(e); }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--crm-border)"; e.currentTarget.style.boxShadow = "none"; props.onBlur?.(e); }}
      />
    </div>
  );
}

function GlassSelect({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--crm-label)" }}>{label}</label>
      <select
        {...props}
        className="w-full rounded-xl px-4 py-2.5 text-sm outline-none transition-all duration-200"
        style={{
          background: "var(--crm-input-bg)",
          border: "1.5px solid var(--crm-border)",
          color: "var(--crm-text)",
          ...(props.style || {}),
        }}
        onFocus={(e) => { e.currentTarget.style.borderColor = "var(--crm-accent-border)"; e.currentTarget.style.boxShadow = "0 0 0 3px var(--crm-accent-focus)"; props.onFocus?.(e); }}
        onBlur={(e) => { e.currentTarget.style.borderColor = "var(--crm-border)"; e.currentTarget.style.boxShadow = "none"; props.onBlur?.(e); }}
      >
        {children}
      </select>
    </div>
  );
}

export default function OptyWizard({ vendorId, initialData, onSave, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState(initialData?.customer_name || "");
  const [customerPhone, setCustomerPhone] = useState(initialData?.customer_phone || "");
  const [customerEmail, setCustomerEmail] = useState(initialData?.customer_email || "");
  const [eventType, setEventType] = useState<EventType | "">(initialData?.event_type || "");
  const [eventDate, setEventDate] = useState(initialData?.event_date || "");
  const [dealValue, setDealValue] = useState(initialData?.deal_value || 0);
  const [winProbability, setWinProbability] = useState(initialData?.win_probability || 50);
  const [priority, setPriority] = useState<Priority>(initialData?.opty_priority || "medium");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [services, setServices] = useState(
    SERVICE_OPTIONS.map((s) => ({ name: s, selected: false, price: 0 }))
  );

  const [guestCount, setGuestCount] = useState("");
  const [budgetMin, setBudgetMin] = useState("");
  const [budgetMax, setBudgetMax] = useState("");
  const [venuePreference, setVenuePreference] = useState("");
  const [specialReqs, setSpecialReqs] = useState("");

  const [contacts, setContacts] = useState([{ name: "", phone: "", email: "" }]);

  const [closeDate, setCloseDate] = useState(initialData?.close_date || "");
  const [siteVisitDate, setSiteVisitDate] = useState(initialData?.site_visit_date || "");
  const [proposalDueDate, setProposalDueDate] = useState(initialData?.proposal_due_date || "");
  const [decisionDate, setDecisionDate] = useState(initialData?.decision_date || "");

  const toggleService = (name: string) => {
    setServices((prev) => prev.map((s) => s.name === name ? { ...s, selected: !s.selected } : s));
  };

  const updateContact = (i: number, field: string, val: string) => {
    setContacts((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };

  const handleNext = () => {
    if (step === 0 && !customerName.trim()) { setError("Customer name is required."); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const { data, error: err } = await createOpportunity({
      vendor_id: vendorId,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim() || undefined,
      customer_email: customerEmail.trim() || undefined,
      event_type: eventType || undefined,
      event_date: eventDate || undefined,
      deal_value: dealValue,
      win_probability: winProbability,
      opty_status: "prospect",
      opty_priority: priority,
      close_date: closeDate || undefined,
      site_visit_date: siteVisitDate || undefined,
      proposal_due_date: proposalDueDate || undefined,
      decision_date: decisionDate || undefined,
      notes,
      new_client: true,
      services: services.filter((s) => s.selected),
      contacts: contacts.filter((c) => c.name.trim()),
      team_resources: [],
    });
    setSaving(false);
    if (err || !data) { setError(err || "Failed to create opportunity."); return; }
    onSave(data);
  };

  const isLastStep = step === STEPS.length - 1;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-4"
      style={{ background: "var(--crm-overlay)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="w-full sm:max-w-lg rounded-t-[28px] sm:rounded-[28px] flex flex-col max-h-[92vh] overflow-hidden"
        style={{
          background: "var(--crm-modal-bg)",
          border: "1px solid var(--crm-modal-border)",
          boxShadow: "0 34px 90px rgba(0,0,0,0.24), 0 12px 32px rgba(0,0,0,0.14)",
        }}
      >
        {/* Header */}
        <div className="relative z-10 flex items-start justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--crm-border2)" }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--crm-text)" }}>New Opportunity</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--crm-muted)" }}>
              Step {step + 1} of {STEPS.length} — {STEPS[step]}
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl transition-colors" style={{ color: "var(--crm-muted)" }}>
            <X size={17} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 flex gap-1.5 px-6 pt-4 pb-1">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i <= step ? "var(--crm-accent)" : "var(--crm-border)" }} />
          ))}
        </div>

        {/* Body */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-4">

          {/* Step 0 — Summary */}
          {step === 0 && (
            <div className="flex flex-col gap-3.5">
              <GlassInput label="Customer Name" required value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Sharma & Gupta" />
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Phone" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+91 98765 43210" />
                <GlassInput label="Email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="email@example.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <GlassSelect label="Event Type" value={eventType} onChange={(e) => setEventType(e.target.value as EventType)}>
                  <option value="">Select…</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </GlassSelect>
                <GlassInput label="Event Date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Deal Value (₹)" type="number" value={dealValue || ""} onChange={(e) => setDealValue(Number(e.target.value))} placeholder="500000" />
                <GlassInput label="Win Probability %" type="number" min={0} max={100} value={winProbability} onChange={(e) => setWinProbability(Number(e.target.value))} />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "var(--crm-label)" }}>Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button key={p} type="button" onClick={() => setPriority(p)}
                      className="flex-1 rounded-xl py-2 text-xs font-bold capitalize transition-all duration-200"
                      style={{
                        background: priority === p ? "var(--crm-accent)" : "var(--crm-input-bg)",
                        color: priority === p ? "#fff" : "var(--crm-muted)",
                        border: `1.5px solid ${priority === p ? "var(--crm-accent)" : "var(--crm-border)"}`,
                        boxShadow: priority === p ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
                      }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1 — Services */}
          {step === 1 && (
            <div>
              <p className="text-sm font-medium mb-3" style={{ color: "var(--crm-muted)" }}>Select required services</p>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <button key={s.name} type="button" onClick={() => toggleService(s.name)}
                    className="rounded-full px-4 py-2 text-xs font-semibold transition-all duration-200"
                    style={{
                      background: s.selected ? "var(--crm-accent)" : "var(--crm-input-bg)",
                      color: s.selected ? "#fff" : "var(--crm-muted)",
                      border: `1.5px solid ${s.selected ? "var(--crm-accent)" : "var(--crm-border)"}`,
                      boxShadow: s.selected ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
                    }}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 — Qualification */}
          {step === 2 && (
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Min Budget (₹)" type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)} placeholder="300000" />
                <GlassInput label="Max Budget (₹)" type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)} placeholder="800000" />
              </div>
              <GlassInput label="Guest Count" type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)} placeholder="150" />
              <GlassInput label="Venue Preference" value={venuePreference} onChange={(e) => setVenuePreference(e.target.value)} placeholder="e.g. Outdoor, Hotel Banquet" />
              <GlassTextarea label="Special Requirements" value={specialReqs} onChange={(e) => setSpecialReqs(e.target.value)} rows={3} placeholder="Any special requirements…" />
            </div>
          )}

          {/* Step 3 — Contacts */}
          {step === 3 && (
            <div className="flex flex-col gap-3">
              {contacts.map((c, i) => (
                <div key={i} className="rounded-2xl p-4 flex flex-col gap-3"
                  style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--crm-label)" }}>Contact {i + 1}</p>
                  <div className="grid grid-cols-2 gap-2.5">
                    <GlassInput label="Name" value={c.name} onChange={(e) => updateContact(i, "name", e.target.value)} placeholder="Full name" />
                    <GlassInput label="Phone" value={c.phone} onChange={(e) => updateContact(i, "phone", e.target.value)} placeholder="+91 …" />
                  </div>
                  <GlassInput label="Email" type="email" value={c.email} onChange={(e) => updateContact(i, "email", e.target.value)} placeholder="email@example.com" />
                </div>
              ))}
              <button type="button" onClick={() => setContacts((c) => [...c, { name: "", phone: "", email: "" }])}
                className="text-sm font-semibold transition-colors hover:opacity-70"
                style={{ color: "var(--crm-accent)" }}>
                + Add another contact
              </button>
            </div>
          )}

          {/* Step 4 — Key Dates */}
          {step === 4 && (
            <div className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Site Visit" type="date" value={siteVisitDate} onChange={(e) => setSiteVisitDate(e.target.value)} />
                <GlassInput label="Proposal Due" type="date" value={proposalDueDate} onChange={(e) => setProposalDueDate(e.target.value)} />
                <GlassInput label="Decision Date" type="date" value={decisionDate} onChange={(e) => setDecisionDate(e.target.value)} />
                <GlassInput label="Close Date" type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)} />
              </div>
              <GlassTextarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} placeholder="Internal notes…" />
            </div>
          )}

          {/* Step 5 — Review */}
          {step === 5 && (
            <div className="flex flex-col items-center gap-5 py-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--crm-accent)", boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}>
                <Check size={28} color="#fff" strokeWidth={2.5} />
              </div>
              <p className="text-sm font-semibold" style={{ color: "var(--crm-text)" }}>Ready to create opportunity</p>
              <div className="rounded-2xl p-4 w-full space-y-2"
                style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--crm-muted)" }}>Customer</span>
                  <span className="font-semibold" style={{ color: "var(--crm-text)" }}>{customerName}</span>
                </div>
                {eventType && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--crm-muted)" }}>Event</span>
                    <span className="font-medium" style={{ color: "var(--crm-text)" }}>{eventType}</span>
                  </div>
                )}
                {dealValue > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--crm-muted)" }}>Deal Value</span>
                    <span className="font-bold" style={{ color: "var(--crm-accent)" }}>₹{dealValue.toLocaleString("en-IN")}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--crm-muted)" }}>Win Probability</span>
                  <span className="font-semibold" style={{ color: "var(--crm-text)" }}>{winProbability}%</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span style={{ color: "var(--crm-muted)" }}>Priority</span>
                  <span className="font-semibold capitalize" style={{ color: "var(--crm-text)" }}>{priority}</span>
                </div>
                {services.filter((s) => s.selected).length > 0 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: "var(--crm-muted)" }}>Services</span>
                    <span className="font-medium text-right" style={{ color: "var(--crm-text)" }}>
                      {services.filter((s) => s.selected).map((s) => s.name).join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <p className="mt-2 text-xs font-medium" style={{ color: "#dc2626" }}>{error}</p>}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-3 px-6 py-4"
          style={{ borderTop: "1px solid var(--crm-border2)", background: "var(--crm-modal-footer)" }}>
          <button
            onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{ border: "1.5px solid var(--crm-border)", color: "var(--crm-muted)" }}
          >
            {step === 0 ? "Cancel" : <><ChevronLeft size={14} /> Back</>}
          </button>
          <div className="flex-1" />
          {!isLastStep ? (
            <button onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold hover:opacity-90 transition-all"
              style={{ background: "var(--crm-accent)", color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={saving}
              className="rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-all"
              style={{ background: "var(--crm-accent)", color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}>
              {saving ? "Creating…" : "Create Opportunity"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

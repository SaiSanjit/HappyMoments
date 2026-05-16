"use client";

import { useState } from "react";
import { CRMLead, EventType, LeadQualification, EventContact, EventService } from "@/lib/crm-types";
import { createLead } from "@/services/crm";
import { X, ChevronRight, ChevronLeft, Check } from "lucide-react";

interface Props {
  vendorId: string;
  initialData?: Partial<CRMLead>;
  onSave: (lead: CRMLead) => void;
  onClose: () => void;
}

const STEPS = ["Summary", "Services", "Qualification", "Contacts", "Done"];
const EVENT_TYPES: EventType[] = ["Wedding", "Engagement", "Corporate", "Birthday", "Anniversary", "Other"];
const LEAD_SOURCES = ["platform", "whatsapp", "referral", "direct", "website", "other"] as const;
type LeadSourceOption = typeof LEAD_SOURCES[number];
const SERVICE_OPTIONS = ["Photography", "Videography", "Decoration", "Catering", "Venue", "DJ/Music", "Mehendi", "Makeup", "Florist", "Invitations"];

/* Shared glass input style — uses CSS vars for theme-awareness */
const glassInput: React.CSSProperties = {
  background: "var(--crm-input-bg)",
  border: "1.5px solid var(--crm-border)",
  borderRadius: 12,
  color: "var(--crm-text)",
  fontSize: 14,
  padding: "10px 14px",
  outline: "none",
  width: "100%",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
};

function GlassInput({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--crm-label)" }}>{label}</label>
      <input
        {...props}
        style={{ ...glassInput, borderColor: focused ? "var(--crm-accent-border)" : "var(--crm-border)", boxShadow: focused ? "0 0 0 3px var(--crm-accent-focus)" : glassInput.boxShadow }}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      />
    </div>
  );
}

function GlassTextarea({ label, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--crm-label)" }}>{label}</label>
      <textarea
        {...props}
        rows={3}
        style={{ ...glassInput, resize: "none", borderColor: focused ? "var(--crm-accent-border)" : "var(--crm-border)", boxShadow: focused ? "0 0 0 3px var(--crm-accent-focus)" : glassInput.boxShadow }}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      />
    </div>
  );
}

function GlassSelect({ label, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: "var(--crm-label)" }}>{label}</label>
      <select
        {...props}
        style={{ ...glassInput, appearance: "none", borderColor: focused ? "var(--crm-accent-border)" : "var(--crm-border)", boxShadow: focused ? "0 0 0 3px var(--crm-accent-focus)" : glassInput.boxShadow }}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
      >
        {children}
      </select>
    </div>
  );
}

export default function LeadWizard({ vendorId, initialData, onSave, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [customerName, setCustomerName] = useState(initialData?.customer_name || "");
  const [customerPhone, setCustomerPhone] = useState(initialData?.customer_phone || "");
  const [customerEmail, setCustomerEmail] = useState(initialData?.customer_email || "");
  const [eventType, setEventType] = useState<string>(initialData?.event_type || "");
  const [eventDate, setEventDate] = useState(initialData?.event_date || "");
  const [leadSource, setLeadSource] = useState<LeadSourceOption>("platform");
  const [notes, setNotes] = useState(initialData?.initial_notes || "");

  const [services, setServices] = useState<EventService[]>(
    SERVICE_OPTIONS.map((s) => ({ name: s, selected: false }))
  );
  const [qualification, setQualification] = useState<LeadQualification>({});
  const [contacts, setContacts] = useState<EventContact[]>([{ name: "", phone: "", email: "" }]);

  const toggleService = (name: string) =>
    setServices((prev) => prev.map((s) => s.name === name ? { ...s, selected: !s.selected } : s));

  const updateContact = (i: number, field: keyof EventContact, val: string) =>
    setContacts((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));

  const handleNext = () => {
    if (step === 0 && !customerName.trim()) { setError("Customer name is required."); return; }
    if (step === 0 && !customerPhone.trim()) { setError("Phone number is required."); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const { data, error: err } = await createLead({
      vendor_id: Number(vendorId),
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim() || undefined,
      event_type: eventType || undefined,
      event_date: eventDate || undefined,
      lead_source: leadSource,
      status: "new_lead",
      initial_notes: notes.trim() || undefined,
      services: services.filter((s) => s.selected),
      contacts: contacts.filter((c) => c.name.trim()),
      qualification,
      team_resources: [],
    });
    setSaving(false);
    if (err || !data) { setError(err || "Failed to create lead."); return; }
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "var(--crm-overlay)", backdropFilter: "blur(6px)" }}>
      <div className="w-full max-w-lg rounded-[28px] flex flex-col max-h-[90vh] overflow-hidden"
        style={{
          background: "var(--crm-modal-bg)",
          border: "1px solid var(--crm-modal-border)",
          boxShadow: "0 34px 90px rgba(0,0,0,0.24), 0 12px 32px rgba(0,0,0,0.14)",
        }}>

        {/* Decorative inner border */}
        <div className="absolute inset-4 rounded-[24px] pointer-events-none z-0"
          style={{ border: "1px solid rgba(255,255,255,0.52)" }} />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid var(--crm-border2)" }}>
          <div>
            <h2 className="text-base font-bold" style={{ color: "var(--crm-text)" }}>New Lead</h2>
            <p className="text-xs mt-0.5" style={{ color: "var(--crm-muted)" }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-xl transition-colors" style={{ color: "var(--crm-muted)" }}>
            <X size={17} />
          </button>
        </div>

        {/* Progress bar */}
        <div className="relative z-10 flex px-6 pt-4 gap-1.5">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-all duration-300"
              style={{ background: i < step ? "var(--crm-accent)" : i === step ? "var(--crm-accent)" : "var(--crm-border)" }} />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 overflow-y-auto px-6 py-5 space-y-4">

          {/* Step 0 — Summary */}
          {step === 0 && (
            <>
              <GlassInput label="Customer Name *" value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="e.g. Priya Sharma" />
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Phone *" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="+91 98765…" />
                <GlassInput label="Email" type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="priya@email.com" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <GlassSelect label="Event Type" value={eventType} onChange={(e) => setEventType(e.target.value)}>
                  <option value="">Select…</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </GlassSelect>
                <GlassInput label="Event Date" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wider" style={{ color: "var(--crm-label)" }}>Lead Source</label>
                <div className="flex flex-wrap gap-2">
                  {LEAD_SOURCES.map((s) => (
                    <button key={s} type="button" onClick={() => setLeadSource(s as LeadSourceOption)}
                      className="rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition-all duration-200"
                      style={{
                        background: leadSource === s ? "var(--crm-accent)" : "var(--crm-input-bg)",
                        color: leadSource === s ? "#fff" : "var(--crm-muted)",
                        border: `1.5px solid ${leadSource === s ? "var(--crm-accent)" : "var(--crm-border)"}`,
                        boxShadow: leadSource === s ? "0 2px 8px rgba(0,0,0,0.15)" : undefined,
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <GlassTextarea label="Notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any additional context…" />
            </>
          )}

          {/* Step 1 — Services */}
          {step === 1 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--crm-muted)" }}>Select the services required</p>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <button key={s.name} type="button" onClick={() => toggleService(s.name)}
                    className="rounded-full px-3.5 py-2 text-sm font-semibold transition-all duration-200"
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
            <>
              <div className="grid grid-cols-2 gap-3">
                <GlassInput label="Min Budget (₹)" type="number" value={qualification.budget_min || ""} onChange={(e) => setQualification((q) => ({ ...q, budget_min: Number(e.target.value) }))} />
                <GlassInput label="Max Budget (₹)" type="number" value={qualification.budget_max || ""} onChange={(e) => setQualification((q) => ({ ...q, budget_max: Number(e.target.value) }))} />
              </div>
              <GlassInput label="Guest Count" type="number" value={qualification.guest_count || ""} onChange={(e) => setQualification((q) => ({ ...q, guest_count: Number(e.target.value) }))} />
              <GlassInput label="Venue Preference" value={qualification.venue_preference || ""} onChange={(e) => setQualification((q) => ({ ...q, venue_preference: e.target.value }))} />
              <GlassTextarea label="Special Requirements" value={qualification.special_requirements || ""} onChange={(e) => setQualification((q) => ({ ...q, special_requirements: e.target.value }))} />
            </>
          )}

          {/* Step 3 — Contacts */}
          {step === 3 && (
            <div className="space-y-4">
              {contacts.map((c, i) => (
                <div key={i} className="rounded-2xl p-4 space-y-3"
                  style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}>
                  <p className="text-xs font-semibold" style={{ color: "var(--crm-label)" }}>Contact {i + 1}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <GlassInput label="Name" value={c.name} onChange={(e) => updateContact(i, "name", e.target.value)} placeholder="Full name" />
                    <GlassInput label="Phone" value={c.phone || ""} onChange={(e) => updateContact(i, "phone", e.target.value)} placeholder="+91…" />
                  </div>
                  <GlassInput label="Email" value={c.email || ""} onChange={(e) => updateContact(i, "email", e.target.value)} placeholder="email@example.com" />
                </div>
              ))}
              <button type="button" onClick={() => setContacts((c) => [...c, { name: "", phone: "", email: "" }])}
                className="text-sm font-semibold" style={{ color: "var(--crm-accent)" }}>
                + Add another contact
              </button>
            </div>
          )}

          {/* Step 4 — Done */}
          {step === 4 && (
            <div className="flex flex-col items-center gap-4 py-10">
              <div className="flex h-16 w-16 items-center justify-center rounded-full"
                style={{ background: "var(--crm-accent-soft)", border: "2px solid var(--crm-accent-border)" }}>
                <Check size={28} style={{ color: "var(--crm-accent)" }} />
              </div>
              <p className="text-base font-bold" style={{ color: "var(--crm-text)" }}>Ready to create lead</p>
              <p className="text-sm text-center" style={{ color: "var(--crm-muted)" }}>
                Lead will be created for <strong style={{ color: "var(--crm-text)" }}>{customerName}</strong>
                {eventType ? ` — ${eventType} event` : ""}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-xl px-4 py-3 text-sm font-medium" style={{ background: "rgba(239,68,68,0.08)", color: "#dc2626", border: "1px solid rgba(239,68,68,0.2)" }}>
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between px-6 py-4"
          style={{ borderTop: "1px solid var(--crm-border2)", background: "var(--crm-modal-footer)" }}>
          <button
            onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
            style={{ border: "1.5px solid var(--crm-border)", color: "var(--crm-muted)" }}
          >
            {step === 0 ? "Cancel" : <><ChevronLeft size={14} />Back</>}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-xl px-5 py-2.5 text-sm font-bold transition-all hover:opacity-90"
              style={{ background: "var(--crm-accent)", color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}
            >
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-xl px-6 py-2.5 text-sm font-bold disabled:opacity-50 transition-all hover:opacity-90"
              style={{ background: "var(--crm-accent)", color: "#fff", boxShadow: "0 4px 14px rgba(0,0,0,0.2)" }}
            >
              {saving ? "Creating…" : "Create Lead"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

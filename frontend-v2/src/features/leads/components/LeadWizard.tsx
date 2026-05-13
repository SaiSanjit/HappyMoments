"use client";

import { useState } from "react";
import { CRMLead, EventType, LeadSource, LeadQualification, EventContact, EventService } from "@/lib/crm-types";
import { createLead } from "@/services/crm";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
  vendorId: string;
  initialData?: Partial<CRMLead>;
  onSave: (lead: CRMLead) => void;
  onClose: () => void;
}

const STEPS = ["Summary", "Services", "Qualification", "Contacts", "Team", "Done"];
const EVENT_TYPES: EventType[] = ["Wedding", "Engagement", "Corporate", "Birthday", "Anniversary", "Other"];
const LEAD_SOURCES: LeadSource[] = ["Platform", "WhatsApp", "Referral", "Direct", "Other"];
const SERVICE_OPTIONS = ["Photography", "Videography", "Decoration", "Catering", "Venue", "DJ/Music", "Mehendi", "Makeup", "Florist", "Invitations"];

export default function LeadWizard({ vendorId, initialData, onSave, onClose }: Props) {
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Step 1 — Summary
  const [customerName, setCustomerName] = useState(initialData?.customer_name || "");
  const [customerPhone, setCustomerPhone] = useState(initialData?.customer_phone || "");
  const [customerEmail, setCustomerEmail] = useState(initialData?.customer_email || "");
  const [eventType, setEventType] = useState<EventType | "">(initialData?.event_type || "");
  const [eventDate, setEventDate] = useState(initialData?.event_date || "");
  const [leadSource, setLeadSource] = useState<LeadSource>("Platform");
  const [description, setDescription] = useState(initialData?.notes || "");

  // Step 2 — Services
  const [services, setServices] = useState<EventService[]>(
    SERVICE_OPTIONS.map((s) => ({ name: s, selected: false }))
  );

  // Step 3 — Qualification
  const [qualification, setQualification] = useState<LeadQualification>({});

  // Step 4 — Contacts
  const [contacts, setContacts] = useState<EventContact[]>([{ name: "", phone: "", email: "" }]);

  const toggleService = (name: string) => {
    setServices((prev) => prev.map((s) => s.name === name ? { ...s, selected: !s.selected } : s));
  };

  const updateContact = (i: number, field: keyof EventContact, val: string) => {
    setContacts((prev) => prev.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  };

  const handleNext = () => {
    if (step === 0 && !customerName.trim()) { setError("Customer name is required."); return; }
    setError("");
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSaving(true);
    const selectedServices = services.filter((s) => s.selected);
    const validContacts = contacts.filter((c) => c.name.trim());

    const { data, error: err } = await createLead({
      vendor_id: vendorId,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim() || undefined,
      customer_email: customerEmail.trim() || undefined,
      event_type: eventType || undefined,
      event_date: eventDate || undefined,
      lead_source: leadSource,
      status: "new",
      description,
      services: selectedServices,
      contacts: validContacts,
      qualification,
      team_resources: [],
    });

    setSaving(false);
    if (err || !data) { setError(err || "Failed to create lead."); return; }
    onSave(data);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh]"
        style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border3)" }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>New Lead</h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Step {step + 1} of {STEPS.length - 1} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={18} /></button>
        </div>

        {/* Step indicator */}
        <div className="flex px-6 pt-4 gap-1">
          {STEPS.slice(0, -1).map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-colors"
              style={{ background: i <= step ? "var(--gold)" : "var(--border3)" }} />
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {step === 0 && (
            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Customer Name *</label>
                <input value={customerName} onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Phone</label>
                  <input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Email</label>
                  <input type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Event Type</label>
                  <select value={eventType} onChange={(e) => setEventType(e.target.value as EventType)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }}>
                    <option value="">Select…</option>
                    {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Event Date</label>
                  <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Lead Source</label>
                <div className="flex flex-wrap gap-2">
                  {LEAD_SOURCES.map((s) => (
                    <button key={s} type="button" onClick={() => setLeadSource(s)}
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{ background: leadSource === s ? "var(--gold)" : "var(--bg)", color: leadSource === s ? "#000" : "var(--text-muted)", border: "1px solid var(--border3)" }}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Description</label>
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>Select the services required</p>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <button key={s.name} type="button" onClick={() => toggleService(s.name)}
                    className="rounded-full px-3 py-1.5 text-sm font-medium transition-colors"
                    style={{ background: s.selected ? "var(--gold)" : "var(--bg)", color: s.selected ? "#000" : "var(--text-muted)", border: "1px solid var(--border3)" }}>
                    {s.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Min Budget (₹)</label>
                  <input type="number" value={qualification.budget_min || ""} onChange={(e) => setQualification((q) => ({ ...q, budget_min: Number(e.target.value) }))}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Max Budget (₹)</label>
                  <input type="number" value={qualification.budget_max || ""} onChange={(e) => setQualification((q) => ({ ...q, budget_max: Number(e.target.value) }))}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Guest Count</label>
                <input type="number" value={qualification.guest_count || ""} onChange={(e) => setQualification((q) => ({ ...q, guest_count: Number(e.target.value) }))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Venue Preference</label>
                <input value={qualification.venue_preference || ""} onChange={(e) => setQualification((q) => ({ ...q, venue_preference: e.target.value }))}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Special Requirements</label>
                <textarea value={qualification.special_requirements || ""} onChange={(e) => setQualification((q) => ({ ...q, special_requirements: e.target.value }))} rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-4">
              {contacts.map((c, i) => (
                <div key={i} className="rounded-xl p-3 flex flex-col gap-2" style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Contact {i + 1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={c.name} onChange={(e) => updateContact(i, "name", e.target.value)} placeholder="Name"
                      className="rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                    <input value={c.phone || ""} onChange={(e) => updateContact(i, "phone", e.target.value)} placeholder="Phone"
                      className="rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                  </div>
                  <input value={c.email || ""} onChange={(e) => updateContact(i, "email", e.target.value)} placeholder="Email"
                    className="rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
              ))}
              <button type="button" onClick={() => setContacts((c) => [...c, { name: "", phone: "", email: "" }])}
                className="text-sm font-medium" style={{ color: "var(--gold)" }}>
                + Add another contact
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-2xl"
                style={{ background: "var(--gold-soft)" }}
              >
                ✓
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Ready to create lead</p>
              <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
                Lead will be created for <strong>{customerName}</strong>
                {eventType ? ` — ${eventType} event` : ""}
              </p>
            </div>
          )}

          {error && (
            <p className="mt-2 text-xs" style={{ color: "#dc2626" }}>{error}</p>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid var(--border3)" }}>
          <button
            onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium"
            style={{ border: "1px solid var(--border3)", color: "var(--text-muted)" }}
          >
            {step === 0 ? "Cancel" : <><ChevronLeft size={14} /> Back</>}
          </button>

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "var(--gold)", color: "#000" }}
            >
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="rounded-lg px-6 py-2 text-sm font-medium disabled:opacity-50"
              style={{ background: "var(--gold)", color: "#000" }}
            >
              {saving ? "Creating…" : "Create Lead"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

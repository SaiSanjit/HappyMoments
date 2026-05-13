"use client";

import { useState } from "react";
import { CRMOpportunity, EventType, Priority } from "@/lib/crm-types";
import { createOpportunity } from "@/services/crm";
import { X, ChevronRight, ChevronLeft } from "lucide-react";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="w-full max-w-lg rounded-2xl flex flex-col max-h-[90vh]"
        style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
      >
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid var(--border3)" }}>
          <div>
            <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>New Opportunity</h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={18} /></button>
        </div>

        <div className="flex px-6 pt-4 gap-1">
          {STEPS.map((_, i) => (
            <div key={i} className="flex-1 h-1 rounded-full transition-colors"
              style={{ background: i <= step ? "#6366f1" : "var(--border3)" }} />
          ))}
        </div>

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
              <div>
                <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button key={p} type="button" onClick={() => setPriority(p)}
                      className="flex-1 rounded-lg py-1.5 text-xs font-medium capitalize"
                      style={{ background: priority === p ? "var(--gold)" : "var(--bg)", color: priority === p ? "#000" : "var(--text-muted)", border: "1px solid var(--border3)" }}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>Select required services</p>
              <div className="flex flex-wrap gap-2">
                {services.map((s) => (
                  <button key={s.name} type="button" onClick={() => toggleService(s.name)}
                    className="rounded-full px-3 py-1.5 text-sm font-medium"
                    style={{ background: s.selected ? "#6366f1" : "var(--bg)", color: s.selected ? "#fff" : "var(--text-muted)", border: "1px solid var(--border3)" }}>
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
                  <input type="number" value={budgetMin} onChange={(e) => setBudgetMin(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Max Budget (₹)</label>
                  <input type="number" value={budgetMax} onChange={(e) => setBudgetMax(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Guest Count</label>
                <input type="number" value={guestCount} onChange={(e) => setGuestCount(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Venue Preference</label>
                <input value={venuePreference} onChange={(e) => setVenuePreference(e.target.value)}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Special Requirements</label>
                <textarea value={specialReqs} onChange={(e) => setSpecialReqs(e.target.value)} rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col gap-3">
              {contacts.map((c, i) => (
                <div key={i} className="rounded-xl p-3 flex flex-col gap-2" style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>Contact {i + 1}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <input value={c.name} onChange={(e) => updateContact(i, "name", e.target.value)} placeholder="Name"
                      className="rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                    <input value={c.phone} onChange={(e) => updateContact(i, "phone", e.target.value)} placeholder="Phone"
                      className="rounded-lg px-3 py-2 text-sm outline-none"
                      style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                  </div>
                  <input value={c.email} onChange={(e) => updateContact(i, "email", e.target.value)} placeholder="Email"
                    className="rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg2)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
              ))}
              <button type="button" onClick={() => setContacts((c) => [...c, { name: "", phone: "", email: "" }])}
                className="text-sm font-medium" style={{ color: "#6366f1" }}>
                + Add contact
              </button>
            </div>
          )}

          {step === 4 && (
            <div className="flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Site Visit</label>
                  <input type="date" value={siteVisitDate} onChange={(e) => setSiteVisitDate(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Proposal Due</label>
                  <input type="date" value={proposalDueDate} onChange={(e) => setProposalDueDate(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Decision Date</label>
                  <input type="date" value={decisionDate} onChange={(e) => setDecisionDate(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Close Date</label>
                  <input type="date" value={closeDate} onChange={(e) => setCloseDate(e.target.value)}
                    className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                    style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Notes</label>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3}
                  className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
                  style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-full text-2xl"
                style={{ background: "#ede9fe", color: "#6d28d9" }}>
                ✓
              </div>
              <p className="text-sm font-medium" style={{ color: "var(--text)" }}>Ready to create opportunity</p>
              <div className="rounded-xl p-4 w-full text-sm space-y-1" style={{ background: "var(--bg)", border: "1px solid var(--border3)" }}>
                <p style={{ color: "var(--text)" }}><strong>Customer:</strong> {customerName}</p>
                {eventType && <p style={{ color: "var(--text-muted)" }}><strong>Event:</strong> {eventType}</p>}
                {dealValue > 0 && <p style={{ color: "var(--text-muted)" }}><strong>Deal Value:</strong> ₹{dealValue.toLocaleString("en-IN")}</p>}
                <p style={{ color: "var(--text-muted)" }}><strong>Win Probability:</strong> {winProbability}%</p>
              </div>
            </div>
          )}

          {error && <p className="mt-2 text-xs" style={{ color: "#dc2626" }}>{error}</p>}
        </div>

        <div className="flex items-center justify-between px-6 py-4" style={{ borderTop: "1px solid var(--border3)" }}>
          <button
            onClick={step === 0 ? onClose : () => setStep((s) => s - 1)}
            className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium"
            style={{ border: "1px solid var(--border3)", color: "var(--text-muted)" }}
          >
            {step === 0 ? "Cancel" : <><ChevronLeft size={14} /> Back</>}
          </button>

          {step < 5 ? (
            <button onClick={handleNext}
              className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium"
              style={{ background: "#6366f1", color: "#fff" }}>
              Next <ChevronRight size={14} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={saving}
              className="rounded-lg px-6 py-2 text-sm font-medium disabled:opacity-50"
              style={{ background: "#6366f1", color: "#fff" }}>
              {saving ? "Creating…" : "Create Opportunity"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

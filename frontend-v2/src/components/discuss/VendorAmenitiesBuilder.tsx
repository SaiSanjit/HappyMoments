"use client";

import { useState } from "react";
import { Plus, Trash2, Send, X } from "lucide-react";
import type { AmenitiesCardData, AmenityItem } from "./types";

const DEFAULT_AMENITIES: AmenityItem[] = [
  { id: "catering", name: "In-house Catering", included: true, description: "Multi-cuisine buffet & à la carte", customizable: true },
  { id: "decoration", name: "Decoration", included: true, description: "Premium décor team included", customizable: true },
  { id: "parking", name: "Parking", included: true, description: "On-site parking facility", customizable: false },
  { id: "av", name: "AV & Sound", included: true, description: "Professional sound & lighting", customizable: true },
  { id: "bridal_suite", name: "Bridal Suite", included: false, description: "AC suite with makeup room", customizable: false },
  { id: "accommodation", name: "Accommodation", included: false, description: "On-premise rooms available", customizable: false },
  { id: "generator", name: "Power Backup", included: true, description: "100% power backup", customizable: false },
  { id: "security", name: "Security", included: true, description: "Trained security personnel", customizable: false },
  { id: "valet", name: "Valet Parking", included: false, description: "Valet service on request", customizable: true },
  { id: "catering_external", name: "External Catering Allowed", included: false, customizable: false },
];

const EVENT_TYPES = ["Wedding", "Engagement", "Reception", "Corporate", "Birthday", "Anniversary", "Baby Shower", "Other"];

interface Props {
  venueName: string;
  highlights?: string[];
  onSend: (card: AmenitiesCardData) => void;
  onClose: () => void;
}

export default function VendorAmenitiesBuilder({ venueName, highlights = [], onSend, onClose }: Props) {
  const [name, setName] = useState(venueName);
  const [eventTypes, setEventTypes] = useState<string[]>(["Wedding", "Engagement"]);
  const [indoorCapacity, setIndoorCapacity] = useState("");
  const [outdoorCapacity, setOutdoorCapacity] = useState("");
  const [amenities, setAmenities] = useState<AmenityItem[]>(DEFAULT_AMENITIES);
  const [vendorHighlights, setVendorHighlights] = useState<string[]>(highlights.length ? highlights : ["Experienced in 500+ events"]);
  const [newHighlight, setNewHighlight] = useState("");
  const [notes, setNotes] = useState("");
  const [newAmenityName, setNewAmenityName] = useState("");

  const toggleEventType = (et: string) =>
    setEventTypes((prev) => prev.includes(et) ? prev.filter((e) => e !== et) : [...prev, et]);

  const toggleAmenity = (id: string) =>
    setAmenities((prev) => prev.map((a) => a.id === id ? { ...a, included: !a.included } : a));

  const updateAmenityDescription = (id: string, desc: string) =>
    setAmenities((prev) => prev.map((a) => a.id === id ? { ...a, description: desc } : a));

  const removeAmenity = (id: string) =>
    setAmenities((prev) => prev.filter((a) => a.id !== id));

  const addAmenity = () => {
    if (!newAmenityName.trim()) return;
    const id = newAmenityName.toLowerCase().replace(/\s+/g, "_");
    setAmenities((prev) => [...prev, { id, name: newAmenityName.trim(), included: true }]);
    setNewAmenityName("");
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setVendorHighlights((prev) => [...prev, newHighlight.trim()]);
    setNewHighlight("");
  };

  const handleSend = () => {
    const card: AmenitiesCardData = {
      type: "amenities_card",
      venue_name: name,
      event_types: eventTypes,
      capacity: {
        indoor: indoorCapacity ? parseInt(indoorCapacity) : undefined,
        outdoor: outdoorCapacity ? parseInt(outdoorCapacity) : undefined,
      },
      amenities,
      highlights: vendorHighlights.filter(Boolean),
      notes: notes || undefined,
    };
    onSend(card);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div
        className="flex items-center justify-between px-5 py-4 shrink-0"
        style={{ borderBottom: "1px solid var(--border3)" }}
      >
        <div>
          <p className="text-[10px] font-medium tracking-widest uppercase" style={{ color: "var(--gold)" }}>
            Template
          </p>
          <p className="text-sm font-semibold" style={{ color: "var(--text)" }}>
            Amenities Overview Card
          </p>
        </div>
        <button onClick={onClose} style={{ color: "var(--text3)" }}>
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5">
        {/* Venue name */}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "var(--text3)" }}>
            Venue Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
            style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
          />
        </div>

        {/* Event types */}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--text3)" }}>
            Suitable For
          </label>
          <div className="flex flex-wrap gap-2">
            {EVENT_TYPES.map((et) => (
              <button
                key={et}
                onClick={() => toggleEventType(et)}
                className="rounded-full px-3 py-1 text-xs font-medium transition"
                style={{
                  background: eventTypes.includes(et) ? "rgba(201,168,76,0.15)" : "var(--bg3)",
                  color: eventTypes.includes(et) ? "var(--gold)" : "var(--text3)",
                  border: `1px solid ${eventTypes.includes(et) ? "rgba(201,168,76,0.3)" : "var(--border2)"}`,
                }}
              >
                {et}
              </button>
            ))}
          </div>
        </div>

        {/* Capacity */}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--text3)" }}>
            Capacity (pax)
          </label>
          <div className="flex gap-3">
            <div className="flex-1">
              <input
                type="number"
                placeholder="Indoor"
                value={indoorCapacity}
                onChange={(e) => setIndoorCapacity(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
              />
            </div>
            <div className="flex-1">
              <input
                type="number"
                placeholder="Outdoor"
                value={outdoorCapacity}
                onChange={(e) => setOutdoorCapacity(e.target.value)}
                className="w-full rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
              />
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--text3)" }}>
            Amenities — toggle to include/exclude
          </label>
          <div className="space-y-2">
            {amenities.map((a) => (
              <div
                key={a.id}
                className="rounded-xl overflow-hidden"
                style={{
                  background: a.included ? "rgba(201,168,76,0.06)" : "var(--bg3)",
                  border: `1px solid ${a.included ? "rgba(201,168,76,0.15)" : "var(--border2)"}`,
                }}
              >
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <button
                    onClick={() => toggleAmenity(a.id)}
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md transition"
                    style={{
                      background: a.included ? "rgba(201,168,76,0.2)" : "rgba(232,221,208,0.06)",
                      border: `1px solid ${a.included ? "rgba(201,168,76,0.4)" : "rgba(232,221,208,0.12)"}`,
                    }}
                  >
                    {a.included && <span style={{ color: "var(--gold)", fontSize: 10, fontWeight: 700 }}>✓</span>}
                  </button>
                  <span
                    className="flex-1 text-xs font-medium"
                    style={{ color: a.included ? "var(--text)" : "var(--text3)" }}
                  >
                    {a.name}
                  </span>
                  <button onClick={() => removeAmenity(a.id)} style={{ color: "var(--text4)" }}>
                    <Trash2 size={12} />
                  </button>
                </div>
                {a.included && (
                  <div className="px-3 pb-2.5">
                    <input
                      value={a.description || ""}
                      onChange={(e) => updateAmenityDescription(a.id, e.target.value)}
                      placeholder="Short description (optional)"
                      className="w-full rounded-lg px-3 py-1.5 text-[11px] outline-none"
                      style={{ background: "rgba(0,0,0,0.2)", color: "var(--text2)", border: "1px solid var(--border3)" }}
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Add new amenity */}
            <div className="flex gap-2">
              <input
                value={newAmenityName}
                onChange={(e) => setNewAmenityName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addAmenity()}
                placeholder="Add custom amenity…"
                className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
                style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
              />
              <button
                onClick={addAmenity}
                className="flex items-center gap-1 rounded-xl px-4 py-2.5 text-xs font-semibold transition hover:opacity-80"
                style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" }}
              >
                <Plus size={13} /> Add
              </button>
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-2" style={{ color: "var(--text3)" }}>
            Key Highlights
          </label>
          <div className="space-y-1.5 mb-2">
            {vendorHighlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="flex-1 text-xs rounded-lg px-3 py-1.5" style={{ background: "var(--bg3)", color: "var(--text2)", border: "1px solid var(--border3)" }}>
                  {h}
                </span>
                <button onClick={() => setVendorHighlights((prev) => prev.filter((_, j) => j !== i))} style={{ color: "var(--text4)" }}>
                  <Trash2 size={12} />
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={newHighlight}
              onChange={(e) => setNewHighlight(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addHighlight()}
              placeholder="Add highlight…"
              className="flex-1 rounded-xl px-4 py-2.5 text-sm outline-none"
              style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
            />
            <button
              onClick={addHighlight}
              className="flex items-center gap-1 rounded-xl px-4 py-2.5 text-xs font-semibold"
              style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)", border: "1px solid rgba(201,168,76,0.2)" }}
            >
              <Plus size={13} /> Add
            </button>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] font-semibold tracking-widest uppercase mb-1.5" style={{ color: "var(--text3)" }}>
            Additional Notes (optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Any additional info for the customer…"
            className="w-full rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
            style={{ background: "var(--bg3)", color: "var(--text)", border: "1px solid var(--border2)" }}
          />
        </div>
      </div>

      {/* Send button */}
      <div
        className="shrink-0 px-5 py-4"
        style={{ borderTop: "1px solid var(--border3)" }}
      >
        <button
          onClick={handleSend}
          className="flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-semibold transition hover:-translate-y-0.5"
          style={{
            background: "linear-gradient(135deg, #c9a84c, #e8d5a3)",
            color: "#070503",
            boxShadow: "0 8px 24px rgba(201,168,76,0.3)",
          }}
        >
          <Send size={15} /> Send Amenities Card
        </button>
      </div>
    </div>
  );
}

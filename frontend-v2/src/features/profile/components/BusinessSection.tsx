"use client";

import { VendorProfile } from "../ProfilePage";

const LABEL = "mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em]";
const INPUT = "w-full rounded-xl border px-4 py-2.5 text-sm transition focus:outline-none focus:ring-2";
const inputStyle = {
  borderColor: "var(--border2)",
  background: "var(--border3)",
  color: "var(--text)",
  "--tw-ring-color": "var(--gold)",
} as React.CSSProperties;

interface Props {
  draft: VendorProfile;
  onChange: <K extends keyof VendorProfile>(key: K, value: VendorProfile[K]) => void;
}

export default function BusinessSection({ draft, onChange }: Props) {
  return (
    <section
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg2)", borderColor: "var(--border3)" }}
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          Experience &amp; Pricing
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
          Shown on your profile to build couple confidence.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Years of Experience */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Years of Experience</label>
          <input className={INPUT} style={inputStyle}
            value={draft.experience ?? ""}
            onChange={(e) => onChange("experience", e.target.value)}
            placeholder="e.g. 7"
            type="number"
            min="0"
            max="60"
          />
        </div>

        {/* Events Completed */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Events Completed</label>
          <input className={INPUT} style={inputStyle}
            value={draft.events_completed || ""}
            onChange={(e) => onChange("events_completed", Number(e.target.value))}
            placeholder="e.g. 120"
            type="number"
            min="0"
          />
          <p className="mt-1 text-[10px]" style={{ color: "var(--text3)" }}>Shown as "120+ events"</p>
        </div>

        {/* Starting Price */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Starting Price (₹)</label>
          <input className={INPUT} style={inputStyle}
            value={draft.starting_price || ""}
            onChange={(e) => onChange("starting_price", Number(e.target.value))}
            placeholder="e.g. 50000"
            type="number"
            min="0"
          />
          <p className="mt-1 text-[10px]" style={{ color: "var(--text3)" }}>Shown on your listing card</p>
        </div>
      </div>
    </section>
  );
}

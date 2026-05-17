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

export default function ContactSection({ draft, onChange }: Props) {
  return (
    <section
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg2)", borderColor: "var(--border3)" }}
    >
      <div className="mb-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          Contact &amp; Reach
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
          Couples use these to get in touch. Shown on your public page.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Point of Contact */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Point of Contact</label>
          <input className={INPUT} style={inputStyle}
            value={draft.spoc_name ?? ""}
            onChange={(e) => onChange("spoc_name", e.target.value)}
            placeholder="Name shown to couples (e.g. Ravi Sharma)"
          />
        </div>

        {/* Phone */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Phone Number</label>
          <input className={INPUT} style={inputStyle}
            value={draft.phone_number ?? ""}
            onChange={(e) => onChange("phone_number", e.target.value)}
            placeholder="+91 98765 43210"
            type="tel"
          />
        </div>

        {/* WhatsApp */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>WhatsApp Number</label>
          <input className={INPUT} style={inputStyle}
            value={draft.whatsapp_number ?? ""}
            onChange={(e) => onChange("whatsapp_number", e.target.value)}
            placeholder="+91 98765 43210"
            type="tel"
          />
          <p className="mt-1 text-[10px]" style={{ color: "var(--text3)" }}>Used for the "Chat on WhatsApp" button</p>
        </div>

        {/* Alternate Number */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Alternate Number</label>
          <input className={INPUT} style={inputStyle}
            value={draft.alternate_number ?? ""}
            onChange={(e) => onChange("alternate_number", e.target.value)}
            placeholder="+91 98765 43210"
            type="tel"
          />
        </div>

        {/* Google Maps */}
        <div className="sm:col-span-2">
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Google Maps Link</label>
          <input className={INPUT} style={inputStyle}
            value={draft.google_maps_link ?? ""}
            onChange={(e) => onChange("google_maps_link", e.target.value)}
            placeholder="https://maps.google.com/..."
          />
          <p className="mt-1 text-[10px]" style={{ color: "var(--text3)" }}>Paste the share link from Google Maps</p>
        </div>
      </div>
    </section>
  );
}

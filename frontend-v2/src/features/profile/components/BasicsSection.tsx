"use client";

import { VendorProfile, AdditionalInfo } from "../ProfilePage";

const CATEGORIES = [
  "Photography", "Videography", "Venues", "Catering", "Decorators",
  "Makeup", "Event Planners", "Entertainment", "DJ & Sound",
  "Lighting", "Florists", "Invitation Design",
];

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
  onAdditionalInfoChange: (key: keyof AdditionalInfo, value: string) => void;
}

export default function BasicsSection({ draft, onChange, onAdditionalInfoChange }: Props) {
  const ai = draft.additional_info ?? {};

  const handleLanguagesChange = (raw: string) => {
    const arr = raw.split(/[,·•|]/).map((s) => s.trim()).filter(Boolean);
    onChange("languages", arr);
  };

  return (
    <section
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg2)", borderColor: "var(--border3)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-4" style={{ color: "var(--text-muted)" }}>
        Basics
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Studio Name */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Studio Name</label>
          <input className={INPUT} style={inputStyle}
            value={draft.brand_name}
            onChange={(e) => onChange("brand_name", e.target.value)}
            placeholder="Your studio name"
          />
        </div>

        {/* Tagline */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Tagline</label>
          <input className={INPUT} style={inputStyle}
            value={ai.tagline ?? ""}
            onChange={(e) => onAdditionalInfoChange("tagline", e.target.value)}
            placeholder="One-line description of your work"
          />
        </div>

        {/* Category */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Primary Category</label>
          <select className={INPUT} style={inputStyle}
            value={draft.categories[0] ?? ""}
            onChange={(e) => onChange("categories", [e.target.value, ...draft.categories.slice(1)])}
          >
            <option value="">Select category</option>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* City */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>City</label>
          <input className={INPUT} style={inputStyle}
            value={draft.address ?? ""}
            onChange={(e) => onChange("address", e.target.value)}
            placeholder="e.g. Hyderabad"
          />
        </div>

        {/* Languages */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Languages</label>
          <input className={INPUT} style={inputStyle}
            value={(draft.languages ?? []).join(", ")}
            onChange={(e) => handleLanguagesChange(e.target.value)}
            placeholder="e.g. English, Telugu, Hindi"
          />
          <p className="mt-1 text-[10px]" style={{ color: "var(--text3)" }}>Separate with commas</p>
        </div>

        {/* Instagram */}
        <div>
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Instagram</label>
          <input className={INPUT} style={inputStyle}
            value={draft.instagram ?? ""}
            onChange={(e) => onChange("instagram", e.target.value)}
            placeholder="@handle or full URL"
          />
        </div>

        {/* Website */}
        <div className="sm:col-span-2">
          <label className={LABEL} style={{ color: "var(--text-muted)" }}>Website</label>
          <input className={INPUT} style={inputStyle}
            value={ai.website ?? ""}
            onChange={(e) => onAdditionalInfoChange("website", e.target.value)}
            placeholder="https://yourstudio.com"
          />
        </div>
      </div>
    </section>
  );
}

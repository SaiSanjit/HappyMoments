"use client";

import { useState } from "react";
import { CRMTerritory } from "@/lib/crm-types";
import { X } from "lucide-react";

interface Props {
  initial: CRMTerritory | null;
  vendorId: string;
  onSave: (payload: Omit<CRMTerritory, "id" | "created_at" | "updated_at">) => Promise<void>;
  onClose: () => void;
}

export default function TerritoryForm({ initial, vendorId, onSave, onClose }: Props) {
  const [country, setCountry] = useState(initial?.country || "India");
  const [city, setCity] = useState(initial?.city || "");
  const [alias, setAlias] = useState(initial?.alias || "");
  const [activeFlag, setActiveFlag] = useState<"Y" | "N">(initial?.active_flag || "Y");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!city.trim()) { setError("City is required."); return; }
    setSaving(true);
    await onSave({
      vendor_id: vendorId,
      country: country.trim(),
      city: city.trim(),
      alias: alias.trim() || undefined,
      active_flag: activeFlag,
    });
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
            {initial ? "Edit Territory" : "Add Territory"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Country
            </label>
            <input
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              City *
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="e.g. Hyderabad"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }}
              required
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Alias (optional)
            </label>
            <input
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              placeholder="e.g. HYD"
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Status
            </label>
            <div className="flex gap-3">
              {(["Y", "N"] as const).map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setActiveFlag(val)}
                  className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors"
                  style={{
                    background: activeFlag === val ? "var(--gold)" : "var(--bg)",
                    color: activeFlag === val ? "#000" : "var(--text-muted)",
                    border: "1px solid var(--border3)",
                  }}
                >
                  {val === "Y" ? "Active" : "Inactive"}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-xs" style={{ color: "#dc2626" }}>{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium"
              style={{ border: "1px solid var(--border3)", color: "var(--text-muted)" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium disabled:opacity-50"
              style={{ background: "var(--gold)", color: "#000" }}
            >
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

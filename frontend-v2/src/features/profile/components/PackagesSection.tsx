"use client";

import { useState } from "react";
import { Plus, Trash2, Package } from "lucide-react";
import { EmptyPackagesIllustration } from "@/components/illustrations/EmptyPackagesIllustration";
import { PackageItem } from "../ProfilePage";

interface Props {
  packages: PackageItem[];
  onChange: (packages: PackageItem[]) => void;
}

const INPUT = "w-full rounded-xl border px-3 py-2 text-sm focus:outline-none transition";
const inputStyle = {
  borderColor: "var(--border2)",
  background: "var(--border3)",
  color: "var(--text)",
};

export default function PackagesSection({ packages, onChange }: Props) {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<PackageItem>({ name: "", price: undefined, description: "" });

  const handleAdd = () => {
    if (!form.name.trim()) return;
    onChange([...packages, { ...form }]);
    setForm({ name: "", price: undefined, description: "" });
    setAdding(false);
  };

  const handleDelete = (idx: number) => {
    onChange(packages.filter((_, i) => i !== idx));
  };

  return (
    <section
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg2)", borderColor: "var(--border3)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
            Packages
          </p>
          <p className="text-xs mt-0.5" style={{ color: "var(--text3)" }}>
            Three is the sweet spot.
          </p>
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors"
          style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)" }}
        >
          <Plus size={13} />
          Add package
        </button>
      </div>

      {/* Package cards */}
      <div className="flex flex-col gap-3">
        {packages.length === 0 && !adding && (
          <div
            className="rounded-xl border-2 border-dashed flex flex-col items-center justify-center py-8 gap-2"
            style={{ borderColor: "var(--border2)" }}
          >
            <div className="w-24 h-24" style={{ color: "var(--gold)" }}>
              <EmptyPackagesIllustration className="overflow-visible" />
            </div>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>No packages yet</p>
            <button
              onClick={() => setAdding(true)}
              className="text-xs font-semibold mt-1"
              style={{ color: "var(--gold)" }}
            >
              + Add your first package
            </button>
          </div>
        )}

        {packages.map((pkg, idx) => (
          <div
            key={idx}
            className="flex items-start justify-between gap-3 rounded-xl border p-4"
            style={{ borderColor: "var(--border2)", background: "var(--bg)" }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>{pkg.name}</p>
                {pkg.price != null && (
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)" }}
                  >
                    ₹{pkg.price.toLocaleString()}
                  </span>
                )}
              </div>
              {pkg.description && (
                <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--text-muted)" }}>
                  {pkg.description}
                </p>
              )}
            </div>
            <button
              onClick={() => handleDelete(idx)}
              className="shrink-0 p-1.5 rounded-lg transition-colors hover:bg-red-500/10"
            >
              <Trash2 size={14} style={{ color: "var(--text-muted)" }} />
            </button>
          </div>
        ))}

        {/* Inline add form */}
        {adding && (
          <div
            className="rounded-xl border p-4 flex flex-col gap-3"
            style={{ borderColor: "var(--gold)", background: "var(--bg)" }}
          >
            <p className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>New package</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: "var(--text-muted)" }}>Name</label>
                <input
                  className={INPUT}
                  style={inputStyle}
                  placeholder="e.g. Full Day Coverage"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: "var(--text-muted)" }}>Price (₹)</label>
                <input
                  className={INPUT}
                  style={inputStyle}
                  type="number"
                  placeholder="e.g. 50000"
                  value={form.price ?? ""}
                  onChange={(e) => setForm((f) => ({ ...f, price: e.target.value ? Number(e.target.value) : undefined }))}
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-[0.18em] mb-1" style={{ color: "var(--text-muted)" }}>Description</label>
              <textarea
                className={INPUT}
                style={inputStyle}
                rows={2}
                placeholder="What's included in this package?"
                value={form.description ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setAdding(false); setForm({ name: "", price: undefined, description: "" }); }}
                className="rounded-lg px-4 py-1.5 text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Cancel
              </button>
              <button
                onClick={handleAdd}
                disabled={!form.name.trim()}
                className="rounded-lg px-4 py-1.5 text-xs font-semibold transition-opacity"
                style={{ background: "var(--gold)", color: "#1a1612", opacity: form.name.trim() ? 1 : 0.5 }}
              >
                Add
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

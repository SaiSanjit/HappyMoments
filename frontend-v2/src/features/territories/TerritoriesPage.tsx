"use client";

import { useEffect, useState } from "react";
import { CRMTerritory } from "@/lib/crm-types";
import { getTerritories, createTerritory, updateTerritory, deleteTerritory } from "@/services/crm";
import TerritoryForm from "./components/TerritoryForm";
import { Plus, MapPin, Pencil, Trash2 } from "lucide-react";

interface Props { vendorId: string; }

export default function TerritoriesPage({ vendorId }: Props) {
  const [territories, setTerritories] = useState<CRMTerritory[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CRMTerritory | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getTerritories(vendorId);
    setTerritories(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [vendorId]);

  const handleSave = async (payload: Omit<CRMTerritory, "id" | "created_at" | "updated_at">) => {
    if (editing) {
      await updateTerritory(editing.id, payload);
    } else {
      await createTerritory({ ...payload, vendor_id: vendorId });
    }
    setShowForm(false);
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this territory? Resources assigned to it will be unlinked.")) return;
    await deleteTerritory(id);
    load();
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Territories</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: "var(--gold)", color: "#000" }}
        >
          <Plus size={16} /> Add Territory
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 rounded-xl animate-pulse" style={{ background: "var(--bg2)" }} />
          ))}
        </div>
      ) : territories.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <MapPin size={40} style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>No territories yet</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {territories.map((t) => (
            <div
              key={t.id}
              className="rounded-xl p-4 flex items-start justify-between"
              style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg"
                  style={{ background: "var(--gold-soft)" }}
                >
                  <MapPin size={16} style={{ color: "var(--gold)" }} />
                </div>
                <div>
                  <p className="font-semibold text-sm" style={{ color: "var(--text)" }}>
                    {t.city}
                    {t.alias && (
                      <span className="ml-1 text-xs font-normal" style={{ color: "var(--text-muted)" }}>
                        ({t.alias})
                      </span>
                    )}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{t.country}</p>
                  <span
                    className="mt-1.5 inline-block rounded-full px-2 py-0.5 text-[10px] font-medium"
                    style={{
                      background: t.active_flag === "Y" ? "#dcfce7" : "#fee2e2",
                      color: t.active_flag === "Y" ? "#16a34a" : "#dc2626",
                    }}
                  >
                    {t.active_flag === "Y" ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => { setEditing(t); setShowForm(true); }}
                  className="p-1.5 rounded-md transition-colors hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  <Pencil size={14} />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
                  className="p-1.5 rounded-md transition-colors hover:opacity-70"
                  style={{ color: "#ef4444" }}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <TerritoryForm
          initial={editing}
          vendorId={vendorId}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

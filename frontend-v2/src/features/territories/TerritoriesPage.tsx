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
    <div className="p-6" style={{ background: "var(--crm-bg)", minHeight: "100%" }}>
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight"
            style={{ color: "var(--crm-text)" }}
          >
            Territories
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: "var(--crm-muted)" }}>
            {loading ? "–" : territories.length} regions · sales coverage
          </p>
        </div>

        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-px active:translate-y-0"
          style={{
            background: "var(--crm-accent)",
            color: "#fff",
            boxShadow: "0 4px 20px rgba(233,99,26,0.35)",
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add Territory
        </button>
      </div>

      {/* ── Loading skeletons ──────────────────────────────────────────────── */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-2xl animate-pulse"
              style={{ background: "var(--crm-surface)", border: "1px solid var(--crm-border2)" }}
            />
          ))}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!loading && territories.length === 0 && (
        <div
          className="flex flex-col items-center gap-4 rounded-2xl py-24"
          style={{ background: "var(--crm-surface)", border: "1px solid var(--crm-border2)" }}
        >
          <div
            className="flex h-16 w-16 items-center justify-center rounded-2xl"
            style={{
              background: "var(--crm-accent-soft)",
              border: "1px solid var(--crm-border2)",
            }}
          >
            <MapPin size={28} style={{ color: "var(--crm-accent)" }} />
          </div>
          <div className="text-center">
            <p className="font-semibold" style={{ color: "var(--crm-text)" }}>No territories yet</p>
            <p className="mt-1 text-sm" style={{ color: "var(--crm-muted)" }}>
              Define your first territory to organise your sales coverage
            </p>
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="mt-2 flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition-transform hover:-translate-y-px"
            style={{
              background: "var(--crm-accent)",
              color: "#fff",
              boxShadow: "0 4px 20px rgba(233,99,26,0.3)",
            }}
          >
            <Plus size={14} strokeWidth={2.5} />
            Define your first territory
          </button>
        </div>
      )}

      {/* ── Card grid ──────────────────────────────────────────────────────── */}
      {!loading && territories.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {territories.map((t) => {
            const isActive = t.active_flag === "Y";

            return (
              <div
                key={t.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "var(--crm-surface)",
                  border: "1px solid var(--crm-border2)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 8px 32px rgba(0,0,0,0.28), 0 0 0 1px var(--crm-accent)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow =
                    "0 4px 16px rgba(0,0,0,0.18)";
                }}
              >
                {/* ── Decorative gold dot pattern in top-right ─────── */}
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-0 top-0 h-20 w-20 rounded-bl-full opacity-40"
                  style={{
                    background:
                      "radial-gradient(circle at 70% 30%, var(--crm-accent-soft) 0%, transparent 70%)",
                  }}
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute right-3 top-3"
                  style={{
                    width: 36,
                    height: 36,
                    backgroundImage:
                      "radial-gradient(circle, var(--crm-accent) 1px, transparent 1px)",
                    opacity: 0.2,
                    backgroundSize: "6px 6px",
                    maskImage:
                      "radial-gradient(ellipse 100% 100% at 100% 0%, black 30%, transparent 80%)",
                    WebkitMaskImage:
                      "radial-gradient(ellipse 100% 100% at 100% 0%, black 30%, transparent 80%)",
                  }}
                />

                {/* ── Top: icon + city/country ─────────────────────── */}
                <div className="mb-4 flex items-start gap-3">
                  <div
                    className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      background: "var(--crm-accent-soft)",
                      border: "1px solid var(--crm-border2)",
                    }}
                  >
                    <MapPin size={18} style={{ color: "var(--crm-accent)" }} strokeWidth={2} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate font-semibold leading-tight"
                      style={{ color: "var(--crm-text)" }}
                    >
                      {t.city}
                    </p>
                    <p
                      className="mt-0.5 truncate text-xs"
                      style={{ color: "var(--crm-muted)" }}
                    >
                      {t.country}
                    </p>
                  </div>
                </div>

                {/* ── Alias ────────────────────────────────────────── */}
                {t.alias && (
                  <p
                    className="mb-3 text-xs italic"
                    style={{ color: "var(--crm-muted)" }}
                  >
                    &ldquo;{t.alias}&rdquo;
                  </p>
                )}

                {/* ── Footer: status + actions ─────────────────────── */}
                <div
                  className="mt-auto flex items-center justify-between border-t pt-3"
                  style={{ borderColor: "var(--crm-border2)" }}
                >
                  <span
                    className="rounded-full px-3 py-1 text-[11px] font-semibold"
                    style={
                      isActive
                        ? {
                            background: "rgba(34,197,94,0.12)",
                            color: "#4ade80",
                            border: "1px solid rgba(34,197,94,0.25)",
                          }
                        : {
                            background: "rgba(239,68,68,0.1)",
                            color: "#f87171",
                            border: "1px solid rgba(239,68,68,0.22)",
                          }
                    }
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditing(t); setShowForm(true); }}
                      className="rounded-lg p-1.5 transition-colors hover:opacity-70"
                      style={{ color: "var(--crm-muted)" }}
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="rounded-lg p-1.5 transition-colors hover:opacity-80"
                      style={{ color: "#f87171" }}
                      title="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Form modal ─────────────────────────────────────────────────────── */}
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

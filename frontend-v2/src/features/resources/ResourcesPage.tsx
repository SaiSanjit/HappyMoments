"use client";

import { useEffect, useState } from "react";
import { CRMResource } from "@/lib/crm-types";
import { getResources, updateResource, deleteResource } from "@/services/crm";
import ResourceForm from "./components/ResourceForm";
import { Plus, Users, Pencil, Trash2, Shield } from "lucide-react";

interface Props { vendorId: string; }

/** Deterministic hue from a character code — gives each initial a unique-ish colour. */
function hueFromChar(ch: string): number {
  return (ch.toUpperCase().charCodeAt(0) * 137) % 360;
}

export default function ResourcesPage({ vendorId }: Props) {
  const [resources, setResources] = useState<CRMResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<CRMResource | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getResources(vendorId);
    setResources(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, [vendorId]);

  const handleToggleActive = async (r: CRMResource) => {
    await updateResource(r.id, { is_active: !r.is_active });
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this resource? This cannot be undone.")) return;
    await deleteResource(id);
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
            Team
          </h1>
          <p className="mt-0.5 text-sm" style={{ color: "var(--crm-muted)" }}>
            {loading ? "–" : resources.length} members · manage CRM access
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
          Add Resource
        </button>
      </div>

      {/* ── Loading skeletons ──────────────────────────────────────────────── */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-52 rounded-2xl animate-pulse"
              style={{ background: "var(--crm-surface)", border: "1px solid var(--crm-border2)" }}
            />
          ))}
        </div>
      )}

      {/* ── Empty state ────────────────────────────────────────────────────── */}
      {!loading && resources.length === 0 && (
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
            <Users size={28} style={{ color: "var(--crm-accent)" }} />
          </div>
          <div className="text-center">
            <p className="font-semibold" style={{ color: "var(--crm-text)" }}>No team members yet</p>
            <p className="mt-1 text-sm" style={{ color: "var(--crm-muted)" }}>
              Add your first team member to get started
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
            Add your first team member
          </button>
        </div>
      )}

      {/* ── Card grid ──────────────────────────────────────────────────────── */}
      {!loading && resources.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((r) => {
            const hue = hueFromChar(r.resource_name[0] ?? "A");
            const avatarGradient = `linear-gradient(135deg, hsl(${hue},60%,28%) 0%, hsl(${hue},50%,18%) 100%)`;
            const avatarText = `hsl(${hue},80%,75%)`;

            return (
              <div
                key={r.id}
                className="group relative flex flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5"
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
                {/* ── Top: avatar + name ──────────────────────────────── */}
                <div className="mb-4 flex items-center gap-3">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-lg font-bold"
                    style={{ background: avatarGradient, color: avatarText }}
                  >
                    {r.resource_name[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0">
                    <p
                      className="truncate font-semibold leading-tight"
                      style={{ color: "var(--crm-text)" }}
                    >
                      {r.resource_name}
                    </p>
                    <p
                      className="mt-0.5 truncate text-xs"
                      style={{ color: "var(--crm-muted)" }}
                    >
                      {r.designation || "No designation"}
                    </p>
                  </div>
                </div>

                {/* ── Middle: email + role ─────────────────────────────── */}
                <div
                  className="mb-3 rounded-xl px-3 py-2.5"
                  style={{ background: "var(--crm-surface2)", border: "1px solid var(--crm-border2)" }}
                >
                  <p
                    className="truncate text-xs"
                    style={{ color: "var(--crm-muted)" }}
                  >
                    {r.email}
                  </p>
                </div>

                <div className="mb-3 flex items-center justify-between">
                  {r.crm_admin === "Y" ? (
                    <span
                      className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold"
                      style={{
                        background: "var(--crm-accent-soft)",
                        color: "var(--crm-accent)",
                        border: "1px solid var(--crm-border2)",
                      }}
                    >
                      <Shield size={11} strokeWidth={2.5} />
                      Admin
                    </span>
                  ) : (
                    <span
                      className="rounded-full px-2.5 py-1 text-xs font-medium"
                      style={{
                        background: "var(--crm-surface2)",
                        color: "var(--crm-muted)",
                        border: "1px solid var(--crm-border2)",
                      }}
                    >
                      Member
                    </span>
                  )}
                </div>

                {/* ── Groups ──────────────────────────────────────────── */}
                {(r.user_groups?.length ?? 0) > 0 && (
                  <div className="mb-4 flex flex-wrap gap-1.5">
                    {(r.user_groups ?? []).slice(0, 3).map((g) => (
                      <span
                        key={g}
                        className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                        style={{
                          background: "var(--crm-accent-soft)",
                          color: "var(--crm-accent)",
                          border: "1px solid var(--crm-border2)",
                        }}
                      >
                        {g.replace("CRM_", "")}
                      </span>
                    ))}
                    {(r.user_groups ?? []).length > 3 && (
                      <span
                        className="rounded-full px-2 py-0.5 text-[10px]"
                        style={{ color: "var(--crm-muted)" }}
                      >
                        +{r.user_groups.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                {/* ── Footer: status + actions ─────────────────────────── */}
                <div className="mt-auto flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--crm-border2)" }}>
                  <button
                    onClick={() => handleToggleActive(r)}
                    className="rounded-full px-3 py-1 text-[11px] font-semibold transition-opacity hover:opacity-80"
                    style={
                      r.is_active
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
                    {r.is_active ? "Active" : "Inactive"}
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => { setEditing(r); setShowForm(true); }}
                      className="rounded-lg p-1.5 transition-colors hover:opacity-70"
                      style={{ color: "var(--crm-muted)" }}
                      title="Edit"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
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
        <ResourceForm
          initial={editing}
          vendorId={vendorId}
          onSave={() => { setShowForm(false); setEditing(null); load(); }}
          onClose={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { CRMResource } from "@/lib/crm-types";
import { getResources, updateResource, deleteResource } from "@/services/crm";
import ResourceForm from "./components/ResourceForm";
import { Plus, Users, Pencil, Trash2, BadgeCheck, Shield } from "lucide-react";

interface Props { vendorId: string; }

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
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Resources</h1>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: "var(--gold)", color: "#000" }}
        >
          <Plus size={16} /> Add Resource
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--bg2)" }} />
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <Users size={40} style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>No team members yet</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--border3)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}>
                {["Name", "Designation", "Email", "Role", "Groups", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {resources.map((r) => (
                <tr
                  key={r.id}
                  style={{ borderBottom: "1px solid var(--border3)", background: "var(--bg2)" }}
                  className="hover:opacity-90 transition-opacity"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div
                        className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
                        style={{ background: "var(--gold-soft)", color: "var(--gold)" }}
                      >
                        {r.resource_name[0]}
                      </div>
                      <span className="font-medium" style={{ color: "var(--text)" }}>
                        {r.resource_name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {r.designation || "—"}
                  </td>
                  <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                    {r.email}
                  </td>
                  <td className="px-4 py-3">
                    {r.crm_admin === "Y" ? (
                      <span className="flex items-center gap-1 text-xs font-medium" style={{ color: "var(--gold)" }}>
                        <Shield size={12} /> Admin
                      </span>
                    ) : (
                      <span className="text-xs" style={{ color: "var(--text-muted)" }}>Member</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {(r.user_groups || []).slice(0, 3).map((g) => (
                        <span
                          key={g}
                          className="rounded-full px-1.5 py-0.5 text-[10px]"
                          style={{ background: "var(--gold-soft)", color: "var(--gold)" }}
                        >
                          {g.replace("CRM_", "")}
                        </span>
                      ))}
                      {(r.user_groups || []).length > 3 && (
                        <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          +{r.user_groups.length - 3}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handleToggleActive(r)}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium"
                      style={{
                        background: r.is_active ? "#dcfce7" : "#fee2e2",
                        color: r.is_active ? "#16a34a" : "#dc2626",
                      }}
                    >
                      {r.is_active ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => { setEditing(r); setShowForm(true); }}
                        className="p-1.5 rounded-md hover:opacity-70"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="p-1.5 rounded-md hover:opacity-70"
                        style={{ color: "#ef4444" }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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

"use client";

import { useEffect, useState } from "react";
import { CRMResource, CRMUserGroup, CRMTerritory } from "@/lib/crm-types";
import { createResource, updateResource, getTerritories, assignTerritoriesToResource, getResourceTerritories } from "@/services/crm";
import { X } from "lucide-react";

const ALL_GROUPS: CRMUserGroup[] = [
  "CRM_LEADS", "CRM_OPPORTUNITIES", "CRM_DASHBOARDS",
  "CRM_CHATS", "CRM_WORKLIST", "CRM_RESOURCES", "CRM_TERRITORIES",
];

interface Props {
  initial: CRMResource | null;
  vendorId: string;
  onSave: () => void;
  onClose: () => void;
}

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ResourceForm({ initial, vendorId, onSave, onClose }: Props) {
  const [name, setName] = useState(initial?.resource_name || "");
  const [email, setEmail] = useState(initial?.email || "");
  const [phone, setPhone] = useState(initial?.phone || "");
  const [designation, setDesignation] = useState(initial?.designation || "");
  const [password, setPassword] = useState("");
  const [crmAdmin, setCrmAdmin] = useState<"Y" | "N">(initial?.crm_admin || "N");
  const [accessType, setAccessType] = useState<"Modify" | "View">(initial?.admin_access_type || "View");
  const [salesTeam, setSalesTeam] = useState<"Y" | "N">(initial?.sales_team || "N");
  const [groups, setGroups] = useState<CRMUserGroup[]>(initial?.user_groups || []);
  const [territories, setTerritories] = useState<CRMTerritory[]>([]);
  const [selectedTerritories, setSelectedTerritories] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  useEffect(() => {
    getTerritories(vendorId).then(setTerritories);
    if (initial) {
      getResourceTerritories(initial.id).then((ts) => setSelectedTerritories(ts.map((t) => t.id)));
    }
  }, [vendorId, initial]);

  const toggleGroup = (g: CRMUserGroup) => {
    setGroups((prev) => prev.includes(g) ? prev.filter((x) => x !== g) : [...prev, g]);
  };

  const toggleTerritory = (id: string) => {
    setSelectedTerritories((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim() || !email.trim()) { setError("Name and email are required."); return; }
    if (!initial && !password.trim()) { setError("Password is required for new resources."); return; }

    setSaving(true);

    if (initial) {
      const { error: err } = await updateResource(initial.id, {
        resource_name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        designation: designation.trim() || undefined,
        crm_admin: crmAdmin,
        admin_access_type: accessType,
        sales_team: salesTeam,
        user_groups: groups,
      });
      if (err) { setError(err); setSaving(false); return; }
      await assignTerritoriesToResource(initial.id, selectedTerritories);
    } else {
      const hash = await hashPassword(password);
      const { data, error: err } = await createResource({
        vendor_id: vendorId,
        resource_name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim() || undefined,
        designation: designation.trim() || undefined,
        password_hash: hash,
        crm_admin: crmAdmin,
        admin_access_type: accessType,
        sales_team: salesTeam,
        user_groups: groups,
        is_active: true,
      });
      if (err || !data) { setError(err || "Failed to create resource."); setSaving(false); return; }
      await assignTerritoriesToResource(data.id, selectedTerritories);
      setTempPassword(password);
      setSaving(false);
      return;
    }

    setSaving(false);
    onSave();
  };

  if (tempPassword) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
        <div
          className="w-full max-w-sm rounded-2xl p-6 text-center"
          style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
        >
          <h2 className="text-base font-semibold mb-2" style={{ color: "var(--text)" }}>
            Resource Created
          </h2>
          <p className="text-sm mb-4" style={{ color: "var(--text-muted)" }}>
            Share these credentials with the team member. Password will not be shown again.
          </p>
          <div
            className="rounded-lg p-4 text-sm font-mono mb-4"
            style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }}
          >
            <div>Email: <strong>{email}</strong></div>
            <div>Password: <strong>{tempPassword}</strong></div>
          </div>
          <button
            onClick={onSave}
            className="w-full rounded-lg py-2.5 text-sm font-medium"
            style={{ background: "var(--gold)", color: "#000" }}
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>
            {initial ? "Edit Resource" : "Add Resource"}
          </h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Basic info */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Name *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} required
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Designation</label>
              <input value={designation} onChange={(e) => setDesignation(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Email *</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Phone</label>
              <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
            </div>
          </div>

          {!initial && (
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Password *</label>
              <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} required
                placeholder="Will be shown once after creation"
                className="w-full rounded-lg px-3 py-2 text-sm outline-none"
                style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
            </div>
          )}

          {/* Role */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>CRM Admin</label>
              <div className="flex gap-2">
                {(["Y", "N"] as const).map((v) => (
                  <button key={v} type="button" onClick={() => setCrmAdmin(v)}
                    className="flex-1 rounded-lg py-2 text-xs font-medium"
                    style={{ background: crmAdmin === v ? "var(--gold)" : "var(--bg)", color: crmAdmin === v ? "#000" : "var(--text-muted)", border: "1px solid var(--border3)" }}>
                    {v === "Y" ? "Yes" : "No"}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Access Type</label>
              <div className="flex gap-2">
                {(["Modify", "View"] as const).map((v) => (
                  <button key={v} type="button" onClick={() => setAccessType(v)}
                    className="flex-1 rounded-lg py-2 text-xs font-medium"
                    style={{ background: accessType === v ? "var(--gold)" : "var(--bg)", color: accessType === v ? "#000" : "var(--text-muted)", border: "1px solid var(--border3)" }}>
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* User Groups */}
          <div>
            <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
              Module Access
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_GROUPS.map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGroup(g)}
                  className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                  style={{
                    background: groups.includes(g) ? "var(--gold)" : "var(--bg)",
                    color: groups.includes(g) ? "#000" : "var(--text-muted)",
                    border: "1px solid var(--border3)",
                  }}
                >
                  {g.replace("CRM_", "")}
                </button>
              ))}
            </div>
          </div>

          {/* Territories */}
          {territories.length > 0 && (
            <div>
              <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                Territories
              </label>
              <div className="flex flex-wrap gap-2">
                {territories.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => toggleTerritory(t.id)}
                    className="rounded-full px-3 py-1 text-xs font-medium transition-colors"
                    style={{
                      background: selectedTerritories.includes(t.id) ? "#6366f1" : "var(--bg)",
                      color: selectedTerritories.includes(t.id) ? "#fff" : "var(--text-muted)",
                      border: "1px solid var(--border3)",
                    }}
                  >
                    {t.alias || `${t.city}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {error && (
            <p className="text-xs" style={{ color: "#dc2626" }}>{error}</p>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium"
              style={{ border: "1px solid var(--border3)", color: "var(--text-muted)" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium disabled:opacity-50"
              style={{ background: "var(--gold)", color: "#000" }}>
              {saving ? "Saving…" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

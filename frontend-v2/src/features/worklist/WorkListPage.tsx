"use client";

import { useEffect, useState, useCallback } from "react";
import { CRMWorklist, Priority, WorklistStatus } from "@/lib/crm-types";
import { getWorklist, createWorklistItem, updateWorklistItem } from "@/services/crm";
import { useResourceAuth } from "@/contexts/ResourceAuth";
import { Plus, ClipboardList, CheckCircle2, Clock, ArrowRight } from "lucide-react";
import { X } from "lucide-react";

interface Props { vendorId: string; }

const PRIORITY_COLORS: Record<Priority, { bg: string; text: string }> = {
  high:   { bg: "#fee2e2", text: "#b91c1c" },
  medium: { bg: "#fef9c3", text: "#854d0e" },
  low:    { bg: "#dcfce7", text: "#15803d" },
};

export default function WorkListPage({ vendorId }: Props) {
  const { resource } = useResourceAuth();
  const [tasks, setTasks] = useState<CRMWorklist[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const resourceId = resource?.resource_id || "";

  const load = useCallback(async () => {
    if (!resourceId) return;
    setLoading(true);
    const data = await getWorklist(resourceId);
    setTasks(data);
    setLoading(false);
  }, [resourceId]);

  useEffect(() => { load(); }, [load]);

  const handleStatus = async (id: string, status: WorklistStatus) => {
    await updateWorklistItem(id, { status });
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status } : t));
  };

  const pending = tasks.filter((t) => t.status === "pending");
  const done = tasks.filter((t) => t.status === "done");
  const deferred = tasks.filter((t) => t.status === "deferred");

  if (!resourceId) {
    return (
      <div className="flex flex-col items-center gap-3 py-20">
        <ClipboardList size={40} style={{ color: "var(--text-muted)" }} />
        <p style={{ color: "var(--text-muted)" }}>Work list is only available when logged in as a resource</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold" style={{ color: "var(--text)" }}>Work List</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium"
          style={{ background: "var(--gold)", color: "#000" }}
        >
          <Plus size={16} /> Add Task
        </button>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl animate-pulse" style={{ background: "var(--bg2)" }} />
          ))}
        </div>
      ) : tasks.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-20">
          <ClipboardList size={40} style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>No tasks yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          <TaskSection title="Pending" count={pending.length} tasks={pending} onStatus={handleStatus} />
          <TaskSection title="Deferred" count={deferred.length} tasks={deferred} onStatus={handleStatus} />
          {done.length > 0 && (
            <TaskSection title="Done" count={done.length} tasks={done} onStatus={handleStatus} muted />
          )}
        </div>
      )}

      {showForm && (
        <AddTaskForm
          vendorId={vendorId}
          resourceId={resourceId}
          onSave={() => { setShowForm(false); load(); }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

function TaskSection({
  title, count, tasks, onStatus, muted = false,
}: {
  title: string; count: number; tasks: CRMWorklist[];
  onStatus: (id: string, status: WorklistStatus) => void; muted?: boolean;
}) {
  if (tasks.length === 0) return null;
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-semibold" style={{ color: muted ? "var(--text-muted)" : "var(--text)" }}>
          {title}
        </h3>
        <span
          className="rounded-full px-2 py-0.5 text-xs font-medium"
          style={{ background: "var(--bg2)", color: "var(--text-muted)", border: "1px solid var(--border3)" }}
        >
          {count}
        </span>
      </div>
      <div className="space-y-2">
        {tasks.map((task) => {
          const colors = PRIORITY_COLORS[task.priority];
          return (
            <div
              key={task.id}
              className="flex items-start gap-3 rounded-xl p-4"
              style={{ background: "var(--bg2)", border: "1px solid var(--border3)", opacity: muted ? 0.6 : 1 }}
            >
              <button
                onClick={() => onStatus(task.id, task.status === "done" ? "pending" : "done")}
                className="mt-0.5 shrink-0"
                style={{ color: task.status === "done" ? "#10b981" : "var(--text-muted)" }}
              >
                <CheckCircle2 size={18} />
              </button>

              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text)", textDecoration: task.status === "done" ? "line-through" : "none" }}
                >
                  {task.title}
                </p>
                {task.due_date && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock size={11} style={{ color: "var(--text-muted)" }} />
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {new Date(task.due_date).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                    </span>
                  </div>
                )}
                {task.notes && (
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>{task.notes}</p>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize"
                  style={{ background: colors.bg, color: colors.text }}
                >
                  {task.priority}
                </span>
                {task.status === "pending" && (
                  <button
                    onClick={() => onStatus(task.id, "deferred")}
                    className="p-1 rounded-md hover:opacity-70"
                    style={{ color: "var(--text-muted)" }}
                    title="Defer"
                  >
                    <ArrowRight size={14} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function AddTaskForm({
  vendorId, resourceId, onSave, onClose,
}: { vendorId: string; resourceId: string; onSave: () => void; onClose: () => void; }) {
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    await createWorklistItem({
      vendor_id: vendorId,
      resource_id: resourceId,
      title: title.trim(),
      due_date: dueDate || undefined,
      priority,
      status: "pending",
      notes: notes.trim() || undefined,
    });
    setSaving(false);
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className="w-full max-w-md rounded-2xl p-6"
        style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-base font-semibold" style={{ color: "var(--text)" }}>Add Task</h2>
          <button onClick={onClose} style={{ color: "var(--text-muted)" }}><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Title *</label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} required
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Due Date</label>
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
          </div>

          <div>
            <label className="mb-2 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Priority</label>
            <div className="flex gap-2">
              {(["high", "medium", "low"] as Priority[]).map((p) => (
                <button key={p} type="button" onClick={() => setPriority(p)}
                  className="flex-1 rounded-lg py-1.5 text-xs font-medium capitalize"
                  style={{ background: priority === p ? "var(--gold)" : "var(--bg)", color: priority === p ? "#000" : "var(--text-muted)", border: "1px solid var(--border3)" }}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium" style={{ color: "var(--text-muted)" }}>Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2}
              className="w-full rounded-lg px-3 py-2 text-sm outline-none resize-none"
              style={{ background: "var(--bg)", border: "1px solid var(--border3)", color: "var(--text)" }} />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium"
              style={{ border: "1px solid var(--border3)", color: "var(--text-muted)" }}>
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 rounded-lg py-2.5 text-sm font-medium disabled:opacity-50"
              style={{ background: "var(--gold)", color: "#000" }}>
              {saving ? "Adding…" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

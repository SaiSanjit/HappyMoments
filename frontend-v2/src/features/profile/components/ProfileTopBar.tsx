"use client";

import { Globe, Loader2, CheckCircle, Circle } from "lucide-react";
import { VendorProfile } from "../ProfilePage";

function relativeTime(iso?: string) {
  if (!iso) return "Never";
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

interface Props {
  draft: VendorProfile;
  isDirty: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export default function ProfileTopBar({ draft, isDirty, isSaving, onSave }: Props) {
  const handlePreview = () => {
    if (draft.slug) window.open(`/vendor/${draft.slug}`, "_blank");
  };

  return (
    <div
      className="sticky top-0 z-40 border-b px-6 py-0"
      style={{ background: "var(--bg)", borderColor: "var(--border3)" }}
    >
      {/* Breadcrumb */}
      <p
        className="pt-5 text-[10px] font-semibold uppercase tracking-[0.22em]"
        style={{ color: "var(--text-muted)" }}
      >
        Profile · Public Listing
      </p>

      <div className="flex items-end justify-between pb-4 gap-4">
        {/* Left: title + status row */}
        <div>
          <h1
            className="mt-1 text-2xl font-bold leading-tight"
            style={{ color: "var(--text)", fontFamily: '"Playfair Display", serif' }}
          >
            Your studio page
          </h1>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs" style={{ color: "var(--text-muted)" }}>
            {/* Live status */}
            <span className="flex items-center gap-1.5">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: draft.verified ? "#22c55e" : "#f59e0b" }}
              />
              <span style={{ color: draft.verified ? "#22c55e" : "#f59e0b", fontWeight: 600 }}>
                {draft.verified ? "Live" : "Draft"}
              </span>
            </span>

            {draft.updated_at && (
              <span>Last edited {relativeTime(draft.updated_at)}</span>
            )}

            {/* Auto-save indicator */}
            <span className="flex items-center gap-1">
              {isSaving ? (
                <><Loader2 size={11} className="animate-spin" /> Saving…</>
              ) : isDirty ? (
                <><Circle size={11} /> Unsaved changes</>
              ) : (
                <><CheckCircle size={11} style={{ color: "#22c55e" }} /> Saved</>
              )}
            </span>
          </div>
        </div>

        {/* Right: action buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePreview}
            className="flex items-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-medium transition-colors"
            style={{
              borderColor: "var(--border2)",
              color: "var(--text)",
              background: "transparent",
            }}
          >
            <Globe size={14} />
            Preview live
          </button>
          <button
            onClick={onSave}
            disabled={!isDirty || isSaving}
            className="flex items-center gap-1.5 rounded-xl px-5 py-2 text-sm font-semibold transition-all"
            style={{
              background: isDirty ? "var(--gold)" : "var(--border3)",
              color: isDirty ? "#1a1612" : "var(--text-muted)",
              cursor: isDirty ? "pointer" : "not-allowed",
              opacity: isSaving ? 0.7 : 1,
            }}
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            Publish changes
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import { Sparkles } from "lucide-react";

const MAX_QUICK = 300;
const MAX_DESC = 600;

interface Props {
  quickIntro: string;
  description: string;
  onChangeQuickIntro: (v: string) => void;
  onChangeDescription: (v: string) => void;
}

const areaStyle = {
  borderColor: "var(--border2)",
  background: "var(--border3)",
  color: "var(--text)",
  "--tw-ring-color": "var(--gold)",
} as React.CSSProperties;

export default function StorySection({ quickIntro, description, onChangeQuickIntro, onChangeDescription }: Props) {
  return (
    <section
      className="rounded-2xl border p-6"
      style={{ background: "var(--bg2)", borderColor: "var(--border3)" }}
    >
      <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1" style={{ color: "var(--text-muted)" }}>
        Your Story
      </p>
      <p className="text-xs mb-4" style={{ color: "var(--text3)" }}>
        Couples spend longer here than anywhere else on your page.
      </p>

      {/* Quick Intro — shown prominently on the customer page */}
      <div className="mb-4">
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          Quick Intro <span className="normal-case font-normal tracking-normal ml-1" style={{ color: "var(--text3)" }}>— shown on your public page</span>
        </label>
        <textarea
          value={quickIntro ?? ""}
          onChange={(e) => onChangeQuickIntro(e.target.value)}
          rows={3}
          maxLength={MAX_QUICK}
          placeholder="A punchy 2–3 sentence intro couples will read first…"
          className="w-full rounded-xl border px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition"
          style={areaStyle}
        />
        <div className="mt-1.5 flex items-center justify-between">
          <button
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium"
            style={{ background: "rgba(201,168,76,0.1)", color: "var(--gold)" }}
            onClick={() => console.log("Polish quick_intro with AI")}
          >
            <Sparkles size={12} /> Polish with AI
          </button>
          <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
            {(quickIntro ?? "").length} / {MAX_QUICK}
          </span>
        </div>
      </div>

      {/* Detailed description */}
      <div>
        <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.22em]" style={{ color: "var(--text-muted)" }}>
          Full Description <span className="normal-case font-normal tracking-normal ml-1" style={{ color: "var(--text3)" }}>— for search & discovery</span>
        </label>
        <textarea
          value={description ?? ""}
          onChange={(e) => onChangeDescription(e.target.value)}
          rows={5}
          maxLength={MAX_DESC}
          placeholder="Tell couples who you are, what you love about your craft, and what they can expect…"
          className="w-full rounded-xl border px-4 py-3 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 transition"
          style={areaStyle}
        />
        <div className="mt-1.5 flex justify-end">
          <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
            {(description ?? "").length} / {MAX_DESC}
          </span>
        </div>
      </div>
    </section>
  );
}

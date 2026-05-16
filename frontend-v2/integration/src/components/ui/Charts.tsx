"use client";

import * as React from "react";

/* ──────────────────────────────────────────────────────────────────────
   BarChart — two-series grouped bars with month labels.
   ────────────────────────────────────────────────────────────────────── */

type Datum = { label: string; a: number; b?: number };

type BarProps = {
  data: Datum[];
  height?: number;
  accent?: string;
  muted?: string;
};

export function BarChart({ data, height = 180, accent = "var(--crm-accent)", muted = "#d0c6b6" }: BarProps) {
  const max = Math.max(...data.flatMap((d) => [d.a || 0, d.b || 0]), 1);
  return (
    <div className="flex items-end gap-[14px] py-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="flex-1 flex flex-col items-center gap-2">
          <div className="flex items-end gap-1 w-full" style={{ height: height - 28 }}>
            <div
              className="flex-1 rounded-t-[4px]"
              style={{ height: `${((d.a || 0) / max) * 100}%`, background: accent, minHeight: 2 }}
            />
            {d.b !== undefined && (
              <div
                className="flex-1 rounded-t-[4px]"
                style={{ height: `${((d.b || 0) / max) * 100}%`, background: muted, minHeight: 2 }}
              />
            )}
          </div>
          <div className="text-[11px] text-[var(--text4)] tracking-wide">{d.label}</div>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   Donut — segmented ring with custom colors.
   ────────────────────────────────────────────────────────────────────── */

type Segment = { value: number; color: string; label?: string };

type DonutProps = {
  segments: Segment[];
  size?: number;
  thickness?: number;
  centerLabel?: React.ReactNode;
};

export function Donut({ segments, size = 160, thickness = 18, centerLabel }: DonutProps) {
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  let offset = 0;

  return (
    <div className="relative inline-block" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--border2)" strokeWidth={thickness} fill="none" />
        {segments.map((s, i) => {
          const len = (s.value / total) * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              stroke={s.color}
              strokeWidth={thickness}
              fill="none"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      {centerLabel && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {centerLabel}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   ProgressBar — single-value horizontal.
   ────────────────────────────────────────────────────────────────────── */

export function ProgressBar({
  value, max = 100, color = "var(--crm-accent)", height = 6, className,
}: {
  value: number; max?: number; color?: string; height?: number; className?: string;
}) {
  return (
    <div className={`w-full bg-[var(--bg3)] rounded-full overflow-hidden ${className ?? ""}`} style={{ height }}>
      <div style={{ height: "100%", width: `${Math.min(100, (value / max) * 100)}%`, background: color }} />
    </div>
  );
}

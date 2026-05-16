"use client";

import * as React from "react";

const TONES = [
  { bg: "#ece3d2", fg: "#3d3630" }, // default warm
  { bg: "#f5e1d6", fg: "#a44d31" }, // accent
  { bg: "#e3e6d2", fg: "#6b7a3f" }, // olive
  { bg: "#dde6da", fg: "#4e6b4a" }, // forest
  { bg: "#d8dfe9", fg: "#5a6f8a" }, // indigo
  { bg: "#e5d6df", fg: "#7a4d63" }, // plum
  { bg: "#efe0c5", fg: "#8a5318" }, // amber
];

function toneFor(name: string): { bg: string; fg: string } {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) & 0xffff;
  return TONES[h % TONES.length];
}

function initials(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";
}

type Props = {
  name: string;
  size?: number;
  /** Force a specific tone instead of hashing from name */
  tone?: "default" | "accent" | "olive" | "forest" | "indigo" | "plum" | "amber";
  className?: string;
};

const TONE_INDEX = { default: 0, accent: 1, olive: 2, forest: 3, indigo: 4, plum: 5, amber: 6 } as const;

export function Avatar({ name, size = 32, tone, className }: Props) {
  const c = tone !== undefined ? TONES[TONE_INDEX[tone]] : toneFor(name);
  return (
    <div
      className={`inline-flex items-center justify-center font-semibold flex-shrink-0 ${className ?? ""}`}
      style={{
        width: size,
        height: size,
        borderRadius: size > 40 ? 14 : 10,
        background: c.bg,
        color: c.fg,
        fontSize: size * 0.36,
        fontFamily: "var(--font-body-stack)",
      }}
    >
      {initials(name)}
    </div>
  );
}

/** Stacked avatar group with a +N overflow chip. */
export function AvatarStack({ names, size = 28, max = 3 }: { names: string[]; size?: number; max?: number }) {
  const visible = names.slice(0, max);
  const overflow = names.length - visible.length;
  return (
    <div className="flex">
      {visible.map((n, i) => (
        <div key={n + i} style={{ marginLeft: i === 0 ? 0 : -size * 0.3 }}>
          <Avatar name={n} size={size} className="border-2 border-[var(--bg)]" />
        </div>
      ))}
      {overflow > 0 && (
        <div
          className="inline-flex items-center justify-center font-semibold flex-shrink-0 bg-[var(--text)] text-[var(--bg2)] border-2 border-[var(--bg)]"
          style={{
            width: size, height: size, borderRadius: size > 40 ? 14 : 10,
            fontSize: size * 0.32, marginLeft: -size * 0.3,
          }}
        >
          +{overflow}
        </div>
      )}
    </div>
  );
}

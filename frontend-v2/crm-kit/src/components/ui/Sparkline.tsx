"use client";

import * as React from "react";

type Props = {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

/** Tiny SVG sparkline with filled area + stroke. */
export function Sparkline({ values, width = 120, height = 36, color = "var(--crm-accent)", className }: Props) {
  if (!values.length) return null;
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const step = width / Math.max(1, values.length - 1);
  const pts = values.map((v, i) => [i * step, height - ((v - min) / range) * (height - 4) - 2] as const);
  const stroke = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + " " + p[1].toFixed(1)).join(" ");
  const area = stroke + ` L${width} ${height} L0 ${height} Z`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className}>
      <path d={area} fill={color} fillOpacity={0.10} />
      <path d={stroke} stroke={color} strokeWidth={1.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

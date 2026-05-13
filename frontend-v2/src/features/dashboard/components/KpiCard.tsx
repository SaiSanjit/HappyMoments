"use client";

import { LucideIcon } from "lucide-react";

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

export default function KpiCard({ label, value, icon: Icon, color }: Props) {
  return (
    <div
      className="flex flex-col gap-3 rounded-xl p-4"
      style={{ background: "var(--bg2)", border: "1px solid var(--border3)" }}
    >
      <div
        className="flex h-9 w-9 items-center justify-center rounded-lg"
        style={{ background: `${color}20` }}
      >
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl font-bold" style={{ color: "var(--text)" }}>
          {value}
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
      </div>
    </div>
  );
}

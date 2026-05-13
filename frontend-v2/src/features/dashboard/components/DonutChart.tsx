"use client";

import { StatusBreakdown } from "@/lib/crm-types";

interface Props { data: StatusBreakdown[]; }

export default function DonutChart({ data }: Props) {
  const total = data.reduce((s, d) => s + d.count, 0);
  if (total === 0) return null;

  const R = 60;
  const strokeWidth = 18;
  const cx = 80;
  const cy = 80;
  const circumference = 2 * Math.PI * R;

  let offset = 0;
  const segments = data.map((d) => {
    const pct = d.count / total;
    const dash = pct * circumference;
    const seg = { ...d, dash, offset, pct };
    offset += dash;
    return seg;
  });

  return (
    <div className="flex items-center gap-6">
      <svg width={160} height={160} viewBox="0 0 160 160">
        {segments.map((seg, i) => (
          <circle
            key={i}
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke={seg.color}
            strokeWidth={strokeWidth}
            strokeDasharray={`${seg.dash} ${circumference - seg.dash}`}
            strokeDashoffset={-seg.offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            style={{ transition: "stroke-dasharray 0.4s ease" }}
          />
        ))}
        <text x={cx} y={cy - 6} textAnchor="middle" fontSize={20} fontWeight="bold" fill="var(--text)">
          {total}
        </text>
        <text x={cx} y={cy + 12} textAnchor="middle" fontSize={10} fill="var(--text-muted)">
          total
        </text>
      </svg>

      <ul className="flex flex-col gap-2">
        {segments.map((seg, i) => (
          <li key={i} className="flex items-center gap-2 text-xs">
            <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
            <span className="capitalize" style={{ color: "var(--text-muted)" }}>
              {seg.status.replace(/_/g, " ")}
            </span>
            <span className="ml-auto font-semibold" style={{ color: "var(--text)" }}>
              {seg.count}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

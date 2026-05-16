"use client";

import { LucideIcon } from "lucide-react";

type Variant = "blue" | "violet" | "green" | "gold" | "rose" | "teal";

const VARIANT_STYLES: Record<Variant, { bg: string; accent: string; soft: string }> = {
  blue:   { bg: "linear-gradient(135deg,#f2f8ff 0%,#dbeaf8 52%,#b9d4ea 100%)", accent: "#2f6ea0", soft: "rgba(47,110,160,0.22)" },
  violet: { bg: "linear-gradient(135deg,#f4f1ff 0%,#dcdff8 52%,#b7bef1 100%)", accent: "#6a72d6", soft: "rgba(106,114,214,0.22)" },
  green:  { bg: "linear-gradient(135deg,#e9fbf2 0%,#cbeedc 52%,#9fd8ba 100%)", accent: "#299a6a", soft: "rgba(41,154,106,0.22)" },
  gold:   { bg: "linear-gradient(135deg,#fef8e6 0%,#faedd0 52%,#f5e4b3 100%)", accent: "#c9a84c", soft: "rgba(201,168,76,0.24)" },
  rose:   { bg: "linear-gradient(135deg,#fff2f1 0%,#fbe4e2 52%,#f6cecb 100%)", accent: "#d56a62", soft: "rgba(213,106,98,0.22)" },
  teal:   { bg: "linear-gradient(135deg,#e4faf9 0%,#c3eeec 52%,#95d8d5 100%)", accent: "#2a8c88", soft: "rgba(42,140,136,0.22)" },
};

interface Props {
  label: string;
  value: string | number;
  icon: LucideIcon;
  variant?: Variant;
  /** legacy color prop — ignored when variant is provided */
  color?: string;
  onClick?: () => void;
}

export default function KpiCard({ label, value, icon: Icon, variant = "blue", onClick }: Props) {
  const { bg, accent, soft } = VARIANT_STYLES[variant];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-[26px] p-[18px] isolate transition-all duration-300 ${onClick ? "cursor-pointer" : ""}`}
      style={{
        background: bg,
        border: "1px solid rgba(255,255,255,0.65)",
        boxShadow: "0 12px 26px -14px rgba(15,23,42,0.3), inset 0 1px 0 rgba(255,255,255,0.82)",
        minHeight: 150,
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 18px 34px -16px rgba(15,23,42,0.34), inset 0 1px 0 rgba(255,255,255,0.9)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 26px -14px rgba(15,23,42,0.3), inset 0 1px 0 rgba(255,255,255,0.82)";
      }}
    >
      {/* Radial glow overlay */}
      <div className="pointer-events-none absolute inset-0 z-[1]" style={{
        background: "radial-gradient(120px 120px at 18% 12%,rgba(255,255,255,0.75),rgba(255,255,255,0) 60%),radial-gradient(160px 160px at 120% 120%,rgba(255,255,255,0.45),rgba(255,255,255,0) 70%)",
        opacity: 0.9,
      }} />

      {/* Decorative circle */}
      <div className="pointer-events-none absolute -right-[52px] -bottom-[64px] w-[150px] h-[150px] rounded-full z-[1]"
        style={{ border: "2px solid rgba(255,255,255,0.45)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.2)", opacity: 0.55 }} />

      {/* Label */}
      <div className="relative z-[3] mb-4">
        <span className="text-[11.5px] font-black uppercase tracking-[0.14em]" style={{ color: "rgba(17,24,39,0.6)" }}>{label}</span>
      </div>

      {/* Value */}
      <div className="relative z-[3] pr-[86px]">
        <p className="text-[36px] font-black leading-none tracking-[-0.02em]" style={{ color: "#111827", textShadow: "0 2px 6px rgba(255,255,255,0.45)", whiteSpace: "nowrap" }}>
          {value}
        </p>
      </div>

      {/* Icon */}
      <div className="pointer-events-none absolute right-[-2px] bottom-[-6px] w-[86px] h-[86px] z-[2] flex items-center justify-center"
        style={{ color: accent, transform: "rotate(-8deg)", opacity: 0.76 }}>
        <div className="absolute inset-[-26px] rounded-full"
          style={{ background: `radial-gradient(circle,${soft} 0%,transparent 70%)`, opacity: 0.6 }} />
        <Icon style={{ width: 52, height: 52, strokeWidth: 1.4, filter: `drop-shadow(0 6px 10px rgba(15,23,42,0.18))` }} />
      </div>
    </div>
  );
}

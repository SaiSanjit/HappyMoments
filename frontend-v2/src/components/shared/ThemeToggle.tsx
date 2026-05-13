"use client";

import { useState } from "react";
import { Palette, Check } from "lucide-react";
import { useTheme, THEMES } from "@/contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const active = THEMES.find((t) => t.id === theme)!;

  return (
    <div className="fixed bottom-6 left-6 z-[9998]">
      {/* Swatch tray — slides up when open */}
      <div
        className="mb-2.5 flex flex-col gap-2 transition-all duration-400"
        style={{
          opacity:          open ? 1 : 0,
          transform:        open ? "translateY(0)" : "translateY(10px)",
          pointerEvents:    open ? "auto" : "none",
          transition:       "opacity 0.3s cubic-bezier(0.16,1,0.3,1), transform 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
        aria-hidden={!open}
      >
        {THEMES.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTheme(t.id); setOpen(false); }}
            className="group flex items-center gap-3 rounded-full py-2 pl-2.5 pr-4 text-xs font-medium transition-all duration-200 hover:scale-105"
            style={{
              background:   "var(--glass-bg)",
              border:       `1px solid ${theme === t.id ? t.accent : "var(--border2)"}`,
              backdropFilter: "blur(20px)",
              boxShadow:    theme === t.id ? `0 4px 20px ${t.accent}30` : "0 4px 16px rgba(0,0,0,0.2)",
              color:        "var(--text)",
            }}
          >
            {/* 2-tone swatch */}
            <span
              className="relative flex h-5 w-5 shrink-0 overflow-hidden rounded-full"
              style={{ outline: `1px solid ${t.accent}60` }}
            >
              <span className="absolute inset-0 left-0 w-1/2" style={{ background: t.bg }} />
              <span className="absolute inset-0 left-1/2 w-1/2" style={{ background: t.accent }} />
            </span>
            <span style={{ color: "var(--text2)" }}>{t.label}</span>
            {theme === t.id && (
              <Check size={11} className="ml-auto" style={{ color: t.accent }} />
            )}
          </button>
        ))}
      </div>

      {/* Trigger button */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change theme"
        className="flex items-center gap-2.5 rounded-full px-3.5 py-2.5 text-xs font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:scale-105"
        style={{
          background:     "var(--glass-bg)",
          border:         `1px solid ${open ? active.accent : "var(--border)"}`,
          backdropFilter: "blur(20px)",
          boxShadow:      `0 8px 32px rgba(0,0,0,0.25), 0 0 0 1px ${active.accent}25`,
          color:          "var(--text)",
          transition:     "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        {/* Live color dot */}
        <span
          className="h-3 w-3 rounded-full transition-colors duration-500"
          style={{ background: active.accent, boxShadow: `0 0 8px ${active.accent}80` }}
        />
        <Palette size={12} style={{ color: active.accent }} />
        <span style={{ color: "var(--text3)" }}>{active.label}</span>
      </button>
    </div>
  );
}

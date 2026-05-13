"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type Theme = "dark" | "light" | "rose" | "emerald" | "sapphire" | "sapphire-light" | "indigo" | "blueprint";

export const THEMES: { id: Theme; label: string; bg: string; accent: string }[] = [
  { id: "dark",           label: "Midnight Gold",      bg: "#070503", accent: "#c9a84c" },
  { id: "light",          label: "Ivory Champagne",    bg: "#f8f4ee", accent: "#c9a84c" },
  { id: "rose",           label: "Rose Velvet",        bg: "#1a0c10", accent: "#d4956a" },
  { id: "emerald",        label: "Emerald Ceremony",   bg: "#060f0a", accent: "#b5874a" },
  { id: "sapphire",       label: "Midnight Sapphire",  bg: "#050810", accent: "#c9a84c" },
  { id: "sapphire-light", label: "Sapphire Pearl",     bg: "#f0f4fd", accent: "#c9a84c" },
  { id: "indigo",         label: "Indigo Ink",         bg: "#0a0b14", accent: "#6366f1" },
  { id: "blueprint",      label: "Blueprint",          bg: "#1e2024", accent: "#0066ff" },
];

interface ThemeContextType {
  theme: Theme;
  setTheme: (t: Theme) => void;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem("hm-theme") as Theme | null;
    const resolved = stored ?? "dark";
    setThemeState(resolved);
    document.documentElement.setAttribute("data-theme", resolved);
  }, []);

  const setTheme = (next: Theme) => {
    setThemeState(next);
    localStorage.setItem("hm-theme", next);
    document.documentElement.setAttribute("data-theme", next);
  };

  const toggle = () => {
    const idx = THEMES.findIndex((t) => t.id === theme);
    const next = THEMES[(idx + 1) % THEMES.length].id;
    setTheme(next);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

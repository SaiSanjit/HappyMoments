"use client";

/**
 * ThemeContext (POST-MIGRATION STUB)
 *
 * The Happy Moments app now ships a single curated theme — there is no light/
 * dark/sapphire/etc. switching anymore. This stub exists only so existing imports
 * (`import { useTheme } from "@/contexts/ThemeContext"`) keep compiling while you
 * clean up consumers gradually.
 *
 * To do:
 *   1. Search the codebase for `useTheme`, `setTheme`, `ThemeProvider` and remove
 *      any theme-switcher UI that calls them.
 *   2. Once nothing imports this file, delete it and remove the `<ThemeProvider>`
 *      wrapper from `app/layout.tsx`.
 */

import * as React from "react";

type Theme = "default";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (t: Theme) => void;
}

const ThemeContext = React.createContext<ThemeContextValue>({
  theme: "default",
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // No-op provider — the single theme is set entirely in globals.css.
  return (
    <ThemeContext.Provider value={{ theme: "default", setTheme: () => {} }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return React.useContext(ThemeContext);
}

"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useState } from "react";
import { readStoredTheme, resolveTheme, themeStorageKey, type ThemePreference } from "@/lib/theme";

type ThemeContextValue = {
  preference: ThemePreference;
  setPreference: (value: ThemePreference) => void;
  /** True when Tailwind `dark` class should apply to document root (marketing shell). */
  resolvedDark: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function applyDocumentDark(isDark: boolean) {
  document.documentElement.classList.toggle("dark", isDark);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>("system");
  const [resolvedDark, setResolvedDark] = useState(true);

  const setPreference = useCallback((value: ThemePreference) => {
    setPreferenceState(value);
    window.localStorage.setItem(themeStorageKey, value);
    const dark = resolveTheme(value);
    setResolvedDark(dark);
    applyDocumentDark(dark);
    window.dispatchEvent(new Event("globalhire:theme-changed"));
  }, []);

  useLayoutEffect(() => {
    const stored = readStoredTheme() || "system";
    setPreferenceState(stored);
    const dark = resolveTheme(stored);
    setResolvedDark(dark);
    applyDocumentDark(dark);

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      const current = (readStoredTheme() || "system") as ThemePreference;
      if (current !== "system") return;
      const next = resolveTheme("system");
      setResolvedDark(next);
      applyDocumentDark(next);
    };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const value = useMemo(() => ({ preference, setPreference, resolvedDark }), [preference, setPreference, resolvedDark]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}

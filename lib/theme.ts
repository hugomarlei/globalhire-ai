export type ThemePreference = "system" | "light" | "dark";

export const themeStorageKey = "globalhire-theme";

export function readStoredTheme(): ThemePreference | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(themeStorageKey);
  if (raw === "light" || raw === "dark" || raw === "system") return raw;
  return null;
}

export function resolveTheme(pref: ThemePreference): boolean {
  if (pref === "dark") return true;
  if (pref === "light") return false;
  if (typeof window === "undefined" || !window.matchMedia) return true;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

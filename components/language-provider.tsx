"use client";

import { createContext, useContext, useLayoutEffect, useMemo, useState } from "react";
import { isLocale, type Locale } from "@/lib/i18n";

type LanguageContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const localeCookieName = "globalhire-locale";

function readLocaleCookie(): Locale | null {
  if (typeof document === "undefined") return null;
  const raw = document.cookie.split("; ").find((row) => row.startsWith(`${localeCookieName}=`));
  if (!raw) return null;
  const value = decodeURIComponent(raw.split("=").slice(1).join("="));
  return isLocale(value) ? value : null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt-BR");

  useLayoutEffect(() => {
    const cookieLocale = readLocaleCookie();
    if (cookieLocale) {
      setLocaleState(cookieLocale);
      document.documentElement.lang = cookieLocale;
      window.localStorage.setItem("globalhire-locale", cookieLocale);
      return;
    }

    const stored = window.localStorage.getItem("globalhire-locale");
    if (isLocale(stored)) {
      setLocaleState(stored);
      document.documentElement.lang = stored;
    }
  }, []);

  function setLocale(nextLocale: Locale) {
    setLocaleState(nextLocale);
    window.localStorage.setItem("globalhire-locale", nextLocale);
    document.documentElement.lang = nextLocale;
    document.cookie = `${localeCookieName}=${encodeURIComponent(nextLocale)}; Path=/; Max-Age=31536000; SameSite=Lax`;
  }

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { Button } from "@/components/ui";
import { cookieConsentCopy } from "@/lib/i18n-app-wide";

const consentKey = "globalhire-cookie-consent";

type ConsentValue = "all" | "essential";

function saveConsent(value: ConsentValue) {
  window.localStorage.setItem(consentKey, value);
  window.dispatchEvent(new Event("globalhire:cookie-consent"));
}

export function CookieConsent() {
  const { locale } = useLanguage();
  const c = cookieConsentCopy[locale];
  const [visible, setVisible] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);

  useEffect(() => {
    function openPreferences() {
      setVisible(true);
      setPreferencesOpen(true);
    }

    const stored = window.localStorage.getItem(consentKey);
    if (stored === "accepted") {
      saveConsent("all");
      setVisible(false);
    } else {
      setVisible(stored !== "all" && stored !== "essential");
    }
    window.addEventListener("globalhire:open-cookie-preferences", openPreferences);

    return () => {
      window.removeEventListener("globalhire:open-cookie-preferences", openPreferences);
    };
  }, []);

  function choose(value: ConsentValue) {
    saveConsent(value);
    setVisible(false);
    setPreferencesOpen(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-4 py-4 text-card-foreground shadow-[0_-12px_40px_rgba(0,0,0,0.12)] backdrop-blur-md dark:shadow-[0_-12px_40px_rgba(0,0,0,0.35)]">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold text-foreground">{c.title}</p>
          <p className="mt-1 max-w-3xl text-sm leading-relaxed text-muted-foreground">{c.body}</p>
          {preferencesOpen ? (
            <div className="mt-3 grid gap-2 rounded-xl border border-border bg-muted/50 p-3 text-sm text-muted-foreground sm:grid-cols-2">
              <div>
                <p className="font-semibold text-foreground">{c.essentialsTitle}</p>
                <p className="mt-1">{c.essentialsBody}</p>
              </div>
              <div>
                <p className="font-semibold text-foreground">{c.analyticsTitle}</p>
                <p className="mt-1">{c.analyticsBody}</p>
              </div>
            </div>
          ) : null}
          <p className="mt-2 text-xs text-muted-foreground">
            {c.legalPrefix}{" "}
            <Link href="/privacidade" className="font-medium text-primary underline-offset-2 hover:underline">
              {c.privacyLink}
            </Link>{" "}
            {c.legalMid}{" "}
            <Link href="/termos" className="font-medium text-primary underline-offset-2 hover:underline">
              {c.termsLink}
            </Link>
            {c.legalSuffix}
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
          <Button onClick={() => choose("all")} className="h-10 whitespace-nowrap">
            {c.acceptAll}
          </Button>
          <Button
            onClick={() => choose("essential")}
            className="h-10 whitespace-nowrap border border-border bg-muted text-foreground shadow-none hover:bg-muted/80"
          >
            {c.rejectAnalytics}
          </Button>
          <Button
            onClick={() => setPreferencesOpen((value) => !value)}
            className="h-10 whitespace-nowrap border border-border bg-transparent text-foreground shadow-none hover:bg-muted"
          >
            {c.preferences}
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui";

const consentKey = "globalhire-cookie-consent";

type ConsentValue = "all" | "essential";

function saveConsent(value: ConsentValue) {
  window.localStorage.setItem(consentKey, value);
  window.dispatchEvent(new Event("globalhire:cookie-consent"));
}

export function CookieConsent() {
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
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#06100B]/95 px-4 py-4 text-white shadow-soft backdrop-blur">
      <div className="mx-auto grid max-w-7xl gap-4 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold">Preferências de privacidade</p>
          <p className="mt-1 max-w-3xl text-sm leading-6 text-white/65">
            Usamos cookies essenciais e tecnologias similares para login, segurança, análise de uso e melhoria da
            experiência. Analytics, como Microsoft Clarity, só será carregado com seu consentimento.
          </p>
          {preferencesOpen ? (
            <div className="mt-3 grid gap-2 rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white/70 sm:grid-cols-2">
              <div>
                <p className="font-semibold text-white">Essenciais</p>
                <p className="mt-1">Necessários para login, segurança e funcionamento da conta. Sempre ativos.</p>
              </div>
              <div>
                <p className="font-semibold text-white">Analytics</p>
                <p className="mt-1">Ajuda a entender uso do produto sem armazenar currículos completos nos logs.</p>
              </div>
            </div>
          ) : null}
          <p className="mt-2 text-xs text-white/45">
            Veja a <Link href="/privacidade" className="text-brand-500 hover:text-brand-400">Política de Privacidade</Link>{" "}
            e os <Link href="/termos" className="text-brand-500 hover:text-brand-400">Termos de Uso</Link>.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row md:justify-end">
          <Button onClick={() => choose("all")} className="h-10 whitespace-nowrap">
            Aceitar todos
          </Button>
          <Button
            onClick={() => choose("essential")}
            className="h-10 whitespace-nowrap border border-white/10 bg-white/8 text-white hover:bg-white/12"
          >
            Rejeitar analytics
          </Button>
          <Button
            onClick={() => setPreferencesOpen((value) => !value)}
            className="h-10 whitespace-nowrap border border-white/10 bg-transparent text-white hover:bg-white/8"
          >
            Preferências
          </Button>
        </div>
      </div>
    </div>
  );
}

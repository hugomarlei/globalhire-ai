"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const key = "globalhire-cookie-consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(window.localStorage.getItem(key) !== "accepted");
  }, []);

  function accept() {
    window.localStorage.setItem(key, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 rounded-lg border border-white/10 bg-[#07120E]/95 p-4 text-sm text-white/72 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between">
        <p>
          Usamos cookies essenciais e tecnologias similares para login, segurança, análise de uso e melhoria da experiência.
          {" "}
          <Link href="/privacidade" className="text-brand-500 hover:text-brand-400">Política de Privacidade</Link>
          {" · "}
          <Link href="/termos" className="text-brand-500 hover:text-brand-400">Termos</Link>
        </p>
        <button onClick={accept} className="focus-ring shrink-0 rounded-md bg-brand-500 px-4 py-2 text-sm font-semibold text-ink hover:bg-brand-600">
          Aceitar
        </button>
      </div>
    </div>
  );
}

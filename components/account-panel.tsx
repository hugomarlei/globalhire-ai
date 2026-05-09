"use client";

import { LogOut, Settings } from "lucide-react";
import { useState } from "react";
import { Button, Card } from "@/components/ui";

export function AccountPanel({
  email,
  planName,
  monthlyLimit,
  subscriptionStatus
}: {
  email: string;
  planName: string;
  monthlyLimit: string;
  subscriptionStatus: string;
}) {
  const [error, setError] = useState("");
  const [loadingPortal, setLoadingPortal] = useState(false);

  async function openPortal() {
    setLoadingPortal(true);
    setError("");
    const response = await fetch("/api/stripe/portal", { method: "POST" });
    const data = await response.json();
    setLoadingPortal(false);

    if (!response.ok) {
      setError(data.error || "Não foi possível abrir o portal de assinatura.");
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <div className="grid size-16 place-items-center rounded-full bg-brand-500 text-2xl font-semibold text-ink">
          {email.slice(0, 2).toUpperCase()}
        </div>
        <h1 className="mt-4 text-2xl font-semibold">Conta</h1>
        <p className="mt-1 text-sm text-white/60">{email}</p>
        <form action="/api/auth/signout" method="post" className="mt-6">
          <Button type="submit" className="w-full border border-white/10 bg-white/8 text-white hover:bg-white/12">
            <LogOut size={17} />
            Sair
          </Button>
        </form>
      </Card>

      <Card>
        <div className="flex items-center gap-2">
          <Settings className="text-brand-500" size={22} />
          <h2 className="text-xl font-semibold">Assinatura e preferências</h2>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-3">
          <div className="rounded-md border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-white/50">Plano atual</p>
            <p className="text-xl font-semibold">{planName}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-white/50">Limite mensal</p>
            <p className="text-xl font-semibold">{monthlyLimit}</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-4">
            <p className="text-sm text-white/50">Status</p>
            <p className="text-xl font-semibold">{subscriptionStatus}</p>
          </div>
        </div>
        {error ? <p className="mt-4 rounded-md bg-coral/15 p-3 text-sm text-coral">{error}</p> : null}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button href="/dashboard#upgrade" className="bg-brand-500 text-white hover:bg-brand-600">Fazer upgrade</Button>
          <Button onClick={openPortal} disabled={loadingPortal} className="border border-white/10 bg-white/8 text-white hover:bg-white/12">
            {loadingPortal ? "Abrindo..." : "Gerenciar assinatura"}
          </Button>
        </div>
      </Card>
    </div>
  );
}

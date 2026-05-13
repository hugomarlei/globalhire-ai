"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import { paidPlans, type PlanId } from "@/lib/plans";
import { trackEvent } from "@/lib/analytics";

export function UpgradePlans({ currentPlan = "free" }: { currentPlan?: PlanId }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    trackEvent("pricing_page_viewed", { current_plan: currentPlan });
  }, [currentPlan]);

  async function checkout(plan: string) {
    setLoading(plan);
    setError("");
    trackEvent("upgrade_clicked", { plan });
    const response = await fetch("/api/stripe/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan })
    });
    const data = await response.json();
    setLoading(null);

    if (!response.ok) {
      setError(data.error || "Não foi possível abrir o checkout.");
      return;
    }

    trackEvent("checkout_started", { plan });
    window.location.href = data.url;
  }

  return (
    <section className="grid gap-4">
      <Card className="border-brand-500/40">
        <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="text-brand-500" size={22} />
              <h3 className="text-xl font-semibold text-ink dark:text-white">ATS Score estimado</h3>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-graphite/65 dark:text-white/65">
              Planos pagos liberam mais gerações, templates sem marca d&apos;água e otimizações por vaga para aumentar o alinhamento com recrutadores e sistemas ATS.
            </p>
          </div>
          <div className="grid min-w-[220px] gap-2 rounded-lg border border-graphite/15 bg-graphite/[0.06] p-4 dark:border-white/10 dark:bg-black/20">
            <div className="flex items-center justify-between text-sm text-graphite/65 dark:text-white/60">
              <span>Plano grátis</span>
              <span>64%</span>
            </div>
            <div className="h-2 rounded-full bg-graphite/15 dark:bg-white/10">
              <div className="h-2 w-[64%] rounded-full bg-graphite/40 dark:bg-white/40" />
            </div>
            <div className="flex items-center justify-between text-sm text-graphite/80 dark:text-white/85">
              <span>Com Pro/Elite</span>
              <span className="font-semibold text-brand-500">92%</span>
            </div>
            <div className="h-2 rounded-full bg-graphite/15 dark:bg-white/10">
              <div className="h-2 w-[92%] rounded-full bg-brand-500" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {paidPlans.map((plan) => (
          <Card key={plan.id} className={`flex h-full flex-col ${plan.id === "pro" ? "border-brand-500/60" : ""}`}>
            <div>
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-xl font-semibold text-ink dark:text-white">{plan.name}</h2>
                {plan.id === "pro" ? <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-500">Recomendado</span> : null}
                {currentPlan === plan.id ? <span className="rounded-full bg-graphite/15 px-3 py-1 text-xs font-semibold text-graphite/70 dark:bg-white/10 dark:text-white/70">Plano atual</span> : null}
              </div>
              <p className="mt-2 text-2xl font-semibold text-ink dark:text-white">{plan.price}</p>
              <p className="mt-1 text-xs text-graphite/50 dark:text-white/45">
                {plan.monthlyLimit >= 9999 ? "Gerações ilimitadas" : `${plan.monthlyLimit} gerações por mês`}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-graphite/75 dark:text-white/70">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="shrink-0 text-mint" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button className="mt-auto w-full bg-brand-500 text-ink hover:bg-brand-600" onClick={() => checkout(plan.id)} disabled={currentPlan === plan.id || loading === plan.id}>
              {loading === plan.id ? <Loader2 className="animate-spin" size={17} /> : null}
              {currentPlan === plan.id ? "Plano atual" : "Assinar"}
            </Button>
          </Card>
        ))}
      </div>
      {error ? <p className="rounded-md bg-coral/15 p-3 text-sm text-coral">{error}</p> : null}
      <p className="text-xs leading-5 text-graphite/50 dark:text-white/45">
        Ao assinar, você concorda com os <Link href="/termos" className="text-graphite/70 underline-offset-2 hover:text-ink dark:text-white/70 dark:hover:text-white">Termos de Uso</Link>, a{" "}
        <Link href="/privacidade" className="text-graphite/70 underline-offset-2 hover:text-ink dark:text-white/70 dark:hover:text-white">Política de Privacidade</Link> e a{" "}
        <Link href="/refund-policy" className="text-graphite/70 underline-offset-2 hover:text-ink dark:text-white/70 dark:hover:text-white">Política de Cancelamento e Reembolso</Link>. Pagamentos são processados pelo Stripe.
      </p>
    </section>
  );
}

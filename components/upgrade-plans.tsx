"use client";

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
              <h3 className="text-xl font-semibold">ATS Score estimado</h3>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-white/65">
              Planos pagos liberam mais gerações, templates sem marca d&apos;água e otimizações por vaga para aumentar o alinhamento com recrutadores e sistemas ATS.
            </p>
          </div>
          <div className="grid min-w-[220px] gap-2 rounded-lg border border-white/10 bg-black/20 p-4">
            <div className="flex items-center justify-between text-sm text-white/60">
              <span>Plano grátis</span>
              <span>64%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <div className="h-2 w-[64%] rounded-full bg-white/40" />
            </div>
            <div className="flex items-center justify-between text-sm text-white/85">
              <span>Com Pro/Elite</span>
              <span className="font-semibold text-brand-500">92%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
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
                <h2 className="text-xl font-semibold">{plan.name}</h2>
                {plan.id === "pro" ? <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-500">Recomendado</span> : null}
                {currentPlan === plan.id ? <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/70">Plano atual</span> : null}
              </div>
              <p className="mt-2 text-2xl font-semibold">{plan.price}</p>
              <p className="mt-1 text-xs text-white/45">
                {plan.monthlyLimit >= 9999 ? "Gerações ilimitadas" : `${plan.monthlyLimit} gerações por mês`}
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
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
    </section>
  );
}

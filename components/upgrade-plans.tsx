"use client";

import Link from "next/link";
import { CheckCircle2, Loader2, TrendingUp } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Card } from "@/components/ui";
import { paidPlans, type PlanId } from "@/lib/plans";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/components/language-provider";
import { upgradePlansCopy } from "@/lib/i18n-account-subscription";
import { getLocalizedPlans } from "@/lib/plan-copy";
import type { StripePriceCatalogJson } from "@/lib/stripe-price-catalog-types";

export function UpgradePlans({
  currentPlan = "free",
  stripeCatalog = null
}: {
  currentPlan?: PlanId;
  stripeCatalog?: StripePriceCatalogJson | null;
}) {
  const { locale } = useLanguage();
  const u = upgradePlansCopy[locale];
  // stripeCatalog null → static fallback prices in getLocalizedPlans; see docs/stripe/DYNAMIC_PRICING_PRODUCTION_DEBUG.md.
  const { paid } = useMemo(() => getLocalizedPlans(locale, stripeCatalog), [locale, stripeCatalog]);
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
      setError(data.error || u.checkoutError);
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
              <h3 className="text-xl font-semibold text-foreground">{u.atsCardTitle}</h3>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{u.atsCardBody}</p>
          </div>
          <div className="grid min-w-[220px] gap-2 rounded-lg border border-border bg-card p-4">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{u.freePlanRow}</span>
              <span>64%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 w-[64%] rounded-full bg-primary/45" />
            </div>
            <div className="flex items-center justify-between text-sm text-foreground">
              <span>{u.withProRow}</span>
              <span className="font-semibold text-brand-500">92%</span>
            </div>
            <div className="h-2 rounded-full bg-muted">
              <div className="h-2 w-[92%] rounded-full bg-brand-500" />
            </div>
          </div>
        </div>
      </Card>

      <div className="grid items-stretch gap-4 lg:grid-cols-3">
        {paidPlans.map((plan) => {
          const localized = paid.find((p) => p.id === plan.id);
          const display = localized || { ...plan, name: plan.name, price: plan.price, features: plan.features };
          return (
            <Card key={plan.id} className={`flex h-full flex-col ${plan.id === "pro" ? "border-brand-500/60" : ""}`}>
              <div>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-xl font-semibold text-foreground">{display.name}</h2>
                  {plan.id === "pro" ? (
                    <span className="rounded-full bg-brand-500/15 px-3 py-1 text-xs font-semibold text-brand-700 dark:text-brand-500">{u.recommended}</span>
                  ) : null}
                  {currentPlan === plan.id ? (
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">{u.currentPlanBadge}</span>
                  ) : null}
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">{display.price}</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {plan.monthlyLimit >= 9999 ? u.generationsUnlimited : u.generationsPerMonth(plan.monthlyLimit)}
                </p>
                <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
                  {display.features.map((feature) => (
                    <li key={feature} className="flex gap-2">
                      <CheckCircle2 className="shrink-0 text-mint" size={16} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              <Button className="mt-auto w-full bg-primary text-primary-foreground hover:brightness-105" onClick={() => checkout(plan.id)} disabled={currentPlan === plan.id || loading === plan.id}>
                {loading === plan.id ? <Loader2 className="animate-spin" size={17} /> : null}
                {currentPlan === plan.id ? u.currentPlanBadge : u.subscribe}
              </Button>
            </Card>
          );
        })}
      </div>
      {error ? <p className="rounded-md bg-coral/15 p-3 text-sm text-coral">{error}</p> : null}
      <p className="text-xs leading-5 text-muted-foreground">
        {u.legalLinePrefix}{" "}
        <Link href="/termos" className="text-muted-foreground underline-offset-2 hover:text-foreground">
          {u.legalTerms}
        </Link>
        {u.legalMid1}{" "}
        <Link href="/privacidade" className="text-muted-foreground underline-offset-2 hover:text-foreground">
          {u.legalPrivacy}
        </Link>
        {u.legalMid2}{" "}
        <Link href="/refund-policy" className="text-muted-foreground underline-offset-2 hover:text-foreground">
          {u.legalRefund}
        </Link>
        {u.legalStripe}
      </p>
    </section>
  );
}

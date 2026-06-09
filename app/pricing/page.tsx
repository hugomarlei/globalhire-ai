import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ShieldCheck } from "lucide-react";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { PublicBand, PublicCard, PublicKicker, PublicPageShell, PublicSection } from "@/components/public-page-shell";
import { Button } from "@/components/ui";
import { getAppUrl } from "@/lib/app-url";
import { marketingPricingCopy } from "@/lib/i18n-app-wide";
import { getLocalizedPlans } from "@/lib/plan-copy";
import { getServerLocale } from "@/lib/server-locale";

/** Same as home: pricing must not stay stuck on build-time fallback when Stripe/env recovers. */
export const revalidate = 300;
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = marketingPricingCopy[locale];
  return {
    title: `${t.title} | GlobalHire AI`,
    description: "Planos GlobalHire AI, gerações com IA, ATS Score e exportação PDF.",
    alternates: { canonical: `${getAppUrl()}/pricing` }
  };
}

export default async function PricingPage() {
  const locale = await getServerLocale();
  const t = marketingPricingCopy[locale];
  const { free, paid } = getLocalizedPlans(locale);
  return (
    <PublicPageShell>
      <PublicNav />
      <PublicSection className="pb-10">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div>
            <PublicKicker>Preço de lançamento</PublicKicker>
            <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">
              {t.title}
            </h1>
          </div>
          <p className="max-w-2xl text-base leading-8 text-muted-foreground">{t.lead}</p>
        </div>
      </PublicSection>

      <PublicBand tone="dark">
        <div className="grid gap-4 lg:grid-cols-4">
          {[free, ...paid].map((plan) => (
            <PublicCard
              key={plan.id}
              dark
              className={plan.id === "pro" ? "border-teal-300/45 bg-teal-300/[0.075]" : ""}
            >
              {plan.id === "pro" ? <p className="mb-3 text-sm font-semibold text-teal-300">Mais equilibrado</p> : null}
              <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-3 text-4xl font-semibold text-white">{plan.price}</p>
              <ul className="mt-6 grid gap-3 text-sm text-zinc-300">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-teal-300" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button href="/cadastro" className="mt-7 w-full">
                {t.cta} <ArrowRight size={16} />
              </Button>
            </PublicCard>
          ))}
        </div>
      </PublicBand>

      <PublicSection className="pt-10">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <PublicCard>
            <div className="flex gap-3">
              <ShieldCheck className="mt-0.5 shrink-0 text-primary" size={20} />
              <div>
                <h2 className="font-semibold text-foreground">Transparência antes de assinar</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Os planos pagos são processados pelo Stripe. Os valores exibidos são os preços oficiais de lançamento da GlobalHire AI.
                </p>
              </div>
            </div>
          </PublicCard>
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-5 text-muted-foreground">
          {t.stripeNotePrefix}{" "}
          <Link href="/termos" className="font-medium text-primary underline-offset-2 hover:underline">
            {t.terms}
          </Link>
          {t.mid}{" "}
          <Link href="/privacidade" className="font-medium text-primary underline-offset-2 hover:underline">
            {t.privacy}
          </Link>
          {t.mid2}{" "}
          <Link href="/refund-policy" className="font-medium text-primary underline-offset-2 hover:underline">
            {t.refund}
          </Link>
          {t.suffix}
        </p>
      </PublicSection>
      <AutoSiteFooter />
    </PublicPageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { Button, Card } from "@/components/ui";
import { getAppUrl } from "@/lib/app-url";
import { marketingPricingCopy } from "@/lib/i18n-app-wide";
import { paidPlans, plans } from "@/lib/plans";
import { getServerLocale } from "@/lib/server-locale";

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
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicNav />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold text-foreground">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{t.lead}</p>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {[plans.free, ...paidPlans].map((plan) => (
            <Card key={plan.id} className={plan.id === "pro" ? "border-brand-500/60" : ""}>
              <h2 className="text-xl font-semibold text-foreground">{plan.name}</h2>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <ul className="mt-5 grid gap-2 text-sm text-muted-foreground">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-brand-500" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button href="/cadastro" className="mt-6 w-full">
                {t.cta}
              </Button>
            </Card>
          ))}
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
      </section>
      <AutoSiteFooter />
    </main>
  );
}

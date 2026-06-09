import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { PublicBand, PublicCard, PublicKicker, PublicPageShell, PublicSection } from "@/components/public-page-shell";
import { getAppUrl } from "@/lib/app-url";
import { marketingFeaturesCopy } from "@/lib/i18n-app-wide";
import { getServerLocale } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = marketingFeaturesCopy[locale];
  return {
    title: `${t.title} | GlobalHire AI`,
    description: t.lead,
    alternates: { canonical: `${getAppUrl()}/features` }
  };
}

export default async function FeaturesPage() {
  const locale = await getServerLocale();
  const t = marketingFeaturesCopy[locale];
  return (
    <PublicPageShell>
      <PublicNav />
      <PublicSection>
        <PublicKicker>Funcionalidades</PublicKicker>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">{t.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{t.lead}</p>
      </PublicSection>
      <PublicBand tone="dark">
        <div className="grid gap-3 md:grid-cols-2">
          {t.items.map((feature) => (
            <PublicCard key={feature} dark>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-teal-300" size={20} />
                <h2 className="font-semibold text-white">{feature}</h2>
              </div>
            </PublicCard>
          ))}
        </div>
      </PublicBand>
      <AutoSiteFooter />
    </PublicPageShell>
  );
}

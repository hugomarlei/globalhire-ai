import type { Metadata } from "next";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { PublicBand, PublicCard, PublicKicker, PublicPageShell, PublicSection } from "@/components/public-page-shell";
import { getAppUrl } from "@/lib/app-url";
import { marketingResourcesCopy } from "@/lib/i18n-app-wide";
import { getServerLocale } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = marketingResourcesCopy[locale];
  return {
    title: `${t.title} | GlobalHire AI`,
    description: t.lead,
    alternates: { canonical: `${getAppUrl()}/resources` }
  };
}

export default async function ResourcesPage() {
  const locale = await getServerLocale();
  const t = marketingResourcesCopy[locale];
  return (
    <PublicPageShell>
      <PublicNav />
      <PublicSection>
        <PublicKicker>Recursos</PublicKicker>
        <h1 className="mt-3 max-w-3xl text-4xl font-semibold leading-tight text-foreground sm:text-5xl">{t.title}</h1>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted-foreground">{t.lead}</p>
      </PublicSection>
      <PublicBand>
        <div className="grid gap-4 md:grid-cols-3">
          {t.cards.map((card) => (
            <PublicCard key={card.title}>
              <h2 className="font-semibold text-foreground">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{card.body}</p>
            </PublicCard>
          ))}
        </div>
      </PublicBand>
      <AutoSiteFooter />
    </PublicPageShell>
  );
}

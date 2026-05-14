import type { Metadata } from "next";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";
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
    <main className="min-h-screen bg-background text-foreground">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold text-foreground">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{t.lead}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {t.cards.map((card) => (
            <Card key={card.title}>
              <h2 className="font-semibold text-foreground">{card.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{card.body}</p>
            </Card>
          ))}
        </div>
      </section>
      <AutoSiteFooter />
    </main>
  );
}

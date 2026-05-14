import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";
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
    <main className="min-h-screen bg-background text-foreground">
      <PublicNav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold text-foreground">{t.title}</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{t.lead}</p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {t.items.map((feature) => (
            <Card key={feature}>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-brand-500" size={20} />
                <h2 className="font-semibold text-foreground">{feature}</h2>
              </div>
            </Card>
          ))}
        </div>
      </section>
      <AutoSiteFooter />
    </main>
  );
}

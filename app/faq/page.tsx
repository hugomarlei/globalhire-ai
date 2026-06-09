import type { Metadata } from "next";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { FaqStructuredData } from "@/components/structured-data";
import { PublicCard, PublicKicker, PublicPageShell, PublicSection } from "@/components/public-page-shell";
import { getAppUrl } from "@/lib/app-url";
import { marketingFaqCopy } from "@/lib/i18n-app-wide";
import { getServerLocale } from "@/lib/server-locale";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const t = marketingFaqCopy[locale];
  return {
    title: `${t.title} | GlobalHire AI`,
    description: "Perguntas frequentes sobre GlobalHire AI, ATS Score, currículos internacionais, upload PDF/DOCX e cancelamento de assinatura.",
    alternates: { canonical: `${getAppUrl()}/faq` }
  };
}

export default async function FaqPage() {
  const locale = await getServerLocale();
  const faq = marketingFaqCopy[locale];
  return (
    <PublicPageShell>
      <FaqStructuredData items={faq.items} />
      <PublicNav />
      <PublicSection className="max-w-4xl">
        <PublicKicker>FAQ</PublicKicker>
        <h1 className="mt-3 text-4xl font-semibold leading-tight text-foreground sm:text-5xl">{faq.title}</h1>
        <div className="mt-8 grid gap-3">
          {faq.items.map(([question, answer]) => (
            <PublicCard key={question}>
              <h2 className="font-semibold text-foreground">{question}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
            </PublicCard>
          ))}
        </div>
      </PublicSection>
      <AutoSiteFooter />
    </PublicPageShell>
  );
}

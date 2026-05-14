import type { Metadata } from "next";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { FaqStructuredData } from "@/components/structured-data";
import { Card } from "@/components/ui";
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
    <main className="min-h-screen bg-background text-foreground">
      <FaqStructuredData items={faq.items} />
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold text-foreground">{faq.title}</h1>
        <div className="mt-8 grid gap-3">
          {faq.items.map(([question, answer]) => (
            <Card key={question}>
              <h2 className="font-semibold text-foreground">{question}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{answer}</p>
            </Card>
          ))}
        </div>
      </section>
      <AutoSiteFooter />
    </main>
  );
}

import type { Metadata } from "next";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { FaqStructuredData } from "@/components/structured-data";
import { Card } from "@/components/ui";
import { getAppUrl } from "@/lib/app-url";

const faqs = [
  ["A análise ATS é garantia de aprovação?", "Não. É uma estimativa automatizada para orientar melhorias."],
  ["Posso usar para vagas internacionais?", "Sim. O produto permite selecionar idioma, país-alvo e tipo de entrega."],
  ["Quais formatos de upload são aceitos?", "PDF e DOCX com texto selecionável. PDFs escaneados podem exigir colagem manual."],
  ["Como cancelo?", "Acesse Assinatura e use o portal seguro de pagamentos Stripe."]
];

export const metadata: Metadata = {
  title: "FAQ | GlobalHire AI",
  description: "Perguntas frequentes sobre GlobalHire AI, ATS Score, currículos internacionais, upload PDF/DOCX e cancelamento de assinatura.",
  alternates: {
    canonical: `${getAppUrl()}/faq`
  }
};

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <FaqStructuredData items={faqs as Array<[string, string]>} />
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold text-foreground">FAQ</h1>
        <div className="mt-8 grid gap-3">
          {faqs.map(([question, answer]) => (
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

import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

const faqs = [
  ["A análise ATS é garantia de aprovação?", "Não. É uma estimativa automatizada para orientar melhorias."],
  ["Posso usar para vagas internacionais?", "Sim. O produto permite selecionar idioma, país-alvo e tipo de entrega."],
  ["Quais formatos de upload são aceitos?", "PDF e DOCX com texto selecionável. PDFs escaneados podem exigir colagem manual."],
  ["Como cancelo?", "Acesse Assinatura e use o portal seguro de pagamentos Stripe."]
];

export default function FaqPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold">FAQ</h1>
        <div className="mt-8 grid gap-3">
          {faqs.map(([question, answer]) => (
            <Card key={question}>
              <h2 className="font-semibold">{question}</h2>
              <p className="mt-2 text-sm leading-6 text-white/65">{answer}</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

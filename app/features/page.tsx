import { CheckCircle2 } from "lucide-react";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

const features = [
  "Otimização de currículo ATS por vaga",
  "Carta de apresentação adaptada",
  "Resumo LinkedIn profissional",
  "Mensagem para recrutador",
  "Preparação para entrevista",
  "Tradução e adaptação internacional",
  "ATS Score e palavras-chave"
];

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicNav />
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold text-foreground">Features</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
          GlobalHire AI combina ATS resume optimizer e AI career copilot para candidatos globais.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {features.map((feature) => (
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

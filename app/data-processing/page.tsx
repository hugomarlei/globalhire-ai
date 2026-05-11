import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

export default function DataProcessingPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-500">GlobalHire AI</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Tratamento de Dados</h1>
          <p className="mt-4 text-sm leading-7 text-white/68">
            A GlobalHire AI processa dados profissionais enviados pelo usuário para entregar funcionalidades de IA,
            análise ATS, histórico, autenticação e assinatura. Provedores envolvidos podem incluir Supabase, Vercel,
            Stripe, Groq, Cloudflare, Microsoft Clarity e PostHog, conforme configuração e consentimento.
          </p>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Recomendamos não enviar dados sensíveis desnecessários no currículo. Solicitações LGPD podem ser enviadas
            para privacy@globalhireai.com.br.
          </p>
        </Card>
      </section>
    </main>
  );
}

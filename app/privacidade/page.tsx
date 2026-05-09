import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card>
          <h1 className="text-3xl font-semibold">Política de privacidade</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Placeholder jurídico. Antes do lançamento público, detalhe coleta de dados, currículos enviados, provedores usados
            (Supabase, Stripe, Groq), retenção, exclusão, cookies, analytics e direitos do usuário.
          </p>
        </Card>
      </section>
    </main>
  );
}

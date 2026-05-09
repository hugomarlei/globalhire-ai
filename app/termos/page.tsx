import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-3xl px-4 py-12">
        <Card>
          <h1 className="text-3xl font-semibold">Termos de uso</h1>
          <p className="mt-4 text-sm leading-6 text-white/65">
            Placeholder jurídico. Antes do lançamento público, substitua este texto por termos revisados por profissional jurídico,
            incluindo assinatura, cancelamento, uso de IA, limitações de responsabilidade e política de reembolso.
          </p>
        </Card>
      </section>
    </main>
  );
}

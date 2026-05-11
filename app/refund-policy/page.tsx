import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

export default function RefundPolicyPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-8">
          <p className="text-sm font-semibold text-brand-500">GlobalHire AI</p>
          <h1 className="mt-3 text-3xl font-semibold sm:text-4xl">Cancelamento e Reembolso</h1>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Assinaturas podem ser gerenciadas pelo portal de pagamentos Stripe, quando disponível na conta. O
            cancelamento interrompe renovações futuras e mantém o acesso até o fim do período já pago, salvo regra
            diferente exibida no checkout.
          </p>
          <p className="mt-4 text-sm leading-7 text-white/68">
            Reembolsos devem ser solicitados pelo suporte em contato@globalhireai.com.br e serão avaliados caso a caso,
            considerando falha técnica, cobrança duplicada ou impossibilidade comprovada de uso. Esta página é uma
            política inicial de MVP e deve ser revisada juridicamente antes da operação pública em escala.
          </p>
        </Card>
      </section>
    </main>
  );
}

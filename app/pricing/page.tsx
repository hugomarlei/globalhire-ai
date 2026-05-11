import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { PublicNav } from "@/components/nav";
import { Button, Card } from "@/components/ui";
import { paidPlans, plans } from "@/lib/plans";

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold">Planos GlobalHire AI</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
          Escolha entre uma degustação gratuita, uso pontual ou otimização intensiva para candidaturas internacionais.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-4">
          {[plans.free, ...paidPlans].map((plan) => (
            <Card key={plan.id} className={plan.id === "pro" ? "border-brand-500/60" : ""}>
              <h2 className="text-xl font-semibold">{plan.name}</h2>
              <p className="mt-2 text-3xl font-semibold">{plan.price}</p>
              <ul className="mt-5 grid gap-2 text-sm text-white/70">
                {plan.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 shrink-0 text-brand-500" size={16} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Button href="/cadastro" className="mt-6 w-full">Começar</Button>
            </Card>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-xs leading-5 text-white/45">
          Planos pagos são processados pelo Stripe. Antes de assinar, leia os <Link href="/termos" className="text-white/70 hover:text-white">Termos de Uso</Link>, a{" "}
          <Link href="/privacidade" className="text-white/70 hover:text-white">Política de Privacidade</Link> e a{" "}
          <Link href="/refund-policy" className="text-white/70 hover:text-white">Política de Cancelamento e Reembolso</Link>.
        </p>
      </section>
    </main>
  );
}

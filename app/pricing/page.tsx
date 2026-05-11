import { CheckCircle2 } from "lucide-react";
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
      </section>
    </main>
  );
}

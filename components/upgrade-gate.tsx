import { LockKeyhole, Sparkles } from "lucide-react";
import { Button, Card } from "@/components/ui";

export function UpgradeGate({
  title,
  description,
  requiredPlan
}: {
  title: string;
  description: string;
  requiredPlan: string;
}) {
  return (
    <Card className="border-brand-500/35">
      <div className="grid gap-4 py-6 text-center">
        <div className="mx-auto grid size-14 place-items-center rounded-full bg-brand-500/15 text-brand-500">
          <LockKeyhole size={26} />
        </div>
        <div>
          <p className="text-sm font-semibold text-brand-500">{requiredPlan}</p>
          <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-white/60">{description}</p>
        </div>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/assinatura#planos" className="bg-brand-500 text-ink hover:bg-brand-600">
            <Sparkles size={17} />
            Ver planos
          </Button>
          <Button href="/dashboard" className="border border-white/10 bg-white/8 text-white hover:bg-white/12">
            Voltar ao dashboard
          </Button>
        </div>
      </div>
    </Card>
  );
}

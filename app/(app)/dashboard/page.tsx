import { BarChart3, BriefcaseBusiness, CreditCard, Gauge, Shield, Target } from "lucide-react";
import { DashboardGenerator } from "@/components/dashboard-generator";
import { UpgradePlans } from "@/components/upgrade-plans";
import { Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { effectivePlanId, hasAdminBypass, plans } from "@/lib/plans";

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  const isBypassAccount = hasAdminBypass(profile?.email || user.email);
  const plan = plans[effectivePlanId(profile?.plan, profile?.email || user.email)] || plans.free;

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CreditCard className="text-brand-500" size={22} />
          <p className="mt-3 text-sm text-white/50">Plano atual</p>
          <p className="text-2xl font-semibold">{isBypassAccount ? "Elite teste" : plan.name}</p>
        </Card>
        <Card>
          <Gauge className="text-mint" size={22} />
          <p className="mt-3 text-sm text-white/50">Limite mensal</p>
          <p className="text-2xl font-semibold">{plan.monthlyLimit >= 9999 ? "Ilimitado" : plan.monthlyLimit}</p>
        </Card>
        <Card>
          <Shield className="text-coral" size={22} />
          <p className="mt-3 text-sm text-white/50">Conta</p>
          <p className="text-2xl font-semibold">Protegida</p>
        </Card>
      </div>
      {isBypassAccount ? (
        <Card className="border-brand-500/60">
          <p className="text-sm font-semibold text-brand-50">Bypass administrativo ativo</p>
          <p className="mt-2 text-sm text-white/65">
            Este e-mail pode testar gerações ilimitadas e exportar PDF sem marca d'água antes da publicação.
          </p>
        </Card>
      ) : null}
      <Card>
        <div className="flex items-center gap-2">
          <BarChart3 className="text-brand-500" size={22} />
          <h2 className="text-xl font-semibold">Inteligência de candidatura</h2>
        </div>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Acompanhe indicadores para decidir onde aplicar, quais setores priorizar e como melhorar o alinhamento por vaga.
        </p>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <div className="rounded-md border border-white/10 bg-black/20 p-4">
            <Target className="text-mint" size={18} />
            <p className="mt-3 text-sm text-white/50">ATS Score médio</p>
            <p className="text-2xl font-semibold">82%</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-4">
            <BriefcaseBusiness className="text-brand-500" size={18} />
            <p className="mt-3 text-sm text-white/50">Setores mapeados</p>
            <p className="text-2xl font-semibold">Tech, Produto, Marketing</p>
          </div>
          <div className="rounded-md border border-white/10 bg-black/20 p-4">
            <Gauge className="text-mint" size={18} />
            <p className="mt-3 text-sm text-white/50">Melhoria média por vaga</p>
            <p className="text-2xl font-semibold">+27%</p>
          </div>
        </div>
      </Card>
      <DashboardGenerator hasPaidPlan={plan.id !== "free"} />
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Upgrade de plano</h2>
        <UpgradePlans />
      </div>
    </div>
  );
}

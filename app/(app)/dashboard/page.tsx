import { BarChart3, BriefcaseBusiness, CreditCard, Gauge, Shield, Target } from "lucide-react";
import { DashboardGenerator } from "@/components/dashboard-generator";
import { UpgradePlans } from "@/components/upgrade-plans";
import { Card } from "@/components/ui";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { effectivePlanId, hasAdminBypass, plans } from "@/lib/plans";
import Link from "next/link";

export default async function DashboardPage() {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const isBypassAccount = hasAdminBypass(profile?.email || user.email);
  const plan = plans[effectivePlanId(profile?.plan, profile?.email || user.email)] || plans.free;
  const since = new Date();
  since.setDate(1);
  since.setHours(0, 0, 0, 0);
  const [{ count }, { data: latest }] = await Promise.all([
    supabase.from("generations").select("id", { count: "exact", head: true }).eq("user_id", user.id).gte("created_at", since.toISOString()),
    supabase.from("generations").select("id,type,language,created_at").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3)
  ]);
  const used = count || 0;
  const usagePercent = plan.monthlyLimit >= 9999 ? 100 : Math.min(100, Math.round((used / plan.monthlyLimit) * 100));

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
          <p className="mt-3 text-sm text-white/50">Uso mensal</p>
          <p className="text-2xl font-semibold">{used}/{plan.monthlyLimit >= 9999 ? "∞" : plan.monthlyLimit}</p>
          <div className="mt-3 h-2 rounded-full bg-white/10">
            <div className="h-2 rounded-full bg-brand-500" style={{ width: `${usagePercent}%` }} />
          </div>
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
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <h2 className="text-xl font-semibold">Quick actions</h2>
          <div className="mt-4 grid gap-2">
            <Link href="/ats-score" className="rounded-md border border-white/10 p-3 text-sm text-white/75 hover:bg-white/8">Analisar ATS Score</Link>
            <Link href="/historico" className="rounded-md border border-white/10 p-3 text-sm text-white/75 hover:bg-white/8">Ver histórico</Link>
            <Link href="/assinatura" className="rounded-md border border-white/10 p-3 text-sm text-white/75 hover:bg-white/8">Comparar planos</Link>
          </div>
        </Card>
        <Card>
          <h2 className="text-xl font-semibold">Últimas gerações</h2>
          <div className="mt-4 grid gap-2">
            {(latest || []).map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-md border border-white/10 p-3 text-sm text-white/70">
                <span>{item.type} · {item.language}</span>
                <span className="text-white/40">{new Date(item.created_at).toLocaleDateString("pt-BR")}</span>
              </div>
            ))}
            {!latest?.length ? <p className="text-sm text-white/50">Gere seu primeiro documento para preencher esta área.</p> : null}
          </div>
        </Card>
      </div>
      <DashboardGenerator hasPaidPlan={plan.id !== "free"} />
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Upgrade de plano</h2>
        <UpgradePlans currentPlan={plan.id} />
      </div>
    </div>
  );
}

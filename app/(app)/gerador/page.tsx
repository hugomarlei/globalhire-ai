import { DashboardGenerator } from "@/components/dashboard-generator";
import { requireUser } from "@/lib/auth";
import { effectivePlanId, plans } from "@/lib/plans";

export default async function GeneratorPage() {
  const { user, profile } = await requireUser();
  const plan = plans[effectivePlanId(profile?.plan, profile?.email || user.email)] || plans.free;

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-3xl font-semibold">Gerador</h1>
        <p className="mt-2 text-sm text-white/60">Crie currículos, cartas, LinkedIn, mensagens e preparação para entrevistas.</p>
      </div>
      <DashboardGenerator hasPaidPlan={plan.id !== "free"} />
    </div>
  );
}

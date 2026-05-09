import { DashboardGenerator } from "@/components/dashboard-generator";
import { requireUser } from "@/lib/auth";
import { effectivePlanId, plans } from "@/lib/plans";
import type { GenerationType } from "@/lib/types";

const generationTypes: GenerationType[] = ["ats_resume", "cover_letter", "linkedin_summary", "recruiter_message", "interview_prep", "translate_resume"];

export default async function GeneratorPage({ searchParams }: { searchParams?: Promise<{ tipo?: string }> }) {
  const { user, profile } = await requireUser();
  const plan = plans[effectivePlanId(profile?.plan, profile?.email || user.email)] || plans.free;
  const params = searchParams ? await searchParams : {};
  const initialType = generationTypes.includes(params.tipo as GenerationType) ? params.tipo as GenerationType : undefined;

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-3xl font-semibold">Gerador</h1>
        <p className="mt-2 text-sm text-white/60">Crie currículos, cartas, LinkedIn, mensagens e preparação para entrevistas.</p>
      </div>
      <DashboardGenerator hasPaidPlan={plan.id !== "free"} initialType={initialType} />
    </div>
  );
}

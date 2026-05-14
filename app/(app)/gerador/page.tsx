import { DashboardGenerator } from "@/components/dashboard-generator";
import { UpgradeGate } from "@/components/upgrade-gate";
import { requireUser } from "@/lib/auth";
import { allowedGenerationTypes, canUseFeature, effectivePlanFromSubscription, featureMinimumPlan, plans } from "@/lib/plans";
import { createClient } from "@/lib/supabase-server";
import { getLatestActiveSubscription } from "@/lib/subscription-state";
import type { GenerationType } from "@/lib/types";
import { planUpgradeCopy } from "@/lib/i18n-account-subscription";
import { getGeneratorUi } from "@/lib/i18n-generator";
import { getLocalizedPlanRow } from "@/lib/plan-copy";
import { getServerLocale } from "@/lib/server-locale";

export const dynamic = "force-dynamic";

const generationTypes: GenerationType[] = ["ats_resume", "cover_letter", "linkedin_summary", "recruiter_message", "interview_prep", "translate_resume"];

export default async function GeneratorPage({ searchParams }: { searchParams?: Promise<{ tipo?: string }> }) {
  const locale = await getServerLocale();
  const u = planUpgradeCopy[locale];
  const genUi = getGeneratorUi(locale);
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const subscription = await getLatestActiveSubscription(supabase, user.id);
  const planId = effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, profile?.email || user.email);
  const plan = plans[planId] || plans.free;
  const params = searchParams ? await searchParams : {};
  const initialType = generationTypes.includes(params.tipo as GenerationType) ? (params.tipo as GenerationType) : undefined;
  const selectedType = initialType || "ats_resume";
  const context = genUi.byType[selectedType];
  const allowedTypes = allowedGenerationTypes(planId);

  if (!canUseFeature(planId, selectedType)) {
    const requiredPlan = getLocalizedPlanRow(locale, featureMinimumPlan[selectedType]).name;
    return (
      <UpgradeGate
        requiredPlan={u.fromPlan(requiredPlan)}
        title={u.toolNotInPlanTitle(context.title)}
        description={u.toolNotInPlanBody}
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{context.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{context.subtitle}</p>
      </div>
      <DashboardGenerator hasPaidPlan={plan.id !== "free"} initialType={selectedType} allowedTypes={allowedTypes} />
    </div>
  );
}

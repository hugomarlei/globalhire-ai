import { AtsAnalyzer } from "@/components/ats-analyzer";
import { UpgradeGate } from "@/components/upgrade-gate";
import { requireUser } from "@/lib/auth";
import { canUseFeature, effectivePlanFromSubscription } from "@/lib/plans";
import { createClient } from "@/lib/supabase-server";
import { getLatestActiveSubscription } from "@/lib/subscription-state";
import { planUpgradeCopy } from "@/lib/i18n-account-subscription";
import { getLocalizedPlanRow } from "@/lib/plan-copy";
import { getServerLocale } from "@/lib/server-locale";

export const dynamic = "force-dynamic";

export default async function AtsScorePage({ searchParams }: { searchParams?: Promise<{ modo?: string }> }) {
  const locale = await getServerLocale();
  const u = planUpgradeCopy[locale];
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const subscription = await getLatestActiveSubscription(supabase, user.id);
  const planId = effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, profile?.email || user.email);
  if (!canUseFeature(planId, "ats_score")) {
    const proName = getLocalizedPlanRow(locale, "pro").name;
    return (
      <UpgradeGate requiredPlan={u.fromPlan(proName)} title={u.atsScoreProTitle} description={u.atsScoreProBody} />
    );
  }
  const params = searchParams ? await searchParams : {};
  return <AtsAnalyzer mode={params.modo === "keywords" ? "keywords" : "score"} />;
}

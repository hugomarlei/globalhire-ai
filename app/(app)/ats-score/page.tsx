import { AtsAnalyzer } from "@/components/ats-analyzer";
import { UpgradeGate } from "@/components/upgrade-gate";
import { requireUser } from "@/lib/auth";
import { canUseFeature, effectivePlanId } from "@/lib/plans";

export default async function AtsScorePage({ searchParams }: { searchParams?: Promise<{ modo?: string }> }) {
  const { user, profile } = await requireUser();
  const planId = effectivePlanId(profile?.plan, profile?.email || user.email);
  if (!canUseFeature(planId, "ats_score")) {
    return (
      <UpgradeGate
        requiredPlan="Disponível a partir do plano Pro"
        title="ATS Score é uma ferramenta Pro"
        description="As análises de compatibilidade, palavras-chave e otimização a partir do score fazem parte do plano Pro e Elite."
      />
    );
  }
  const params = searchParams ? await searchParams : {};
  return <AtsAnalyzer mode={params.modo === "keywords" ? "keywords" : "score"} />;
}

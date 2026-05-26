import { NextResponse } from "next/server";
import type { createClient } from "@/lib/supabase-server";
import { canUseFeature, effectivePlanFromSubscription, featureMinimumPlan, plans, type PlanFeature } from "@/lib/plans";
import { getLatestActiveSubscription } from "@/lib/subscription-state";

type Supabase = Awaited<ReturnType<typeof createClient>>;

export async function assertResumeAiAccess(supabase: Supabase, user: { id: string; email?: string | null }, feature: PlanFeature) {
  const [{ data: profile }, subscription] = await Promise.all([
    supabase.from("profiles").select("plan,is_blocked").eq("id", user.id).single(),
    getLatestActiveSubscription(supabase, user.id)
  ]);

  if (profile?.is_blocked) return NextResponse.json({ error: "Conta bloqueada." }, { status: 403 });

  const planId = effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, user.email);
  if (!canUseFeature(planId, feature)) {
    return NextResponse.json({
      error: `Este recurso esta disponivel a partir do plano ${plans[featureMinimumPlan[feature]].name}.`
    }, { status: 403 });
  }

  return null;
}

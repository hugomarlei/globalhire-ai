import type { SupabaseClient } from "@supabase/supabase-js";
import type { PlanId } from "@/lib/plans";

export type ActiveSubscription = {
  plan: PlanId | string | null;
  status: string | null;
  current_period_end?: string | null;
  updated_at?: string | null;
  created_at?: string | null;
};

export async function getLatestActiveSubscription(supabase: SupabaseClient, userId: string): Promise<ActiveSubscription | null> {
  const { data, error }: { data: ActiveSubscription[] | null; error: { message: string } | null } = await supabase
    .from("subscriptions")
    .select("plan,status,current_period_end,updated_at,created_at")
    .eq("user_id", userId)
    .in("status", ["active", "trialing"])
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error("active_subscription_select_failed", {
      userId,
      error: error.message
    });
    return null;
  }

  const subscription = data?.[0] || null;

  if (subscription) {
    console.log("active_subscription_selected", {
      userId,
      plan: subscription.plan,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end || null
    });
  }

  return subscription;
}

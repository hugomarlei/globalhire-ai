import { AccountPanel } from "@/components/account-panel";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { effectivePlanFromSubscription, plans } from "@/lib/plans";
import { getLatestActiveSubscription } from "@/lib/subscription-state";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const subscription = await getLatestActiveSubscription(supabase, user.id);
  const plan = plans[effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, user.email)] || plans.free;

  return (
    <AccountPanel
      email={user.email || ""}
      planId={plan.id}
      monthlyLimitValue={plan.monthlyLimit}
      subscriptionStatus={subscription?.status || "free"}
      currentPeriodEnd={subscription?.current_period_end}
    />
  );
}

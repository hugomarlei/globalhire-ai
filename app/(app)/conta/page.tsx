import { AccountPanel } from "@/components/account-panel";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { effectivePlanId, plans } from "@/lib/plans";

export default async function AccountPage() {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();
  const plan = plans[effectivePlanId(profile?.plan, user.email)] || plans.free;

  return (
    <AccountPanel
      email={user.email || ""}
      planName={plan.name}
      monthlyLimit={plan.monthlyLimit >= 9999 ? "Ilimitado" : String(plan.monthlyLimit)}
      subscriptionStatus={subscription?.status || "free"}
    />
  );
}

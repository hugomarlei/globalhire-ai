import { AccountPanel } from "@/components/account-panel";
import { UpgradePlans } from "@/components/upgrade-plans";
import { requireUser } from "@/lib/auth";
import { effectivePlanId, plans } from "@/lib/plans";
import { createClient } from "@/lib/supabase-server";

export default async function SubscriptionPage() {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("status,current_period_end")
    .eq("user_id", user.id)
    .maybeSingle();
  const plan = plans[effectivePlanId(profile?.plan, user.email)] || plans.free;

  return (
    <div className="grid gap-8">
      <AccountPanel
        email={user.email || ""}
        planName={plan.name}
        monthlyLimit={plan.monthlyLimit >= 9999 ? "Ilimitado" : String(plan.monthlyLimit)}
        subscriptionStatus={subscription?.status || "free"}
        currentPeriodEnd={subscription?.current_period_end}
        initialTab="subscription"
      />
      <section id="planos" className="scroll-mt-28 grid gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Comparar planos</h2>
          <p className="mt-2 text-sm text-white/60">Escolha o plano ideal sem perder seu histórico ou configurações.</p>
        </div>
        <UpgradePlans currentPlan={plan.id} />
      </section>
    </div>
  );
}

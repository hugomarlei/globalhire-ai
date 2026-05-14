import { AccountPanel } from "@/components/account-panel";
import { UpgradePlans } from "@/components/upgrade-plans";
import { requireUser } from "@/lib/auth";
import { effectivePlanFromSubscription, plans } from "@/lib/plans";
import { createClient } from "@/lib/supabase-server";
import { getLatestActiveSubscription } from "@/lib/subscription-state";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const subscription = await getLatestActiveSubscription(supabase, user.id);
  const plan = plans[effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, user.email)] || plans.free;

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
          <h2 className="text-2xl font-semibold text-foreground">Comparar planos</h2>
          <p className="mt-2 text-sm text-muted-foreground">Escolha o plano ideal sem perder seu histórico ou configurações.</p>
        </div>
        <UpgradePlans currentPlan={plan.id} />
      </section>
    </div>
  );
}

import { AccountPanel } from "@/components/account-panel";
import { UpgradePlans } from "@/components/upgrade-plans";
import { requireUser } from "@/lib/auth";
import { effectivePlanFromSubscription, plans } from "@/lib/plans";
import { createClient } from "@/lib/supabase-server";
import { getLatestActiveSubscription } from "@/lib/subscription-state";
import { subscriptionPageCopy } from "@/lib/i18n-account-subscription";
import { getServerLocale } from "@/lib/server-locale";

export const dynamic = "force-dynamic";

export default async function SubscriptionPage() {
  const locale = await getServerLocale();
  const s = subscriptionPageCopy[locale];
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const subscription = await getLatestActiveSubscription(supabase, user.id);
  const plan = plans[effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, user.email)] || plans.free;

  return (
    <div className="grid gap-8">
      <AccountPanel
        email={user.email || ""}
        planId={plan.id}
        monthlyLimitValue={plan.monthlyLimit}
        subscriptionStatus={subscription?.status || "free"}
        currentPeriodEnd={subscription?.current_period_end}
        initialTab="subscription"
      />
      <section id="planos" className="scroll-mt-28 grid gap-3">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{s.compareTitle}</h2>
          <p className="mt-2 text-sm text-muted-foreground">{s.compareLead}</p>
        </div>
        <UpgradePlans currentPlan={plan.id} />
      </section>
    </div>
  );
}

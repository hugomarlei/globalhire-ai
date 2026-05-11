import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { getPlanFromStripePriceId, type PlanId } from "@/lib/plans";
import type { createAdminClient } from "@/lib/supabase-server";

type AdminClient = ReturnType<typeof createAdminClient>;

type SyncInput = {
  supabase: AdminClient;
  subscription: Stripe.Subscription;
  userId?: string | null;
  customerId?: string | null;
  source: string;
};

type SubscriptionPayload = {
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string;
  stripe_price_id: string | null;
  plan?: PlanId;
  status: string;
  current_period_start: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
};

function withoutOptionalSyncFields(payload: SubscriptionPayload) {
  const fallbackPayload: Partial<SubscriptionPayload> = { ...payload };
  delete fallbackPayload.current_period_start;
  delete fallbackPayload.cancel_at_period_end;
  return fallbackPayload;
}

async function upsertSubscription(supabase: AdminClient, payload: SubscriptionPayload) {
  const result = await supabase
    .from("subscriptions")
    .upsert(payload, { onConflict: "stripe_subscription_id" });

  if (!result.error) return result;

  const missingOptionalColumn =
    result.error.message.includes("current_period_start") ||
    result.error.message.includes("cancel_at_period_end");

  if (!missingOptionalColumn) return result;

  console.warn("subscription_optional_columns_missing_retrying", {
    subscriptionId: payload.stripe_subscription_id,
    error: result.error.message
  });

  return supabase
    .from("subscriptions")
    .upsert(withoutOptionalSyncFields(payload), { onConflict: "stripe_subscription_id" });
}

export function toIsoFromStripeTimestamp(value?: number | null) {
  if (!value || typeof value !== "number" || !Number.isFinite(value) || value <= 0) return null;
  const date = new Date(value * 1000);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

export function getStripeSubscriptionPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.id || null;
}

export function isPaidSubscriptionStatus(status?: string | null) {
  return status === "active" || status === "trialing";
}

export function planFromSubscription(subscription: Stripe.Subscription): PlanId | null {
  if (!isPaidSubscriptionStatus(subscription.status)) return "free";

  const priceId = getStripeSubscriptionPriceId(subscription);
  const plan = getPlanFromStripePriceId(priceId);

  if (!plan) {
    console.warn("unknown_price_id", {
      subscriptionId: subscription.id,
      priceId: priceId ? `${priceId.slice(0, 12)}...` : null
    });
    return null;
  }

  console.log("plan_mapped", {
    subscriptionId: subscription.id,
    plan,
    priceId: priceId ? `${priceId.slice(0, 12)}...` : null
  });

  return plan;
}

export async function findUserIdForStripeSubscription({
  supabase,
  subscription
}: {
  supabase: AdminClient;
  subscription: Stripe.Subscription;
}) {
  const metadataUserId = typeof subscription.metadata?.user_id === "string" ? subscription.metadata.user_id : null;
  if (metadataUserId) return metadataUserId;

  const bySubscription = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_subscription_id", subscription.id)
    .maybeSingle();

  if (bySubscription.data?.user_id) return bySubscription.data.user_id as string;

  const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id;
  if (!customerId) return null;

  const byCustomer = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();

  return (byCustomer.data?.user_id as string | undefined) || null;
}

export async function syncStripeSubscription({
  supabase,
  subscription,
  userId,
  customerId,
  source
}: SyncInput) {
  const resolvedUserId = userId || await findUserIdForStripeSubscription({ supabase, subscription });
  const stripeCustomerId =
    customerId || (typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id) || null;
  const priceId = getStripeSubscriptionPriceId(subscription);
  const mappedPlan = planFromSubscription(subscription);

  console.log("stripe_price_detected", {
    source,
    subscriptionId: subscription.id,
    priceId: priceId ? `${priceId.slice(0, 12)}...` : null
  });

  if (!resolvedUserId) {
    console.warn("subscription_sync_missing_user", { source, subscriptionId: subscription.id });
    return { ok: false as const, error: "missing_user" as const, plan: mappedPlan, priceId };
  }

  if (!mappedPlan) {
    await upsertSubscription(supabase, {
      user_id: resolvedUserId,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: subscription.id,
      stripe_price_id: priceId,
      status: subscription.status,
      current_period_start: toIsoFromStripeTimestamp(subscription.current_period_start),
      current_period_end: toIsoFromStripeTimestamp(subscription.current_period_end),
      cancel_at_period_end: Boolean(subscription.cancel_at_period_end)
    });

    return { ok: false as const, error: "unknown_price" as const, plan: null, priceId };
  }

  const subscriptionPayload = {
    user_id: resolvedUserId,
    stripe_customer_id: stripeCustomerId,
    stripe_subscription_id: subscription.id,
    stripe_price_id: priceId,
    plan: mappedPlan,
    status: subscription.status,
    current_period_start: toIsoFromStripeTimestamp(subscription.current_period_start),
    current_period_end: toIsoFromStripeTimestamp(subscription.current_period_end),
    cancel_at_period_end: Boolean(subscription.cancel_at_period_end)
  };

  const subscriptionResult = await upsertSubscription(supabase, subscriptionPayload);

  if (subscriptionResult.error) {
    console.error("supabase_subscription_update_failed", {
      source,
      subscriptionId: subscription.id,
      error: subscriptionResult.error.message
    });
    return { ok: false as const, error: "supabase_subscription_update_failed" as const, plan: mappedPlan, priceId };
  }

  console.log("supabase_subscription_updated", {
    source,
    subscriptionId: subscription.id,
    plan: mappedPlan,
    status: subscription.status
  });

  const profileResult = await supabase
    .from("profiles")
    .update({ plan: mappedPlan })
    .eq("id", resolvedUserId);

  if (profileResult.error) {
    console.error("profile_plan_sync_failed", {
      source,
      userId: resolvedUserId,
      error: profileResult.error.message
    });
    return { ok: false as const, error: "profile_plan_sync_failed" as const, plan: mappedPlan, priceId };
  }

  console.log("profile_plan_synced", { source, userId: resolvedUserId, plan: mappedPlan });

  return { ok: true as const, plan: mappedPlan, priceId, status: subscription.status };
}

export async function syncLatestStripeSubscriptionForUser({
  supabase,
  userId
}: {
  supabase: AdminClient;
  userId: string;
}) {
  const { data: existing } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id,stripe_subscription_id")
    .eq("user_id", userId)
    .maybeSingle();

  let subscription: Stripe.Subscription | null = null;

  if (existing?.stripe_subscription_id) {
    subscription = await stripe.subscriptions.retrieve(existing.stripe_subscription_id);
  } else if (existing?.stripe_customer_id) {
    const subscriptions = await stripe.subscriptions.list({
      customer: existing.stripe_customer_id,
      status: "all",
      limit: 10
    });
    subscription = subscriptions.data.find((item) => isPaidSubscriptionStatus(item.status)) || subscriptions.data[0] || null;
  }

  if (!subscription) return { ok: false as const, error: "no_subscription" as const };

  return syncStripeSubscription({
    supabase,
    subscription,
    userId,
    source: "manual_sync"
  });
}

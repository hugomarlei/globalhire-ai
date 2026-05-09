import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase-server";
import { planFromPriceId } from "@/lib/plans";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  console.log("stripe_webhook_received");

  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("stripe_webhook_missing_config");
    return NextResponse.json({ error: "Webhook nao configurado." }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error("stripe_webhook_invalid_signature", error);
    return NextResponse.json({ error: "Assinatura invalida." }, { status: 400 });
  }

  console.log("stripe_webhook_event", {
    type: event.type,
    id: event.id
  });

  const supabase = createAdminClient();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.client_reference_id || session.metadata?.user_id;
      const subscriptionId = String(session.subscription || "");

      console.log("checkout_session_completed_debug", {
        userId,
        subscriptionId,
        customer: session.customer,
        metadata: session.metadata
      });

      if (!userId || !subscriptionId) {
        console.error("checkout_missing_user_or_subscription", {
          userId,
          subscriptionId
        });

        return NextResponse.json({ received: true });
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id || null;
      const plan = planFromPriceId(priceId);

      console.log("stripe_plan_detected", {
        priceId,
        plan,
        starterEnv: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID,
        proEnv: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
        eliteEnv: process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID
      });

      const subscriptionResult = await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: String(session.customer || ""),
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        plan,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      });

      console.log("subscription_upsert_result", subscriptionResult);

      const profileResult = await supabase
        .from("profiles")
        .update({ plan })
        .eq("id", userId);

      console.log("profile_update_result", profileResult);
    }

    if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;

      console.log("subscription_event_debug", {
        subscriptionId: subscription.id,
        status: subscription.status
      });

      const priceId = subscription.items.data[0]?.price.id || null;
      const plan = subscription.status === "active" ? planFromPriceId(priceId) : "free";

      const existingSubscription = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_subscription_id", subscription.id)
        .maybeSingle();

      console.log("existing_subscription_lookup", existingSubscription);

      if (existingSubscription.data?.user_id) {
        const subscriptionUpdateResult = await supabase
          .from("subscriptions")
          .update({
            stripe_price_id: priceId,
            plan,
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
          })
          .eq("stripe_subscription_id", subscription.id);

        console.log("subscription_update_result", subscriptionUpdateResult);

        const profileUpdateResult = await supabase
          .from("profiles")
          .update({ plan })
          .eq("id", existingSubscription.data.user_id);

        console.log("profile_update_from_subscription_result", profileUpdateResult);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("stripe_webhook_processing_error", error);
    return NextResponse.json({ error: "Erro ao processar webhook." }, { status: 500 });
  }
}
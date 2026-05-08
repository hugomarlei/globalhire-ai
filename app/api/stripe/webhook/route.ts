import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase-server";
import { planFromPriceId } from "@/lib/plans";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const body = await request.text();
  const signature = (await headers()).get("stripe-signature");

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook nao configurado." }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
  } catch {
    return NextResponse.json({ error: "Assinatura invalida." }, { status: 400 });
  }

  const supabase = createAdminClient();

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id || session.metadata?.user_id;
    const subscriptionId = String(session.subscription || "");

    if (userId && subscriptionId) {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const priceId = subscription.items.data[0]?.price.id;
      const plan = planFromPriceId(priceId);

      await supabase.from("subscriptions").upsert({
        user_id: userId,
        stripe_customer_id: String(session.customer || ""),
        stripe_subscription_id: subscriptionId,
        stripe_price_id: priceId,
        plan,
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
      });

      await supabase.from("profiles").update({ plan }).eq("id", userId);
    }
  }

  if (event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as Stripe.Subscription;
    const priceId = subscription.items.data[0]?.price.id;
    const plan = subscription.status === "active" ? planFromPriceId(priceId) : "free";

    const { data } = await supabase
      .from("subscriptions")
      .select("user_id")
      .eq("stripe_subscription_id", subscription.id)
      .single();

    if (data?.user_id) {
      await supabase
        .from("subscriptions")
        .update({
          stripe_price_id: priceId,
          plan,
          status: subscription.status,
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        })
        .eq("stripe_subscription_id", subscription.id);

      await supabase.from("profiles").update({ plan }).eq("id", data.user_id);
    }
  }

  return NextResponse.json({ received: true });
}

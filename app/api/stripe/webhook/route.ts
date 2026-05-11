import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createAdminClient } from "@/lib/supabase-server";
import { syncStripeSubscription } from "@/lib/stripe-subscription";
import { stripe } from "@/lib/stripe";

async function retrieveSubscriptionFromInvoice(invoice: Stripe.Invoice) {
  const subscriptionId =
    typeof invoice.subscription === "string"
      ? invoice.subscription
      : invoice.subscription?.id;

  if (!subscriptionId) return null;
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function POST(request: Request) {
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

  console.log("subscription_event_received", {
    type: event.type,
    eventId: event.id
  });

  const supabase = createAdminClient();

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.client_reference_id || session.metadata?.user_id || null;
      const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id;

      if (!subscriptionId) {
        console.warn("checkout_missing_subscription", { sessionId: session.id });
        return NextResponse.json({ received: true });
      }

      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      await syncStripeSubscription({
        supabase,
        subscription,
        userId,
        customerId: typeof session.customer === "string" ? session.customer : session.customer?.id,
        source: "checkout.session.completed"
      });
    }

    if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated" || event.type === "customer.subscription.deleted") {
      const subscription = event.data.object as Stripe.Subscription;
      await syncStripeSubscription({
        supabase,
        subscription,
        source: event.type
      });
    }

    if (event.type === "invoice.payment_succeeded" || event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const subscription = await retrieveSubscriptionFromInvoice(invoice);

      if (subscription) {
        await syncStripeSubscription({
          supabase,
          subscription,
          source: event.type
        });
      } else {
        console.warn("invoice_missing_subscription", { invoiceId: invoice.id, eventType: event.type });
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("stripe_webhook_processing_error", error);
    return NextResponse.json({ error: "Erro ao processar webhook." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/app-url";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faça login para gerenciar a assinatura." }, { status: 401 });

  const { data: subscriptions } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id,status,updated_at,created_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(10);

  const subscription =
    subscriptions?.find((item) => item.status === "active" || item.status === "trialing") ||
    subscriptions?.find((item) => item.stripe_customer_id) ||
    null;

  if (!subscription?.stripe_customer_id) {
    return NextResponse.json({ error: "Nenhuma assinatura Stripe encontrada." }, { status: 404 });
  }

  const appUrl = getAppUrl();
  const session = await stripe.billingPortal.sessions.create({
    customer: subscription.stripe_customer_id,
    return_url: `${appUrl}/dashboard?subscription=updated`
  });

  return NextResponse.json({ url: session.url });
}

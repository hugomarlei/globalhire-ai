import { NextResponse } from "next/server";
import { checkoutSchema } from "@/lib/validation";
import { createClient } from "@/lib/supabase-server";
import { paidPlans } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import { getAppUrl } from "@/lib/app-url";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faca login para assinar." }, { status: 401 });

  const parsed = checkoutSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Plano invalido." }, { status: 400 });

  const plan = paidPlans.find((item) => item.id === parsed.data.plan);
  if (!plan) return NextResponse.json({ error: "Plano invalido." }, { status: 400 });

  const priceId = plan?.stripePriceEnv ? process.env[plan.stripePriceEnv] : null;

  if (!priceId || priceId.includes("placeholder")) {
    return NextResponse.json({ error: "Price ID do Stripe ainda nao configurado." }, { status: 500 });
  }

  const appUrl = getAppUrl();
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer_email: user.email,
    client_reference_id: user.id,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard?checkout=success`,
    cancel_url: `${appUrl}/dashboard?checkout=cancelled`,
    metadata: {
      user_id: user.id,
      plan: plan.id
    }
  });

  return NextResponse.json({ url: session.url });
}

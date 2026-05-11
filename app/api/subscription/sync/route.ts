import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase-server";
import { syncLatestStripeSubscriptionForUser } from "@/lib/stripe-subscription";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faça login para sincronizar a assinatura." }, { status: 401 });

  const result = await syncLatestStripeSubscriptionForUser({
    supabase: createAdminClient(),
    userId: user.id
  });

  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.error === "no_subscription" ? 404 : 400 });
  }

  return NextResponse.json({
    ok: true,
    plan: result.plan,
    status: result.status
  });
}

import { NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase-server";
import { stripe } from "@/lib/stripe";
import { rejectInvalidOrigin } from "@/lib/security";

const confirmationText = "EXCLUIR MINHA CONTA";

export async function POST(request: Request) {
  const originError = rejectInvalidOrigin(request);
  if (originError) return originError;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faça login para excluir a conta." }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  if (body.confirmation !== confirmationText) {
    return NextResponse.json({ error: `Digite exatamente "${confirmationText}" para confirmar.` }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Exclusão completa não está configurada no servidor." }, { status: 500 });
  }

  const admin = createAdminClient();

  const { data: subscription } = await admin
    .from("subscriptions")
    .select("stripe_subscription_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (subscription?.stripe_subscription_id && process.env.STRIPE_SECRET_KEY) {
    try {
      await stripe.subscriptions.cancel(subscription.stripe_subscription_id);
    } catch (error) {
      console.error("account_delete_stripe_cancel_error", error);
    }
  }

  await admin.from("documents").delete().eq("user_id", user.id);
  await admin.from("generations").delete().eq("user_id", user.id);
  await admin.from("subscriptions").delete().eq("user_id", user.id);
  await admin.from("profiles").delete().eq("id", user.id);

  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) {
    console.error("account_delete_auth_error", error);
    return NextResponse.json({
      error: "Seus dados do app foram removidos, mas não consegui excluir o usuário Auth automaticamente. Contate o suporte."
    }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

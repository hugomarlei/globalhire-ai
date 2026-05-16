import { redirect } from "next/navigation";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { createClient } from "@/lib/supabase-server";

export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (profile?.is_blocked) redirect("/login?blocked=1");

  return { user, profile };
}

export async function requireAdmin() {
  const session = await requireUser();
  if (!isAllowedAdminEmail(session.user.email)) {
    redirect("/dashboard");
  }

  return session;
}

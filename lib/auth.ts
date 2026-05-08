import { redirect } from "next/navigation";
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
  const adminEmails = (process.env.ADMIN_EMAILS || "").split(",").map((email) => email.trim().toLowerCase());
  const email = session.user.email?.toLowerCase() || "";

  if (!session.profile?.is_admin && !adminEmails.includes(email)) {
    redirect("/dashboard");
  }

  return session;
}

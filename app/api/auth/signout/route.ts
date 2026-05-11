import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { getAppUrl } from "@/lib/app-url";

export async function POST() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  return NextResponse.redirect(
    new URL("/?logout=success", getAppUrl()),
    {
      status: 303
    }
  );
}

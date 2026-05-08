import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";

const schema = z.object({
  userId: z.string().uuid(),
  blocked: z.boolean()
});

export async function POST(request: Request) {
  await requireAdmin();
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Dados invalidos." }, { status: 400 });

  const supabase = createAdminClient();
  await supabase.from("profiles").update({ is_blocked: parsed.data.blocked }).eq("id", parsed.data.userId);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { normalizeResumeData } from "@/lib/resumes/defaults";
import { resumeUpdateSchema } from "@/lib/resumes/validation";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

  const { data, error } = await supabase
    .from("resumes")
    .select("id,title,data,created_at,updated_at")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return NextResponse.json({ error: "Curriculo nao encontrado." }, { status: 404 });

  return NextResponse.json({ resume: { ...data, data: normalizeResumeData(data.data) } });
}

export async function PUT(request: Request, context: Ctx) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

  const parsed = resumeUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message || "Dados invalidos." }, { status: 400 });

  const update: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (parsed.data.title) update.title = parsed.data.title;
  if (parsed.data.data) update.data = normalizeResumeData(parsed.data.data);

  const { data, error } = await supabase
    .from("resumes")
    .update(update)
    .eq("id", id)
    .eq("user_id", user.id)
    .select("id,title,data,created_at,updated_at")
    .single();

  if (error || !data) return NextResponse.json({ error: "Nao foi possivel salvar o curriculo." }, { status: 500 });

  return NextResponse.json({ resume: { ...data, data: normalizeResumeData(data.data) } });
}

export async function DELETE(_request: Request, context: Ctx) {
  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

  const { error } = await supabase.from("resumes").delete().eq("id", id).eq("user_id", user.id);
  if (error) return NextResponse.json({ error: "Nao foi possivel excluir o curriculo." }, { status: 500 });

  return NextResponse.json({ ok: true });
}

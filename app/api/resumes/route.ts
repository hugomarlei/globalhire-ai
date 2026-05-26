import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { defaultResumeData, normalizeResumeData } from "@/lib/resumes/defaults";
import { resumeCreateSchema } from "@/lib/resumes/validation";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

  const { data, error } = await supabase
    .from("resumes")
    .select("id,title,data,created_at,updated_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Nao foi possivel listar curriculos." }, { status: 500 });

  return NextResponse.json({ resumes: (data || []).map((item) => ({ ...item, data: normalizeResumeData(item.data) })) });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

  const parsed = resumeCreateSchema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message || "Dados invalidos." }, { status: 400 });

  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      title: parsed.data.title || "Novo currículo",
      data: parsed.data.data ? normalizeResumeData(parsed.data.data) : defaultResumeData()
    })
    .select("id,title,data,created_at,updated_at")
    .single();

  if (error) return NextResponse.json({ error: "Nao foi possivel criar o curriculo." }, { status: 500 });

  return NextResponse.json({ resume: data }, { status: 201 });
}

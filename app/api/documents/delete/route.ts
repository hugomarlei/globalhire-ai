import { NextResponse } from "next/server";
import { z } from "zod";
import { createAdminClient, createClient } from "@/lib/supabase-server";
import { rejectInvalidOrigin } from "@/lib/security";

const schema = z.object({
  generationId: z.string().uuid().optional(),
  documentId: z.string().uuid().optional()
}).refine((value) => value.generationId || value.documentId, {
  message: "Informe o documento que deseja excluir."
});

export async function POST(request: Request) {
  const originError = rejectInvalidOrigin(request);
  if (originError) return originError;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faça login para excluir documentos." }, { status: 401 });

  const parsed = schema.safeParse(await request.json().catch(() => ({})));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message || "Documento inválido." }, { status: 400 });
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: "Exclusão granular não está configurada no servidor." }, { status: 500 });
  }

  const admin = createAdminClient();

  if (parsed.data.documentId) {
    const { error } = await admin
      .from("documents")
      .delete()
      .eq("id", parsed.data.documentId)
      .eq("user_id", user.id);

    if (error) {
      console.error("document_delete_error", { code: error.code, message: error.message });
      return NextResponse.json({ error: "Não consegui excluir este documento agora." }, { status: 500 });
    }
  }

  if (parsed.data.generationId) {
    await admin
      .from("documents")
      .delete()
      .eq("generation_id", parsed.data.generationId)
      .eq("user_id", user.id);

    const { error } = await admin
      .from("generations")
      .delete()
      .eq("id", parsed.data.generationId)
      .eq("user_id", user.id);

    if (error) {
      console.error("generation_delete_error", { code: error.code, message: error.message });
      return NextResponse.json({ error: "Não consegui excluir esta geração agora." }, { status: 500 });
    }
  }

  console.log("document_deleted", {
    userId: user.id,
    generationId: parsed.data.generationId ? "present" : "absent",
    documentId: parsed.data.documentId ? "present" : "absent"
  });

  return NextResponse.json({ ok: true });
}

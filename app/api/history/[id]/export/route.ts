import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase-server";
import { rejectInvalidOrigin } from "@/lib/security";

function sanitizeFilenamePart(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48) || "document";
}

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const originError = rejectInvalidOrigin(request);
  if (originError) return originError;

  const { id } = await context.params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Faça login para baixar documentos." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("generations")
    .select("output, type")
    .eq("id", id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "Documento não encontrado." }, { status: 404 });
  }

  const text = (data.output || "").trim();
  if (!text) {
    return NextResponse.json({ error: "Este documento não tem conteúdo para exportar." }, { status: 404 });
  }

  const typePart = sanitizeFilenamePart(data.type || "export");
  const idShort = id.replace(/-/g, "").slice(0, 10);
  const filename = `globalhire-${typePart}-${idShort}.txt`;

  const encoder = new TextEncoder();
  const body = new Uint8Array([0xef, 0xbb, 0xbf, ...encoder.encode(text)]);

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store"
    }
  });
}

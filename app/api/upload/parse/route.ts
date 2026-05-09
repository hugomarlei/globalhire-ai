import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { createClient } from "@/lib/supabase-server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faça login para enviar arquivos." }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Envie um arquivo PDF ou DOCX." }, { status: 400 });
  }

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json({ error: "Formato inválido. Use PDF ou DOCX." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande. Envie até 5 MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let text = "";

    if (file.type === "application/pdf") {
      const parser = new PDFParse({ data: buffer });
      const parsed = await parser.getText();
      await parser.destroy();
      text = parsed.text;
    } else {
      const parsed = await mammoth.extractRawText({ buffer });
      text = parsed.value;
    }

    const cleanText = text.replace(/\n{3,}/g, "\n\n").trim();

    if (cleanText.length < 100) {
      return NextResponse.json({
        error: "Não consegui extrair texto suficiente. Você pode colar o currículo manualmente."
      }, { status: 422 });
    }

    return NextResponse.json({ text: cleanText });
  } catch (error) {
    console.error("upload_parse_error", error);
    return NextResponse.json({
      error: "Não consegui ler o arquivo. Tente outro PDF/DOCX ou cole o texto manualmente."
    }, { status: 500 });
  }
}

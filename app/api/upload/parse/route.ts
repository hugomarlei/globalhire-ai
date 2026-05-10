import { NextResponse } from "next/server";
import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";
import { createClient } from "@/lib/supabase-server";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const allowedTypes = new Set([
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]);

function withTimeout<T>(promise: Promise<T>, ms: number) {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error("parse_timeout")), ms);
    })
  ]);
}

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

  const fileName = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || fileName.endsWith(".pdf");
  const isDocx =
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx");

  if (!allowedTypes.has(file.type) && !isPdf && !isDocx) {
    return NextResponse.json({ error: "Formato inválido. Use PDF ou DOCX." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande. Envie até 5 MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let text = "";

    if (isPdf) {
      const parser = new PDFParse({ data: buffer });
      try {
        const parsed = await withTimeout(parser.getText(), 20_000);
        text = parsed.text;
      } finally {
        await parser.destroy().catch(() => undefined);
      }
    } else {
      const parsed = await withTimeout(mammoth.extractRawText({ buffer }), 20_000);
      text = parsed.value;
    }

    const cleanText = text.replace(/\n{3,}/g, "\n\n").trim();

    if (cleanText.length < 100) {
      return NextResponse.json({
        error: "Não consegui extrair texto suficiente. Se o PDF for escaneado ou imagem, cole o currículo manualmente."
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

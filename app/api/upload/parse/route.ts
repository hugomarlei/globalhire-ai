import { NextResponse } from "next/server";
import { createRequire } from "module";
import mammoth from "mammoth";
import { createClient } from "@/lib/supabase-server";

export const runtime = "nodejs";

const nodeRequire = createRequire(import.meta.url);
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

async function extractPdfText(buffer: Buffer) {
  try {
    const pdfParse = nodeRequire("pdf-parse/lib/pdf-parse.js") as (
      dataBuffer: Buffer,
      options?: { max?: number }
    ) => Promise<{ text?: string; numpages?: number; numrender?: number }>;
    const parsed = await withTimeout(pdfParse(buffer, { max: 0 }), 20_000);

    console.log("upload_parse_pdf_extracted", {
      pages: parsed.numpages || 0,
      renderedPages: parsed.numrender || 0,
      extractedLength: parsed.text?.length || 0
    });

    return parsed.text || "";
  } catch (error) {
    console.error("upload_parse_pdf_extract_error", error);
    throw error;
  }
}

async function extractDocxText(buffer: Buffer) {
  try {
    const parsed = await withTimeout(mammoth.extractRawText({ buffer }), 20_000);
    return parsed.value || "";
  } catch (error) {
    console.error("upload_parse_docx_extract_error", error);
    throw error;
  }
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

  if (!file.size) {
    console.warn("upload_parse_empty_file");
    return NextResponse.json({ error: "O arquivo chegou vazio. Tente enviar novamente ou cole o texto manualmente." }, { status: 400 });
  }

  const fileName = file.name.toLowerCase();
  const isPdf = file.type === "application/pdf" || fileName.endsWith(".pdf");
  const isDocx =
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    fileName.endsWith(".docx");

  if (!allowedTypes.has(file.type) && !isPdf && !isDocx) {
    console.warn("upload_parse_invalid_type", { type: file.type, fileName: file.name });
    return NextResponse.json({ error: "Formato inválido. Use PDF ou DOCX." }, { status: 400 });
  }

  if (file.size > MAX_FILE_SIZE) {
    return NextResponse.json({ error: "Arquivo muito grande. Envie até 5 MB." }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  console.log("upload_parse_started", {
    fileName: file.name,
    type: file.type || "unknown",
    size: file.size,
    detected: isPdf ? "pdf" : "docx"
  });

  try {
    let text = "";

    if (isPdf) {
      text = await extractPdfText(buffer);
    } else {
      text = await extractDocxText(buffer);
    }

    const cleanText = text.replace(/\n{3,}/g, "\n\n").trim();
    console.log("upload_parse_finished", {
      fileName: file.name,
      detected: isPdf ? "pdf" : "docx",
      extractedLength: cleanText.length
    });

    if (cleanText.length < 100) {
      console.warn("upload_parse_insufficient_text", { fileName: file.name, extractedLength: cleanText.length });
      return NextResponse.json({
        error: "O arquivo abriu, mas não encontrei texto suficiente para importar. Isso acontece com PDF escaneado ou imagem. Você pode copiar e colar o texto do currículo manualmente no campo abaixo."
      }, { status: 422 });
    }

    return NextResponse.json({ text: cleanText });
  } catch (error) {
    console.error("upload_parse_error", {
      fileName: file.name,
      detected: isPdf ? "pdf" : "docx",
      message: error instanceof Error ? error.message : String(error)
    });
    return NextResponse.json({
      error: isPdf
        ? "Não consegui extrair o texto deste PDF. Se ele for escaneado ou imagem, cole o conteúdo manualmente. Se o texto for selecionável, tente salvar o PDF novamente e reenviar."
        : "Não consegui extrair o texto deste DOCX. Tente salvar o arquivo novamente no Word/Google Docs ou cole o conteúdo manualmente."
    }, { status: 500 });
  }
}

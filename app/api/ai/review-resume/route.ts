import { NextRequest, NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { createClient } from "@/lib/supabase-server";
import { buildRateLimitKey, cooldownLimit } from "@/lib/rate-limit";
import { getClientIp, rejectInvalidOrigin } from "@/lib/security";
import { normalizeResumeData, resumeToPlainText } from "@/lib/resumes/defaults";
import { reviewResumeSchema } from "@/lib/resumes/validation";
import { assertResumeAiAccess } from "@/lib/resumes/ai-access";

function parseJson(value: string) {
  try {
    return JSON.parse(value);
  } catch {
    const match = value.match(/\{[\s\S]*\}/);
    if (!match) return null;
    try {
      return JSON.parse(match[0]);
    } catch {
      return null;
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const originError = rejectInvalidOrigin(request);
    if (originError) return originError;

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

    const limited = await cooldownLimit(buildRateLimitKey("resume-review", user.id, getClientIp(request)), 30_000);
    if (!limited.ok) return NextResponse.json({ error: "Aguarde alguns segundos antes de revisar novamente." }, { status: 429 });

    const parsed = reviewResumeSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message || "Dados invalidos." }, { status: 400 });

    const accessError = await assertResumeAiAccess(supabase, user, "resume_ai_writer");
    if (accessError) return accessError;

    if (!process.env.GROQ_API_KEY) return NextResponse.json({ error: "GROQ_API_KEY nao configurada no servidor." }, { status: 500 });

    const data = normalizeResumeData(parsed.data.data);
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Voce e um revisor senior de curriculos. Responda apenas com JSON valido. Use estritamente o idioma do documento. Nao invente experiencias, empresas, certificados, metricas ou ferramentas."
        },
        {
          role: "user",
          content: JSON.stringify({
            language: parsed.data.language,
            resume: data,
            plainText: resumeToPlainText(data),
            expectedJson: {
              categories: [
                { key: "structure", title: "Estrutura e organização", score: 0, suggestions: ["..."] },
                { key: "clarity", title: "Conteúdo e clareza", score: 0, suggestions: ["..."] },
                { key: "positioning", title: "Posicionamento de cargo", score: 0, suggestions: ["..."] }
              ],
              improvedData: "ResumeData JSON com melhorias conservadoras, mantendo todos os fatos verdadeiros"
            }
          })
        }
      ],
      temperature: 0.2
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const reviewed = parseJson(raw);
    if (!reviewed?.categories) return NextResponse.json({ error: "A IA nao retornou uma revisao valida." }, { status: 500 });

    return NextResponse.json({
      categories: reviewed.categories,
      improvedData: reviewed.improvedData ? normalizeResumeData(reviewed.improvedData) : data
    });
  } catch (error) {
    console.error("resume_review_error", error);
    return NextResponse.json({ error: "Erro interno ao revisar curriculo." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { createClient } from "@/lib/supabase-server";
import { buildRateLimitKey, cooldownLimit } from "@/lib/rate-limit";
import { getClientIp, rejectInvalidOrigin } from "@/lib/security";
import { normalizeResumeData, resumeToPlainText } from "@/lib/resumes/defaults";
import { resumeChatSchema } from "@/lib/resumes/validation";
import { assertResumeAiAccess } from "@/lib/resumes/ai-access";

export async function POST(request: NextRequest) {
  try {
    const originError = rejectInvalidOrigin(request);
    if (originError) return originError;

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

    const limited = await cooldownLimit(buildRateLimitKey("resume-chat", user.id, getClientIp(request)), 10_000);
    if (!limited.ok) return NextResponse.json({ error: "Aguarde alguns segundos antes de enviar outra mensagem." }, { status: 429 });

    const parsed = resumeChatSchema.safeParse(await request.json());
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
            "Voce e um escritor de curriculos e coach de carreira. Responda no idioma solicitado. Use apenas fatos presentes no curriculo ou explicitamente fornecidos pelo usuario. Se algo faltar, pergunte ou sugira placeholders seguros."
        },
        {
          role: "user",
          content: JSON.stringify({
            language: parsed.data.language,
            resumeContext: resumeToPlainText(data).slice(0, 12000),
            recentConversation: parsed.data.history,
            question: parsed.data.question
          })
        }
      ],
      temperature: 0.25
    });

    const answer = completion.choices[0]?.message?.content?.trim() || "";
    if (!answer) return NextResponse.json({ error: "A IA nao retornou resposta." }, { status: 500 });

    return NextResponse.json({ answer });
  } catch (error) {
    console.error("resume_chat_error", error);
    return NextResponse.json({ error: "Erro interno no chat de IA." }, { status: 500 });
  }
}

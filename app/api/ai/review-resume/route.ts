import { NextRequest, NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { createClient } from "@/lib/supabase-server";
import { buildRateLimitKey, cooldownLimit } from "@/lib/rate-limit";
import { getClientIp, rejectInvalidOrigin } from "@/lib/security";
import { mergeResumeData, normalizeResumeData, resumeToPlainText } from "@/lib/resumes/defaults";
import { calculateResumeScore } from "@/lib/resumes/score";
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

function buildLocalReviewFallback(score: number, recommendations: string[]) {
  return {
    categories: [
      {
        key: "structure",
        title: "Estrutura e organização",
        score,
        suggestions: recommendations.length
          ? recommendations.slice(0, 3)
          : ["Reforce contato, resumo, experiência e habilidades antes de tentar novamente."]
      },
      {
        key: "clarity",
        title: "Conteúdo e clareza",
        score: Math.max(0, score - 4),
        suggestions: [
          "A revisão automática não respondeu desta vez.",
          "O currículo original foi mantido.",
          "Tente novamente quando a IA estiver disponível."
        ]
      }
    ],
    improvedData: null
  };
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
    const plainText = resumeToPlainText(data);
    if (plainText.trim().length < 120) {
      return NextResponse.json({ error: "Adicione dados reais do curriculo antes de revisar com IA." }, { status: 400 });
    }
    const localScore = calculateResumeScore(data);
    let raw = "";
    try {
      const completion = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content:
              "Voce e um revisor senior de curriculos, ATS e recrutamento internacional. Responda apenas com JSON valido. Use estritamente o idioma do documento. Nao invente experiencias, empresas, certificados, metricas, idiomas, senioridade ou ferramentas. Sua revisao deve transformar o curriculo quando houver base factual: melhorar posicionamento, densidade, clareza, palavras-chave compativeis e aderencia a vaga-alvo, sem maquiagem superficial."
          },
          {
            role: "user",
            content: JSON.stringify({
              language: parsed.data.language,
              resume: data,
              plainText,
              qualityGate: [
                "Avalie internamente se a versao melhorada seria aceita por ATS e recrutador humano.",
                "Compare mentalmente com curriculos fortes: secoes limpas, resumo especifico, skills aderentes e experiencia com acao + contexto + impacto.",
                "Se improvedData ficar quase igual ao original, revise novamente antes de responder.",
                "Use palavras-chave da vaga apenas se data.targetJobDescription existir e forem condizentes com o historico do candidato.",
                "Nao apresente melhoria que nao apareca em improvedData."
              ],
              expectedJson: {
                categories: [
                  { key: "structure", title: "Estrutura e organização", score: 0, suggestions: ["..."] },
                  { key: "clarity", title: "Conteúdo e clareza", score: 0, suggestions: ["..."] },
                  { key: "positioning", title: "Posicionamento de cargo", score: 0, suggestions: ["..."] },
                  { key: "atsHumanFit", title: "ATS e leitura humana", score: 0, suggestions: ["..."] }
                ],
                improvedData: "ResumeData JSON com melhorias verificaveis e substanciais, mantendo todos os fatos verdadeiros"
              }
            })
          }
        ],
        max_completion_tokens: 6000,
        temperature: 0.2
      });
      raw = completion.choices[0]?.message?.content?.trim() || "";
    } catch (error) {
      console.error("resume_review_groq_error", error);
      const fallback = buildLocalReviewFallback(localScore.score, localScore.recommendations);
      return NextResponse.json(fallback);
    }

    const reviewed = parseJson(raw);
    if (!reviewed?.categories) {
      return NextResponse.json(buildLocalReviewFallback(localScore.score, localScore.recommendations));
    }

    return NextResponse.json({
      categories: reviewed.categories,
      improvedData: reviewed.improvedData ? mergeResumeData(data, reviewed.improvedData) : data
    });
  } catch (error) {
    console.error("resume_review_error", error);
    return NextResponse.json({ error: "Erro interno ao revisar curriculo." }, { status: 500 });
  }
}

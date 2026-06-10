import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildPrompt } from "@/prompts/ai-prompts";
import { createClient } from "@/lib/supabase-server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { canUseFeature, effectivePlanFromSubscription, optimizationIntensity, plans } from "@/lib/plans";
import { buildRateLimitKey, cooldownLimit } from "@/lib/rate-limit";
import { parseAiOutput } from "@/lib/document-format";
import { buildQualityRevisionPrompt, evaluateGeneratedAsset } from "@/lib/ai-output-quality";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getLatestActiveSubscription } from "@/lib/subscription-state";
import { getClientIp, rejectInvalidOrigin } from "@/lib/security";
import {
  budgetedMaxCompletionTokens,
  buildCompleteResumeFallback,
  desiredCompletionTokens,
  groqRateLimitResponse,
  isGroqRateLimitError,
  longDocumentLooksIncomplete,
  prepareBudgetedGenerationInput,
  shouldAutoReviseWithAi
} from "@/lib/ai-generation-budget";

const optimizeFromScoreSchema = z.object({
  resume: z.string().min(100, "Cole pelo menos 100 caracteres do currículo.").max(20000),
  jobDescription: z.string().min(40, "Cole a descrição da vaga para otimizar com precisão.").max(20000),
  score: z.number().min(0).max(100),
  match: z.number().min(0).max(100),
  found: z.array(z.string()).max(30).default([]),
  missing: z.array(z.string()).max(30).default([]),
  recommendations: z.array(z.string()).max(10).default([]),
  language: z.string().min(2).max(40).default("Português do Brasil"),
  targetCountry: z.string().min(2).max(60).default("Estados Unidos"),
  turnstileToken: z.string().optional()
});

function scoreAppliedImprovements(items: string[]) {
  return items.map((item, index) => {
    const match = item.match(/\[?\s*(\d{1,2})\s*%\s*\]?/);
    const score = match ? Number(match[1]) : Math.max(6, 18 - index * 2);
    const text = item.replace(/\[?\s*\d{1,2}\s*%\s*\]?\s*[-–—:]?\s*/, "").trim();
    return { text, score: Math.min(Math.max(score, 1), 35) };
  });
}

export async function POST(request: NextRequest) {
  try {
    const originError = rejectInvalidOrigin(request);
    if (originError) return originError;

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Faça login para otimizar o currículo." }, { status: 401 });

    const ip = getClientIp(request);
    const limited = await cooldownLimit(buildRateLimitKey("ai-score-optimize", user.id, ip), 30_000);
    if (!limited.ok) return NextResponse.json({ error: "Aguarde 30 segundos antes de otimizar novamente." }, { status: 429 });

    const parsed = optimizeFromScoreSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Dados inválidos." }, { status: 400 });
    }

    const captcha = await verifyTurnstileToken(
      parsed.data.turnstileToken,
      request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")
    );
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error || "Confirme o captcha para otimizar." }, { status: 400 });
    }

    const [{ data: profile }, subscription] = await Promise.all([
      supabase
        .from("profiles")
        .select("plan,is_blocked")
        .eq("id", user.id)
        .single(),
      getLatestActiveSubscription(supabase, user.id)
    ]);

    if (profile?.is_blocked) return NextResponse.json({ error: "Conta bloqueada." }, { status: 403 });

    const planId = effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, user.email);
    const plan = plans[planId] || plans.free;

    if (!canUseFeature(planId, "ats_score")) {
      return NextResponse.json({ error: "ATS Score e otimização a partir da análise estão disponíveis a partir do plano Pro." }, { status: 403 });
    }
    const since = new Date();
    since.setDate(1);
    since.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("generations")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .gte("created_at", since.toISOString());

    if ((count || 0) >= plan.monthlyLimit) {
      return NextResponse.json({
        error: "Você atingiu o limite mensal do seu plano. O limite renova no início do próximo mês."
      }, { status: 402 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY não configurada no servidor." }, { status: 500 });
    }

    const scoreContext = `
Contexto da análise ATS já realizada:
- ATS Score atual: ${parsed.data.score}%
- Compatibilidade com a vaga: ${parsed.data.match}%
- Palavras-chave encontradas: ${parsed.data.found.join(", ") || "nenhuma detectada"}
- Palavras-chave ausentes: ${parsed.data.missing.join(", ") || "nenhuma lacuna crítica"}
- Recomendações calculadas: ${parsed.data.recommendations.join(" | ")}

Obrigatório: use estes achados para reescrever o currículo de forma mais forte e alinhada à vaga. Incorpore palavras-chave ausentes somente quando forem compatíveis com a experiência real do candidato.`;

    const intensity = optimizationIntensity(planId);
    const prepared = prepareBudgetedGenerationInput({
      type: "ats_resume",
      resume: parsed.data.resume,
      jobDescription: `${parsed.data.jobDescription}\n\n${scoreContext}`
    });
    const prompt = buildPrompt({
      type: "ats_resume",
      resume: prepared.resume,
      jobDescription: prepared.jobDescription,
      language: parsed.data.language,
      targetCountry: parsed.data.targetCountry,
      optimizationInstruction: intensity.instruction,
      planLabel: intensity.label,
      intensityPercent: intensity.percent
    });
    const maxCompletionTokens = budgetedMaxCompletionTokens(prompt, desiredCompletionTokens("ats_resume"));

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista sênior em ATS, currículo internacional e recrutamento. Reescreva com base nos achados do score para gerar melhoria real, não maquiagem textual. Preserve fatos, cabeçalho, telefone, e-mail e localização quando existirem. Incorpore lacunas de palavras-chave somente quando forem compatíveis com a experiência do candidato. Use apenas o idioma solicitado e entregue um currículo limpo para ATS e convincente para recrutador humano."
        },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: maxCompletionTokens,
      temperature: 0.25
    });

    const rawOutput = completion.choices[0]?.message?.content?.trim() || "";
    let { document, recommendations } = parseAiOutput(rawOutput);
    if (completion.choices[0]?.finish_reason === "length") {
      document = buildCompleteResumeFallback(parsed.data.resume, parsed.data.language, "ats_resume");
      recommendations = ["Versão completa reconstruída localmente porque a IA atingiu o limite de saída."];
    }
    if (!document) {
      document = buildCompleteResumeFallback(parsed.data.resume, parsed.data.language, "ats_resume");
      recommendations = ["Versão completa reconstruída localmente para evitar currículo vazio."];
    }
    if (longDocumentLooksIncomplete("ats_resume", parsed.data.resume, document)) {
      document = buildCompleteResumeFallback(parsed.data.resume, parsed.data.language, "ats_resume");
      recommendations = ["Versão completa reconstruída localmente porque a IA retornou um currículo incompleto."];
    }
    let quality = evaluateGeneratedAsset({
      type: "ats_resume",
      resume: parsed.data.resume,
      jobDescription: parsed.data.jobDescription,
      document,
      recommendations
    });

    if (quality.shouldRevise && shouldAutoReviseWithAi("ats_resume", prepared)) {
      try {
        const revisionPrompt = buildQualityRevisionPrompt({
          type: "ats_resume",
          resume: prepared.resume,
          jobDescription: prepared.jobDescription,
          document,
          recommendations,
          quality,
          language: parsed.data.language
        });
        const revision = await groq.chat.completions.create({
          model: GROQ_MODEL,
          messages: [
            {
              role: "system",
              content:
                "Você é um auditor e rewriter sênior de currículos ATS. Corrija a versão reprovada com melhoria real, alinhamento à vaga e preservação estrita de fatos."
            },
            {
              role: "user",
              content: revisionPrompt
            }
          ],
          max_completion_tokens: budgetedMaxCompletionTokens(revisionPrompt, maxCompletionTokens),
          temperature: 0.18
        });
        const revised = parseAiOutput(revision.choices[0]?.message?.content?.trim() || "");
        if (revised.document) {
          const revisedQuality = evaluateGeneratedAsset({
            type: "ats_resume",
            resume: parsed.data.resume,
            jobDescription: parsed.data.jobDescription,
            document: revised.document,
            recommendations: revised.recommendations
          });
          if (revisedQuality.score >= quality.score) {
            document = revised.document;
            recommendations = revised.recommendations;
            quality = revisedQuality;
          }
        }
      } catch (error) {
        if (!isGroqRateLimitError(error)) throw error;
        console.warn("score_optimize_revision_rate_limited");
      }
    }
    const appliedImprovements = scoreAppliedImprovements(recommendations);

    await supabase.from("generations").insert({
      user_id: user.id,
      type: "ats_resume",
      language: parsed.data.language,
      target_country: parsed.data.targetCountry,
      input_resume: parsed.data.resume,
      job_description: parsed.data.jobDescription,
      output: document
    });

    return NextResponse.json({ output: document, appliedImprovements, saved: true, quality });
  } catch (error) {
    if (isGroqRateLimitError(error)) return groqRateLimitResponse();
    console.error("score_optimize_error", error);
    return NextResponse.json({ error: "Erro interno ao otimizar o currículo." }, { status: 500 });
  }
}

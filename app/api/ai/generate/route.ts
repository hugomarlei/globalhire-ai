import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/prompts/ai-prompts";
import { createClient } from "@/lib/supabase-server";
import { generateSchema } from "@/lib/validation";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { canUseFeature, effectivePlanFromSubscription, featureMinimumPlan, optimizationIntensity, plans } from "@/lib/plans";
import { buildRateLimitKey, cooldownLimit } from "@/lib/rate-limit";
import { parseAiOutput } from "@/lib/document-format";
import { buildQualityRevisionPrompt, evaluateGeneratedAsset } from "@/lib/ai-output-quality";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getLatestActiveSubscription } from "@/lib/subscription-state";
import { getClientIp, rejectInvalidOrigin } from "@/lib/security";
import {
  budgetedMaxCompletionTokens,
  desiredCompletionTokens,
  groqRateLimitResponse,
  isGroqRateLimitError,
  prepareBudgetedGenerationInput,
  shouldAutoReviseWithAi
} from "@/lib/ai-generation-budget";

function scoreAppliedImprovements(items: string[]) {
  return items.map((item, index) => {
    const match = item.match(/\[?\s*(\d{1,2})\s*%\s*\]?/);
    const score = match ? Number(match[1]) : Math.max(6, 18 - index * 2);
    const text = item
      .replace(/\[?\s*\d{1,2}\s*%\s*\]?\s*[-–—:]?\s*/, "")
      .trim();

    return {
      text,
      score: Math.min(Math.max(score, 1), 35)
    };
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

    if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

    const ip = getClientIp(request);
    const limited = await cooldownLimit(buildRateLimitKey("ai-generate", user.id, ip), 30_000);
    if (!limited.ok) return NextResponse.json({ error: "Aguarde 30 segundos antes de gerar novamente." }, { status: 429 });

    const parsed = generateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Dados invalidos." }, { status: 400 });
    }

    const captcha = await verifyTurnstileToken(
      parsed.data.turnstileToken,
      request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")
    );
    if (!captcha.ok) {
      return NextResponse.json({ error: captcha.error || "Confirme o captcha para gerar." }, { status: 400 });
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

    if (!canUseFeature(planId, parsed.data.type)) {
      return NextResponse.json({
        error: `Esta ferramenta está disponível a partir do plano ${plans[featureMinimumPlan[parsed.data.type]].name}.`
      }, { status: 403 });
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
      return NextResponse.json({ error: "Você atingiu o limite mensal do seu plano. O limite renova no início do próximo mês." }, { status: 402 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY nao configurada no servidor." }, { status: 500 });
    }
    
    const intensity = optimizationIntensity(planId);
    const prepared = prepareBudgetedGenerationInput({
      type: parsed.data.type,
      resume: parsed.data.resume,
      jobDescription: parsed.data.jobDescription
    });
    const prompt = buildPrompt({
      type: parsed.data.type,
      resume: prepared.resume,
      jobDescription: prepared.jobDescription,
      language: parsed.data.language,
      targetCountry: parsed.data.targetCountry,
      optimizationInstruction: intensity.instruction,
      planLabel: intensity.label,
      intensityPercent: intensity.percent,
      outputLength: parsed.data.outputLength,
      outputTone: parsed.data.outputTone
    });
    const maxCompletionTokens = budgetedMaxCompletionTokens(
      prompt,
      desiredCompletionTokens(parsed.data.type, parsed.data.outputLength)
    );

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Voce e um estrategista senior de carreira internacional, ATS e recrutamento. Seu trabalho e entregar melhoria real, nao reescrita cosmetica. Adapte documentos ao alvo da vaga, preserve somente fatos verdadeiros e incorpore palavras-chave apenas quando sustentadas pelo historico do candidato. Preserve telefone, e-mail e cidade/localizacao quando constarem no material de entrada. O documento final deve estar inteiramente no idioma solicitado, limpo para ATS e convincente para recrutador humano."
        },
        { role: "user", content: prompt }
      ],
      max_completion_tokens: maxCompletionTokens,
      temperature: 0.25
    });

    if (completion.choices[0]?.finish_reason === "length") {
      return NextResponse.json({
        error: "A IA atingiu o limite de saída antes de finalizar o documento. Tente novamente; nenhum asset truncado foi salvo."
      }, { status: 502 });
    }

    const rawOutput = completion.choices[0]?.message?.content?.trim() || "";
    if (!rawOutput) return NextResponse.json({ error: "A IA nao retornou conteudo." }, { status: 500 });

    let { document, recommendations } = parseAiOutput(rawOutput);
    if (!document) return NextResponse.json({ error: "A IA nao retornou um documento valido." }, { status: 500 });
    let quality = evaluateGeneratedAsset({
      type: parsed.data.type,
      resume: parsed.data.resume,
      jobDescription: parsed.data.jobDescription,
      document,
      recommendations
    });

    if (quality.shouldRevise && shouldAutoReviseWithAi(parsed.data.type, prepared)) {
      try {
        const revisionPrompt = buildQualityRevisionPrompt({
          type: parsed.data.type,
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
                "Voce e um auditor e rewriter senior de curriculos, ATS e assets de candidatura. Corrija apenas com fatos sustentados. Entregue uma versao mais forte, especifica, humana e alinhada a vaga."
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
            type: parsed.data.type,
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
        console.warn("quality_revision_rate_limited", { type: parsed.data.type });
      }
    }

    const appliedImprovements = scoreAppliedImprovements(recommendations);

    await supabase.from("generations").insert({
      user_id: user.id,
      type: parsed.data.type,
      language: parsed.data.language,
      target_country: parsed.data.targetCountry,
      input_resume: parsed.data.resume,
      job_description: parsed.data.jobDescription,
      output: document
    });

    console.log("generation_created", { userId: user.id, type: parsed.data.type });
    return NextResponse.json({
      output: document,
      appliedImprovements,
      recommendations: appliedImprovements,
      quality
    });
  } catch (error) {
    if (isGroqRateLimitError(error)) return groqRateLimitResponse();
    console.error("ai_generate_error", error);
    return NextResponse.json({ error: "Erro interno ao gerar documento." }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildPrompt } from "@/prompts/ai-prompts";
import { createClient } from "@/lib/supabase-server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { canUseFeature, effectivePlanFromSubscription, featureMinimumPlan, optimizationIntensity, plans } from "@/lib/plans";
import { parseAiOutput } from "@/lib/document-format";
import { buildRateLimitKey, cooldownLimit } from "@/lib/rate-limit";
import type { GenerationType } from "@/lib/types";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getLatestActiveSubscription } from "@/lib/subscription-state";
import { getClientIp, rejectInvalidOrigin } from "@/lib/security";

const regenerateSchema = z.object({
  generationId: z.string().uuid(),
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

    if (!user) return NextResponse.json({ error: "Faça login para regenerar o documento." }, { status: 401 });

    const ip = getClientIp(request);
    const limited = await cooldownLimit(buildRateLimitKey("ai-regenerate", user.id, ip), 30_000);
    if (!limited.ok) return NextResponse.json({ error: "Aguarde 30 segundos antes de regenerar novamente." }, { status: 429 });

    const parsed = regenerateSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: "Documento inválido." }, { status: 400 });

    const captcha = await verifyTurnstileToken(
      parsed.data.turnstileToken,
      request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")
    );
    if (!captcha.ok) return NextResponse.json({ error: captcha.error || "Confirme o captcha para regenerar." }, { status: 400 });

    const { data: original } = await supabase
      .from("generations")
      .select("type,language,target_country,input_resume,job_description")
      .eq("id", parsed.data.generationId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!original) return NextResponse.json({ error: "Documento não encontrado no seu histórico." }, { status: 404 });
    if (!original.input_resume || original.input_resume.length < 100) {
      return NextResponse.json({
        error: "Não há dados salvos suficientes para regenerar este documento. Abra o gerador e cole o currículo novamente."
      }, { status: 422 });
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
    const type = original.type as GenerationType;

    if (!canUseFeature(planId, type)) {
      return NextResponse.json({
        error: `Este tipo de documento está disponível a partir do plano ${plans[featureMinimumPlan[type]].name}.`
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
      return NextResponse.json({ error: "Você atingiu o limite mensal do seu plano. Faça upgrade para regenerar agora." }, { status: 402 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY não configurada no servidor." }, { status: 500 });
    }

    const intensity = optimizationIntensity(planId);
    const prompt = buildPrompt({
      type: original.type,
      resume: original.input_resume,
      jobDescription: original.job_description || "",
      language: original.language,
      targetCountry: original.target_country,
      optimizationInstruction: `${intensity.instruction} Gere uma nova versão, diferente da anterior, mantendo o mesmo contexto salvo.`,
      planLabel: intensity.label,
      intensityPercent: intensity.percent
    });

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content: "Você regenera documentos profissionais mantendo contexto, fatos verdadeiros e melhorando a versão anterior. Preserve telefone, e-mail e cidade/localização quando constarem no documento de origem. Mantenha um único idioma, o mesmo do pedido."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.3
    });

    const rawOutput = completion.choices[0]?.message?.content?.trim() || "";
    const { document, recommendations } = parseAiOutput(rawOutput);
    if (!document) return NextResponse.json({ error: "A IA não retornou um documento válido." }, { status: 500 });

    const { data: inserted } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        type: original.type,
        language: original.language,
        target_country: original.target_country,
        input_resume: original.input_resume,
        job_description: original.job_description,
        output: document
      })
      .select("id,created_at")
      .single();

    return NextResponse.json({
      output: document,
      generation: inserted,
      appliedImprovements: scoreAppliedImprovements(recommendations)
    });
  } catch (error) {
    console.error("regenerate_error", error);
    return NextResponse.json({ error: "Erro interno ao regenerar documento." }, { status: 500 });
  }
}

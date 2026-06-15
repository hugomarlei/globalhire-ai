import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { canUseFeature, effectivePlanFromSubscription, plans } from "@/lib/plans";
import { buildRateLimitKey, cooldownLimit } from "@/lib/rate-limit";
import { verifyTurnstileToken } from "@/lib/turnstile";
import { getLatestActiveSubscription } from "@/lib/subscription-state";
import { getClientIp, rejectInvalidOrigin } from "@/lib/security";
import { buildAtsScoreOptimizedResume } from "@/lib/ats-score-optimizer";

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
  template: z.enum(["classic", "professional", "modern"]).default("professional"),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#0f766e"),
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

    const { document, recommendations, resumeData } = buildAtsScoreOptimizedResume({
      resume: parsed.data.resume,
      jobDescription: parsed.data.jobDescription,
      language: parsed.data.language,
      found: parsed.data.found,
      missing: parsed.data.missing,
      recommendations: parsed.data.recommendations,
      template: parsed.data.template,
      primaryColor: parsed.data.primaryColor
    });
    const appliedImprovements = scoreAppliedImprovements(recommendations);

    return NextResponse.json({
      output: document,
      resumeData,
      appliedImprovements,
      saved: false,
      quality: {
        score: Math.max(parsed.data.score, parsed.data.match),
        issues: [],
        shouldRevise: false
      }
    });
  } catch (error) {
    console.error("score_optimize_error", error);
    return NextResponse.json({ error: "Erro interno ao otimizar o currículo." }, { status: 500 });
  }
}

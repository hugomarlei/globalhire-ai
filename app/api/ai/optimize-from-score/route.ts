import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { buildPrompt } from "@/prompts/ai-prompts";
import { createClient } from "@/lib/supabase-server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { canUseFeature, effectivePlanFromSubscription, optimizationIntensity, plans } from "@/lib/plans";
import { cooldownLimit } from "@/lib/rate-limit";
import { parseAiOutput } from "@/lib/document-format";
import { verifyTurnstileToken } from "@/lib/turnstile";

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
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Faça login para otimizar o currículo." }, { status: 401 });

    const ip = request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for") || "unknown";
    const limited = cooldownLimit(`ai-score-optimize:${user.id || ip}`, 30_000);
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

    const [{ data: profile }, { data: subscription }] = await Promise.all([
      supabase
        .from("profiles")
        .select("plan,is_blocked")
        .eq("id", user.id)
        .single(),
      supabase
        .from("subscriptions")
        .select("plan,status")
        .eq("user_id", user.id)
        .maybeSingle()
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
    const prompt = buildPrompt({
      type: "ats_resume",
      resume: parsed.data.resume,
      jobDescription: `${parsed.data.jobDescription}\n\n${scoreContext}`,
      language: parsed.data.language,
      targetCountry: parsed.data.targetCountry,
      optimizationInstruction: intensity.instruction,
      planLabel: intensity.label,
      intensityPercent: intensity.percent
    });

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Você é um especialista sênior em ATS e currículo internacional. Reescreva com base nos achados do score, sem inventar fatos."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.25
    });

    const rawOutput = completion.choices[0]?.message?.content?.trim() || "";
    if (!rawOutput) return NextResponse.json({ error: "A IA não retornou conteúdo." }, { status: 500 });

    const { document, recommendations } = parseAiOutput(rawOutput);
    if (!document) return NextResponse.json({ error: "A IA não retornou um currículo válido." }, { status: 500 });
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

    return NextResponse.json({ output: document, appliedImprovements, saved: true });
  } catch (error) {
    console.error("score_optimize_error", error);
    return NextResponse.json({ error: "Erro interno ao otimizar o currículo." }, { status: 500 });
  }
}

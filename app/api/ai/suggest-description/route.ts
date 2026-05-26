import { NextRequest, NextResponse } from "next/server";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { createClient } from "@/lib/supabase-server";
import { buildRateLimitKey, cooldownLimit } from "@/lib/rate-limit";
import { getClientIp, rejectInvalidOrigin } from "@/lib/security";
import { suggestDescriptionSchema } from "@/lib/resumes/validation";
import { canUseFeature, effectivePlanFromSubscription, featureMinimumPlan, plans } from "@/lib/plans";
import { getLatestActiveSubscription } from "@/lib/subscription-state";

function parseJsonArray(value: string) {
  try {
    const parsed = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.map((item) => String(item).trim()).filter(Boolean);
  } catch {
    const match = value.match(/\[[\s\S]*\]/);
    if (match) return parseJsonArray(match[0]);
  }
  return [];
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

    const limited = await cooldownLimit(buildRateLimitKey("resume-suggest", user.id, getClientIp(request)), 20_000);
    if (!limited.ok) return NextResponse.json({ error: "Aguarde alguns segundos antes de pedir outra sugestao." }, { status: 429 });

    const parsed = suggestDescriptionSchema.safeParse(await request.json());
    if (!parsed.success) return NextResponse.json({ error: parsed.error.errors[0]?.message || "Dados invalidos." }, { status: 400 });

    const [{ data: profile }, subscription] = await Promise.all([
      supabase.from("profiles").select("plan,is_blocked").eq("id", user.id).single(),
      getLatestActiveSubscription(supabase, user.id)
    ]);
    if (profile?.is_blocked) return NextResponse.json({ error: "Conta bloqueada." }, { status: 403 });
    const planId = effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, user.email);
    if (!canUseFeature(planId, "resume_ai_writer")) {
      return NextResponse.json({
        error: `Este assistente esta disponivel a partir do plano ${plans[featureMinimumPlan.resume_ai_writer].name}.`
      }, { status: 403 });
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json({ error: "GROQ_API_KEY nao configurada no servidor." }, { status: 500 });
    }

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Voce e um resume writer senior. Responda apenas com JSON valido: array de strings. Use estritamente o idioma solicitado. Nao invente empresas, cargos, metricas, diplomas ou tecnologias. Quando faltar dado, escreva de forma honesta e especifica sem criar fatos."
        },
        {
          role: "user",
          content: JSON.stringify({
            task: "Gerar 2 a 4 bullets curtos para curriculo.",
            section: parsed.data.section,
            role: parsed.data.role,
            company: parsed.data.company,
            currentDescription: parsed.data.currentDescription,
            targetJobDescription: parsed.data.jobDescription,
            language: parsed.data.language,
            constraints: [
              "Retorne somente um array JSON de strings.",
              "Nao misture idiomas.",
              "Nao invente fatos, numeros, ferramentas ou responsabilidades nao sustentadas pelo input.",
              "Incorpore termos relevantes da vaga somente quando forem compatíveis com o input."
            ]
          })
        }
      ],
      temperature: 0.2
    });

    const raw = completion.choices[0]?.message?.content?.trim() || "";
    const bullets = parseJsonArray(raw).slice(0, 4);
    if (!bullets.length) return NextResponse.json({ error: "A IA nao retornou sugestoes validas." }, { status: 500 });

    return NextResponse.json({ bullets });
  } catch (error) {
    console.error("resume_suggest_error", error);
    return NextResponse.json({ error: "Erro interno ao gerar sugestoes." }, { status: 500 });
  }
}

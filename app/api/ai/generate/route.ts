import { NextRequest, NextResponse } from "next/server";
import { buildPrompt } from "@/prompts/ai-prompts";
import { createClient } from "@/lib/supabase-server";
import { generateSchema } from "@/lib/validation";
import { groq, GROQ_MODEL } from "@/lib/groq";
import { effectivePlanId, plans } from "@/lib/plans";
import { rateLimit } from "@/lib/rate-limit";
import { parseAiOutput } from "@/lib/document-format";

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
    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Faca login para continuar." }, { status: 401 });

    const ip = request.headers.get("x-forwarded-for") || user.id;
    const limited = rateLimit(`ai:${ip}`, 8, 60_000);
    if (!limited.ok) return NextResponse.json({ error: "Muitas tentativas. Tente novamente em 1 minuto." }, { status: 429 });

    const parsed = generateSchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Dados invalidos." }, { status: 400 });
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("plan,is_blocked")
      .eq("id", user.id)
      .single();

    if (profile?.is_blocked) return NextResponse.json({ error: "Conta bloqueada." }, { status: 403 });

    const plan = plans[effectivePlanId(profile?.plan, user.email)] || plans.free;
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
    
    const prompt = buildPrompt({
      type: parsed.data.type,
      resume: parsed.data.resume,
      jobDescription: parsed.data.jobDescription,
      language: parsed.data.language,
      targetCountry: parsed.data.targetCountry
    });

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Voce e um estrategista senior de carreira internacional. Seu trabalho e adaptar documentos ao alvo da vaga, nao apenas reescrever texto. Preserve somente fatos verdadeiros."
        },
        { role: "user", content: prompt }
      ],
      temperature: 0.25
    });

    const rawOutput = completion.choices[0]?.message?.content?.trim() || "";
    if (!rawOutput) return NextResponse.json({ error: "A IA nao retornou conteudo." }, { status: 500 });

    const { document, recommendations } = parseAiOutput(rawOutput);
    const appliedImprovements = scoreAppliedImprovements(recommendations);
    if (!document) return NextResponse.json({ error: "A IA nao retornou um documento valido." }, { status: 500 });

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
      recommendations: appliedImprovements
    });
  } catch (error) {
    console.error("ai_generate_error", error);
    return NextResponse.json({ error: "Erro interno ao gerar documento." }, { status: 500 });
  }
}

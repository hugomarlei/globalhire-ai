import { DashboardGenerator } from "@/components/dashboard-generator";
import { UpgradeGate } from "@/components/upgrade-gate";
import { requireUser } from "@/lib/auth";
import { allowedGenerationTypes, canUseFeature, effectivePlanFromSubscription, featureMinimumPlan, plans } from "@/lib/plans";
import { createClient } from "@/lib/supabase-server";
import type { GenerationType } from "@/lib/types";

export const dynamic = "force-dynamic";

const generationTypes: GenerationType[] = ["ats_resume", "cover_letter", "linkedin_summary", "recruiter_message", "interview_prep", "translate_resume"];
const pageContext: Record<GenerationType, { title: string; subtitle: string }> = {
  ats_resume: {
    title: "Gerador de Currículo ATS",
    subtitle: "Crie uma versão internacional, otimizada para ATS e adaptada à vaga."
  },
  cover_letter: {
    title: "Gerador de Carta de Apresentação",
    subtitle: "Transforme sua experiência em uma carta clara, convincente e personalizada."
  },
  linkedin_summary: {
    title: "Gerador de Resumo LinkedIn",
    subtitle: "Posicione seu perfil para recrutadores internacionais com uma narrativa forte."
  },
  recruiter_message: {
    title: "Mensagem para Recrutador",
    subtitle: "Crie uma abordagem curta, profissional e relevante."
  },
  interview_prep: {
    title: "Preparação para Entrevista",
    subtitle: "Gere perguntas prováveis, respostas e pontos de atenção por vaga."
  },
  translate_resume: {
    title: "Tradução e Adaptação Internacional",
    subtitle: "Adapte idioma, tom e convenções do currículo para o país-alvo."
  }
};

export default async function GeneratorPage({ searchParams }: { searchParams?: Promise<{ tipo?: string }> }) {
  const { user, profile } = await requireUser();
  const supabase = await createClient();
  const { data: subscription } = await supabase
    .from("subscriptions")
    .select("plan,status")
    .eq("user_id", user.id)
    .maybeSingle();
  const planId = effectivePlanFromSubscription(profile?.plan, subscription?.plan, subscription?.status, profile?.email || user.email);
  const plan = plans[planId] || plans.free;
  const params = searchParams ? await searchParams : {};
  const initialType = generationTypes.includes(params.tipo as GenerationType) ? params.tipo as GenerationType : undefined;
  const selectedType = initialType || "ats_resume";
  const context = pageContext[selectedType];
  const allowedTypes = allowedGenerationTypes(planId);

  if (!canUseFeature(planId, selectedType)) {
    const required = plans[featureMinimumPlan[selectedType]].name;
    return (
      <UpgradeGate
        requiredPlan={`Disponível a partir do plano ${required}`}
        title={`${context.title} não está incluído no seu plano atual`}
        description="Seu plano atual continua funcionando para as ferramentas incluídas nele. Para liberar esta ferramenta, escolha um plano compatível."
      />
    );
  }

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-3xl font-semibold">{context.title}</h1>
        <p className="mt-2 text-sm text-white/60">{context.subtitle}</p>
      </div>
      <DashboardGenerator hasPaidPlan={plan.id !== "free"} initialType={selectedType} allowedTypes={allowedTypes} />
    </div>
  );
}

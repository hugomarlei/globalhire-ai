import { DashboardGenerator } from "@/components/dashboard-generator";
import { requireUser } from "@/lib/auth";
import { effectivePlanId, plans } from "@/lib/plans";
import type { GenerationType } from "@/lib/types";

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
  const plan = plans[effectivePlanId(profile?.plan, profile?.email || user.email)] || plans.free;
  const params = searchParams ? await searchParams : {};
  const initialType = generationTypes.includes(params.tipo as GenerationType) ? params.tipo as GenerationType : undefined;
  const context = pageContext[initialType || "ats_resume"];

  return (
    <div className="grid gap-4">
      <div>
        <h1 className="text-3xl font-semibold">{context.title}</h1>
        <p className="mt-2 text-sm text-white/60">{context.subtitle}</p>
      </div>
      <DashboardGenerator hasPaidPlan={plan.id !== "free"} initialType={initialType} />
    </div>
  );
}

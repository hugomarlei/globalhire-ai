import type { GenerationType } from "@/lib/types";

export type PlanId = "free" | "starter" | "pro" | "elite";

export const plans = {
  free: {
    id: "free",
    name: "Free",
    price: "R$0",
    monthlyLimit: 1,
    features: ["1 geração premium por mês", "Currículo ATS", "Carta de apresentação", "Resumo LinkedIn", "ATS Score"]
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: "R$29/mes",
    monthlyLimit: 10,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID",
    features: ["10 gerações por mês", "Currículo ATS", "Carta de apresentação", "Resumo LinkedIn"]
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "R$79/mes",
    monthlyLimit: 9999,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
    features: ["Gerações ilimitadas", "Tudo do Starter", "Mensagem para recrutador", "Simular entrevista", "Traduzir currículo", "ATS Score e palavras-chave"]
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: "R$149/mes",
    monthlyLimit: 9999,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID",
    features: [
      "Tudo do Pro",
      "Geração premium 110%",
      "Máximo match com a vaga",
      "Inserção inteligente de termos ATS",
      "Adaptação intensa por país",
      "Respostas para recrutadores"
    ]
  }
} satisfies Record<string, {
  id: PlanId;
  name: string;
  price: string;
  monthlyLimit: number;
  stripePriceEnv?: string;
  features: string[];
}>;

export const paidPlans = [plans.starter, plans.pro, plans.elite];

export const planRank: Record<PlanId, number> = {
  free: 0,
  starter: 1,
  pro: 2,
  elite: 3
};

export const featureMinimumPlan: Record<GenerationType | "ats_score" | "keywords", PlanId> = {
  ats_resume: "free",
  cover_letter: "free",
  linkedin_summary: "free",
  recruiter_message: "pro",
  interview_prep: "pro",
  translate_resume: "pro",
  ats_score: "free",
  keywords: "free"
};

export const generationTypeLabels: Record<GenerationType, string> = {
  ats_resume: "Currículo ATS",
  cover_letter: "Carta de apresentação",
  linkedin_summary: "Resumo LinkedIn",
  recruiter_message: "Mensagem para recrutador",
  interview_prep: "Simular entrevista",
  translate_resume: "Traduzir currículo"
};

export function canUseFeature(planId: PlanId, feature: GenerationType | "ats_score" | "keywords") {
  return planRank[planId] >= planRank[featureMinimumPlan[feature]];
}

export function allowedGenerationTypes(planId: PlanId) {
  return (Object.keys(generationTypeLabels) as GenerationType[]).filter((type) => canUseFeature(planId, type));
}

export function optimizationIntensity(planId: PlanId) {
  if (planId === "elite" || planId === "free") {
    return {
      label: planId === "free" ? "Free premium preview" : "Elite",
      percent: "110%",
      instruction:
        "Aplique otimização máxima: busque o maior match possível com a vaga, explore intensamente termos ATS compatíveis, reorganize experiências com agressividade estratégica e alinhe o currículo à descrição sem mentir ou criar fatos. Esta experiência deve mostrar o potencial premium do produto."
    };
  }

  if (planId === "pro") {
    return {
      label: "Pro",
      percent: "75%",
      instruction:
        "Aplique otimização forte: reordene informações, reescreva bullets com impacto, incorpore termos ATS relevantes e adapte a narrativa do candidato à vaga com alta precisão."
    };
  }

  return {
    label: "Starter",
    percent: "50%",
    instruction:
      "Aplique otimização moderada: melhore clareza, estrutura e alinhamento básico com a vaga, mantendo adaptação conservadora e fiel ao currículo original."
  };
}

export function hasAdminBypass(email?: string | null) {
  const bypassEmails = (process.env.ADMIN_BYPASS_EMAILS || "hugomarcianoleite@gmail.com")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  return Boolean(email && bypassEmails.includes(email.toLowerCase()));
}

export function effectivePlanId(plan: string | null | undefined, email?: string | null): PlanId {
  if (hasAdminBypass(email)) return "elite";
  if (plan === "starter" || plan === "pro" || plan === "elite") return plan;
  return "free";
}

export function planFromPriceId(priceId?: string | null): PlanId {
  if (!priceId) return "free";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID) return "elite";
  return "free";
}

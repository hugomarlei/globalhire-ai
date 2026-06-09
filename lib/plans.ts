import type { GenerationType } from "@/lib/types";

export type PlanId = "free" | "starter" | "pro" | "elite";
export type PlanFeature = GenerationType | "ats_score" | "keywords" | "resume_builder" | "resume_ai_writer";

export const planDisplayPrices = {
  free: "R$0",
  starter: "R$7/mês",
  pro: "R$14/mês",
  elite: "R$18/mês"
} as const;

export const plans = {
  free: {
    id: "free",
    name: "Free",
    price: planDisplayPrices.free,
    monthlyLimit: 1,
    features: [
      "1 uso premium por mês",
      "Todas as ferramentas por degustação",
      "Currículo ATS",
      "Carta de apresentação",
      "Resumo LinkedIn",
      "Mensagem para recrutador",
      "Guia para entrevista",
      "Traduzir currículo",
      "ATS Score e palavras-chave"
    ]
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: planDisplayPrices.starter,
    monthlyLimit: 10,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID",
    features: ["10 gerações por mês", "Currículo ATS por vaga", "Carta de apresentação", "Resumo LinkedIn"]
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: planDisplayPrices.pro,
    monthlyLimit: 9999,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
    features: ["Gerações ilimitadas", "Tudo do Starter", "Mensagem para recrutador", "Guia para entrevista", "Traduzir currículo", "Score de aderência"]
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: planDisplayPrices.elite,
    monthlyLimit: 9999,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID",
    features: [
      "Tudo do Pro",
      "Otimização avançada e consistente",
      "Ajuste forte ao contexto da vaga",
      "Inclusão estratégica de palavras-chave ATS",
      "Adaptação por país e idioma",
      "Saídas prontas para recrutadores"
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

export const featureMinimumPlan: Record<PlanFeature, PlanId> = {
  ats_resume: "free",
  cover_letter: "free",
  linkedin_summary: "free",
  recruiter_message: "free",
  interview_prep: "free",
  translate_resume: "free",
  ats_score: "free",
  keywords: "free",
  resume_builder: "free",
  resume_ai_writer: "free"
};

export const generationTypeLabels: Record<GenerationType, string> = {
  ats_resume: "Currículo ATS",
  cover_letter: "Carta de apresentação",
  linkedin_summary: "Resumo LinkedIn",
  recruiter_message: "Mensagem para recrutador",
  interview_prep: "Guia para entrevista",
  translate_resume: "Traduzir currículo"
};

export function canUseFeature(planId: PlanId, feature: PlanFeature) {
  return planRank[planId] >= planRank[featureMinimumPlan[feature]];
}

export function allowedGenerationTypes(planId: PlanId) {
  return (Object.keys(generationTypeLabels) as GenerationType[]).filter((type) => canUseFeature(planId, type));
}

export function optimizationIntensity(planId: PlanId) {
  if (planId === "elite" || planId === "free") {
    return {
      label: planId === "free" ? "Free preview" : "Elite",
      percent: "90%",
      instruction:
        "Aplique otimização máxima com foco em evidências: priorize fatos do currículo, palavras-chave compatíveis com a vaga e reorganização estratégica do conteúdo sem inventar dados, sem exagerar promessas e sem sacrificar clareza."
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

export function getPlanFromStripePriceId(priceId?: string | null): Exclude<PlanId, "free"> | null {
  if (!priceId) return null;
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) return "starter";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return "pro";
  if (priceId === process.env.NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID) return "elite";
  console.warn("unknown_price_id", { priceId: `${priceId.slice(0, 12)}...` });
  return null;
}

export function planFromPriceId(priceId?: string | null): PlanId {
  return getPlanFromStripePriceId(priceId) || "free";
}

export function effectivePlanFromSubscription(
  profilePlan: string | null | undefined,
  subscriptionPlan: string | null | undefined,
  subscriptionStatus?: string | null,
  email?: string | null
): PlanId {
  if (hasAdminBypass(email)) return "elite";
  if (
    (subscriptionStatus === "active" || subscriptionStatus === "trialing") &&
    (subscriptionPlan === "starter" || subscriptionPlan === "pro" || subscriptionPlan === "elite")
  ) {
    return subscriptionPlan;
  }

  if (subscriptionStatus === "canceled" || subscriptionStatus === "unpaid" || subscriptionStatus === "incomplete_expired") {
    return "free";
  }

  if (profilePlan === "starter" || profilePlan === "pro" || profilePlan === "elite") return profilePlan;
  return "free";
}

export type PlanId = "free" | "starter" | "pro" | "elite";

export const plans = {
  free: {
    id: "free",
    name: "Free",
    price: "R$0",
    monthlyLimit: 1,
    features: ["1 geração teste", "Preview do produto", "Histórico básico"]
  },
  starter: {
    id: "starter",
    name: "Starter",
    price: "R$29/mes",
    monthlyLimit: 3,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID",
    features: ["3 gerações por mês", "Currículo ATS", "Carta de apresentação", "LinkedIn summary"]
  },
  pro: {
    id: "pro",
    name: "Pro",
    price: "R$79/mes",
    monthlyLimit: 9999,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_PRO_PRICE_ID",
    features: ["Gerações ilimitadas", "Currículo", "Carta", "LinkedIn", "Entrevista", "Tradução"]
  },
  elite: {
    id: "elite",
    name: "Elite",
    price: "R$149/mes",
    monthlyLimit: 9999,
    stripePriceEnv: "NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID",
    features: [
      "Tudo do Pro",
      "Modo Europa",
      "Modo Canadá",
      "Modo EUA",
      "Otimização premium",
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

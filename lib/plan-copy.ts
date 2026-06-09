import type { Locale } from "@/lib/i18n";
import type { PlanId } from "@/lib/plans";
import { paidPlans, planDisplayPrices, plans } from "@/lib/plans";
import { formatStripePaidPlanPrice } from "@/lib/plan-price-display";
import type { StripePriceCatalogJson } from "@/lib/stripe-price-catalog-types";

export type PlanDisplayRow = {
  id: PlanId;
  name: string;
  price: string;
  features: string[];
};

type PlanCopy = Omit<PlanDisplayRow, "id">;

const byLocale: Record<Locale, Record<PlanId, PlanCopy>> = {
  "pt-BR": {
    free: { name: plans.free.name, price: planDisplayPrices.free, features: plans.free.features },
    starter: { name: plans.starter.name, price: planDisplayPrices.starter, features: plans.starter.features },
    pro: { name: plans.pro.name, price: planDisplayPrices.pro, features: plans.pro.features },
    elite: { name: plans.elite.name, price: planDisplayPrices.elite, features: plans.elite.features }
  },
  en: {
    free: {
      name: "Free",
      price: "R$0",
      features: [
        "1 premium use per month",
        "All tools in preview mode",
        "ATS resume",
        "Cover letter",
        "LinkedIn summary",
        "Recruiter message",
        "Interview guide",
        "Resume translation",
        "ATS Score and keywords"
      ]
    },
    starter: {
      name: "Starter",
      price: "R$29/mo",
      features: ["10 generations per month", "ATS resume", "Cover letter", "LinkedIn summary"]
    },
    pro: {
      name: "Pro",
      price: "R$79/mo",
      features: [
        "Unlimited generations",
        "Everything in Starter",
        "Recruiter message",
        "Interview guide",
        "Resume translation",
        "ATS Score and keywords"
      ]
    },
    elite: {
      name: "Elite",
      price: "R$149/mo",
      features: [
        "Everything in Pro",
        "Advanced and consistent optimization",
        "Strong alignment to the role context",
        "Strategic ATS keyword inclusion",
        "Country and language adaptation",
        "Outputs ready for recruiters"
      ]
    }
  },
  es: {
    free: {
      name: "Free",
      price: "R$0",
      features: [
        "1 uso premium al mes",
        "Todas las herramientas en modo vista previa",
        "Currículum ATS",
        "Carta de presentación",
        "Resumen LinkedIn",
        "Mensaje al reclutador",
        "Guía para entrevista",
        "Traducción de currículum",
        "ATS Score y palabras clave"
      ]
    },
    starter: {
      name: "Starter",
      price: "R$29/mes",
      features: ["10 generaciones al mes", "Currículum ATS", "Carta de presentación", "Resumen LinkedIn"]
    },
    pro: {
      name: "Pro",
      price: "R$79/mes",
      features: [
        "Generaciones ilimitadas",
        "Todo lo de Starter",
        "Mensaje al reclutador",
        "Guía para entrevista",
        "Traducción de currículum",
        "ATS Score y palabras clave"
      ]
    },
    elite: {
      name: "Elite",
      price: "R$149/mes",
      features: [
        "Todo lo de Pro",
        "Optimización avanzada y consistente",
        "Ajuste fuerte al contexto de la vacante",
        "Inclusión estratégica de palabras clave ATS",
        "Adaptación por país e idioma",
        "Salidas listas para reclutadores"
      ]
    }
  },
  fr: {
    free: {
      name: "Free",
      price: "R$0",
      features: [
        "1 utilisation premium par mois",
        "Tous les outils en aperçu",
        "CV ATS",
        "Lettre de motivation",
        "Résumé LinkedIn",
        "Message recruteur",
        "Guide d’entretien",
        "Traduction de CV",
        "ATS Score et mots-clés"
      ]
    },
    starter: {
      name: "Starter",
      price: "R$29/mois",
      features: ["10 générations par mois", "CV ATS", "Lettre de motivation", "Résumé LinkedIn"]
    },
    pro: {
      name: "Pro",
      price: "R$79/mois",
      features: [
        "Générations illimitées",
        "Tout le pack Starter",
        "Message recruteur",
        "Guide d’entretien",
        "Traduction de CV",
        "ATS Score et mots-clés"
      ]
    },
    elite: {
      name: "Elite",
      price: "R$149/mois",
      features: [
        "Tout le pack Pro",
        "Optimisation avancée et cohérente",
        "Ajustement fort au contexte du poste",
        "Intégration stratégique de mots-clés ATS",
        "Adaptation par pays et langue",
        "Livrables prêts pour recruteurs"
      ]
    }
  }
};

/**
 * Localized plan rows for UI.
 * When `stripeCatalog` is provided and contains live `unitAmount`, paid-plan `price` strings
 * come from Stripe (see `formatStripePaidPlanPrice`). Otherwise uses **FALLBACK_STATIC_PRICES**
 * from this file / `lib/plans.ts` — same copy as before the dynamic pricing rollout.
 */
export function getLocalizedPlans(
  locale: Locale,
  stripeCatalog?: StripePriceCatalogJson | null
): { free: PlanDisplayRow; paid: PlanDisplayRow[] } {
  const row = byLocale[locale];
  return {
    free: { id: "free", ...row.free },
    paid: paidPlans.map((plan) => {
      const base = row[plan.id];
      const stripeRow = stripeCatalog?.paid?.[plan.id];
      const price =
        stripeRow && stripeRow.unitAmount != null ? formatStripePaidPlanPrice(locale, stripeRow) : base.price;
      return { id: plan.id, name: base.name, price, features: base.features };
    })
  };
}

export function getLocalizedPlanRow(locale: Locale, planId: PlanId, stripeCatalog?: StripePriceCatalogJson | null): PlanDisplayRow {
  const { free, paid } = getLocalizedPlans(locale, stripeCatalog);
  if (planId === "free") return free;
  const hit = paid.find((p) => p.id === planId);
  return hit || free;
}

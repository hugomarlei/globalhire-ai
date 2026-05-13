import type { Locale } from "@/lib/i18n";
import type { PlanId } from "@/lib/plans";
import { paidPlans, plans } from "@/lib/plans";

export type PlanDisplayRow = {
  id: PlanId;
  name: string;
  price: string;
  features: string[];
};

type PlanCopy = Omit<PlanDisplayRow, "id">;

const byLocale: Record<Locale, Record<PlanId, PlanCopy>> = {
  "pt-BR": {
    free: { name: plans.free.name, price: plans.free.price, features: plans.free.features },
    starter: { name: plans.starter.name, price: plans.starter.price, features: plans.starter.features },
    pro: { name: plans.pro.name, price: plans.pro.price, features: plans.pro.features },
    elite: { name: plans.elite.name, price: plans.elite.price, features: plans.elite.features }
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
        "Interview simulation",
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
        "Interview simulation",
        "Resume translation",
        "ATS Score and keywords"
      ]
    },
    elite: {
      name: "Elite",
      price: "R$149/mo",
      features: [
        "Everything in Pro",
        "110% premium generation",
        "Maximum job match",
        "Smart ATS keyword insertion",
        "Intensive country adaptation",
        "Recruiter-ready replies"
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
        "Simulación de entrevista",
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
        "Simulación de entrevista",
        "Traducción de currículum",
        "ATS Score y palabras clave"
      ]
    },
    elite: {
      name: "Elite",
      price: "R$149/mes",
      features: [
        "Todo lo de Pro",
        "Generación premium 110%",
        "Máximo encaje con la vacante",
        "Inserción inteligente de términos ATS",
        "Adaptación intensa por país",
        "Respuestas para reclutadores"
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
        "Simulation d'entretien",
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
        "Simulation d'entretien",
        "Traduction de CV",
        "ATS Score et mots-clés"
      ]
    },
    elite: {
      name: "Elite",
      price: "R$149/mois",
      features: [
        "Tout le pack Pro",
        "Génération premium 110%",
        "Adéquation maximale au poste",
        "Insertion intelligente de termes ATS",
        "Adaptation poussée par pays",
        "Réponses prêtes pour recruteurs"
      ]
    }
  }
};

export function getLocalizedPlans(locale: Locale): { free: PlanDisplayRow; paid: PlanDisplayRow[] } {
  const row = byLocale[locale];
  return {
    free: { id: "free", ...row.free },
    paid: paidPlans.map((plan) => ({ id: plan.id, ...row[plan.id] }))
  };
}

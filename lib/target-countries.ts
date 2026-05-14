import type { Locale } from "@/lib/i18n";

/** Valores canónicos enviados à API / gravados (PT) — estáveis para prompts e histórico. */
export const TARGET_COUNTRY_CANONICAL = ["Brasil", "Estados Unidos", "Europa"] as const;

export type TargetCountryCanonical = (typeof TARGET_COUNTRY_CANONICAL)[number];

export const targetCountryCanonicalSet = new Set<string>(TARGET_COUNTRY_CANONICAL);

const labels: Record<Locale, Record<TargetCountryCanonical, string>> = {
  "pt-BR": {
    Brasil: "Brasil",
    "Estados Unidos": "Estados Unidos",
    Europa: "Europa"
  },
  en: {
    Brasil: "Brazil",
    "Estados Unidos": "United States",
    Europa: "Europe (region)"
  },
  es: {
    Brasil: "Brasil",
    "Estados Unidos": "Estados Unidos",
    Europa: "Europa"
  },
  fr: {
    Brasil: "Brésil",
    "Estados Unidos": "États-Unis",
    Europa: "Europe"
  }
};

export function getTargetCountrySelectOptions(locale: Locale): Array<{ value: TargetCountryCanonical; label: string }> {
  return TARGET_COUNTRY_CANONICAL.map((value) => ({ value, label: labels[locale][value] }));
}

import type { Locale } from "@/lib/i18n";

/** Aviso quando o corpo jurídico completo está apenas em PT-BR (LGPD / foro BR). */
export const legalBindingNotice: Record<Locale, string | null> = {
  "pt-BR": null,
  en: "The authoritative legal text for this policy is in Portuguese (Brazil). For the official version, switch the interface to Português (Brasil) or contact privacy@globalhireai.com.br.",
  es: "El texto legal vinculante de esta política está en portugués (Brasil). Para la versión oficial, cambia el idioma a Português (Brasil) o escribe a privacy@globalhireai.com.br.",
  fr: "Le texte juridique faisant foi pour cette politique est en portugais (Brésil). Pour la version officielle, passez l’interface en Português (Brasil) ou écrivez à privacy@globalhireai.com.br."
};

import type { Locale } from "@/lib/i18n";

export type LegalPageChrome = {
  lastUpdatedPrefix: string;
  legalNavAria: string;
  linkPrivacy: string;
  linkTerms: string;
  linkCookies: string;
  linkRefund: string;
  linkData: string;
  linkSupport: string;
  eyebrowDefault: string;
};

export const legalPageChrome: Record<Locale, LegalPageChrome> = {
  "pt-BR": {
    lastUpdatedPrefix: "Última atualização:",
    legalNavAria: "Links legais",
    linkPrivacy: "Privacidade",
    linkTerms: "Termos",
    linkCookies: "Cookies",
    linkRefund: "Cancelamento e reembolso",
    linkData: "Tratamento de dados",
    linkSupport: "Suporte",
    eyebrowDefault: "GlobalHire AI"
  },
  en: {
    lastUpdatedPrefix: "Last updated:",
    legalNavAria: "Legal links",
    linkPrivacy: "Privacy",
    linkTerms: "Terms",
    linkCookies: "Cookies",
    linkRefund: "Cancellation and refund",
    linkData: "Data processing",
    linkSupport: "Support",
    eyebrowDefault: "GlobalHire AI"
  },
  es: {
    lastUpdatedPrefix: "Última actualización:",
    legalNavAria: "Enlaces legales",
    linkPrivacy: "Privacidad",
    linkTerms: "Términos",
    linkCookies: "Cookies",
    linkRefund: "Cancelación y reembolso",
    linkData: "Tratamiento de datos",
    linkSupport: "Soporte",
    eyebrowDefault: "GlobalHire AI"
  },
  fr: {
    lastUpdatedPrefix: "Dernière mise à jour :",
    legalNavAria: "Liens juridiques",
    linkPrivacy: "Confidentialité",
    linkTerms: "Conditions",
    linkCookies: "Cookies",
    linkRefund: "Annulation et remboursement",
    linkData: "Traitement des données",
    linkSupport: "Assistance",
    eyebrowDefault: "GlobalHire AI"
  }
};

export type LegalDocTitles = {
  privacy: string;
  terms: string;
  cookies: string;
  refund: string;
  dataProcessing: string;
  support: string;
};

export const legalDocTitles: Record<Locale, LegalDocTitles> = {
  "pt-BR": {
    privacy: "Política de Privacidade",
    terms: "Termos de Uso",
    cookies: "Política de Cookies",
    refund: "Política de Cancelamento e Reembolso",
    dataProcessing: "Informações sobre tratamento de dados",
    support: "Suporte"
  },
  en: {
    privacy: "Privacy Policy",
    terms: "Terms of Use",
    cookies: "Cookie Policy",
    refund: "Cancellation and Refund Policy",
    dataProcessing: "Data processing information",
    support: "Support"
  },
  es: {
    privacy: "Política de privacidad",
    terms: "Términos de uso",
    cookies: "Política de cookies",
    refund: "Política de cancelación y reembolso",
    dataProcessing: "Información sobre tratamiento de datos",
    support: "Soporte"
  },
  fr: {
    privacy: "Politique de confidentialité",
    terms: "Conditions d’utilisation",
    cookies: "Politique relative aux cookies",
    refund: "Politique d’annulation et de remboursement",
    dataProcessing: "Informations sur le traitement des données",
    support: "Assistance"
  }
};

/** Data da última revisão legal exibida por locale (mesmo evento editorial). */
export const legalUpdatedAtByLocale: Record<Locale, string> = {
  "pt-BR": "11 de maio de 2026",
  en: "May 11, 2026",
  es: "11 de mayo de 2026",
  fr: "11 mai 2026"
};

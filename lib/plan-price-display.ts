import type { Locale } from "@/lib/i18n";
import type { StripePaidPlanPriceJson, StripePriceCatalogJson } from "@/lib/stripe-price-catalog-types";

function intlLocaleForCurrency(locale: Locale): string {
  switch (locale) {
    case "pt-BR":
      return "pt-BR";
    case "es":
      return "es-ES";
    case "fr":
      return "fr-FR";
    default:
      return "en-US";
  }
}

function recurringSuffix(locale: Locale, interval: string | null, intervalCount: number): string {
  if (!interval) return "";
  const n = intervalCount > 1 ? intervalCount : 1;
  const plural = n > 1;

  if (interval === "month") {
    if (locale === "pt-BR") return plural ? `/ ${n} meses` : "/ mês";
    if (locale === "es") return plural ? `/ ${n} meses` : "/ mes";
    if (locale === "fr") return plural ? `/ ${n} mois` : "/ mois";
    return plural ? `/ ${n} months` : "/ month";
  }
  if (interval === "year") {
    if (locale === "pt-BR") return plural ? `/ ${n} anos` : "/ ano";
    if (locale === "es") return plural ? `/ ${n} años` : "/ año";
    if (locale === "fr") return plural ? `/ ${n} ans` : "/ an";
    return plural ? `/ ${n} years` : "/ year";
  }
  if (interval === "week") {
    if (locale === "pt-BR") return plural ? `/ ${n} semanas` : "/ semana";
    if (locale === "es") return plural ? `/ ${n} semanas` : "/ semana";
    if (locale === "fr") return plural ? `/ ${n} semaines` : "/ semaine";
    return plural ? `/ ${n} weeks` : "/ week";
  }
  return "";
}

/**
 * Formats a Stripe Price for UI. Safe on client (no Stripe SDK).
 * FALLBACK_STATIC_PRICES in plan-copy apply when this is not used (catalog null / missing row).
 */
export function formatStripePaidPlanPrice(locale: Locale, row: StripePaidPlanPriceJson): string {
  if (row.unitAmount == null) return "";
  const currency = (row.currency || "brl").toUpperCase();
  const intl = intlLocaleForCurrency(locale);
  const nf = new Intl.NumberFormat(intl, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });
  const base = nf.format(row.unitAmount / 100);
  const suffix = recurringSuffix(locale, row.recurringInterval, row.recurringIntervalCount);
  return suffix ? `${base}${suffix}` : base;
}

/** AggregateOffer highPrice string (major units, conservative) for JSON-LD when Stripe data exists. */
export function computeAggregateOfferHighPriceMajorUnits(catalog: StripePriceCatalogJson | null, fallback = "149"): string {
  if (!catalog?.paid) return fallback;
  let maxCents = 0;
  for (const row of Object.values(catalog.paid)) {
    if (row?.unitAmount != null) maxCents = Math.max(maxCents, row.unitAmount);
  }
  if (maxCents <= 0) return fallback;
  return String(Math.ceil(maxCents / 100));
}

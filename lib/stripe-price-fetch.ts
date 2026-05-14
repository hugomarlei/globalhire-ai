import { unstable_cache } from "next/cache";
import { paidPlans } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import type { PaidPlanId, StripePaidPlanPriceJson, StripePriceCatalogJson } from "@/lib/stripe-price-catalog-types";

const CACHE_KEY = "gh-stripe-price-catalog-v2";

function stripeSecretConfigured(): boolean {
  const k = process.env.STRIPE_SECRET_KEY;
  return Boolean(k && !k.includes("placeholder") && !k.toLowerCase().includes("replace"));
}

export type StripePriceIdsPresent = {
  starter: boolean;
  pro: boolean;
  elite: boolean;
};

function readPriceIdPresence(): StripePriceIdsPresent {
  const out: StripePriceIdsPresent = { starter: false, pro: false, elite: false };
  for (const plan of paidPlans) {
    const envName = plan.stripePriceEnv;
    if (!envName) continue;
    const v = process.env[envName];
    out[plan.id as keyof StripePriceIdsPresent] = Boolean(v && !v.includes("placeholder") && v.trim() !== "");
  }
  return out;
}

function sanitizeStripeErrorMessage(message: string): string {
  return message
    .replace(/price_[a-zA-Z0-9]{8,}/gi, "price_***")
    .replace(/sk_live_[a-zA-Z0-9]+/gi, "sk_live_***")
    .replace(/sk_test_[a-zA-Z0-9]+/gi, "sk_test_***")
    .replace(/rk_live_[a-zA-Z0-9]+/gi, "rk_live_***")
    .replace(/rk_test_[a-zA-Z0-9]+/gi, "rk_test_***")
    .slice(0, 220);
}

function sanitizeStripeError(error: unknown): {
  errorName: string;
  errorCode: string | null;
  errorMessage: string;
} {
  const err = error as { name?: unknown; code?: unknown; type?: unknown; message?: unknown } | null;
  const name = typeof err?.name === "string" ? err.name : "Error";
  const codeRaw = typeof err?.code === "string" ? err.code : typeof err?.type === "string" ? String(err.type) : null;
  const rawMsg = typeof err?.message === "string" ? err.message : "";
  return {
    errorName: name,
    errorCode: codeRaw,
    errorMessage: sanitizeStripeErrorMessage(rawMsg || "(no message)")
  };
}

export type StripePricingDiagLog = {
  hasStripeSecret: boolean;
  priceIdsPresent: StripePriceIdsPresent;
  catalogLoaded: boolean;
  loadedPlanIds: string[];
  fallbackUsed: boolean;
  phase?: string;
  reason?: string;
  planId?: PaidPlanId;
} & Partial<ReturnType<typeof sanitizeStripeError>>;

function logStripePricingDiag(payload: StripePricingDiagLog) {
  console.info("stripe_pricing_diag", payload);
}

/**
 * Fetches live recurring Prices from Stripe for each paid plan's configured env price_id.
 * Returns null if secret missing, IDs missing, or Stripe errors — callers must use FALLBACK_STATIC_PRICES.
 * Does not log successful catalog composition (caller / cache layer logs once).
 */
async function fetchStripePriceCatalogUncached(): Promise<StripePriceCatalogJson | null> {
  if (!stripeSecretConfigured()) {
    return null;
  }

  const paid: StripePriceCatalogJson["paid"] = {};

  try {
    for (const plan of paidPlans) {
      const envName = plan.stripePriceEnv;
      if (!envName) continue;
      const priceId = process.env[envName];
      if (!priceId || priceId.includes("placeholder")) continue;

      const price = await stripe.prices.retrieve(priceId, { expand: ["product"] });
      const product = price.product;
      let productName: string | null = null;
      if (product && typeof product !== "string") {
        const p = product as { name?: string | null; deleted?: boolean };
        if (!p.deleted && p.name) productName = String(p.name);
      }
      const rec = price.recurring;

      const row: StripePaidPlanPriceJson = {
        planId: plan.id as PaidPlanId,
        stripePriceId: price.id,
        unitAmount: price.unit_amount,
        currency: price.currency || "brl",
        recurringInterval: rec?.interval ?? null,
        recurringIntervalCount: rec?.interval_count ?? 1,
        productName
      };
      paid[plan.id as PaidPlanId] = row;
    }

    if (Object.keys(paid).length === 0) {
      return null;
    }
    return { paid };
  } catch (error) {
    const s = sanitizeStripeError(error);
    console.error("stripe_price_catalog_fetch_failed", s);
    logStripePricingDiag({
      hasStripeSecret: stripeSecretConfigured(),
      priceIdsPresent: readPriceIdPresence(),
      catalogLoaded: false,
      loadedPlanIds: [],
      fallbackUsed: true,
      phase: "fetch_uncached",
      reason: "stripe_api_error",
      ...s
    });
    return null;
  }
}

/**
 * Only successful catalogs are cached. Empty/failed fetches throw so `unstable_cache` does not
 * persist a null snapshot for 300s (which used to freeze fallback pricing in production).
 */
const getStripePriceCatalogCachedNonEmpty = unstable_cache(
  async (): Promise<StripePriceCatalogJson> => {
    const result = await fetchStripePriceCatalogUncached();
    if (!result || Object.keys(result.paid).length === 0) {
      throw new Error("STRIPE_PRICE_CATALOG_EMPTY");
    }
    return result;
  },
  [CACHE_KEY],
  { revalidate: 300 }
);

export async function getCachedStripePriceCatalog(): Promise<StripePriceCatalogJson | null> {
  const hasStripeSecret = stripeSecretConfigured();
  const priceIdsPresent = readPriceIdPresence();
  const idsComplete = priceIdsPresent.starter && priceIdsPresent.pro && priceIdsPresent.elite;

  if (!hasStripeSecret || !idsComplete) {
    logStripePricingDiag({
      hasStripeSecret,
      priceIdsPresent,
      catalogLoaded: false,
      loadedPlanIds: [],
      fallbackUsed: true,
      phase: "preflight",
      reason: !hasStripeSecret ? "stripe_secret_missing_or_placeholder" : "one_or_more_price_env_missing"
    });
    return null;
  }

  try {
    const data = await getStripePriceCatalogCachedNonEmpty();
    logStripePricingDiag({
      hasStripeSecret,
      priceIdsPresent,
      catalogLoaded: true,
      loadedPlanIds: Object.keys(data.paid),
      fallbackUsed: false,
      phase: "cache_hit_or_fresh_success"
    });
    return data;
  } catch (error) {
    const s = sanitizeStripeError(error);
    logStripePricingDiag({
      hasStripeSecret,
      priceIdsPresent,
      catalogLoaded: false,
      loadedPlanIds: [],
      fallbackUsed: true,
      phase: "cache_layer_empty_or_rejected",
      reason:
        error instanceof Error && error.message === "STRIPE_PRICE_CATALOG_EMPTY"
          ? "catalog_empty_not_cached"
          : "cache_read_failed",
      ...s
    });
    const fresh = await fetchStripePriceCatalogUncached();
    const ok = Boolean(fresh && Object.keys(fresh.paid).length > 0);
    logStripePricingDiag({
      hasStripeSecret,
      priceIdsPresent,
      catalogLoaded: ok,
      loadedPlanIds: fresh ? Object.keys(fresh.paid) : [],
      fallbackUsed: !ok,
      phase: "after_uncached_retry"
    });
    return fresh;
  }
}

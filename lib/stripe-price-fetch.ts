import { unstable_cache } from "next/cache";
import { paidPlans } from "@/lib/plans";
import { stripe } from "@/lib/stripe";
import type { PaidPlanId, StripePaidPlanPriceJson, StripePriceCatalogJson } from "@/lib/stripe-price-catalog-types";

function stripeSecretConfigured(): boolean {
  const k = process.env.STRIPE_SECRET_KEY;
  return Boolean(k && !k.includes("placeholder") && !k.toLowerCase().includes("replace"));
}

/**
 * Fetches live recurring Prices from Stripe for each paid plan's configured env price_id.
 * Returns null if secret missing, IDs missing, or Stripe errors — callers must use FALLBACK_STATIC_PRICES.
 */
async function fetchStripePriceCatalogUncached(): Promise<StripePriceCatalogJson | null> {
  if (!stripeSecretConfigured()) return null;

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

    if (Object.keys(paid).length === 0) return null;
    return { paid };
  } catch (error) {
    console.error("stripe_price_catalog_fetch_failed", error);
    return null;
  }
}

const getStripePriceCatalogCached = unstable_cache(fetchStripePriceCatalogUncached, ["gh-stripe-price-catalog-v1"], {
  revalidate: 300
});

export async function getCachedStripePriceCatalog(): Promise<StripePriceCatalogJson | null> {
  return getStripePriceCatalogCached();
}

import type { PlanId } from "@/lib/plans";

export type PaidPlanId = Exclude<PlanId, "free">;

/** Serializable Stripe price row for UI (server → client). */
export type StripePaidPlanPriceJson = {
  planId: PaidPlanId;
  stripePriceId: string;
  unitAmount: number | null;
  currency: string;
  recurringInterval: string | null;
  recurringIntervalCount: number;
  productName: string | null;
};

export type StripePriceCatalogJson = {
  paid: Partial<Record<PaidPlanId, StripePaidPlanPriceJson>>;
};

import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getStripePricingDebugSnapshot } from "@/lib/stripe-price-fetch";
import { rejectInvalidOrigin } from "@/lib/security";

/**
 * Temporary admin-only diagnostics for Stripe display pricing (not checkout).
 * Remove or restrict further after production validation — see docs/stripe/DYNAMIC_PRICING_PRODUCTION_DEBUG.md
 */
export async function GET(request: Request) {
  const originError = rejectInvalidOrigin(request);
  if (originError) return originError;

  await requireAdmin();
  const body = await getStripePricingDebugSnapshot();
  return NextResponse.json(body);
}

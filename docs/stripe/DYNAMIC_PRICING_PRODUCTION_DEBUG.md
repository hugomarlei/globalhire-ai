# Dynamic Stripe pricing — production debug (May 2026)

## Root cause (confirmed in code review)

1. **`unstable_cache` cached `null` for 300s**  
   `getCachedStripePriceCatalog()` wrapped `fetchStripePriceCatalogUncached`, which returns `null` when Stripe fails, env is incomplete, or build/runtime cannot reach `api.stripe.com`. Next’s cache treated that as a valid cached value, so **fallback prices could stick across requests** until revalidate elapsed.

2. **Public routes behaved like static marketing pages**  
   `app/page.tsx` and `app/pricing/page.tsx` had **no** `dynamic` / `revalidate` segment config. Combined with (1), a **build-time or first-hit failure** (e.g. no outbound network during build) could bake **fallback** prices into generated HTML for a long window.

3. **Errors were easy to miss**  
   Failures logged as `stripe_price_catalog_fetch_failed` without a **structured, filterable** line describing env vs Stripe vs empty catalog.

`app/(app)/assinatura/page.tsx` already used `export const dynamic = "force-dynamic"` and passed `stripeCatalog` into `UpgradePlans`; the main gap was **home + pricing + cache semantics**.

## What we changed (files)

| File | Change |
|------|--------|
| `lib/stripe-price-fetch.ts` | Safe structured logs (`stripe_pricing_diag`), **do not cache empty catalog** (cache layer throws on empty; null is never stored as success), uncached retry after cache miss. |
| `app/page.tsx` | `revalidate = 300`, `dynamic = "force-dynamic"`. |
| `app/pricing/page.tsx` | Same segment config; comment when `stripeCatalog` is null. |
| `components/home-page.tsx` | Comment when `stripeCatalog` is null. |
| `components/upgrade-plans.tsx` | Comment when `stripeCatalog` is null. |
| `docs/stripe/DYNAMIC_PRICING_PRODUCTION_DEBUG.md` | This document. |

**Go-live note:** o endpoint temporário `GET /api/debug/stripe-pricing` foi **removido** na auditoria final de segurança (reduz superfície de ataque). Diagnóstico: apenas **Vercel Logs** com o prefixo `stripe_pricing_diag`.

**Not changed (per request):** Stripe checkout route, webhooks, `NEXT_PUBLIC_STRIPE_*_PRICE_ID` env **names**, subscription business logic, Supabase, auth, plan IDs/limits, manual fallback strings in `lib/plans` / `plan-copy`.

## Classifying the issue

| Area | Relevant? |
|------|-----------|
| Cache (`unstable_cache` + null) | **Yes** — primary fix. |
| Env / secret / price IDs | **Yes** — preflight logs when incomplete. |
| Static / prerender | **Yes** — mitigated with `force-dynamic` + `revalidate` on `/` and `/pricing`. |
| Stripe API errors | **Yes** — logged with sanitized `errorName` / `errorCode` / `errorMessage`. |

## Validate on Vercel Logs

1. Open the deployment → **Logs**.
2. Filter by message **`stripe_pricing_diag`** (or substring `stripe_pricing`).
3. Interpret fields:
   - **`hasStripeSecret`**: `false` → fix `STRIPE_SECRET_KEY` in Vercel (not placeholder).
   - **`priceIdsPresent`**: any `false` → missing/placeholder `NEXT_PUBLIC_STRIPE_*_PRICE_ID`.
   - **`catalogLoaded` / `fallbackUsed`**: `catalogLoaded: true` and `fallbackUsed: false` when Stripe rows are merged into UI.
   - **`phase`**: `preflight` (env), `cache_hit_or_fresh_success`, `cache_layer_empty_or_rejected`, `after_uncached_retry`, `fetch_uncached`.
   - **`errorName` / `errorCode` / `errorMessage`**: sanitized; no live keys or full price IDs.

Legacy line **`stripe_price_catalog_fetch_failed`** may still appear on hard Stripe errors (stack stripped in structured log).

## Post-deploy checklist

- [ ] `/` — paid cards show Stripe amounts when env is correct.
- [ ] `/pricing` — same.
- [ ] `/assinatura` — upgrade cards match Stripe.
- [ ] Vercel logs — `stripe_pricing_diag` shows `catalogLoaded: true` in steady state.

## Checkout / webhook / price_id confirmation

- **Checkout** and **webhook** handlers were **not** modified in this fix.
- **Environment variable names** for Stripe Price IDs were **not** renamed.
- Display pricing still reads the same IDs server-side; only **caching, logging, route dynamics, and diagnostics** changed.

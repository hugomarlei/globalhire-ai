# Preços dinâmicos via Stripe — implementação

## 1. Ficheiros alterados / novos

| Ficheiro | Função |
|----------|--------|
| `docs/stripe/CURRENT_PRICING_AUDIT.md` | Auditoria pré-implementação (origem dos preços). |
| `lib/stripe-price-catalog-types.ts` | Tipos serializáveis (`StripePriceCatalogJson`, `StripePaidPlanPriceJson`). |
| `lib/plan-price-display.ts` | `formatStripePaidPlanPrice`, `computeAggregateOfferHighPriceMajorUnits` — **sem Stripe SDK** (seguro no cliente). |
| `lib/stripe-price-fetch.ts` | `fetchStripePriceCatalogUncached` + **`unstable_cache`** (`getCachedStripePriceCatalog`), revalidate **300 s** (5 min). |
| `lib/plan-copy.ts` | `getLocalizedPlans(locale, stripeCatalog?)` e `getLocalizedPlanRow(..., stripeCatalog?)` — sobrepõem `price` quando há dados Stripe. |
| `app/page.tsx` | Server Component: `await getCachedStripePriceCatalog()` → `HomePage`. |
| `components/home-page.tsx` | Client: landing completa; recebe `stripeCatalog` e passa a `getLocalizedPlans`. |
| `app/pricing/page.tsx` | Usa `getLocalizedPlans(locale, stripeCatalog)`. |
| `app/(app)/assinatura/page.tsx` | Passa `stripeCatalog` a `UpgradePlans`. |
| `components/upgrade-plans.tsx` | Prop opcional `stripeCatalog`; `useMemo` + `getLocalizedPlans`. |
| `app/layout.tsx` | `async` root layout; calcula `aggregateOfferHighPrice` para JSON-LD. |
| `components/structured-data.tsx` | Prop `aggregateOfferHighPrice` no `SoftwareApplication.offers`. |

**Não alterado:** `app/api/stripe/checkout/route.ts`, `app/api/stripe/webhook/route.ts`, `lib/stripe-subscription.ts`, `lib/plans.ts` (`stripePriceEnv`, limites, `getPlanFromStripePriceId`), Supabase, auth.

---

## 2. Onde ficam os `price_id`

Variáveis de ambiente (já existentes):

| Env | Plano |
|-----|--------|
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | Starter |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Pro |
| `NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID` | Elite |

O checkout continua a resolver `priceId` via `plan.stripePriceEnv` em `lib/plans.ts` → `process.env[...]`.

---

## 3. Como os preços são obtidos

1. **`getCachedStripePriceCatalog()`** (servidor apenas) chama `unstable_cache` com TTL **300 segundos**.
2. Se `STRIPE_SECRET_KEY` estiver ausente ou contiver `placeholder` / `replace` (case insensitive), **não** chama a API → retorna `null` (**FALLBACK_STATIC_PRICES** em `plan-copy`).
3. Para cada plano pago, lê-se o `price_id` da env correspondente e executa-se `stripe.prices.retrieve(id, { expand: ["product"] })`.
4. Guarda-se `unitAmount` (centimos), `currency`, `recurring`, `stripePriceId`, `productName`.
5. **`getLocalizedPlans(locale, catalog)`** — se existir linha Stripe com `unitAmount !== null`, o campo `price` da linha paga vem de **`formatStripePaidPlanPrice`** (`Intl.NumberFormat` + sufixo de intervalo localizado). Caso contrário usa-se a string estática anterior (**fallback explícito**).

Nenhum **Client Component** importa `stripe-price-fetch` nem `stripe`.

---

## 4. Fallback

- **Catálogo `null`:** UI usa as mesmas strings de preço que antes (`lib/plan-copy` / `plans` para pt-BR base).
- **Erro Stripe (rede, chave inválida, etc.):** `fetchStripePriceCatalogUncached` regista `stripe_price_catalog_fetch_failed` e devolve `null` → mesmo fallback.
- **JSON-LD `highPrice`:** `computeAggregateOfferHighPriceMajorUnits(catalog)` — se não houver catálogo, mantém-se **"149"** (major units, alinhado ao legado BRL).

---

## 5. Cache e atualizações

- **Revalidate:** 300 s na cache do Next (`unstable_cache`).
- Alterar o valor de um **Price** no Stripe Dashboard reflete-se no site após, no máximo, **~5 minutos** (e após novo deploy/revalidação conforme tráfego).
- Para forçar invalidação em desenvolvimento, reiniciar o servidor ou esperar o TTL.

---

## 6. Como validar

1. Configurar `STRIPE_SECRET_KEY` e os três `NEXT_PUBLIC_STRIPE_*_PRICE_ID` com IDs reais de **modo teste** ou live.
2. Abrir `/`, `/pricing`, `/assinatura` — preços dos planos pagos devem coincidir com o Stripe (moeda e valor).
3. Mudar o preço no Stripe → esperar ≤ 5 min → recarregar páginas.
4. Trocar idioma no seletor — formatação numérica e sufixo (`/ mês`, `/ month`, …) devem acompanhar.
5. `POST /api/stripe/checkout` com `{ "plan": "pro" }` — deve continuar a criar sessão com o mesmo `price_id`.

---

## 7. Alterar preço no Stripe sem código

1. No Stripe Dashboard, editar o **Price** (ou criar novo Price e atualizar a subscrição / env com o novo ID).
2. Se apenas o **valor** do mesmo Price for alterado, basta esperar a cache (5 min) e recarregar.
3. Se usar um **novo Price ID**, atualizar a variável de ambiente correspondente (deploy) — o código já lê sempre da env.

---

## 8. Confirmação — checkout / webhook / `price_id`

- **Checkout:** inalterado (mesmo `line_items`, metadata, URLs).
- **Webhook:** inalterado.
- **Mapeamento `price_id` → `planId`:** continua em `getPlanFromStripePriceId` com as mesmas env vars.

---

## 9. Notas

- `priceCurrency` no JSON-LD mantém-se **BRL**; se no futuro existirem preços noutra moeda, alinhar schema e copy legal.
- Build em ambientes **sem DNS para `api.stripe.com`** cai em fallback (como em sandbox de CI); produção com rede e chaves válidas obtém catálogo real.

# Auditoria técnica — sistema de preços atual (GlobalHire AI)

**Data:** 2026-05-14  
**Escopo:** origem dos valores exibidos ao usuário, fluxo até o Stripe, riscos e inconsistências. **Nenhuma alteração de produto foi feita neste documento.**

---

## 1. Resumo executivo

| Aspecto | Situação atual (pré-dinâmico) |
|--------|-------------------------------|
| **Preço exibido na UI** | Quase sempre **string fixa** em `lib/plan-copy.ts` (por locale) ou espelho de `lib/plans.ts` para `pt-BR`. **Não** reflete alterações no Stripe Dashboard. |
| **Checkout** | Usa **`process.env[NEXT_PUBLIC_STRIPE_*_PRICE_ID]`** via `plan.stripePriceEnv` em `lib/plans.ts` → `app/api/stripe/checkout/route.ts`. **Correto** para cobrança real. |
| **Webhook / assinatura** | `price_id` da subscription → `getPlanFromStripePriceId` compara com os **mesmos** env vars. Supabase guarda plano/status. |
| **Banco** | Tabelas de subscription guardam `stripe_price_id`, não o valor monetário para exibição. |
| **Stripe API para listar preço** | **Não** usada para marketing/UI antes desta iniciativa. |

**Conclusão:** havia **desacoplamento intencional mas problemático**: cobrança fiel ao Price ID do Stripe, **exibição** fiel a cópia estática — risco de divergência legal/UX.

---

## 2. Onde o preço aparece (arquivos e funções)

| Local | Arquivo | O que exibe | Fonte hoje |
|-------|---------|-------------|------------|
| Landing — grelha de planos | `app/page.tsx` | `plan.price` | `getLocalizedPlans(locale)` → `lib/plan-copy.ts` (fixo) |
| Marketing — `/pricing` | `app/pricing/page.tsx` | `plan.price` | `lib/plans.ts` direto (`plans.free`, `paidPlans`) — **não** passava por i18n de `plan-copy` |
| Assinatura — upgrade | `components/upgrade-plans.tsx` | `display.price` | `getLocalizedPlans(locale)` → `plan-copy` (fixo) |
| Conta / painel | `components/account-panel.tsx` | Nome do plano, limite, status | **Não** mostra linha de preço monetário |
| Upgrade gate | `components/upgrade-gate.tsx` | Nome do plano requerido | Sem preço |
| Gerador / ATS gate | `app/(app)/gerador/page.tsx`, `app/(app)/ats-score/page.tsx` | Nome do plano | `getLocalizedPlanRow` (sem preço na gate) |
| JSON-LD | `components/structured-data.tsx` | `lowPrice` / `highPrice` | **Hardcoded** `"0"` / `"149"` |

**Libs centrais**

| Arquivo | Função / constante | Papel |
|---------|-------------------|--------|
| `lib/plans.ts` | `plans`, `paidPlans`, `stripePriceEnv`, `getPlanFromStripePriceId`, `effectivePlanFromSubscription` | Limites, nomes PT em `plans`, **preço string PT** em `plans.*.price`; mapeamento **price_id → planId** |
| `lib/plan-copy.ts` | `getLocalizedPlans`, `getLocalizedPlanRow` | Nome + **preço localizado fixo** (R$29/mo, etc.) + features |
| `lib/stripe.ts` | `stripe` | Cliente Stripe (secret) |
| `lib/stripe-subscription.ts` | `getStripeSubscriptionPriceId`, sync | Lê subscription Stripe, price id |
| `lib/validation.ts` | `checkoutSchema` | Body `{ plan }` |

**Rotas API**

| Rota | Uso de preço |
|------|----------------|
| `app/api/stripe/checkout/route.ts` | Resolve `priceId` por `plan.stripePriceEnv` → `stripe.checkout.sessions.create` |
| `app/api/stripe/webhook/route.ts` | Não formata preço; sincroniza subscription |
| `app/api/stripe/portal/route.ts` | Portal; sem exibição de valor |

**Variáveis de ambiente (price_id)**

| Env | Usado em |
|-----|----------|
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | `plans.starter.stripePriceEnv`, `getPlanFromStripePriceId`, checkout |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | idem `pro` |
| `NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID` | idem `elite` |
| `STRIPE_SECRET_KEY` | Cliente Stripe (checkout, webhook, fetch futuro) |
| `STRIPE_WEBHOOK_SECRET` | Webhook |

**Nota:** Price IDs em `NEXT_PUBLIC_*` expõem apenas IDs (não o secret); aceitável para mapeamento client-side se necessário; o **secret** nunca vai ao browser.

---

## 3. Fluxo completo (checkout → plano)

1. UI chama `POST /api/stripe/checkout` com `{ plan: "pro" }` (ex.: `upgrade-plans.tsx`).
2. Rota valida usuário Supabase, resolve `paidPlans.find` → `plan.stripePriceEnv`.
3. `priceId = process.env[plan.stripePriceEnv]`.
4. Se ausente ou `placeholder` → **500** com mensagem PT.
5. `stripe.checkout.sessions.create({ line_items: [{ price: priceId, ... }] })`.
6. Webhook atualiza subscription; `getPlanFromStripePriceId` reconcilia plano.

**Exibição** do valor na landing **não** entra neste fluxo — era só cópia estática.

---

## 4. Classificação da origem (checklist)

| Fonte | Usado para exibição? | Usado para cobrança? |
|-------|----------------------|----------------------|
| Hardcoded em `plan-copy` | Sim (principal) | Não |
| Constants `lib/plans.ts` (`price`) | Sim (pt-BR base + pricing page) | Não |
| Env `NEXT_PUBLIC_*_PRICE_ID` | Não diretamente na UI | Sim (checkout + mapeamento pós-webhook) |
| Stripe API `prices.retrieve` | Não (antes) | Indireto (checkout session) |
| Banco (Supabase) | Não para valor BRL | Sim (status / price_id) |
| Cache | Não específico para preço UI | — |
| Mocks | Não | — |
| CMS | Não | — |

---

## 5. Telas: fixo vs Stripe vs misto

| Tela | Exibição | Checkout |
|------|----------|----------|
| `/` (landing) | **Fixo** (`plan-copy`) | CTA → cadastro (não checkout direto na grelha) |
| `/pricing` | **Fixo** (`plans` PT) | CTA cadastro |
| `/assinatura` | **Fixo** (`upgrade-plans` + `plan-copy`) | **Stripe** real |
| `/conta` | Sem preço na aba assinatura | Portal Stripe |

**Misto:** `/assinatura` — texto de preço **estático**, pagamento **dinâmico** (Price ID). Principal inconsistência.

---

## 6. Problemas e riscos

1. **Divergência Stripe ↔ UI:** alterar valor no Dashboard não atualiza site sem deploy/cópia.
2. **`/pricing` sem i18n:** nomes/preços vinham de `lib/plans.ts` (PT), enquanto outras páginas usavam `plan-copy` por locale.
3. **JSON-LD:** `highPrice: "149"` fixo — SEO desalinhado se preços mudarem.
4. **Moeda:** cópia assume BRL (`R$`); produto internacional pode precisar de moeda vinda do Price.
5. **Confiança:** utilizador pode ver um preço e pagar outro se houver erro operacional na cópia.

---

## 7. O que NÃO deve ser alterado (requisitos de segurança/produto)

- Lógica de `checkout` (body, metadata, URLs de sucesso/cancelamento).
- Webhook e `lib/stripe-subscription.ts` (mapeamento price_id → planId).
- **IDs canônicos** `free` | `starter` | `pro` | `elite`.
- Nomes das env vars dos Price IDs (`NEXT_PUBLIC_STRIPE_*`).
- Limites `monthlyLimit` e matriz de features em `lib/plans.ts` / `plan-copy` (só **substituir a string de preço** quando houver dado Stripe).
- Supabase schema e auth.

---

## 8. O que precisa mudar (direção da implementação)

1. Buscar **Prices** na Stripe no **servidor** (secret), por cada `price_id` configurado.
2. Normalizar **unit_amount, currency, recurring** e expor à UI via **props de Server Components** ou dados serializáveis.
3. **Formatar** com `Intl` por `Locale` no servidor e no cliente (mesma função pura em módulo sem `stripe`).
4. **`getLocalizedPlans` / `getLocalizedPlanRow`** devem aceitar catálogo opcional e **sobrepor** apenas o campo `price` quando houver dados válidos; caso contrário **fallback explícito** (cópia atual).
5. **Cache** (ex.: `unstable_cache` 5–15 min) para limitar chamadas Stripe.
6. Documentar em `docs/stripe/DYNAMIC_PRICING_FROM_STRIPE.md`.

---

## 9. Referência rápida de ficheiros tocados na implementação seguinte

- Novo: `lib/stripe-price-catalog-types.ts`, `lib/plan-price-display.ts`, `lib/stripe-price-fetch.ts`
- Alterado: `lib/plan-copy.ts`, `app/page.tsx`, `components/home-page.tsx` (novo cliente), `app/pricing/page.tsx`, `components/upgrade-plans.tsx`, `app/(app)/assinatura/page.tsx`, opcionalmente `components/structured-data.tsx`

---

*Fim da auditoria — base para `DYNAMIC_PRICING_FROM_STRIPE.md` e implementação.*

---

## 10. Pós-implementação (resumo)

A implementação dinâmica está descrita em **`docs/stripe/DYNAMIC_PRICING_FROM_STRIPE.md`**: catálogo via `getCachedStripePriceCatalog`, merge em `getLocalizedPlans`, landing (`HomePage`), `/pricing`, `/assinatura` / `UpgradePlans`, e `highPrice` no JSON-LD a partir do catálogo quando disponível.

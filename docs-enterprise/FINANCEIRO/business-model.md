# Modelo de negócio (SaaS)

**Fontes canónicas:** [`docs/product/PRODUCT_OVERVIEW.md`](../../docs/product/PRODUCT_OVERVIEW.md), [`docs/ENVIRONMENT_VARIABLES.md`](../../docs/ENVIRONMENT_VARIABLES.md)

## Resumo

- Receita recorrente via **Stripe** (planos Starter / Pro / Elite).
- Upsell natural: mais gerações, features premium (ver roadmap canónico).

## Custos variáveis principais

- **Groq** (tokens IA)
- **Supabase** (storage + DB)
- **Vercel** (compute/egress conforme plano)
- **Ferramentas de analytics** (PostHog, etc.)

## Documentos relacionados

- `unit-economics.md`, `saas-metrics.md`, `pricing-strategy.md` (marketing)

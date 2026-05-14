# Estratégia de pricing (empresa)

**Fontes canónicas:** planos e variáveis em [`docs/ENVIRONMENT_VARIABLES.md`](../../docs/ENVIRONMENT_VARIABLES.md); páginas públicas de preços no site.

## Princípios

1. **Transparência:** o que está incluído em cada plano (gerações, features).
2. **Alinhamento Stripe:** nomes dos price IDs estáveis; mudança = coordenação eng + financeiro.
3. **Descontos:** documentar exceções (campanhas) e duração.

## Tabela de planos (preencher preços comerciais)

| Plano | Price ID env | Valor público | Notas |
|-------|--------------|---------------|-------|
| Starter | `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | — | |
| Pro | `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | — | |
| Elite | `NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID` | — | |

## Elasticidade

- Medir conversão checkout e downgrade/upgrade no Stripe antes de mudanças agressivas.

## Relação com políticas

- Reembolso / termos — páginas legais + `SUPORTE/refund-policy-internal.md`

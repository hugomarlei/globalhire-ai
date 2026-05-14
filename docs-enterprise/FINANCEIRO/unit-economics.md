# Unit economics (framework)

## Fórmulas base

| Métrica | Fórmula |
|---------|---------|
| CAC | Marketing spend / novos clientes pagos |
| LTV | ARPU × margem bruta × 1/churn mensal (aprox.) |
| Payback | CAC / (ARPU × margem bruta) |

## Custos variáveis por utilizador (preencher com dados reais)

| Item | Como medir |
|------|--------------|
| Custo IA | Logs Groq + limites por plano |
| Infra | Dashboards Vercel/Supabase |
| Pagamentos | Taxa Stripe |

## Alertas

- Se LTV/CAC < 3 e payback > 12 meses — rever pricing ou custo IA.

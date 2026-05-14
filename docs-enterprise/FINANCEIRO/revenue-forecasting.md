# Previsão de receita (template)

## Inputs

- Pipeline de conversão (marketing funnels)
- Taxa de trial→pago (se aplicável)
- Churn histórico

## Cenários

| Cenário | Pressupostos |
|---------|----------------|
| Base | churn e conversão médios |
| Upside | melhor activação |
| Downside | aumento custo IA ou churn |

## Ligação técnica

- Webhooks Stripe — `TECNICO/payments-flow.md`

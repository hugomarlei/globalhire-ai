# Métricas SaaS (definições)

| Métrica | Definição operacional |
|---------|------------------------|
| MRR | Soma MRR activo no Stripe (normalizado) |
| ARR | MRR × 12 |
| Churn revenue | MRR perdido no mês / MRR início |
| NRR | (MRR início + expansão - churn - contração) / MRR início |
| ARPU | MRR / contas pagas |

## Fontes de dados

- **Stripe:** assinaturas e invoices
- **PostHog:** activação e retenção produto
- **Supabase:** contagens de utilizadores (com cuidado RGPD)

## Cadência

- Semanal: MRR, churn, falhas pagamento
- Mensal: cohorts retenção

# Manual operacional do founder — GlobalHire AI

## Cadência semanal (60–90 min)

| Ordem | Tema | Onde olhar |
|-------|------|------------|
| 1 | **Receita & billing** | Stripe Dashboard (MRR, churn, falhas de webhook) |
| 2 | **Custos variáveis** | Groq usage; Vercel usage; Supabase quotas |
| 3 | **Produto & erros** | Sentry (se ativo); Vercel logs; tickets suporte |
| 4 | **Funil** | PostHog / GA4 / Clarity — ver `TECNICO/analytics-stack.md` |
| 5 | **Legal / titulares** | Pedidos LGPD; mailbox privacy/support |

## Cadência diária (15 min)

- [ ] Alertas críticos (email Stripe, Vercel, Supabase)
- [ ] Fila de suporte (SLA interno — `SUPORTE/support-slas.md`)

## Regras de ouro

1. **Sem deploy em produção** sem `RUNBOOKS/post-deploy-validation.md`.
2. **Sem mudança de env em produção** sem registo (data, quem, porquê) — ver `SEGURANCA_COMPLIANCE/secrets-management.md`.
3. **Incidente SEV1/2:** abrir linha de tempo curta (início, mitigação, fim) para post-mortem leve.

## Escalação

- **Técnico bloqueante:** consultar `RUNBOOKS/production-emergency.md`
- **Cliente VIP / ameaça legal:** `SUPORTE/customer-escalation.md`

## Fontes canónicas

- Operações: [`docs/OPERATIONS.md`](../../docs/OPERATIONS.md)
- Checklist operacional: [`docs/OPERATIONS_CHECKLIST.md`](../../docs/OPERATIONS_CHECKLIST.md)

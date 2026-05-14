# Emergência em produção

## Gatilho

- Indisponibilidade total ou perda de dados potencial.

## Checklist imediato (primeiros 15 min)

| # | Ação |
|---|------|
| 1 | Confirmar âmbito (global vs região vs rota) |
| 2 | Abrir Vercel logs + último deploy |
| 3 | Verificar status pages externas (Vercel, Supabase, Stripe) |
| 4 | Comunicação mínima ao utilizador se SEV1 |

## Mitigação

- Se deploy suspeito: `rollback-procedures.md`.
- Se dependência externa: runbook específico (`stripe-failure`, `supabase-failure`, `vercel-failure`).

## Pós-incidente

- Post-mortem de 1 página: timeline, causa, ação corretiva.

**Referência:** [`docs/TROUBLESHOOTING.md`](../../docs/TROUBLESHOOTING.md)

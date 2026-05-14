# Framework de decisão — GlobalHire AI

## Classificação de decisões

| Tipo | Características | Exemplos | Artefacto mínimo |
|------|-----------------|----------|-------------------|
| **D1 — Reversível** | Rollback trivial; baixo risco | copy UI, textos marketing | PR + Preview |
| **D2 — Médio** | Afeta métricas ou UX significativa | mudança de funil signup | PR + teste manual + nota em `PRODUTO/` |
| **D3 — Alto** | Auth, billing, dados, segurança | RLS, webhook Stripe, CSP | ADR + runbook + janela de deploy |
| **D4 — Emergência** | Indisponibilidade ou perda de dados | outage | `RUNBOOKS/incident-response.md` |

## Critérios de “go / no-go” para ship

| Pergunta | Resposta necessária |
|----------|----------------------|
| Há rollback claro? | Sim, exceto D1 |
| Documentação / legal afetados? | Revisão cruzada com `docs/legal/` |
| Env novos? | Apenas via Vercel secrets; sem commit de secrets |
| Analytics quebrados? | Smoke analytics — `RUNBOOKS/analytics-debugging.md` |

## ADR (Architecture Decision Record)

Para D3/D4 pós-incidente, registar:

- Contexto
- Decisão
- Alternativas
- Consequências

**Local sugerido:** `docs-enterprise/PRODUTO/decisions/` (criar quando primeira ADR for necessária) ou manter em `docs/operations/` — **escolher uma convenção única**.

## Conflito produto vs técnico

- **Curto prazo receita:** não sobrepõe segurança ou legal.
- **Dívida técnica:** registar em `docs/audit/10_CRITICAL_PENDING.md` ou equivalente.

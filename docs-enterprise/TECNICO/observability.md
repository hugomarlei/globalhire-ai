# Observabilidade

**Fontes canónicas:** [`docs/OBSERVABILITY.md`](../../docs/OBSERVABILITY.md), [`docs/PRODUCTION_OBSERVABILITY.md`](../../docs/PRODUCTION_OBSERVABILITY.md), [`docs/SENTRY_SETUP.md`](../../docs/SENTRY_SETUP.md)

## Camadas

| Camada | Ferramenta | Modo atual (empresa) |
|--------|------------|----------------------|
| Produto / funil | PostHog, GA4, Clarity | **Ativo** para growth e UX |
| Erros / stacks | Sentry (`@sentry/nextjs`) | **Standby** — sem DSN = sem custo de eventos |
| Infra | Vercel logs, dashboards Stripe/Supabase | **Ativo** operacionalmente |

## Sentry (resumo operacional)

- Opcional: `NEXT_PUBLIC_SENTRY_DSN` vazio → SDK inativo.
- Túnel `/monitoring` documentado em `docs/SENTRY_SETUP.md`.
- PII scrub em `lib/sentry-privacy.ts` (ver código; não duplicar política técnica aqui).

## Alertas (recomendação futura)

- Quando houver receita: definir alertas Stripe (webhook failures) e uptime (Vercel ou serviço externo).

## Incidentes

- [`RUNBOOKS/incident-response.md`](../RUNBOOKS/incident-response.md)

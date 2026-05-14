# Runbook — Debug de analytics

## Sintomas

- Eventos não aparecem no GA4 / PostHog / Clarity.
- Discrepância grande entre ferramentas.

## Checklist

| # | Verificação |
|---|--------------|
| 1 | IDs `NEXT_PUBLIC_*` corretos no ambiente ativo |
| 2 | Consentimento de cookies / bloqueio de scripts |
| 3 | Ad blockers em testes locais (falso negativo) |
| 4 | Tag Assistant / debug mode GA4 |
| 5 | PostHog project key e host (`NEXT_PUBLIC_POSTHOG_HOST`) |

## Fontes

- [`docs/ANALYTICS_SETUP.md`](../../docs/ANALYTICS_SETUP.md)
- [`docs/audit/06_ANALYTICS_AUDIT.md`](../../docs/audit/06_ANALYTICS_AUDIT.md)

## Nota

- Sentry **não** substitui analytics de produto — [`docs/SENTRY_SETUP.md`](../../docs/SENTRY_SETUP.md).

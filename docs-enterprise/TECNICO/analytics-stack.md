# Stack de analytics

**Fontes canónicas:** [`docs/ANALYTICS_STACK.md`](../../docs/ANALYTICS_STACK.md), [`docs/ANALYTICS_EVENTS.md`](../../docs/ANALYTICS_EVENTS.md), [`docs/TRACKING_EVENTS.md`](../../docs/TRACKING_EVENTS.md), [`docs/ANALYTICS_SETUP.md`](../../docs/ANALYTICS_SETUP.md)

## Ferramentas em uso

| Ferramenta | Variáveis típicas | Papel |
|-------------|-------------------|-------|
| Google Analytics 4 | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Funil e tráfego |
| Microsoft Clarity | `NEXT_PUBLIC_CLARITY_PROJECT_ID` | UX / gravações (conforme produto) |
| PostHog | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | Produto / eventos |

## Princípios (empresa)

1. **Consentimento:** alinhar com cookie consent e políticas — [`docs/compliance/COOKIE_POLICY_OVERVIEW.md`](../../docs/compliance/COOKIE_POLICY_OVERVIEW.md)
2. **Minimização:** eventos sem PII; mascaramento onde aplicável (ver docs de analytics).
3. **Debug:** runbook [`RUNBOOKS/analytics-debugging.md`](../RUNBOOKS/analytics-debugging.md)

## Observação sobre Sentry

- Sentry é **observabilidade de erros**, não substitui analytics de produto — ver [`docs/SENTRY_SETUP.md`](../../docs/SENTRY_SETUP.md) (standby opcional).

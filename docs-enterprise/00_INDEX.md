# Índice mestre — `docs-enterprise`

## Mapa rápido → fontes canónicas (`docs/`)

| Tema | Enterprise | Canónico |
|------|------------|----------|
| Arquitetura geral | [`TECNICO/architecture.md`](./TECNICO/architecture.md) | [`docs/ARCHITECTURE.md`](../docs/ARCHITECTURE.md), [`docs/infra/SYSTEM_ARCHITECTURE.md`](../docs/infra/SYSTEM_ARCHITECTURE.md) |
| Variáveis de ambiente | [`TECNICO/env-vars-reference.md`](./TECNICO/env-vars-reference.md) | [`docs/ENVIRONMENT_VARIABLES.md`](../docs/ENVIRONMENT_VARIABLES.md), [`docs/audit/03_ENVIRONMENT_VARIABLES.md`](../docs/audit/03_ENVIRONMENT_VARIABLES.md) |
| Deploy | [`TECNICO/deployment-process.md`](./TECNICO/deployment-process.md) | [`docs/DEPLOYMENT.md`](../docs/DEPLOYMENT.md), [`docs/infra/DEPLOY_FLOW.md`](../docs/infra/DEPLOY_FLOW.md), [`docs/operations/SOP_DEPLOYMENT.md`](../docs/operations/SOP_DEPLOYMENT.md) |
| Auth | [`TECNICO/auth-flow.md`](./TECNICO/auth-flow.md) | [`docs/AUTH_FLOW.md`](../docs/AUTH_FLOW.md), [`docs/OAUTH_SETUP.md`](../docs/OAUTH_SETUP.md) |
| Pagamentos | [`TECNICO/payments-flow.md`](./TECNICO/payments-flow.md) | Fluxos em `app/api/stripe/*` + docs legais |
| Analytics | [`TECNICO/analytics-stack.md`](./TECNICO/analytics-stack.md) | [`docs/ANALYTICS_STACK.md`](../docs/ANALYTICS_STACK.md), [`docs/ANALYTICS_EVENTS.md`](../docs/ANALYTICS_EVENTS.md) |
| Observabilidade / Sentry | [`TECNICO/observability.md`](./TECNICO/observability.md) | [`docs/SENTRY_SETUP.md`](../docs/SENTRY_SETUP.md), [`docs/OBSERVABILITY.md`](../docs/OBSERVABILITY.md) |
| Fluxo de dados / LGPD | [`SEGURANCA_COMPLIANCE/privacy-operations.md`](./SEGURANCA_COMPLIANCE/privacy-operations.md) | [`docs/legal/data-flow-map.md`](../docs/legal/data-flow-map.md) |
| Incidentes | [`RUNBOOKS/incident-response.md`](./RUNBOOKS/incident-response.md) | [`docs/security/INCIDENT_RESPONSE.md`](../docs/security/INCIDENT_RESPONSE.md) |
| Go-live | [`RUNBOOKS/go-live-checklist.md`](./RUNBOOKS/go-live-checklist.md) | [`docs/GO_LIVE_CHECKLIST.md`](../docs/GO_LIVE_CHECKLIST.md), [`docs/PREVIEW_QA_REPORT.md`](../docs/PREVIEW_QA_REPORT.md) |
| Roadmap produto | [`PRODUTO/roadmap.md`](./PRODUTO/roadmap.md) | [`docs/audit/11_ROADMAP.md`](../docs/audit/11_ROADMAP.md) |
| Produto | [`PRODUTO/product-vision.md`](./PRODUTO/product-vision.md) | [`docs/product/PRODUCT_OVERVIEW.md`](../docs/product/PRODUCT_OVERVIEW.md) |

## Fluxo de leitura sugerido

1. **Novo membro da equipa:** `GOVERNANCA/company-structure.md` → `RUNBOOKS/onboarding-checklist.md` → `TECNICO/architecture.md`
2. **Incidente:** `RUNBOOKS/incident-response.md` → runbook específico do provider
3. **Investidor / due diligence:** [`EXECUTIVO/executive-summary-onepager.md`](./EXECUTIVO/executive-summary-onepager.md) + [`FINANCEIRO/investor-due-diligence.md`](./FINANCEIRO/investor-due-diligence.md) + [`SEGURANCA_COMPLIANCE/lgpd-readiness.md`](./SEGURANCA_COMPLIANCE/lgpd-readiness.md)
4. **Compliance:** `SEGURANCA_COMPLIANCE/` + `docs/legal/` + `docs/compliance/`

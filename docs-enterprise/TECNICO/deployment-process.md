# Processo de deploy

**Fontes canónicas:** [`docs/DEPLOYMENT.md`](../../docs/DEPLOYMENT.md), [`docs/infra/DEPLOY_FLOW.md`](../../docs/infra/DEPLOY_FLOW.md), [`docs/operations/SOP_DEPLOYMENT.md`](../../docs/operations/SOP_DEPLOYMENT.md)

## Fluxo típico (Vercel + Git)

1. Branch de trabalho → PR → revisão.
2. **Preview** automático; executar checklist preview quando mudanças sensíveis — [`docs/VERCEL_PREVIEW_CHECKLIST.md`](../../docs/VERCEL_PREVIEW_CHECKLIST.md), [`docs/PREVIEW_QA_REPORT.md`](../../docs/PREVIEW_QA_REPORT.md).
3. Merge para branch de release acordada (ex.: `main` ou `staging/*` conforme política interna).
4. Produção: validar `RUNBOOKS/post-deploy-validation.md`.

## Sentry e build

- `withSentryConfig` no `next.config.ts`: source maps **apenas** quando `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT` definidos — [`docs/SENTRY_SETUP.md`](../../docs/SENTRY_SETUP.md).

## Rollback

- [`RUNBOOKS/rollback-procedures.md`](../RUNBOOKS/rollback-procedures.md)

## Changelog operacional (opcional)

- [`docs/operations/CHANGELOG.md`](../../docs/operations/CHANGELOG.md) se a equipa mantiver histórico formal.

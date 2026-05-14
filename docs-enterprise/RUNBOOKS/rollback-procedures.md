# Procedimentos de rollback

## Quando fazer rollback

- Deploy introduziu SEV1/SEV2.
- Correção forward demora > SLA interno acordado.

## Rollback na Vercel (típico)

1. Vercel → Deployments → selecionar deploy **anterior estável**.
2. **Promote to Production** (ou equivalente).
3. Confirmar health — `post-deploy-validation.md`.

## Rollback de configuração

- **Env vars:** reverter valor no painel Vercel; redeploy.
- **Stripe:** evitar rollback “destrutivo” em clientes; preferir **correção forward** em webhooks.

## Rollback de schema (Supabase)

- **Alto risco** — seguir processo de migração documentado em `docs/` e nunca improvisar em produção sem backup — [`docs/infra/BACKUP_AND_RECOVERY.md`](../../docs/infra/BACKUP_AND_RECOVERY.md).

## Pós-rollback

- [ ] Identificar causa raiz
- [ ] Bloquear merge até teste extra em Preview

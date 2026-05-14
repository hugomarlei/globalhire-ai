# Referência de variáveis de ambiente (enterprise)

**Fonte canónica detalhada:** [`docs/ENVIRONMENT_VARIABLES.md`](../../docs/ENVIRONMENT_VARIABLES.md)  
**Matriz de segurança:** [`docs/security/ENVIRONMENT_VARIABLES.md`](../../docs/security/ENVIRONMENT_VARIABLES.md)  
**Auditoria:** [`docs/audit/03_ENVIRONMENT_VARIABLES.md`](../../docs/audit/03_ENVIRONMENT_VARIABLES.md)

## Classes de variáveis

| Classe | Exemplos | Regra |
|--------|----------|--------|
| Públicas | `NEXT_PUBLIC_APP_URL`, IDs analytics | Sem segredos |
| Secretas servidor | `STRIPE_SECRET_KEY`, `GROQ_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | Só Vercel / CI secrets |
| Sentry opcional | `NEXT_PUBLIC_SENTRY_DSN`, trio source maps | Ver [`docs/SENTRY_SETUP.md`](../../docs/SENTRY_SETUP.md) |

## Stripe — nomes dos price IDs

Conforme documentação canónica, usar:

- `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
- `NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID`

Valores devem começar por `price_`.

## Procedimento de alteração (SOP resumido)

1. Alterar no painel Vercel (ambiente correto).
2. Redeploy ou aguardar próximo deploy.
3. Validar smoke mínimo (`RUNBOOKS/post-deploy-validation.md`).
4. Registar alteração (data + motivo) — `SEGURANCA_COMPLIANCE/secrets-management.md`

## Rotação de segredos

- Ver política em `SEGURANCA_COMPLIANCE/secrets-management.md`.

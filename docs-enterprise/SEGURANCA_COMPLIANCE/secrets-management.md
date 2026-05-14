# Gestão de segredos (SOP)

**Fontes canónicas:** [`docs/security/ENVIRONMENT_VARIABLES.md`](../../docs/security/ENVIRONMENT_VARIABLES.md), [`docs/ENVIRONMENT_VARIABLES.md`](../../docs/ENVIRONMENT_VARIABLES.md)

## Onde vivem os segredos

| Local | Uso |
|-------|-----|
| Vercel Environment Variables | Produção e Preview |
| `.env.local` | Apenas desenvolvimento local (gitignored) |
| CI secrets (futuro) | Build com upload de source maps Sentry |

## Regras

1. **Nunca** commitar `.env` com valores reais.
2. **Nunca** `NEXT_PUBLIC_*` para chaves secretas.
3. Rotação: gerar novo → atualizar Vercel → deploy → revogar antigo após validação.

## Lista de segredos críticos (nome genérico)

- Supabase service role, anon (pública mas sensível a abuso)
- Groq API key
- Stripe secret + webhook secret
- Turnstile secret
- Sentry auth token (opcional)

## Acesso humano

- Mínimo de pessoas com acesso “owner” em Vercel/Stripe/Supabase.
- Ver também `access-control.md`.

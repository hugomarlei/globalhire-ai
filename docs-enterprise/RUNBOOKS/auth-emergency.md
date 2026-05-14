# Runbook — Emergência de autenticação

## Sintomas

- Login OAuth falha em massa.
- Callback erro 500.
- Sessão “desaparece” após navegação.

## Diagnóstico

1. Confirmar `middleware.ts` a correr (exclui apenas assets + `/monitoring`).
2. Supabase Auth logs.
3. URLs de redirect nos providers (Google etc.) — [`docs/OAUTH_SETUP.md`](../../docs/OAUTH_SETUP.md), [`docs/GOOGLE_OAUTH_REVIEW.md`](../../docs/GOOGLE_OAUTH_REVIEW.md).
4. `NEXT_PUBLIC_APP_URL` coerente com domínio real.

## Recuperação

- Corrigir redirect URIs / env.
- Rollback se deploy quebrou auth.

## Fonte canónica

- [`docs/AUTH_FLOW.md`](../../docs/AUTH_FLOW.md)

# GlobalHire AI - Security

Status: IMPLEMENTADO/PARCIAL.

## Implementado

- Supabase Auth.
- RLS no schema.
- CSP e headers globais.
- Origin/Referer check.
- Turnstile.
- Rate limit distribuído.
- Validação com Zod.
- Service role somente server-side.

## Pendências

- Confirmar RLS real via `schema-drift-introspection.sql`.
- Implementar Sentry com scrub PII.
- Criar audit logs persistentes quando necessário.
- Testar CSP após cada novo provider.

# Política de segurança (camada enterprise)

**Fonte canónica:** [`docs/security/SECURITY_POLICY.md`](../../docs/security/SECURITY_POLICY.md), [`docs/SECURITY.md`](../../docs/SECURITY.md), [`docs/HARDENING_SECURITY.md`](../../docs/HARDENING_SECURITY.md)

## Princípios

1. **Least privilege** em todos os painéis.
2. **Defense in depth:** CSP, validação de origem, RLS, rate limits.
3. **Segredos:** nunca em repositório; rotação documentada em `secrets-management.md`.

## Superfícies críticas (inventário)

| Superfície | Controlo principal |
|------------|-------------------|
| APIs IA / upload | Turnstile + rate limit + origem |
| Stripe webhook | Secret + idempotência |
| Auth | Supabase + cookies seguros |
| Admin | Lista `ADMIN_EMAILS` (ver env docs) |

## Resposta a incidentes

- `RUNBOOKS/incident-response.md`

## Revisão

- Política técnica detalhada permanece em `docs/security/`; rever após incidente ou mudança legal relevante.

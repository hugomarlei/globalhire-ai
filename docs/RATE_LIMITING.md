# GlobalHire AI - Rate Limiting

Status: IMPLEMENTADO/PARCIAL.

## Implementação

Arquivo:

- `lib/rate-limit.ts`

O rate limit usa:

1. Supabase `rate_limits`, quando `SUPABASE_SERVICE_ROLE_KEY` está disponível.
2. Fallback em memória para desenvolvimento ou falha controlada.

## Escopo

As rotas de IA usam cooldown de 30 segundos por usuário + IP:

- `/api/ai/generate`
- `/api/ai/regenerate`
- `/api/ai/optimize-from-score`

## SQL

Arquivo:

- `supabase/rate-limits.sql`

## Risco Residual

A operação atual usa select/update simples. Para alto volume, evoluir para:

- RPC SQL transacional;
- Upstash Redis;
- Vercel KV.

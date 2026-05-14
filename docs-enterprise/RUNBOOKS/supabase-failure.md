# Runbook — Falhas Supabase

## Sintomas

- Login falha para todos ou muitos utilizadores.
- APIs retornam erro de DB ou auth.
- Latência extrema ou timeouts.

## Causas comuns

| Causa | Sinal |
|-------|-------|
| Projeto pausado / quota | Dashboard Supabase |
| URL ou anon key errados em env | Erros na init do client |
| RLS a bloquear leitura legítima | 401/403 em padrão novo |
| Incidente regional | Status page Supabase |

## Diagnóstico

1. Supabase Dashboard → Database + Auth logs.
2. Vercel logs nas rotas que tocam Supabase.
3. Validar `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` no ambiente.

## Recuperação

- Escalar com plano Supabase se for quota.
- Rollback de migração **apenas** com processo e backup — [`docs/infra/BACKUP_AND_RECOVERY.md`](../../docs/infra/BACKUP_AND_RECOVERY.md).

## Referências

- [`docs/SUPABASE_PRODUCTION_STATUS.md`](../../docs/SUPABASE_PRODUCTION_STATUS.md)
- [`docs/RLS_AUDIT.md`](../../docs/RLS_AUDIT.md)

# GlobalHire AI - Database Notes

Status: PARCIALMENTE VALIDADO.

## Tabelas Principais

- `profiles`
- `subscriptions`
- `generations`
- `usage_limits`
- `documents`
- `rate_limits`

## Arquivos SQL

- `supabase/schema.sql`: schema base documentado.
- `supabase/rate-limits.sql`: tabela distribuída para rate limiting.
- `supabase/usage-events.sql`: logs internos opcionais.
- `supabase/schema-drift-introspection.sql`: auditoria read-only de produção.
- `supabase/schema-drift-corrective-migration.sql`: migration corretiva idempotente.

## Estado Real Confirmado via OpenAPI

- Tabelas e colunas principais alinhadas.
- `usage_limits.starter = 10`.
- `rate_limits` existe.

## Pendência

Rodar `supabase/schema-drift-introspection.sql` no SQL Editor para confirmar:

- constraints;
- índices;
- triggers;
- policies RLS;
- funções;
- permissões.

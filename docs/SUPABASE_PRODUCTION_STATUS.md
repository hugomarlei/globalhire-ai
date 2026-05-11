# GlobalHire AI - Supabase Production Status

Status: PARCIALMENTE VALIDADO.

## Confirmado por Consulta Read-Only

Tabelas existentes:

- `profiles`
- `subscriptions`
- `generations`
- `usage_limits`
- `documents`
- `rate_limits`

Contagens observadas:

- `profiles`: 5
- `subscriptions`: 5
- `generations`: 23
- `usage_limits`: 4
- `documents`: 0
- `rate_limits`: 0

`usage_limits`:

- `free`: 1
- `starter`: 10
- `pro`: 9999
- `elite`: 9999

## Não Confirmado via OpenAPI

- Check constraints.
- Unique constraints.
- Índices.
- Triggers.
- RLS policies.
- Permissões detalhadas por role.
- Storage buckets/policies.
- Edge Functions.

## Próximo Passo

Rodar `supabase/schema-drift-introspection.sql` no SQL Editor.

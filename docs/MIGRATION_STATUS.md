# GlobalHire AI - Migration Status

Status: PENDENTE DE CONFIRMAÇÃO MANUAL NO SUPABASE.

## Migrations/Scripts Existentes

| Arquivo | Finalidade | Status |
|---|---|---|
| `supabase/schema.sql` | Schema base | IMPLEMENTADO no código; produção alinhada em tabelas/colunas |
| `supabase/rate-limits.sql` | Rate limit distribuído | Tabela existe em produção |
| `supabase/subscription-sync-fields.sql` | Campos Stripe antigos | Provavelmente aplicado; campos existem |
| `supabase/usage-events.sql` | Logs/audit opcionais | PENDENTE/opcional |
| `supabase/schema-drift-introspection.sql` | Introspecção read-only | Criado; rodar manualmente |
| `supabase/schema-drift-corrective-migration.sql` | Correção idempotente | Criado; aplicar apenas se introspecção indicar necessidade |

## Ordem Recomendada

1. Rodar introspecção.
2. Verificar duplicidades em `subscriptions.stripe_subscription_id` e `usage_limits.plan`.
3. Aplicar migration corretiva apenas se necessário.
4. Testar auth, geração, histórico, checkout e webhook.

# Esquema de base de dados (referência enterprise)

**Fontes canónicas:** [`docs/infra/DATABASE_STRUCTURE.md`](../../docs/infra/DATABASE_STRUCTURE.md), [`docs/DATABASE_NOTES.md`](../../docs/DATABASE_NOTES.md), [`docs/audit/SUPABASE_SCHEMA_DIVERGENCE.md`](../../docs/audit/SUPABASE_SCHEMA_DIVERGENCE.md)

## Princípios

- **RLS** ativo para isolamento por utilizador — [`docs/RLS_AUDIT.md`](../../docs/RLS_AUDIT.md)
- **Migrações:** qualquer alteração de schema segue processo definido em docs técnicos (não automatizado neste documento).

## Entidades de negócio (alto nível)

| Domínio | Notas |
|---------|--------|
| Utilizadores / auth | Supabase Auth |
| Gerações / histórico | Texto e metadados conforme modelo atual |
| Subscrição | Estado sincronizado com Stripe (webhook + sync) |

## Operações de retenção

- Política e toggles: [`docs/legal/DATA_RETENTION_POLICY.md`](../../docs/legal/DATA_RETENTION_POLICY.md), [`docs/DATA_RETENTION_OPERATIONS.md`](../../docs/DATA_RETENTION_OPERATIONS.md)

## Divergências conhecidas

- Consultar explicitamente [`docs/audit/SUPABASE_SCHEMA_DIVERGENCE.md`](../../docs/audit/SUPABASE_SCHEMA_DIVERGENCE.md) antes de assumir que “o diagrama mental = produção”.

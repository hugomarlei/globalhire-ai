# GlobalHire AI - RLS Audit

Status: PENDENTE DE SNAPSHOT COMPLETO.

## RLS Esperado

Tabelas com RLS:

- `profiles`
- `subscriptions`
- `generations`
- `usage_limits`
- `documents`
- `rate_limits`

## Policies Esperadas

### `profiles`

- Usuário lê próprio perfil.
- Usuário atualiza próprio perfil.

### `subscriptions`

- Usuário lê própria assinatura.
- Escrita feita pelo servidor com service role.

### `generations`

- Usuário lê próprias gerações.
- Usuário insere próprias gerações.
- Usuário exclui próprias gerações.

### `usage_limits`

- Leitura pública.
- Escrita controlada por migration/admin.

### `documents`

- Usuário lê próprios documentos.
- Usuário insere próprios documentos.
- Usuário atualiza próprios documentos.
- Usuário exclui próprios documentos.

### `rate_limits`

- Sem policy pública intencional.
- Acesso pelo servidor com service role.

## Como Auditar Produção

Rodar:

- `supabase/schema-drift-introspection.sql`

E revisar a seção `policies`.

## Risco

RLS permissivo demais pode expor dados profissionais. RLS restritivo demais pode quebrar dashboard, histórico e documentos. Não simplificar policies em produção.

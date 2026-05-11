# Auditoria de Divergência Supabase — GlobalHire AI

Data: 2026-05-11  
Escopo: comparação entre `supabase/schema.sql` e estrutura real acessível do Supabase em produção.  
Modo de execução: somente leitura. Nenhuma alteração foi executada no banco.

## 1. Fontes analisadas

### Schema documentado

Arquivo local:

- `supabase/schema.sql`

### Banco real Supabase

Consulta read-only via Supabase REST/OpenAPI usando `SUPABASE_SERVICE_ROLE_KEY`, sem expor segredos.

O snapshot real confirmou estas tabelas públicas:

- `profiles`
- `subscriptions`
- `generations`
- `usage_limits`
- `documents`
- `rate_limits`

Contagens reais no momento da auditoria:

| Tabela | Linhas |
|---|---:|
| `profiles` | 5 |
| `subscriptions` | 5 |
| `generations` | 23 |
| `usage_limits` | 4 |
| `documents` | 0 |
| `rate_limits` | 0 |

## 2. Resultado executivo

Não foi encontrada divergência de tabelas ou colunas entre `supabase/schema.sql` atual e o snapshot público real do Supabase.

Pontos confirmados:

- `rate_limits` já existe em produção.
- `subscriptions.current_period_start` já existe.
- `subscriptions.current_period_end` já existe.
- `subscriptions.cancel_at_period_end` já existe.
- `usage_limits.starter` está em `10`, consistente com `lib/plans.ts`.
- As tabelas principais usadas pelo app existem e estão acessíveis.

Limitação da auditoria automática:

- O Supabase REST/OpenAPI confirma tabelas, colunas, tipos básicos, defaults visíveis, PK e FK em descrições.
- Ele não expõe de forma completa constraints check/unique, índices, triggers e políticas RLS.
- Para fechar 100% da auditoria de constraints/índices/RLS, rode `supabase/schema-drift-introspection.sql` no SQL Editor do Supabase e compare a saída com este relatório.

## 3. Comparação por tabela

### `profiles`

Status: alinhada por tabelas/colunas.

Colunas esperadas e encontradas:

- `id`
- `email`
- `full_name`
- `plan`
- `is_admin`
- `is_blocked`
- `created_at`
- `updated_at`

Risco operacional: baixo.

Observação:

- O check constraint de `plan in ('free', 'starter', 'pro', 'elite')` precisa ser confirmado pelo SQL de introspecção.

### `subscriptions`

Status: alinhada por tabelas/colunas.

Colunas esperadas e encontradas:

- `id`
- `user_id`
- `stripe_customer_id`
- `stripe_subscription_id`
- `stripe_price_id`
- `plan`
- `status`
- `current_period_start`
- `current_period_end`
- `cancel_at_period_end`
- `created_at`
- `updated_at`

Risco operacional: médio-baixo.

Observação importante:

- O código usa `upsert(..., { onConflict: "stripe_subscription_id" })`.
- Portanto, a constraint unique em `subscriptions.stripe_subscription_id` é crítica.
- O OpenAPI não confirmou explicitamente essa unique constraint. Confirme pelo SQL de introspecção.

### `generations`

Status: alinhada por tabelas/colunas.

Colunas esperadas e encontradas:

- `id`
- `user_id`
- `type`
- `language`
- `target_country`
- `input_resume`
- `job_description`
- `output`
- `created_at`

Risco operacional: baixo.

Observação:

- O check constraint de `type` precisa ser confirmado por introspecção SQL.
- Esta tabela armazena dados sensíveis/profissionais; retenção e exclusão granular já estão documentadas em `docs/DATA_RETENTION_OPERATIONS.md`.

### `usage_limits`

Status: alinhada por tabelas/colunas e dados principais.

Valores reais confirmados:

| Plano | monthly_generations |
|---|---:|
| `free` | 1 |
| `starter` | 10 |
| `pro` | 9999 |
| `elite` | 9999 |

Risco operacional: baixo.

Observação:

- A divergência anterior `starter = 3` foi mitigada.
- Ainda vale confirmar unique constraint em `plan`.

### `documents`

Status: alinhada por tabelas/colunas.

Colunas esperadas e encontradas:

- `id`
- `user_id`
- `generation_id`
- `title`
- `content`
- `document_type`
- `created_at`
- `updated_at`

Risco operacional: baixo.

Observação:

- A tabela está vazia atualmente.
- Policies de delete/update/select/insert devem ser confirmadas por introspecção SQL.

### `rate_limits`

Status: alinhada por tabelas/colunas.

Colunas esperadas e encontradas:

- `key`
- `count`
- `reset_at`
- `updated_at`

Risco operacional: baixo.

Observação:

- A tabela existe e está vazia, o que é normal se ainda não houve tráfego após a mudança ou se houve limpeza/manual reset.
- O índice `rate_limits_reset_at_idx` precisa ser confirmado por introspecção SQL.

## 4. Divergências encontradas

### Confirmadas

Nenhuma divergência confirmada de tabela/coluna/dado operacional crítico entre o schema atual e a estrutura real via OpenAPI.

### Não verificáveis automaticamente via REST

Precisam de `supabase/schema-drift-introspection.sql`:

- Check constraints:
  - `profiles_plan_check`
  - `subscriptions_plan_check`
  - `generations_type_check`
  - `usage_limits_plan_check`
- Unique constraints:
  - `subscriptions_stripe_subscription_id_key`
  - `usage_limits_plan_key`
- Índices:
  - `generations_user_created_idx`
  - `subscriptions_user_idx`
  - `rate_limits_reset_at_idx`
- RLS enabled em cada tabela.
- Policies RLS.
- Triggers:
  - `on_auth_user_created`
  - `profiles_updated_at`
  - `subscriptions_updated_at`
  - `documents_updated_at`

## 5. Risco operacional

| Item | Risco | Impacto | Probabilidade | Recomendação |
|---|---|---:|---:|---|
| Unique em `stripe_subscription_id` ausente | Webhook pode falhar ou duplicar assinaturas no upsert | Alto | Baixa/desconhecida | Confirmar com introspecção SQL antes de campanha paga |
| RLS/policies divergentes | Usuário pode não acessar ou acessar dado indevido | Alto | Baixa/desconhecida | Rodar introspecção de policies |
| Índice `generations_user_created_idx` ausente | Dashboard/histórico lentos com crescimento | Médio | Desconhecida | Confirmar e aplicar migration se faltar |
| Índice `rate_limits_reset_at_idx` ausente | Limpeza futura de rate limits lenta | Baixo | Desconhecida | Confirmar e aplicar migration |
| Trigger `subscriptions_updated_at` ausente | Seleção de assinatura ativa mais recente pode ficar menos confiável | Médio | Desconhecida | Confirmar trigger |
| `usage_events`/`audit_logs` ausentes | Sem auditoria interna persistente | Médio | Confirmada como não presente no OpenAPI | Aplicar `supabase/usage-events.sql` quando decidir ativar logs internos |

## 6. Migrations corretivas seguras

Arquivos gerados:

- `supabase/schema-drift-introspection.sql`
- `supabase/schema-drift-corrective-migration.sql`

### Ordem correta de aplicação

1. Rodar `supabase/schema-drift-introspection.sql`.
2. Salvar a saída em um arquivo de evidência, por exemplo `docs/audit/supabase-production-snapshot-YYYY-MM-DD.md`.
3. Verificar duplicidades antes de aplicar unique constraints:

```sql
select stripe_subscription_id, count(*)
from public.subscriptions
where stripe_subscription_id is not null
group by stripe_subscription_id
having count(*) > 1;

select plan, count(*)
from public.usage_limits
group by plan
having count(*) > 1;
```

4. Se não houver duplicidades, aplicar `supabase/schema-drift-corrective-migration.sql`.
5. Rodar novamente `supabase/schema-drift-introspection.sql`.
6. Testar:
   - login/cadastro;
   - geração IA;
   - histórico;
   - exclusão granular de documento;
   - checkout Stripe;
   - webhook Stripe;
   - troca de plano no Customer Portal;
   - rate limit em `/api/ai/generate`.

## 7. O que não foi executado

Nenhuma migration foi aplicada automaticamente.

Não foram executados:

- `alter table`
- `create table`
- `drop policy`
- `create policy`
- `create index`
- qualquer alteração em dados reais.

## 8. Conclusão

O banco real está alinhado com `supabase/schema.sql` no nível de tabelas, colunas principais e valores de `usage_limits`.

O próximo passo responsável é validar constraints, índices, RLS, policies e triggers pelo SQL de introspecção, porque esses elementos não são totalmente visíveis pelo OpenAPI do Supabase.

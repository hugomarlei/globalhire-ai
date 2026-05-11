# Database Structure

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Documentar a estrutura lógica do banco Supabase usada pela GlobalHire AI.

## Entidades principais

IMPLEMENTADO:

- `profiles`: dados operacionais do usuário, plano e flags.
- `subscriptions`: estado de assinatura e referências Stripe.
- `generations`: histórico de documentos gerados.
- Tabelas auxiliares de uso/limite, se presentes no schema.

PARCIAL:

- Preferências do usuário podem estar parcialmente no perfil ou no frontend.
- Consentimento de cookies ainda não está persistido no banco.

PENDENTE:

- Auditoria de ações admin.
- Registro formal de consentimentos.
- Registro de incidentes e solicitações LGPD.

OPCIONAL/PARCIAL:

- `supabase/usage-events.sql` prepara `usage_events` e `audit_logs` para operação futura.
- Essas tabelas não fazem parte do fluxo crítico atual e devem ser escritas por rotas server-side, não diretamente pelo frontend.

## Dados sensíveis

`generations` pode armazenar:

- currículo original;
- descrição da vaga;
- saída gerada pela IA;
- idioma e país-alvo.

Regra: não replicar esse conteúdo para logs, analytics ou ferramentas de suporte sem necessidade.

## Integridade

Recomendações:

- Todas as linhas devem ter `user_id`.
- APIs devem filtrar sempre por usuário autenticado.
- RLS deve impedir acesso cruzado entre usuários.
- Admin deve ter cuidado extra ao consultar dados profissionais.

## Assinaturas Stripe

IMPLEMENTADO/PARCIAL:

- `subscriptions.plan` deve refletir o plano derivado de `subscription.items.data[0].price.id`.
- `profiles.plan` é sincronizado como cópia operacional para leitura rápida.
- `subscriptions.stripe_price_id` armazena o Price ID atual da assinatura.
- `current_period_start`, `current_period_end` e `cancel_at_period_end` devem ser atualizados por webhook ou sync manual.

Se o banco foi criado antes desses campos, rode `supabase/subscription-sync-fields.sql`.

## Próximas melhorias

- Documentar schema com diagrama ERD.
- Criar migrations versionadas.
- Criar tabela de `audit_logs`.
- Criar tabela de `privacy_requests`.

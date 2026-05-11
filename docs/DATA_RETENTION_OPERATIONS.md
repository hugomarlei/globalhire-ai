# GlobalHire AI - Política Operacional de Retenção

Status: PARCIAL.

Este documento define a primeira política operacional de retenção de dados do GlobalHire AI para MVP. Nenhuma exclusão automática está ativa por padrão.

## Configuração

Arquivo técnico: `lib/retention.ts`.

Variáveis opcionais:

- `RETENTION_GENERATIONS_DAYS`: prazo sugerido para manter gerações de IA. Padrão: 180 dias.
- `RETENTION_DOCUMENTS_DAYS`: prazo sugerido para manter documentos salvos. Padrão: 365 dias.
- `RETENTION_CLEANUP_ENABLED`: controla execução futura de limpeza automática. Padrão: `false`.

## Exclusão Manual Granular

Status: IMPLEMENTADO.

O usuário pode excluir documentos individuais do histórico pela interface. A rota server-side `/api/documents/delete` valida:

- sessão autenticada;
- origem same-origin;
- propriedade do documento/geração;
- exclusão restrita ao próprio usuário.

## Cleanup Futuro

Status: PENDENTE.

Ainda não há rotina automática apagando dados em produção. Para ativar no futuro:

1. Criar cron job Vercel ou Supabase Scheduled Function.
2. Chamar rotina server-side usando `retentionConfig`.
3. Registrar auditoria com contagem de linhas excluídas.
4. Nunca logar conteúdo de currículo, vaga ou documento gerado.

## Dados Sensíveis

Currículos, descrições de vaga e documentos gerados podem conter dados pessoais e profissionais. Esses campos devem ser tratados como sensíveis para LGPD, suporte, logs, analytics e exportações.

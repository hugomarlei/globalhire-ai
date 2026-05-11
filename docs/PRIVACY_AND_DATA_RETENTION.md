# GlobalHire AI - Privacy and Data Retention

Status: PARCIAL.

## Implementado

- Política de Privacidade pública.
- Termos de Uso públicos.
- Banner de cookies.
- Consentimento analytics.
- Exclusão de conta.
- Exclusão granular de documentos.
- Configuração inicial de retenção em `lib/retention.ts`.

## Configuração

- `RETENTION_GENERATIONS_DAYS`
- `RETENTION_DOCUMENTS_DAYS`
- `RETENTION_CLEANUP_ENABLED`

## Importante

Nenhuma rotina automática apaga dados em produção por padrão. A limpeza futura deve ser ativada explicitamente, com logs e janela operacional.

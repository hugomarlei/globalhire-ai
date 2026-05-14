# Política de backups e recuperação

**Fonte canónica:** [`docs/infra/BACKUP_AND_RECOVERY.md`](../../docs/infra/BACKUP_AND_RECOVERY.md)

## Escopo

- **Supabase:** backups geridos pelo fornecedor; confirmar plano e RPO/RTO aceites.
- **Código:** Git como fonte de verdade.
- **Config:** Vercel env exportada de forma segura apenas quando necessário (não em canal inseguro).

## Testes de recuperação

- Agendar **teste anual** mínimo de restore em ambiente isolado (mesmo que manual).

## Relação com disaster recovery

- DR não é só backup — inclui runbooks e comunicação (`RUNBOOKS/production-emergency.md`).

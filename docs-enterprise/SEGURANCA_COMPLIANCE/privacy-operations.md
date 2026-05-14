# Operações de privacidade (titulares + incidentes)

**Fontes canónicas:** [`docs/legal/data-flow-map.md`](../../docs/legal/data-flow-map.md), [`docs/legal/data-flow-executive-summary.md`](../../docs/legal/data-flow-executive-summary.md), [`docs/PRIVACY_AND_DATA_RETENTION.md`](../../docs/PRIVACY_AND_DATA_RETENTION.md)

## Pedidos de titulares (acesso, retificação, eliminação)

| Etapa | Ação |
|-------|------|
| 1 | Verificar identidade do requerente (canal seguro) |
| 2 | Mapear dados no Supabase e logs fornecedores |
| 3 | Executar eliminação/export conforme política |
| 4 | Responder com prazo alinhado à LGPD |

## Breach / vazamento (suspeita ou confirmado)

1. SEV1 — `RUNBOOKS/incident-response.md`
2. Notificações legais conforme orientação jurídica (fora do âmbito técnico deste ficheiro).

## Retenção

- Cruzar com [`docs/legal/DATA_RETENTION_POLICY.md`](../../docs/legal/DATA_RETENTION_POLICY.md) e `data-retention-policy.md` (esta pasta).

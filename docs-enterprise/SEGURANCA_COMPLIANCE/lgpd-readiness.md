# LGPD — readiness operacional

**Fontes canónicas:** [`docs/compliance/LGPD_CHECKLIST.md`](../../docs/compliance/LGPD_CHECKLIST.md), [`docs/audit/07_COMPLIANCE_LGPD.md`](../../docs/audit/07_COMPLIANCE_LGPD.md), [`docs/legal/data-flow-map.md`](../../docs/legal/data-flow-map.md)

## Controlos mínimos

| Control | Estado | Owner |
|---------|--------|-------|
| Base legal por tratamento | Documentado em fluxo de dados | Legal/Founder |
| Direitos do titular | Processo em `privacy-operations.md` | Ops |
| Retenção | Política + operações | Ops |
| Subprocessadores | Lista | `third-party-risk.md` |
| Cookies / tracking | Consent + políticas | Produto |

## Evidências para auditoria

- Exportar lista de variáveis e fornecedores alinhada a [`docs/legal/THIRD_PARTY_SERVICES.md`](../../docs/legal/THIRD_PARTY_SERVICES.md).

## Lacunas típicas early-stage

- DPO dedicado ausente — definir responsável interno + contacto externo.

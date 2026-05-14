# Priorização de features (framework)

## Matriz Impacto × Esforço

| Quadrante | Ação |
|-----------|------|
| Alto impacto / baixo esforço | Fazer já |
| Alto impacto / alto esforço | Planear milestone |
| Baixo impacto / baixo esforço | Encaixar em “polish week” |
| Baixo impacto / alto esforço | Evitar |

## Gates obrigatórios

| Gate | Critério |
|------|----------|
| Legal | Dados novos? → `SEGURANCA_COMPLIANCE/` |
| Segurança | Superfície nova? → revisão CSP/origem |
| Billing | Afeta planos? → coordenação Stripe |

## Bugs vs features

- Ver `bug-triage.md`

# Triagem de bugs (SOP)

**Fonte canónica:** [`docs/operations/SOP_BUG_RESPONSE.md`](../../docs/operations/SOP_BUG_RESPONSE.md)

## Severidade (produto)

| Nível | Exemplo |
|-------|---------|
| P0 | Impossível pagar ou login em massa |
| P1 | Gerador quebrado para maioria |
| P2 | Bug UI isolado |
| P3 | Cosmético |

## Fluxo

1. Reproduzir em Preview quando possível
2. Identificar componente/rota (`TECNICO/integrations-map.md`)
3. Patch mínimo + teste
4. Deploy com `post-deploy-validation.md`

## Registo

- Preferir issues no Git (quando fluxo GitHub ativo) com template: passos, esperado, actual, logs.

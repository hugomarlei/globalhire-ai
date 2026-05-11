# SOP Bug Response

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Definir como bugs devem ser triados, corrigidos e documentados.

## Severidade

| Severidade | Critério | Exemplo |
| --- | --- | --- |
| P0 | Receita, auth ou dados quebrados | Checkout não atualiza plano |
| P1 | Fluxo principal afetado | IA não gera documento |
| P2 | UX importante | Upload mostra erro ruim |
| P3 | Polimento | Texto ou layout menor |

## Processo

1. Reproduzir bug.
2. Identificar ambiente.
3. Verificar se envolve auth, Stripe, dados ou IA.
4. Corrigir de forma incremental.
5. Rodar `npm run typecheck` e `npm run build`.
6. Testar cenário original.
7. Documentar no changelog.

## Regras de segurança

- Não usar dados reais de usuário em prints públicos.
- Não logar payloads completos.
- Não corrigir bug de Stripe sem testar webhook.
- Não mexer em auth sem testar login e reset.

## Pendências

- Issue tracker formal.
- Template de bug report.
- Sentry para agrupamento automático de erros.

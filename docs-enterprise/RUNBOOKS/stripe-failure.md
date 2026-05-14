# Runbook — Falhas Stripe

## Sintomas

- Checkout retorna erro ou 500.
- Portal não abre.
- Utilizadores pagam mas plano não atualiza.

## Causas comuns

| Causa | Sinal |
|-------|-------|
| Webhook secret incorreto | Entregas falhadas no Stripe |
| Price IDs errados / env | Erro na criação de session |
| Modo test vs live misturado | Charges invisíveis no painel esperado |
| Origem bloqueada (CSRF) | 403 em APIs — ver [`docs/PREVIEW_QA_REPORT.md`](../../docs/PREVIEW_QA_REPORT.md) |

## Diagnóstico

1. Stripe Dashboard → Developers → Webhooks → **Recent deliveries**.
2. Vercel → Functions → `api/stripe/webhook`.
3. Confirmar `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, price IDs no ambiente ativo.

## Recuperação

- Corrigir env → redeploy.
- Reenviar eventos webhook falhados (com cuidado; entender idempotência).

## Rollback

- Promover deploy anterior estável na Vercel.
- **Não** apagar customers no Stripe como “rollback”.

## Prevenção

- Monitorizar taxa de falha de webhooks.
- Smoke pós-deploy: checkout test em modo teste.

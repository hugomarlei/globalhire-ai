# Escalação (suporte → eng)

## Nível 1 — Suporte

- Problemas de conta, billing visível, “como usar”.
- Colectar: user id (se seguro partilhar), browser, passos.

## Nível 2 — Eng on-call (founder)

- Erros 500 persistentes, falhas Stripe webhook, auth em massa.
- Runbooks: `RUNBOOKS/`

## Nível 3 — Fornecedor

- Supabase incident, Stripe status page, Vercel status.

## Critério de escalação imediata

- Qualquer suspeita de **vazamento de dados** ou **conta comprometida** → `incident-response.md`

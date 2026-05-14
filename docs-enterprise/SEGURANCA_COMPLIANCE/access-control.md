# Controlo de acessos

**Fonte canónica:** [`docs/security/ACCESS_CONTROL.md`](../../docs/security/ACCESS_CONTROL.md)

## Matriz mínima

| Sistema | Roles recomendadas |
|---------|-------------------|
| Vercel | Owner mínimo; resto Developer |
| Supabase | Owner mínimo; devs sem service role quando possível |
| Stripe | Desenvolvedores sem “full payout” desnecessário |
| GitHub | Branch protection + required reviews quando equipa >1 |

## Offboarding

- [ ] Revogar acessos no dia da saída
- [ ] Rotacionar segredos se suspeita de cópia

## Admin da aplicação

- `ADMIN_EMAILS` / bypass — apenas pessoas de confiança; documentar lista interna (fora do repo).

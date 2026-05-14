# Checklist — Go-live (produção)

**Fonte canónica estendida:** [`docs/GO_LIVE_CHECKLIST.md`](../../docs/GO_LIVE_CHECKLIST.md), [`docs/GO_LIVE_AUDIT.md`](../../docs/GO_LIVE_AUDIT.md), [`docs/PRODUCTION_CHECKLIST.md`](../../docs/PRODUCTION_CHECKLIST.md)

## Infra

- [ ] `NEXT_PUBLIC_APP_URL` = URL pública final
- [ ] Domínio e SSL validados na Vercel
- [ ] Variáveis de produção completas — `TECNICO/env-vars-reference.md`

## Fornecedores

- [ ] Stripe live + webhook endpoint produção
- [ ] Supabase produção (projeto correto)
- [ ] Groq quotas adequadas ao tráfego esperado

## Segurança

- [ ] RLS e políticas revistas — [`docs/RLS_AUDIT.md`](../../docs/RLS_AUDIT.md)
- [ ] Rate limits ativos — [`docs/RATE_LIMITING.md`](../../docs/RATE_LIMITING.md)

## Pós go-live imediato

- [ ] Executar `post-deploy-validation.md`
- [ ] Monitorização intensiva primeiras 24–48h

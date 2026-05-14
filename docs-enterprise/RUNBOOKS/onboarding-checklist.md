# Checklist — Onboarding de novo membro (equipa)

## Acessos (dia 0)

- [ ] Conta Vercel (projeto GlobalHire) — role adequada
- [ ] Supabase — leitura vs escrita conforme função
- [ ] Stripe — **recomendado read-only** até necessidade de suporte billing
- [ ] Repositório Git (read ou write)
- [ ] PostHog / GA (viewer)

## Ambiente local (dia 0–1)

- [ ] Node LTS alinhado ao projeto
- [ ] `npm install` (sem alterar lockfile sem PR)
- [ ] Copiar `.env.example` → `.env.local` e preencher com secrets **não partilhados em chat aberto**
- [ ] `npm run dev` — homepage e login a carregar

## Leitura obrigatória (dia 1–3)

- [ ] `docs-enterprise/README.md` + `00_INDEX.md`
- [ ] `docs/ARCHITECTURE.md`
- [ ] `docs/AUTH_FLOW.md`
- [ ] `docs/OPERATIONS.md`
- [ ] `docs/security/SECURITY_POLICY.md` (resumo)

## Primeira contribuição (dia 3–5)

- [ ] PR pequeno (docs ou bugfix trivial)
- [ ] Passar `npm run typecheck` e `npm run lint` localmente
- [ ] Revisão por segundo membro

## Suporte (se função incluir suporte)

- [ ] `SUPORTE/support-playbook.md`
- [ ] `docs/operations/SOP_SUPPORT.md`

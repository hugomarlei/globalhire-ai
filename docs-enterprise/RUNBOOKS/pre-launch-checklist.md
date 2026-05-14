# Checklist — Pré-lançamento (release / campanha)

**Cruzamento com:** [`docs/GO_LIVE_CHECKLIST.md`](../../docs/GO_LIVE_CHECKLIST.md), [`docs/PRODUCTION_CHECKLIST.md`](../../docs/PRODUCTION_CHECKLIST.md)

## Produto e UX

- [ ] Fluxos críticos testados: signup, login, gerador, ATS, checkout teste
- [ ] Mensagens de erro humanas e sem vazamento de stack em UI
- [ ] Limitações da IA visíveis onde prometem resultado

## Legal e confiança

- [ ] Páginas legais acessíveis e atualizadas (`/privacidade`, `/termos`, etc.)
- [ ] Cookie consent alinhado a tracking — [`docs/compliance/COOKIE_POLICY_OVERVIEW.md`](../../docs/compliance/COOKIE_POLICY_OVERVIEW.md)

## Segurança

- [ ] Turnstile em chaves corretas (prod vs preview)
- [ ] CSP não regressou inadvertidamente (smoke manual)
- [ ] Nenhum secret em `NEXT_PUBLIC_*`

## Analytics

- [ ] IDs de produção nos envs de produção
- [ ] Eventos chave a disparar — [`docs/ANALYTICS_EVENTS.md`](../../docs/ANALYTICS_EVENTS.md)

## Observabilidade

- [ ] Decisão explícita: Sentry **on** ou **standby** — [`docs/SENTRY_SETUP.md`](../../docs/SENTRY_SETUP.md)

## Comunicação

- [ ] Mensagem de release (changelog utilizador) se aplicável

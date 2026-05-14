# Checklist — Validação pós-deploy

## Smoke técnico (15–30 min)

| # | Teste | Resultado esperado |
|---|--------|---------------------|
| 1 | Homepage carrega | 200 |
| 2 | Login + logout | Sessão ok |
| 3 | Gerador — request mínimo (respeitar limites) | Resposta 200 ou erro de negócio claro |
| 4 | ATS score página | Carrega sem 500 |
| 5 | Histórico | Lista ou empty state |
| 6 | Checkout Stripe **modo adequado ao ambiente** | Redireciona ou erro controlado |

## APIs sensíveis

- [ ] Nenhum 403 inesperado por origem em Preview/prod conforme [`docs/PREVIEW_QA_REPORT.md`](../../docs/PREVIEW_QA_REPORT.md)

## Analytics

- [ ] Evento de teste visível em GA4/PostHog (ambiente correto)

## Erros

- [ ] Se Sentry ativo: confirmar que evento de teste **não** contém PII — [`docs/SENTRY_SETUP.md`](../../docs/SENTRY_SETUP.md)

## Encerramento

- [ ] Registar versão deployada (commit SHA Vercel)
- [ ] Comunicar equipa “deploy concluído”

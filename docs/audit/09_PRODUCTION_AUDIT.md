# 9. Auditoria de Produção

## Vercel

Status: IMPLEMENTADO

- Projeto compatível com Vercel.
- `next build` funciona.
- `outputFileTracingRoot` definido em `next.config.ts`.
- Server Actions body limit configurado para 3 MB.

## Build

Scripts:

- `npm run lint`
- `npm run typecheck`
- `npm run build`

Status: PASSOU na última validação conhecida.

## Deploy

Fluxo esperado:

1. Commit em `main`.
2. Push para GitHub.
3. Deploy automático Vercel.
4. Verificar domínio `https://www.globalhireai.com.br`.

Risco atual:

- O ambiente local do agente não tinha credencial para `git push`. Deploy depende de push manual ou GitHub Desktop.

## Logs

Status: PARCIAL

Há logs server-side para:

- Stripe webhook.
- Geração IA.
- Upload parse.
- Subscription sync.
- Conta/delete.

Pendência:

- Centralizar logs estruturados.
- Adicionar Sentry SDK com scrub de PII.
- Criar alertas para webhook e IA.

## Envs

Status: DOCUMENTADO

- `.env.example` atualizado.
- `docs/ENVIRONMENT_VARIABLES.md` existe.
- `docs/PRODUCTION_CHECKLIST.md` existe.

## Fallbacks

- `getAppUrl()` fallback produção para domínio canônico.
- Groq model tem default.
- Analytics não quebra se env vazia.
- Turnstile faz fallback dev quando secret ausente.

## Observabilidade

Status: PARCIAL

- GA4/PostHog/Clarity preparados.
- Sentry apenas preparado em env/docs.
- Vercel logs são principal fonte de erro.

## Validações pós-deploy

- `/sitemap.xml`
- `/robots.txt`
- `/privacidade`
- `/termos`
- Login Google.
- Checkout Stripe.
- Webhook Stripe.
- Geração IA.
- Upload PDF/DOCX.
- Consentimento analytics.

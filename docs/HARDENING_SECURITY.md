# GlobalHire AI - Hardening de Segurança

Status: PARCIAL, com controles prioritários implementados para MVP em produção.

## Headers de Segurança

Status: IMPLEMENTADO.

Os headers são definidos em `next.config.ts` para todas as rotas:

- `Strict-Transport-Security`
- `X-Frame-Options`
- `X-Content-Type-Options`
- `Referrer-Policy`
- `Permissions-Policy`
- `Content-Security-Policy`

A CSP permite apenas origens necessárias para a stack atual:

- Vercel/Next.js no próprio domínio;
- Supabase;
- Stripe Checkout e Customer Portal;
- Groq API;
- Google Analytics;
- Microsoft Clarity;
- PostHog;
- Cloudflare Turnstile.

## Proteção CSRF/Origin

Status: IMPLEMENTADO.

O helper `lib/security.ts` valida `Origin` e `Referer` para endpoints sensíveis de browser. Em produção, requisições sem origem válida são recusadas.

Endpoints protegidos:

- `/api/ai/generate`
- `/api/ai/regenerate`
- `/api/ai/optimize-from-score`
- `/api/stripe/checkout`
- `/api/stripe/portal`
- `/api/account/delete`
- `/api/admin/block-user`
- `/api/documents/delete`

Observação: `/api/stripe/webhook` não usa validação de Origin porque é uma chamada servidor-a-servidor da Stripe. A proteção correta desse endpoint é a verificação de assinatura `STRIPE_WEBHOOK_SECRET`.

## Rate Limit Distribuído

Status: IMPLEMENTADO COM FALLBACK.

O rate limit usa a tabela Supabase `rate_limits` quando `SUPABASE_SERVICE_ROLE_KEY` está disponível. Em ambiente local ou em falha operacional da tabela, o app usa fallback em memória para não bloquear desenvolvimento.

Aplicar `supabase/rate-limits.sql` no Supabase de produção antes de depender do controle distribuído.

## Pendências

- Revisar CSP após cada novo provedor externo.
- Criar job agendado futuro para limpeza de rate limits expirados.
- Avaliar SQL RPC transacional caso o volume de tráfego cresça muito.

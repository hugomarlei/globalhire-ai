# Arquitetura de backend (aplicação)

**Nota:** não existe servidor Node separado; o “backend” são **Route Handlers** em `app/api/**/route.ts` executados na Vercel.

## Mapa de rotas API (implementadas)

| Rota | Função |
|------|--------|
| `app/api/ai/generate/route.ts` | Geração IA principal |
| `app/api/ai/regenerate/route.ts` | Regeneração |
| `app/api/ai/optimize-from-score/route.ts` | Otimização a partir do ATS score |
| `app/api/upload/parse/route.ts` | Extração PDF/DOCX |
| `app/api/stripe/checkout/route.ts` | Checkout |
| `app/api/stripe/portal/route.ts` | Portal cliente |
| `app/api/stripe/webhook/route.ts` | Webhooks Stripe |
| `app/api/subscription/sync/route.ts` | Sincronização subscrição |
| `app/api/history/[id]/export/route.ts` | Export histórico |
| `app/api/documents/delete/route.ts` | Remoção documento |
| `app/api/account/delete/route.ts` | Eliminação de conta |
| `app/api/admin/block-user/route.ts` | Admin |
| `app/api/security/turnstile/route.ts` | Verificação Turnstile |
| `app/api/pdf/route.ts` | PDF |
| `app/api/auth/signout/route.ts` | Sign out |

## Padrões de segurança no backend

- Validação com **Zod** onde aplicável nos handlers.
- **Origem / CSRF** em rotas sensíveis — ver hardening em [`docs/PRODUCTION_HARDENING.md`](../../docs/PRODUCTION_HARDENING.md) e relatório preview.

## Middleware

- `middleware.ts`: cliente Supabase SSR + refresh de sessão; exclusão do path `/monitoring` (Sentry tunnel).

## Fontes canónicas

- Diretórios: [`docs/audit/02_DIRECTORY_STRUCTURE.md`](../../docs/audit/02_DIRECTORY_STRUCTURE.md)
- Rate limiting: [`docs/RATE_LIMITING.md`](../../docs/RATE_LIMITING.md)

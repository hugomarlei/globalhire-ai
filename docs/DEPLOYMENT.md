# GlobalHire AI - Deployment

Status: IMPLEMENTADO.

## Plataforma

- Vercel para Next.js.
- Supabase para banco/auth.
- Stripe para pagamentos.
- Cloudflare para DNS/Turnstile.

## Comandos

```bash
npm run lint
npm run typecheck
npm run build
```

## Pós-Deploy

- Testar `/sitemap.xml`.
- Testar `/robots.txt`.
- Testar login Google.
- Testar Turnstile.
- Testar geração IA.
- Testar checkout e webhook.
- Conferir logs Vercel.

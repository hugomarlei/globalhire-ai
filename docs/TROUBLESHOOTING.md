# GlobalHire AI - Troubleshooting

## Turnstile não carrega

1. Verificar se `NEXT_PUBLIC_TURNSTILE_SITE_KEY` está na Vercel.
2. Verificar se `TURNSTILE_SECRET_KEY` está na Vercel.
3. Verificar domínios permitidos no Cloudflare Turnstile.
4. Testar sem bloqueador de anúncios.
5. Conferir CSP em `next.config.ts`.
6. Usar botão `Recarregar captcha` no widget.

## Login Google redireciona errado

1. Verificar `NEXT_PUBLIC_APP_URL=https://www.globalhireai.com.br`.
2. Verificar Supabase Auth URL Configuration.
3. Verificar Google Cloud OAuth redirect URI do Supabase.
4. Confirmar que não há domínio `vercel.app` em envs.

## Stripe não atualiza plano

1. Conferir webhook Stripe.
2. Conferir `STRIPE_WEBHOOK_SECRET`.
3. Conferir Price IDs `price_`.
4. Verificar tabela `subscriptions`.
5. Usar `/api/subscription/sync` após login se necessário.

## Upload PDF falha

1. Confirmar que o PDF tem texto selecionável.
2. Testar DOCX.
3. Orientar usuário a colar texto manualmente se for PDF escaneado.

## Geração IA falha

1. Verificar `GROQ_API_KEY`.
2. Verificar rate limit.
3. Verificar Turnstile.
4. Verificar plano/limite mensal.

# Checklist de produção — GlobalHire AI

Este guia é uma receita de bolo para publicar o GlobalHire AI em `https://www.globalhireai.com.br`.

## 1. Cloudflare

1. Entre em `cloudflare.com`.
2. Adicione o domínio `globalhireai.com.br`.
3. Troque os nameservers no registrador do domínio pelos nameservers mostrados pela Cloudflare.
4. Aguarde o status ficar **Active**.
5. Em **DNS**, crie os registros pedidos pela Vercel.
6. Em **Email > Email Routing**, ative roteamento para:
   - `contato@globalhireai.com.br`
   - `support@globalhireai.com.br`
   - `privacy@globalhireai.com.br`
   - `billing@globalhireai.com.br`
7. Em **Security > Turnstile**, crie um widget permitindo `www.globalhireai.com.br`, `globalhireai.com.br` e `localhost`.
8. Copie:
   - Site key para `NEXT_PUBLIC_TURNSTILE_SITE_KEY`
   - Secret key para `TURNSTILE_SECRET_KEY`

## 2. Vercel

1. Entre em `vercel.com`.
2. Abra o projeto GlobalHire AI.
3. Vá em **Settings > Domains**.
4. Adicione `www.globalhireai.com.br` e `globalhireai.com.br`.
5. Siga os registros DNS que a Vercel pedir na Cloudflare.
6. Vá em **Settings > Environment Variables**.
7. Cadastre todas as variáveis do `.env.example`.
8. Use `NEXT_PUBLIC_APP_URL=https://www.globalhireai.com.br`.
9. Faça novo deploy.

## 3. Google Cloud

1. Abra `console.cloud.google.com`.
2. Entre no projeto usado para OAuth.
3. Vá em **APIs & Services > Credentials**.
4. Abra o OAuth Client usado pelo Supabase.
5. Em **Authorized redirect URIs**, adicione a URL de callback do Supabase.
6. No Supabase, confirme que o provider Google está ativo.
7. Teste login Google em produção.
8. Teste sincronização de plano:
   - Entre com um usuário Pro.
   - Abra o Stripe Customer Portal pelo app.
   - Troque para Elite.
   - Volte para `/dashboard?subscription=updated`.
   - Confirme que o dashboard mostra Elite.
   - No Supabase, confirme que `subscriptions.stripe_price_id` é o Price ID Elite.
   - Confirme que `subscriptions.current_period_start` e `subscriptions.current_period_end` foram preenchidos.
   - Confirme que `subscriptions.plan` e `profiles.plan` estão como `elite`.

## 4. Supabase

1. Abra o projeto no Supabase.
2. Vá em **Authentication > URL Configuration**.
3. Configure **Site URL** como `https://www.globalhireai.com.br`.
4. Adicione redirects permitidos:
   - `https://www.globalhireai.com.br/auth/callback`
   - `https://globalhireai.com.br/auth/callback`
   - `http://localhost:3000/auth/callback`
5. Confirme se as tabelas do `supabase/schema.sql` estão criadas.
6. Rode também `supabase/rate-limits.sql` para ativar rate limit distribuído.
7. Confirme que `usage_limits` tem `starter = 10`.
8. Confirme se `SUPABASE_SERVICE_ROLE_KEY` está somente na Vercel, nunca no frontend.

## 5. Stripe

1. No Stripe, crie produtos mensais Starter, Pro e Elite.
2. Copie os IDs que começam com `price_`, não `prod_`.
3. Cole na Vercel:
   - `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID`
   - `NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID`
4. Em **Developers > Webhooks**, crie endpoint:
   - `https://www.globalhireai.com.br/api/stripe/webhook`
5. Ative eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
6. Copie o signing secret para `STRIPE_WEBHOOK_SECRET`.
7. Teste checkout sandbox antes de trocar para produção.

## 6. Analytics

1. No Google Analytics, crie uma propriedade GA4 para `https://www.globalhireai.com.br`.
2. Copie o Measurement ID no formato `G-XXXXXXXXXX`.
3. Cole na Vercel em `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
4. No Microsoft Clarity, crie um projeto para `www.globalhireai.com.br`.
5. Copie o Project ID.
6. Cole na Vercel em `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
7. No PostHog, copie a Project API Key e o host.
8. Cole na Vercel:
   - `NEXT_PUBLIC_POSTHOG_KEY`
   - `NEXT_PUBLIC_POSTHOG_HOST`
9. GA4, Clarity e PostHog só carregam em produção após consentimento de analytics.
10. Não envie currículos, descrições de vaga, e-mails, telefones, billing ou conteúdo gerado para analytics.

## 7. Microsoft Clarity legado

1. Entre em `clarity.microsoft.com`.
2. Crie um projeto para `www.globalhireai.com.br`.
3. Copie o Project ID.
4. Cole na Vercel em `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
5. O script só carregará se o usuário aceitar analytics no banner de cookies.

## 8. Sentry

1. Crie projeto Next.js no Sentry.
2. Copie o DSN público para `NEXT_PUBLIC_SENTRY_DSN`.
3. Se for usar upload de source maps, configure `SENTRY_AUTH_TOKEN`.
4. Não envie currículos, descrições de vaga ou documentos completos para logs.
5. Antes de instalar SDK, revise custos e retenção.

## 9. Testes antes de publicar

1. Cadastro com e-mail e senha.
2. Login Google.
3. Recuperação de senha.
4. Upload PDF com texto selecionável.
5. Upload DOCX.
6. Geração Free premium.
7. Bloqueio após limite Free.
8. Checkout Starter, Pro e Elite.
9. Webhook atualizando plano no Supabase.
10. ATS Score e versão otimizada.
11. Histórico e regenerar documento.
12. Banner de cookies: aceitar, rejeitar e preferências.
13. Páginas `/privacidade` e `/termos`.
14. Mobile: home, login, dashboard, gerador, assinatura e histórico.

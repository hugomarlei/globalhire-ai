# GlobalHire AI - Architecture

Status: IMPLEMENTADO/PARCIAL.

## Stack

- Next.js App Router.
- TypeScript.
- Tailwind CSS.
- Supabase Auth/Postgres.
- Stripe Checkout/Portal/Webhook.
- Groq API.
- Cloudflare Turnstile.
- GA4, Clarity e PostHog.
- Vercel.

## Áreas

- Landing pública.
- Auth.
- Dashboard.
- Gerador IA.
- ATS Score.
- Histórico/documentos.
- Conta/assinatura.
- Admin.
- APIs server-side.

## Princípios

- Secrets somente no servidor.
- Dados sensíveis mascarados em analytics.
- RLS no Supabase.
- Rate limit distribuído para IA.
- CSP e Origin check para hardening.

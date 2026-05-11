# GlobalHire AI - Production Hardening

Status: IMPLEMENTADO/PARCIAL.

## Implementado

- CSP e headers em `next.config.ts`.
- Origin/Referer check em endpoints sensíveis.
- Rate limit distribuído via Supabase.
- Turnstile em login, cadastro e IA.
- Cookies/analytics pós-consentimento.
- Links legais públicos.
- Sitemap e robots.
- Metadata e OpenGraph.

## Validar após Deploy

- CSP não bloqueia Turnstile.
- CSP não bloqueia Stripe.
- CSP não bloqueia GA4/Clarity/PostHog.
- Login Google funciona no domínio final.
- Stripe retorna para dashboard.
- Supabase RLS via introspecção SQL.

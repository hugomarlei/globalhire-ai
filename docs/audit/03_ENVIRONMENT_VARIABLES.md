# 3. Variáveis de Ambiente

Fonte analisada: `.env.example`, `lib/*`, rotas API e documentação.

## Variáveis utilizadas

| Variável | Finalidade | Obrigatória | Ambiente | Segurança |
|---|---|---:|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL pública Supabase | Sim | Todos | Pública, pode ir ao frontend. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Chave anon Supabase | Sim | Todos | Pública, protegida por RLS. |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin Supabase | Sim para admin/webhook/delete | Server/Vercel | Secreto crítico. Nunca usar no frontend. |
| `GROQ_API_KEY` | Chave IA Groq | Sim para IA | Server/Vercel | Secreto crítico. |
| `GROQ_MODEL` | Modelo Groq | Não | Server/Vercel | Não secreto. Default `llama-3.3-70b-versatile`. |
| `STRIPE_SECRET_KEY` | Stripe server API | Sim para checkout/portal/webhook | Server/Vercel | Secreto crítico. |
| `STRIPE_WEBHOOK_SECRET` | Assinatura webhook | Sim | Server/Vercel | Secreto crítico. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable | Parcial | Frontend | Pública. |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | Price ID Starter | Sim para checkout | Server/Frontend | Pública, não secreta. |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Price ID Pro | Sim para checkout | Server/Frontend | Pública, não secreta. |
| `NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID` | Price ID Elite | Sim para checkout | Server/Frontend | Pública, não secreta. |
| `NEXT_PUBLIC_APP_URL` | URL canônica | Sim produção | Server/Frontend | Pública. Deve ser `https://www.globalhireai.com.br`. |
| `ADMIN_EMAILS` | Admin por e-mail | Sim para admin fallback | Server/Vercel | Sensível operacional. |
| `ADMIN_BYPASS_EMAILS` | Bypass plano Elite | Dev/teste | Server/Vercel | Sensível; remover/restringir em produção pública. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key Turnstile | Sim se captcha ativo | Frontend | Pública. |
| `TURNSTILE_SECRET_KEY` | Secret Turnstile | Sim produção | Server/Vercel | Secreto crítico. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 | Opcional | Frontend | Pública. |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity | Opcional | Frontend | Pública. |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog project key | Opcional | Frontend | Pública, tratar como identificador. |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host PostHog | Opcional | Frontend | Pública. |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN | Opcional | Frontend | Pública, mas sem PII. |
| `SENTRY_AUTH_TOKEN` | Upload release/source maps | Opcional | Server/CI | Secreto. |
| `SENTRY_ORG` | Sentry org | Opcional | CI | Não crítico. |
| `SENTRY_PROJECT` | Sentry project | Opcional | CI | Não crítico. |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | E-mail suporte público | Opcional | Frontend | Pública. |

## Variáveis faltando ou inconsistentes

- `NEXT_PUBLIC_GA_MEASUREMENT_ID` foi adicionado ao `.env.example`, mas precisa ser cadastrado na Vercel.
- Sentry está documentado e variáveis existem, mas o SDK não está implementado.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` existe, mas o checkout atual usa server-side Stripe Checkout e não depende dela no client.
- `ADMIN_BYPASS_EMAILS` pode ser útil para teste, mas é risco comercial se mantido em produção sem controle.

## Riscos

- Qualquer chave sem prefixo `NEXT_PUBLIC_` não deve ser usada em client components.
- `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `GROQ_API_KEY` e `TURNSTILE_SECRET_KEY` são segredos críticos.
- Price IDs Stripe são públicos, mas precisam ser `price_`, não `prod_`.

# Environment Variables

Status: IMPLEMENTADO/PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Documentar variáveis de ambiente necessárias e classificar risco de exposição.

## Variáveis

| Variável | Tipo | Exposição | Finalidade | Status |
| --- | --- | --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Pública | Frontend | URL Supabase | IMPLEMENTADO |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Pública | Frontend | Supabase client | IMPLEMENTADO |
| `SUPABASE_SERVICE_ROLE_KEY` | Secreta | Servidor | Admin backend | IMPLEMENTADO |
| `GROQ_API_KEY` | Secreta | Servidor | IA Groq | IMPLEMENTADO |
| `GROQ_MODEL` | Config | Servidor | Modelo IA | IMPLEMENTADO |
| `STRIPE_SECRET_KEY` | Secreta | Servidor | Stripe API | IMPLEMENTADO |
| `STRIPE_WEBHOOK_SECRET` | Secreta | Servidor | Validar webhook | IMPLEMENTADO |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Pública | Frontend | Stripe client | IMPLEMENTADO |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | Pública | Frontend | Plano Starter | IMPLEMENTADO |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Pública | Frontend | Plano Pro | IMPLEMENTADO |
| `NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID` | Pública | Frontend | Plano Elite | IMPLEMENTADO |
| `NEXT_PUBLIC_APP_URL` | Pública | Frontend/metadata | URL base | IMPLEMENTADO |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Pública | Frontend | Analytics | PARCIAL |
| `NEXT_PUBLIC_POSTHOG_KEY` | Pública | Frontend | Product analytics | PARCIAL |
| `NEXT_PUBLIC_POSTHOG_HOST` | Pública | Frontend | Host PostHog | PARCIAL |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Pública | Frontend | Captcha | PARCIAL |
| `TURNSTILE_SECRET_KEY` | Secreta | Servidor | Validar captcha | PARCIAL |
| `NEXT_PUBLIC_SENTRY_DSN` | Pública | Frontend | Monitoramento | PENDENTE |
| `SENTRY_AUTH_TOKEN` | Secreta | Build/CI | Source maps | PENDENTE |
| `SENTRY_ORG` | Config | Build/CI | Release tracking | PENDENTE |
| `SENTRY_PROJECT` | Config | Build/CI | Release tracking | PENDENTE |
| `ADMIN_EMAILS` | Config sensível | Servidor | Admin | IMPLEMENTADO |
| `ADMIN_BYPASS_EMAILS` | Config sensível | Servidor | Bypass de teste | IMPLEMENTADO |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Pública | Frontend | Canal de suporte | IMPLEMENTADO |
| `RETENTION_GENERATIONS_DAYS` | Config | Servidor | Prazo sugerido para retenção de gerações | PARCIAL |
| `RETENTION_DOCUMENTS_DAYS` | Config | Servidor | Prazo sugerido para retenção de documentos | PARCIAL |
| `RETENTION_CLEANUP_ENABLED` | Config | Servidor | Ativar cleanup futuro de retenção | PENDENTE |

## Regras

- Prefixo `NEXT_PUBLIC_` significa visível no navegador.
- Nunca colocar secrets com prefixo `NEXT_PUBLIC_`.
- Price IDs do Stripe devem começar com `price_`, não `prod_`.
- `.env.local` não deve ser commitado.
- Rotacionar qualquer chave exposta em print, chat ou commit.

## Pendências

- Criar processo trimestral de rotação.
- Criar inventário de quem tem acesso às chaves.

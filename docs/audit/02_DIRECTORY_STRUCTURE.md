# 2. Estrutura de Diretórios

## Diretório raiz

| Caminho | Função |
|---|---|
| `app/` | Rotas App Router, páginas públicas, rotas logadas, APIs e metadata routes. |
| `components/` | Componentes React reutilizáveis e client components críticos. |
| `lib/` | Serviços, helpers, integrações, validação, planos, auth e analytics. |
| `prompts/` | Prompts internos de IA. |
| `supabase/` | Schema SQL e migrations complementares. |
| `docs/` | Documentação operacional, jurídica, segurança, SEO, analytics e auditoria. |
| `marketing/` | Materiais de marketing e vendas. |
| `public/brand/` | Placeholders de branding. |

## Páginas públicas

| Rota | Arquivo | Status |
|---|---|---|
| `/` | `app/page.tsx` | Landing page com CTA, pricing e footer. |
| `/pricing` | `app/pricing/page.tsx` | Página pública de planos. |
| `/features` | `app/features/page.tsx` | Página pública simples. |
| `/faq` | `app/faq/page.tsx` | FAQ com JSON-LD. |
| `/resources` | `app/resources/page.tsx` | Recursos placeholder. |
| `/privacidade` | `app/privacidade/page.tsx` | Política de privacidade. |
| `/termos` | `app/termos/page.tsx` | Termos de uso. |
| `/cookies` | `app/cookies/page.tsx` | Política de cookies. |
| `/refund-policy` | `app/refund-policy/page.tsx` | Reembolso/cancelamento. |
| `/data-processing` | `app/data-processing/page.tsx` | Tratamento de dados. |
| `/support` | `app/support/page.tsx` | Suporte. |
| `/privacy`, `/terms` | Redirects | Redirecionam para rotas em português. |

## Rotas de autenticação

| Rota | Arquivo | Função |
|---|---|---|
| `/login` | `app/(auth)/login/page.tsx` | Login por senha e social auth. |
| `/cadastro` | `app/(auth)/cadastro/page.tsx` | Cadastro. |
| `/recuperar-senha` | `app/(auth)/recuperar-senha/page.tsx` | Solicitação de reset. |
| `/redefinir-senha` | `app/(auth)/redefinir-senha/page.tsx` | Redefinição. |
| `/auth/callback` | `app/auth/callback/route.ts` | Callback Supabase OAuth/recovery. |

## Área logada

| Rota | Arquivo | Função |
|---|---|---|
| `/dashboard` | `app/(app)/dashboard/page.tsx` | Visão geral, plano, uso, estatísticas. |
| `/gerador` | `app/(app)/gerador/page.tsx` | Ferramentas de geração por tipo. |
| `/ats-score` | `app/(app)/ats-score/page.tsx` | ATS Score e keywords. |
| `/historico` | `app/(app)/historico/page.tsx` | Histórico e documentos. |
| `/conta` | `app/(app)/conta/page.tsx` | Perfil e conta. |
| `/assinatura` | `app/(app)/assinatura/page.tsx` | Plano, portal e upgrade. |
| `/configuracoes` | `app/(app)/configuracoes/page.tsx` | Preferências. |
| `/admin` | `app/(app)/admin/page.tsx` | Painel admin básico. |

## APIs

| Rota | Arquivo | Observações |
|---|---|---|
| `POST /api/ai/generate` | `app/api/ai/generate/route.ts` | Geração principal com Groq. |
| `POST /api/ai/regenerate` | `app/api/ai/regenerate/route.ts` | Regenera usando dados salvos. |
| `POST /api/ai/optimize-from-score` | `app/api/ai/optimize-from-score/route.ts` | Otimiza a partir do ATS Score. |
| `POST /api/upload/parse` | `app/api/upload/parse/route.ts` | PDF/DOCX parser, Node runtime. |
| `POST /api/stripe/checkout` | `app/api/stripe/checkout/route.ts` | Stripe Checkout. |
| `POST /api/stripe/portal` | `app/api/stripe/portal/route.ts` | Stripe Customer Portal. |
| `POST /api/stripe/webhook` | `app/api/stripe/webhook/route.ts` | Webhook com assinatura Stripe. |
| `GET /api/subscription/sync` | `app/api/subscription/sync/route.ts` | Sync manual autenticado. |
| `POST /api/account/delete` | `app/api/account/delete/route.ts` | Exclusão de conta/dados. |
| `POST /api/admin/block-user` | `app/api/admin/block-user/route.ts` | Bloqueio admin. |
| `POST /api/security/turnstile` | `app/api/security/turnstile/route.ts` | Validação Turnstile. |
| `POST /api/auth/signout` | `app/api/auth/signout/route.ts` | Logout. |
| `POST /api/pdf` | `app/api/pdf/route.ts` | Placeholder de PDF server-side. |

## Serviços e providers em `lib/`

- `analytics.ts`: sanitização e envio de eventos.
- `app-url.ts`: URL canônica, callback auth e proteção contra domínio Vercel antigo.
- `auth.ts`: `requireUser` e `requireAdmin`.
- `groq.ts`: cliente Groq.
- `plans.ts`: regras de plano, limites, features e Price IDs.
- `rate-limit.ts`: cooldown em memória.
- `stripe.ts`: cliente Stripe.
- `stripe-subscription.ts`: sync e mapeamento de assinaturas.
- `subscription-state.ts`: seleção da assinatura ativa mais recente.
- `supabase-browser.ts`: client Supabase no browser.
- `supabase-server.ts`: client Supabase SSR/admin.
- `turnstile.ts`: validação Cloudflare.
- `validation.ts`: schemas zod.

## Middleware

`middleware.ts` atualiza sessão Supabase em todas as rotas não estáticas. Não aplica headers de segurança.

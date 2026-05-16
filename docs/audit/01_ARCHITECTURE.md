# 1. Arquitetura do Projeto

## Stack completa

| Camada | Tecnologia | Status |
|---|---|---|
| Framework | Next.js App Router 15 | IMPLEMENTADO |
| Linguagem | TypeScript strict | IMPLEMENTADO |
| UI | React 19, Tailwind CSS, lucide-react | IMPLEMENTADO |
| Auth | Supabase Auth + Google OAuth preparado | IMPLEMENTADO/PARCIAL |
| Banco | Supabase Postgres + RLS | IMPLEMENTADO |
| IA | Groq SDK com modelo compatível OpenAI-style | IMPLEMENTADO |
| Pagamentos | Stripe Checkout, Customer Portal e Webhook | IMPLEMENTADO |
| Upload | PDF via `pdf-parse`, DOCX via `mammoth` | IMPLEMENTADO |
| Analytics | GA4, PostHog, Microsoft Clarity pós-consentimento | IMPLEMENTADO/PARCIAL |
| Deploy | Vercel | IMPLEMENTADO |
| Segurança extra | Cloudflare Turnstile | IMPLEMENTADO/PARCIAL |
| SEO | Metadata, sitemap, robots, JSON-LD | IMPLEMENTADO |

## Frontend

O frontend usa Next.js App Router com componentes server e client. As telas públicas ficam em `app/*`, auth em `app/(auth)/*` e área logada em `app/(app)/*`.

Componentes críticos:

- `components/nav.tsx`: navegação pública/logada e seletor de idioma.
- `components/dashboard-generator.tsx`: gerador principal com upload, IA e exportação PDF via navegador.
- `components/ats-analyzer.tsx`: análise ATS e geração otimizada a partir do score.
- `components/history-list.tsx`: histórico, documentos e regeneração.
- `components/upgrade-plans.tsx`: planos e checkout.
- `components/account-panel.tsx`: conta, assinatura, portal Stripe, exclusão de conta.
- `components/analytics-scripts.tsx`: GA4, PostHog e Clarity.
- `components/cookie-consent.tsx`: consentimento LGPD local.

## Backend

O backend é composto por Route Handlers do App Router:

- IA: `/api/ai/generate`, `/api/ai/regenerate`, `/api/ai/optimize-from-score`.
- Upload: `/api/upload/parse`.
- Stripe: `/api/stripe/checkout`, `/api/stripe/portal`, `/api/stripe/webhook`.
- Auth: `/api/auth/signout`, `/auth/callback`.
- Conta: `/api/account/delete`.
- Admin: `/api/admin/block-user`.
- Segurança: `/api/security/turnstile`.
- Sync assinatura: `/api/subscription/sync`.

## Banco de dados

Schema principal em `supabase/schema.sql`.

Tabelas:

- `profiles`: perfil, plano, admin, bloqueio.
- `subscriptions`: plano Stripe, status, preço, período, customer/subscription ids.
- `generations`: histórico de gerações com currículo/input/output.
- `usage_limits`: limites por plano.
- `documents`: biblioteca documental.

RLS está habilitado para tabelas principais, com políticas para leitura/inserção própria.

## Autenticação e autorização

Autenticação:

- Supabase Auth por e-mail/senha.
- Social auth via Supabase OAuth, com Google preparado.
- Recuperação de senha via Supabase.

Autorização:

- `requireUser()` protege área logada e bloqueia usuários marcados.
- `requireAdmin()` protege admin **apenas** por allowlist `ADMIN_EMAILS` no servidor (`lib/admin-access.ts`); `profiles.is_admin` não autoriza rotas admin.
- APIs validam sessão com `supabase.auth.getUser()`.
- RLS limita leitura/inserção no banco.

## Integrações

- Supabase: auth e banco.
- Stripe: assinatura, checkout, portal e webhook.
- Groq: IA generativa.
- Cloudflare Turnstile: captcha.
- Cloudflare: DNS, segurança e e-mail routing planejado.
- Google OAuth: login social.
- GA4/PostHog/Clarity: analytics pós-consentimento.
- Vercel: deploy e logs.

## Fluxos principais

### Cadastro/login

1. Usuário cria conta por e-mail/senha ou OAuth.
2. Supabase cria usuário Auth.
3. Trigger `handle_new_user` cria profile.
4. Usuário entra no dashboard.

### Geração IA

1. Usuário cola/upload currículo e vaga.
2. Frontend envia JSON para `/api/ai/generate`.
3. API valida sessão, Turnstile, zod, plano, limite mensal e cooldown.
4. Prompt é montado em `prompts/ai-prompts.ts`.
5. Groq gera resposta.
6. Resposta é limpa por `lib/document-format.ts`.
7. Resultado é salvo em `generations`.

### Stripe

1. Usuário clica em assinar.
2. `/api/stripe/checkout` cria sessão.
3. Webhook recebe evento.
4. `syncStripeSubscription()` mapeia Price ID para plano.
5. `subscriptions` e `profiles.plan` são sincronizados.
6. Dashboard lê assinatura ativa mais recente.

### ATS Score

1. Usuário cola/upload currículo e vaga.
2. Score local calcula match/keywords no client.
3. Ao otimizar, `/api/ai/optimize-from-score` gera versão com Groq.
4. Resultado é salvo no histórico.

# System Architecture

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Visão geral

GlobalHire AI é um SaaS web baseado em Next.js App Router, hospedado na Vercel, com autenticação e banco no Supabase, pagamentos via Stripe e geração de IA via Groq.

## Componentes

| Camada | Tecnologia | Responsabilidade | Status |
| --- | --- | --- | --- |
| Frontend | Next.js, React, Tailwind | UI, dashboard, forms, landing | IMPLEMENTADO |
| Backend | Next.js API routes | IA, Stripe, upload, segurança | IMPLEMENTADO |
| Auth | Supabase Auth | Login, cadastro, Google OAuth | IMPLEMENTADO |
| Banco | Supabase Postgres | Perfis, planos, histórico | IMPLEMENTADO |
| Pagamentos | Stripe | Checkout, assinatura, portal | IMPLEMENTADO |
| IA | Groq API | Geração e otimização | IMPLEMENTADO |
| Deploy | Vercel | Hosting e serverless | IMPLEMENTADO |
| Segurança edge | Cloudflare | DNS, Turnstile, e-mail | PARCIAL |
| Analytics | Microsoft Clarity | Analytics pós-consentimento | PARCIAL |

## Fluxo principal

1. Usuário autentica via Supabase.
2. Usuário envia currículo e vaga.
3. API valida sessão, plano, limite e captcha.
4. API monta prompt e chama Groq.
5. Resultado é salvo no Supabase.
6. Usuário visualiza, copia, exporta ou regenera.

## Fluxo de pagamento

1. Usuário escolhe plano.
2. API cria checkout Stripe.
3. Stripe processa pagamento.
4. Webhook atualiza assinatura no Supabase.
5. Dashboard reflete plano atualizado.

## Limitações conhecidas

- Rate limit atual em memória não é global entre instâncias.
- Consentimento de cookies não está centralizado no banco.
- Backups dependem do Supabase e plano contratado.
- Não há fila assíncrona para geração de IA.

## Direção futura

- Rate limit persistente por Supabase/Redis.
- Logs estruturados sem dados sensíveis.
- Observabilidade com Sentry.
- Backups e restore testados periodicamente.

# Security Policy

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Definir princípios mínimos de segurança para operação da GlobalHire AI como SaaS B2C com IA.

## Escopo

- Aplicação Next.js.
- APIs server-side.
- Supabase Auth e banco.
- Stripe checkout e webhooks.
- Groq AI.
- Vercel e variáveis de ambiente.
- Cloudflare Turnstile e DNS.

## Controles implementados

IMPLEMENTADO:

- Autenticação com Supabase.
- Proteção de rotas privadas.
- Uso de Groq API apenas no backend.
- Stripe Secret Key apenas no servidor.
- Webhook Stripe com secret.
- Rate limit básico em rotas de IA.
- Turnstile preparado para login, cadastro e geração.
- `.env.local` ignorado pelo Git.
- Banner de consentimento para analytics.

PARCIAL:

- Rate limit em memória, não distribuído.
- Sentry documentado, mas não necessariamente instalado.
- Logs técnicos ainda dependem de disciplina de implementação.
- Auditoria de acesso administrativo não formalizada.

PENDENTE:

- Pentest externo.
- Monitoramento centralizado de segurança.
- Política formal de rotação de secrets.
- Revisão de RLS por terceiro.

## Regras obrigatórias

- Nunca commitar secrets.
- Nunca logar currículo completo, vaga completa ou documentos gerados.
- Nunca manipular plano do usuário pelo frontend.
- Validar plano e limite sempre no backend.
- Revisar webhooks antes de alterar Stripe.
- Usar princípio de menor privilégio no Supabase.

## Vulnerabilidades

Para um MVP bootstrap, reporte vulnerabilidades diretamente ao fundador pelo canal operacional definido internamente. Antes de abertura pública, criar e-mail dedicado `security@globalhireai.com.br`.

## Próximas ações

- Criar checklist mensal de segurança.
- Criar processo de rotação de chaves.
- Ativar alertas básicos na Vercel, Supabase e Stripe.

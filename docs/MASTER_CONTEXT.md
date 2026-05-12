# MASTER CONTEXT — GlobalHire AI

Status: fonte de verdade operacional para produto, stack, riscos e prioridades.  
Última consolidação: conforme documento base fornecido pelo fundador (pré-lançamento).

---

## 1. Entendimento global do projeto

A GlobalHire AI é um SaaS de inteligência artificial para otimização de documentos profissionais, com foco principal em currículos ATS, geração de cartas de apresentação, resumo de LinkedIn, mensagens para recrutadores, preparação para entrevistas, tradução/adaptação de currículo e análise de compatibilidade com vagas. O produto não é uma recrutadora, não intermedeia vagas e não deve ser posicionado como RH tradicional; o posicionamento correto é: plataforma de IA para empregabilidade, carreira internacional e automação documental profissional.

**Domínio oficial validado:** https://www.globalhireai.com.br

Esse domínio deve ser tratado como fonte principal para SEO, OAuth, analytics, Stripe, Vercel e comunicação institucional. Não voltar a tratar URL antiga da Vercel como domínio principal, salvo para staging/preview.

O modelo de negócio é SaaS com planos recorrentes via Stripe, possivelmente evoluindo para monetização por assinatura, recursos premium, geração limitada por plano, upsell de documentos e, futuramente, tráfego orgânico/ads. O estágio atual é MVP avançado em pré-lançamento profissional, com infraestrutura real, domínio próprio, autenticação, banco, pagamentos sandbox, analytics e branding estruturados, mas ainda dependente de validação final de produção, compliance e monetização real.

---

## 2. Estado real consolidado

A GlobalHire AI já saiu da fase de “ideia/protótipo” e entrou em fase de empresa SaaS em pré-operação. O projeto possui stack moderna, documentação crescente, decisões técnicas importantes já tomadas e histórico de problemas resolvidos. O foco agora não deve ser criar features novas, mas sim:

- estabilidade;
- validação pós-deploy;
- login/auth;
- Stripe real;
- UX mobile;
- LGPD;
- analytics;
- aquisição inicial;
- monetização.

**Stack consolidada (referência):** Next.js 15.x, React, TypeScript, Tailwind CSS, API Routes/Server Actions, Supabase/PostgreSQL/Auth, Vercel, GitHub, Cloudflare, Stripe, GA4, Microsoft Clarity, Turnstile, RLS e middleware. *(Versão exata do Next.js: ver `package.json` / lockfile do repositório.)*

---

## 3. Consolidação por área

### 3.1 Produto/Site

| Estado | Conteúdo |
|--------|----------|
| Feito | Produto definido como SaaS de IA para currículos ATS e documentos profissionais. Fluxos: currículo ATS, carta, LinkedIn, mensagem para recrutador, entrevista, tradução/adaptação, ATS score. |
| Validado | Posicionamento como ferramenta de empregabilidade, não recrutadora. |
| Pendente | Validar fluxo completo com usuário real: entrada → cadastro → geração → pagamento → histórico → cancelamento. |
| Não refazer | Não reposicionar como marketplace de vagas ou agência de recrutamento. |

### 3.2 Frontend/UI/UX

| Estado | Conteúdo |
|--------|----------|
| Feito | Next.js, React, Tailwind, TypeScript. Branding V2: logo, assets, OG, banners. |
| Validado | Build aprovado e V2 commitada. |
| Pendente | Teste mobile completo; UX login/logout, checkout, dashboard, geração. |
| Não refazer | Não voltar ao branding V1; apenas corrigir qualidade visual e consistência. |

### 3.3 Backend

| Estado | Conteúdo |
|--------|----------|
| Feito | Serverless: API Routes e Server Actions. |
| Validado | Estrutura operacional na Vercel. |
| Pendente | Validar rotas críticas em produção (IA, auth, Stripe webhook, exclusão de conta, limites). |
| Não refazer | Não migrar backend sem motivo forte. |

### 3.4 Banco de dados

| Estado | Conteúdo |
|--------|----------|
| Feito | Supabase/PostgreSQL: profiles, subscriptions, documents, generations, usage_events, audit_logs (referência). |
| Validado | Estrutura existe e conectada. |
| Pendente | Auditoria RLS, constraints, triggers, policies, backup, retenção. |
| Não refazer | Não recriar banco do zero sem backup e justificativa. |

### 3.5 Deploy/Infraestrutura

| Estado | Conteúdo |
|--------|----------|
| Feito | Vercel + GitHub, domínio próprio, SSL, env vars, deploy produção. |
| Problema conhecido | Em algum momento commits chegaram ao GitHub sem auto-deploy na Vercel; exigiu deploy manual. |
| Pendente | Confirmar auto-deploy após correção/manual. |
| Não refazer | Não trocar domínio principal; não orientar fluxo principal por localhost. |

### 3.6 Segurança

| Estado | Conteúdo |
|--------|----------|
| Feito | Cloudflare, Turnstile, middleware, RLS, proteção de webhook. |
| Pendente | Rate limit avançado, pentest, revisão de secrets, RLS em produção, logs sem PII. |
| Risco | Currículos = dados pessoais; possível dado sensível voluntário. |

### 3.7 Auth/Login

| Estado | Conteúdo |
|--------|----------|
| Feito | Email/senha, cadastro, Google OAuth, callback, recuperação de senha. |
| Validado | Funcional; validação contínua em produção. |
| Problemas já tratados | Redirects, trusted origins, domínio oficial, UX mobile. |
| Pendente | Login/logout mobile e recuperação de senha E2E. |

### 3.8 Analytics/Tracking

| Estado | Conteúdo |
|--------|----------|
| Feito | GA4 (Measurement ID **G-JXZC91RDLX**); Microsoft Clarity. |
| Preparado/discutido | PostHog. |
| Pendente | Eventos, funil, consentimento, mascaramento em produção. |
| Não refazer | GA4 no domínio oficial; não usar domínio antigo como principal. |

### 3.9 Pagamentos

| Estado | Conteúdo |
|--------|----------|
| Feito | Stripe Checkout, Customer Portal, Webhook, sync com Supabase preparado. |
| Status | Sandbox operacional. |
| Pendente | Pagamento real, cancelamento, portal live, webhook live, plano correto no Supabase. |
| Não refazer | Manter Stripe Checkout para SaaS recorrente. |

### 3.10 SEO

| Estado | Conteúdo |
|--------|----------|
| Feito | Sitemap, robots, OpenGraph, favicon, metadata, OG V2. |
| Pendente | Search Console, schema.org, conteúdo orgânico, indexação, internacional. |

### 3.11 Branding

| Estado | Conteúdo |
|--------|----------|
| Feito | Brand V2, `public/branding/*`, docs, banners LinkedIn, OG. |
| Direção | Minimalismo SaaS; globo + maleta; visual premium. |
| Não refazer | Logos amadores ou fora da paleta. |

### 3.12 LinkedIn/Instagram/Marketing

| Estado | Conteúdo |
|--------|----------|
| Feito | Discussão página LinkedIn, PT/FR, banners, testes com rede próxima. |
| Pendente | Calendário, perfil consistente, campanha inicial, prova social, funil. |

### 3.13 Jurídico/MEI/INPI

| Estado | Conteúdo |
|--------|----------|
| Feito | MEI; CNAE/nome fantasia discutidos; GRU INPI; preparação marca. |
| Pendente | Protocolo INPI, políticas (privacidade, termos, cookies, refund), DPA/subprocessadores, CDC, LGPD. |
| Risco | Nome “GlobalHire” vs empresas similares — validar juridicamente; escopo IA/documentos mitiga mas não elimina. |

### 3.14 Operação empresarial

| Estado | Conteúdo |
|--------|----------|
| Feito | Entendimento de operar como empresa. |
| Pendente | Rotina semanal: métricas, suporte, financeiro, jurídico, bugs, deploy, docs, aquisição. |

### 3.15 Automação

| Estado | Conteúdo |
|--------|----------|
| Feito | Discussão de ferramentas. |
| Pendente | Stack operacional baixo custo, CRM simples, agenda editorial, dashboard métricas, backlog. |

### 3.16 IA/Codex/Prompts

| Estado | Conteúdo |
|--------|----------|
| Feito | Uso intenso de IA para implementação, branding, docs, hardening. |
| Problema | Créditos/limits; terminal; GitHub Desktop como fluxo confiável. |
| Pendente | Padronizar prompts: bugfix, deploy, auditoria, branding, testes, docs, segurança. |

### 3.17 Testes e QA

| Estado | Conteúdo |
|--------|----------|
| Feito | Plano go-live e checklist discutidos. |
| Pendente crítico | Mobile, auth, Stripe, IA, dashboard, Supabase, analytics, Clarity, SEO, LGPD, cancelamento. |

### 3.18 Documentação

| Estado | Conteúdo |
|--------|----------|
| Feito | PDFs, fluxo de dados jurídico, resumo operacional, manual. |
| Recomendado | Atualizar periodicamente: `MASTER_OPERATIONS.md`, `SYSTEM_ARCHITECTURE.md`, `INCIDENT_HISTORY.md`, `DEPLOY_GUIDE.md`, `INVESTOR_TECH_SUMMARY.md`. **Este arquivo (`MASTER_CONTEXT.md`) consolida visão de produto e prioridades.** Verificações de produção (sem secrets): [`PRODUCTION_VERIFICATION_LOG.md`](./PRODUCTION_VERIFICATION_LOG.md). |

### 3.19 Monetização

| Estado | Conteúdo |
|--------|----------|
| Feito | Stripe preparado; potencial SaaS. |
| Pendente | Preço, planos, trial/free, limites, conversão, copy, pricing page, cobrança real. |

### 3.20 Roadmap futuro

**Prioridade:** não inventar feature nova antes de estabilizar, validar e monetizar.

---

## 4. Situação atual (resumo)

**Operacional:** domínio oficial, Vercel, GitHub, SSL, Supabase, banco, auth, GA4, Clarity, Stripe sandbox, Brand V2, build, documentação relevante.

**Parcial:** Stripe live, analytics completos, Google Auth produção, recuperação de senha, consentimento LGPD, retenção, Search Console, UX mobile, automação operacional.

**Não validado / pendente:** pagamento real completo, cancelamento real, webhook live confiável, RLS validado em produção, Clarity sem dados sensíveis, cleanup retenção automático, revisão jurídica formal, aquisição, monetização real, rotina de métricas.

---

## 5. Riscos principais

1. **Técnico:** pipeline Vercel/GitHub já falhou; validar antes de campanhas.
2. **LGPD:** currículos, vagas, outputs em `generations` — retenção, exclusão, portabilidade claras.
3. **IA (Groq):** DPA, retenção, treinamento, transferência internacional.
4. **Analytics:** GA4/Clarity/PostHog só após consentimento; nunca enviar currículo, vaga, email, telefone, senha, token ou output gerado.
5. **Financeiro:** dependência de tiers gratuitos (Vercel, Supabase, email/Auth).
6. **Operacional:** equipe reduzida — documentação é ativo crítico.

---

## 6. Decisões já tomadas (não reverter sem motivo forte)

- Next.js + Vercel como base.
- Supabase Auth + banco.
- Stripe Checkout + Portal + Webhook.
- Groq como provedor de IA.
- Google OAuth + email/senha.
- Domínio produção: **globalhireai.com.br** (www canônico).
- GA4 + Clarity como analytics inicial; PostHog como evolução possível.
- Cloudflare Turnstile anti-bot.
- Posicionamento: SaaS IA ATS/documentos, **não** recrutadora.
- MEI enquanto valida monetização.
- Prioridade: deploy, estabilidade, LGPD, monetização antes de features novas.

---

## 7. Roadmap priorizado (síntese)

**Crítico/imediato:** produção no domínio oficial; mobile; cadastro/login/logout; Google OAuth; recuperação senha; geração IA; Stripe real; webhook + plano no Supabase; GA4/Clarity; Clarity sem PII sensível.

**Pré-lançamento:** políticas, cookies, refund, suporte/privacidade, Search Console, checklist QA recorrente, rotina métricas.

**Go-live:** grupo pequeno, bugs, abandono, copy, primeira venda real.

**Pós / escala / monetização:** conteúdo, blog, campanhas, backup Supabase, rate limit, Sentry filtrado, PostHog, testes automáticos, auditoria RLS, planos pagos infra quando justificado, free limitado, mensal/anual, upsells, multilíngue, B2B, etc. *(Detalhes no documento operacional de roadmap do fundador.)*

---

## 8. Instruções para IA / engenharia

Operar como **CTO + Tech Lead + PM + Compliance**.

- Não inventar implementações; evidenciar no código/docs o que é validado.
- Separar sempre: **validado | parcial | preparado | planejado | descartado**.
- Preservar domínio oficial.
- Não refazer Supabase/Vercel/Stripe sem motivo forte.
- Antes de alterar produção: checklist de validação.
- Não criar feature nova antes de go-live estável.
- Alterações: build / lint / typecheck quando possível.
- Mudanças em auth, Stripe, banco, middleware, env: **teste de regressão**.
- Nunca expor secrets.
- Não enviar dados sensíveis a analytics.
- Documentar mudanças relevantes em `docs/`.
- Preservar histórico de decisões.

---

## 9. Estado consolidado (uma frase)

A GlobalHire AI é um SaaS de IA para currículos ATS e documentos profissionais em **https://www.globalhireai.com.br**, em MVP avançado/pré-lançamento: infra principal pronta; faltam validações reais de produção (Stripe live, webhook, sync assinatura, mobile, auth edge cases, analytics com compliance, LGPD, jurídico, primeira monetização). **Prioridade: estabilizar, validar e vender — não empilhar features.**

---

## 10. Instrução final (colar em outra IA)

Assuma o projeto GlobalHire AI como CTO/engenheiro/arquiteto operacional. É um SaaS de IA para otimização de currículos ATS e documentos profissionais, hospedado em **https://www.globalhireai.com.br**, com Next.js, Vercel, Supabase, Stripe, Groq, Google OAuth, GA4, Microsoft Clarity e Cloudflare Turnstile. Preserve decisões validadas; não refaça o que funciona; diferencie validado/parcial/preparado/pendente; priorize estabilidade, Stripe live, auth, UX mobile, LGPD, analytics e monetização. **Não posicione como recrutadora** — é plataforma SaaS de IA para empregabilidade e documentos profissionais.

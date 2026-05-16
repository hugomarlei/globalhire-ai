# GlobalHire AI — Mapa Técnico de Fluxo de Dados

Data da auditoria técnica: 2026-05-12  
Escopo: repositório local da aplicação GlobalHire AI em Next.js App Router, Supabase, Stripe, Groq, Cloudflare Turnstile, Google OAuth, GA4, Microsoft Clarity e PostHog.  
Finalidade do documento: apoiar advogado, fundador e equipe técnica na revisão de LGPD, Política de Privacidade, Termos de Uso, Política de Cookies, contratos com fornecedores e governança operacional.

> Observação de escopo: este documento é um relatório técnico baseado no código-fonte, arquivos SQL e documentação encontrados no repositório. Bases legais são indicadas como hipótese provável de tratamento e devem ser validadas juridicamente. Quando uma informação depende de painel externo, contrato, configuração de fornecedor ou estado real do Supabase em produção, ela é marcada como “não identificado no código — validar manualmente”.

---

## 1. Resumo Executivo

A GlobalHire AI é uma aplicação SaaS que ajuda usuários a criar e otimizar documentos profissionais com IA, incluindo currículo ATS, carta de apresentação, resumo de LinkedIn, mensagem para recrutador, preparação para entrevista, tradução/adaptação de currículo e análise ATS Score.

O produto trata dados pessoais porque o usuário informa ou envia:

- dados cadastrais, como nome e e-mail;
- dados de autenticação, diretamente via Supabase Auth e indiretamente via Google OAuth;
- currículo, experiências profissionais, formação, competências, idiomas, certificações e demais dados profissionais;
- descrição de vagas e critérios de candidatura;
- documentos gerados por IA a partir desses dados;
- dados técnicos de segurança, sessão, IP, navegador, captcha e logs;
- dados de assinatura e cobrança processados via Stripe.

O fluxo central do produto é:

1. Visitante acessa a landing page.
2. Usuário cria conta ou faz login.
3. Usuário cola texto ou envia PDF/DOCX do currículo.
4. Usuário informa descrição da vaga, idioma e país-alvo.
5. Backend valida autenticação, plano, limite de uso, captcha e origem da requisição.
6. Backend envia currículo, vaga e parâmetros da tarefa para a API da Groq.
7. O resultado da IA é retornado ao usuário e salvo na tabela `generations`.
8. Usuário pode copiar, baixar, exportar via navegador, regenerar ou excluir documentos.
9. Para planos pagos, checkout e assinatura são processados pela Stripe.
10. Webhooks da Stripe sincronizam plano/status/período no Supabase.

Dados profissionais são o núcleo de valor do produto e também a principal superfície de risco LGPD, pois currículos podem conter dados pessoais identificáveis e, por decisão do usuário, até dados sensíveis desnecessários. O código e a documentação já indicam que o usuário deve evitar inserir dados sensíveis desnecessários, mas a aplicação ainda armazena currículo, vaga e resultado completo na tabela `generations`.

---

## 2. Categorias de Dados Coletados

### 2.1 Nome

| Item | Mapeamento técnico |
|---|---|
| Onde é coletado | Página de cadastro em `app/(auth)/cadastro/page.tsx`, campo `fullName`; também pode vir de metadados Google OAuth/Supabase Auth. |
| Tela/formulário/rota | `/cadastro`; OAuth em `components/social-auth-buttons.tsx`; callback em `app/auth/callback/route.ts`. |
| Obrigatório/opcional | Obrigatório no cadastro por e-mail/senha; em OAuth depende do provedor. |
| Finalidade | Criar perfil, personalização mínima da conta e identificação operacional. |
| Base provável LGPD | Execução de contrato/prestação do serviço; legítimo interesse para gestão da conta; validar juridicamente. |
| Armazenamento | `profiles.full_name` em Supabase, criado por trigger `handle_new_user()` em `supabase/schema.sql`. |
| Retenção aparente | Mantido enquanto conta existir; exclusão via `app/api/account/delete/route.ts`. Prazos formais estão em `lib/retention.ts`, mas cleanup automático não é executado por padrão. |
| Terceiros | Supabase Auth/Database; Google OAuth se cadastro social; Vercel como infraestrutura. |
| Evidências | `app/(auth)/cadastro/page.tsx`; `supabase/schema.sql`; `lib/supabase-server.ts`. |

### 2.2 E-mail

| Item | Mapeamento técnico |
|---|---|
| Onde é coletado | Login/cadastro por e-mail; OAuth social; checkout Stripe por `customer_email`. |
| Tela/formulário/rota | `/login`, `/cadastro`, `components/social-auth-buttons.tsx`, `app/api/stripe/checkout/route.ts`. |
| Obrigatório/opcional | Obrigatório para autenticação e assinatura. |
| Finalidade | Autenticação, criação de conta, identificação do cliente Stripe, suporte, controle administrativo. |
| Base provável LGPD | Execução de contrato; cumprimento de obrigação relacionada a cobrança/contabilidade quando aplicável; legítimo interesse contra fraude. |
| Armazenamento | Supabase Auth; `profiles.email`; Stripe Customer/Checkout. |
| Retenção aparente | Enquanto conta existir; dados de pagamento retidos pela Stripe conforme política própria. |
| Terceiros | Supabase, Stripe, Google OAuth se usado. |
| Evidências | `app/(auth)/login/page.tsx`; `app/(auth)/cadastro/page.tsx`; `app/api/stripe/checkout/route.ts`; `supabase/schema.sql`. |

### 2.3 Dados de login e sessão

| Item | Mapeamento técnico |
|---|---|
| Dados envolvidos | Senha enviada ao Supabase no login/cadastro por e-mail; códigos OAuth; cookies/sessão Supabase; dados de sessão gerenciados por `@supabase/ssr`. |
| Onde é coletado | Formulários de login/cadastro; callback OAuth. |
| Obrigatório/opcional | Obrigatório para autenticação. |
| Finalidade | Autenticação, manutenção de sessão e proteção de rotas. |
| Base provável LGPD | Execução de contrato; segurança/prevenção a fraude. |
| Armazenamento | Senha é tratada pelo Supabase Auth; cookies de sessão gerenciados pelo Supabase SSR. Nome exato dos cookies não identificado no código — validar em navegador/painel. |
| Retenção aparente | Sessão conforme configuração Supabase; não identificado no código — validar painel Supabase. |
| Terceiros | Supabase; Google para OAuth. |
| Evidências | `lib/supabase-browser.ts`; `lib/supabase-server.ts`; `middleware.ts`; `app/auth/callback/route.ts`. |

### 2.4 Dados de perfil e plano

| Item | Mapeamento técnico |
|---|---|
| Dados envolvidos | `plan`, `is_admin`, `is_blocked`, assinatura, status, Stripe customer/subscription IDs, price ID, período de assinatura. |
| Onde é coletado/gerado | Supabase trigger; checkout/webhook Stripe; admin. |
| Obrigatório/opcional | Necessário para operação do SaaS. |
| Finalidade | Controle de acesso, limite de uso, cobrança, suporte e antifraude. |
| Base provável LGPD | Execução de contrato; legítimo interesse; cumprimento de obrigações fiscais/contábeis quando aplicável. |
| Armazenamento | `profiles`, `subscriptions`. |
| Retenção aparente | Enquanto conta/assinatura existir; exclusão de dados do app pela rota de exclusão de conta. |
| Terceiros | Supabase, Stripe, Vercel. |
| Evidências | `supabase/schema.sql`; `lib/plans.ts`; `lib/stripe-subscription.ts`; `app/api/stripe/webhook/route.ts`. |

### 2.5 Currículo, experiências profissionais, formação e competências

| Item | Mapeamento técnico |
|---|---|
| Onde é coletado | Textareas do gerador e ATS Score; upload PDF/DOCX parseado. |
| Tela/formulário/rota | `/gerador`, `/ats-score`; `components/dashboard-generator.tsx`; `components/ats-analyzer.tsx`; `app/api/upload/parse/route.ts`. |
| Obrigatório/opcional | Obrigatório para geração/análise; mínimo de 100 caracteres no backend. |
| Finalidade | Gerar documentos profissionais, comparar com vaga, calcular score, reescrever/adaptar currículo. |
| Base provável LGPD | Execução de contrato/prestação do serviço; consentimento pode ser considerado para conteúdos sensíveis enviados voluntariamente; validar juridicamente. |
| Armazenamento | `generations.input_resume` armazena texto completo do currículo/base profissional. Arquivo PDF/DOCX bruto não é salvo pelo endpoint de upload. |
| Retenção aparente | Mantido na tabela `generations` até exclusão granular ou exclusão de conta. Configuração de retenção existe (`lib/retention.ts`), mas cleanup automático está desativado por padrão. |
| Terceiros | Groq recebe currículo/base dentro do prompt; Supabase armazena; Vercel processa no runtime; ferramenta de upload usa bibliotecas server-side `pdf-parse` e `mammoth`. |
| Evidências | `components/dashboard-generator.tsx`; `components/ats-analyzer.tsx`; `app/api/ai/generate/route.ts`; `app/api/ai/optimize-from-score/route.ts`; `app/api/upload/parse/route.ts`; `supabase/schema.sql`. |

### 2.6 Descrição de vaga

| Item | Mapeamento técnico |
|---|---|
| Onde é coletado | Textarea “Descrição da vaga” no gerador e ATS Score. |
| Obrigatório/opcional | Opcional para algumas ferramentas; obrigatório para otimização precisa e ATS Score. |
| Finalidade | Adaptar currículo/documentos à vaga, extrair palavras-chave, calcular match. |
| Base provável LGPD | Execução de contrato; geralmente dado não pessoal, mas pode conter nomes/e-mails de recrutadores ou dados empresariais. |
| Armazenamento | `generations.job_description`. |
| Retenção aparente | Igual às gerações/documentos salvos. |
| Terceiros | Groq quando gera/otimiza; Supabase; Vercel. |
| Evidências | `components/dashboard-generator.tsx`; `components/ats-analyzer.tsx`; `app/api/ai/generate/route.ts`; `supabase/schema.sql`. |

### 2.7 Documentos gerados por IA

| Item | Mapeamento técnico |
|---|---|
| Dados envolvidos | Currículo otimizado, carta, resumo LinkedIn, mensagem para recrutador, preparação de entrevista, tradução/adaptação. |
| Onde é gerado | Rotas IA com Groq: `/api/ai/generate`, `/api/ai/optimize-from-score`, `/api/ai/regenerate`. |
| Obrigatório/opcional | Gerado sob ação do usuário. |
| Finalidade | Entrega principal do serviço; histórico; regeneração. |
| Base provável LGPD | Execução de contrato; legítimo interesse para histórico; validar retenção. |
| Armazenamento | `generations.output`; tabela `documents` existe para documentos finais, mas o fluxo analisado lê principalmente `generations`. |
| Retenção aparente | Até exclusão granular ou exclusão de conta; sem cleanup automático por padrão. |
| Terceiros | Groq gera; Supabase armazena. |
| Evidências | `app/api/ai/generate/route.ts`; `app/api/ai/regenerate/route.ts`; `components/history-list.tsx`; `supabase/schema.sql`. |

### 2.8 Informações de pagamento e assinatura

| Item | Mapeamento técnico |
|---|---|
| Dados envolvidos | Plano selecionado, e-mail do cliente, customer ID, subscription ID, price ID, status, período de cobrança, cancelamento no fim do período. Dados completos de cartão não passam pelo app. |
| Onde é coletado/processado | Stripe Checkout, Customer Portal e Webhooks. |
| Obrigatório/opcional | Obrigatório para planos pagos. |
| Finalidade | Cobrança, atualização de plano, controle de acesso. |
| Base provável LGPD | Execução de contrato; cumprimento de obrigação legal/contábil; prevenção a fraude. |
| Armazenamento | Stripe armazena dados de pagamento; Supabase armazena metadados de assinatura em `subscriptions`. |
| Retenção aparente | No app, até exclusão de conta; na Stripe, conforme política própria/obrigações legais. |
| Terceiros | Stripe; Vercel; Supabase. |
| Evidências | `app/api/stripe/checkout/route.ts`; `app/api/stripe/portal/route.ts`; `app/api/stripe/webhook/route.ts`; `lib/stripe-subscription.ts`; `supabase/schema.sql`. |

### 2.9 Identificadores técnicos, IP, user-agent e dispositivo/navegador

| Item | Mapeamento técnico |
|---|---|
| Dados envolvidos | IP por headers `cf-connecting-ip`, `x-real-ip`, `x-forwarded-for`; Origin/Referer; possíveis user-agent e device/browser via Vercel/fornecedores; anonymous analytics ID local. |
| Onde é coletado | Rate limit, Turnstile, logs de infraestrutura, analytics. |
| Obrigatório/opcional | Necessário para segurança; analytics depende de consentimento. |
| Finalidade | Segurança, antiabuso, rate limit, captcha, métricas agregadas. |
| Base provável LGPD | Legítimo interesse/segurança; consentimento para analytics; validar juridicamente. |
| Armazenamento | `rate_limits.key` contém escopo + userId/anonymous + IP; localStorage `globalhire-anonymous-id`; logs Vercel/fornecedores não detalhados no código. |
| Retenção aparente | `rate_limits` expira por `reset_at`, mas não há cleanup automático identificado; logs de fornecedor não identificado no código. |
| Terceiros | Cloudflare Turnstile, GA4, Clarity, PostHog, Vercel, Supabase. |
| Evidências | `lib/security.ts`; `lib/rate-limit.ts`; `components/analytics-scripts.tsx`; `lib/analytics.ts`; `lib/turnstile.ts`. |

### 2.10 Cookies, consentimento e armazenamento local

| Item | Mapeamento técnico |
|---|---|
| Dados envolvidos | Consentimento LGPD, idioma, preferências do usuário, anonymous analytics ID, cookies Supabase, cookies/scripts de terceiros após consentimento. |
| Onde é coletado | `components/cookie-consent.tsx`; `components/language-provider.tsx`; `components/settings-panel.tsx`; `lib/analytics.ts`; Supabase SSR. |
| Obrigatório/opcional | Cookies de sessão são necessários; analytics depende de consentimento. |
| Finalidade | Login, segurança, preferências, idioma, analytics. |
| Armazenamento | localStorage: `globalhire-cookie-consent`, `globalhire-locale`, `globalhire-preferences`, `globalhire-anonymous-id`; cookies de sessão Supabase. |
| Retenção aparente | localStorage até usuário limpar navegador ou alterar preferências; cookies de sessão conforme Supabase; analytics conforme fornecedor. |
| Terceiros | Supabase; GA4; Microsoft Clarity; PostHog. |
| Evidências | `components/cookie-consent.tsx`; `components/analytics-scripts.tsx`; `lib/analytics.ts`; `components/settings-panel.tsx`; `components/language-provider.tsx`. |

### 2.11 Logs de erro e operação

| Item | Mapeamento técnico |
|---|---|
| Dados envolvidos | Mensagens técnicas, IDs de usuário, IDs Stripe, IDs de assinatura, nomes de arquivo no upload, tipo/tamanho de arquivo, comprimentos extraídos, códigos de erro. |
| Onde é gerado | APIs IA, upload, Stripe, rate limit, Turnstile, exclusão, assinatura, admin. |
| Obrigatório/opcional | Necessário para operação e troubleshooting. |
| Finalidade | Diagnóstico, segurança, auditoria operacional básica. |
| Base provável LGPD | Legítimo interesse/segurança; cumprimento de obrigações técnicas. |
| Armazenamento | `console.log/warn/error` em runtime Vercel; tabelas `usage_events`/`audit_logs` existem em SQL opcional, mas não foi identificado uso ativo no código. |
| Retenção aparente | Logs Vercel conforme configuração do provedor; não identificado no código — validar painel Vercel. |
| Terceiros | Vercel; Supabase se logs forem inseridos futuramente; Stripe/Groq/Turnstile nos seus próprios painéis. |
| Evidências | `app/api/upload/parse/route.ts`; `app/api/ai/generate/route.ts`; `app/api/stripe/webhook/route.ts`; `lib/rate-limit.ts`; `supabase/usage-events.sql`. |

---

## 3. Fluxo de Dados por Jornada do Usuário

### 3.1 Visitante anônimo

1. Usuário acessa a landing page em `/`.
2. O layout global carrega `CookieConsent`, `AnalyticsScripts`, `LanguageProvider` e structured data.
3. Sem consentimento, scripts GA4, Clarity e PostHog não são carregados porque `AnalyticsScripts` só renderiza quando `globalhire-cookie-consent` é `all` ou legado `accepted` e `NODE_ENV === "production"`.
4. O banner salva decisão em localStorage com chave `globalhire-cookie-consent`.
5. A seleção de idioma salva `globalhire-locale`.
6. Se o usuário aceitar analytics, o app carrega:
   - GA4 via `https://www.googletagmanager.com/gtag/js`;
   - PostHog via script dinâmico configurado;
   - Clarity via `https://www.clarity.ms/tag/{id}`.
7. Eventos de page view são enviados por `trackEvent("page_view", { path, has_query })`, com sanitização.

Evidências: `app/layout.tsx`, `components/cookie-consent.tsx`, `components/analytics-scripts.tsx`, `lib/analytics.ts`, `components/language-provider.tsx`.

### 3.2 Criação de conta por e-mail/senha

1. Usuário abre `/cadastro`.
2. Informa nome, e-mail e senha.
3. Campos possuem `data-clarity-mask="true"`.
4. Antes de chamar Supabase, o frontend chama `/api/security/turnstile` com token do Cloudflare Turnstile.
5. O servidor valida o token no endpoint Cloudflare `siteverify` usando `TURNSTILE_SECRET_KEY`.
6. Se captcha for válido, o frontend chama Supabase Auth `signUp` com:
   - e-mail;
   - senha;
   - metadata `full_name`;
   - `emailRedirectTo` baseado em `getAppUrl()`.
7. Trigger `handle_new_user()` cria linha em `profiles`.
8. Eventos `signup_started` e `signup_completed` podem ser enviados a analytics se usuário tiver consentido e estiver em produção.

Evidências: `app/(auth)/cadastro/page.tsx`, `components/turnstile-widget.tsx`, `app/api/security/turnstile/route.ts`, `lib/turnstile.ts`, `supabase/schema.sql`.

### 3.3 Login por e-mail/senha

1. Usuário abre `/login`.
2. Informa e-mail e senha, campos mascarados para Clarity.
3. Frontend valida Turnstile via `/api/security/turnstile`.
4. Frontend chama Supabase Auth `signInWithPassword`.
5. Em caso de sucesso, redireciona para `/dashboard`.
6. `middleware.ts` atualiza sessão via Supabase SSR.

Evidências: `app/(auth)/login/page.tsx`, `middleware.ts`, `lib/supabase-browser.ts`, `lib/supabase-server.ts`.

### 3.4 Login com Google OAuth

1. Usuário clica “Continuar com Google”.
2. `components/social-auth-buttons.tsx` chama `supabase.auth.signInWithOAuth`.
3. `redirectTo` usa `getAuthCallbackUrl("/dashboard")`, que aponta para `${getAppUrl()}/auth/callback?next=/dashboard`.
4. `app/auth/callback/route.ts` troca o `code` por sessão via `exchangeCodeForSession`.
5. Usuário é redirecionado ao dashboard.
6. O código também contém botões preparados para LinkedIn OIDC e Facebook, mas funcionamento depende de providers habilitados no Supabase. Se provider não estiver configurado, exibe mensagem amigável.

Evidências: `components/social-auth-buttons.tsx`, `lib/app-url.ts`, `app/auth/callback/route.ts`.

### 3.5 Uso do gerador de documentos

1. Usuário autenticado acessa `/gerador` ou `/gerador?tipo=...`.
2. Informa currículo/base profissional, descrição da vaga, idioma, país-alvo e tipo de entrega.
3. Opcionalmente faz upload PDF/DOCX. O arquivo é enviado para `/api/upload/parse`; o backend extrai texto com `pdf-parse` ou `mammoth` e retorna somente `text`.
4. Frontend envia `resume`, `jobDescription`, `language`, `targetCountry`, `type`, `turnstileToken` para `/api/ai/generate`.
5. Backend valida:
   - Origin/Referer;
   - sessão Supabase;
   - rate limit por usuário/IP;
   - schema Zod;
   - Turnstile;
   - bloqueio de conta;
   - plano/feature;
   - limite mensal.
6. Backend monta prompt com `buildPrompt()` e envia currículo/vaga para Groq.
7. Backend parseia o resultado, salva `input_resume`, `job_description` e `output` em `generations`.
8. Frontend mostra o documento, melhorias aplicadas, botões copiar, gerar novamente e exportar PDF via `window.print()`.

Evidências: `components/dashboard-generator.tsx`, `app/api/upload/parse/route.ts`, `app/api/ai/generate/route.ts`, `prompts/ai-prompts.ts`, `lib/groq.ts`, `supabase/schema.sql`.

### 3.6 ATS Score e palavras-chave

1. Usuário acessa `/ats-score`.
2. Cola ou envia currículo e descrição da vaga.
3. A análise inicial de keywords/match/score é calculada no cliente em `components/ats-analyzer.tsx`.
4. Para “Criar versão otimizada”, frontend envia currículo, vaga, score, match, found/missing keywords e recomendações para `/api/ai/optimize-from-score`.
5. Backend valida autenticação, rate limit, Turnstile, plano, limite e envia dados à Groq.
6. Resultado otimizado é salvo em `generations` com tipo `ats_resume`.

Evidências: `components/ats-analyzer.tsx`, `app/api/ai/optimize-from-score/route.ts`.

### 3.7 Regeneração de documentos

1. Usuário abre histórico em `/historico`.
2. Clica em “Regenerar”.
3. Frontend envia `generationId` e `turnstileToken` para `/api/ai/regenerate`.
4. Backend busca a geração original com `.eq("user_id", user.id)`, recupera `input_resume`, `job_description`, `type`, `language`, `target_country`.
5. Backend chama Groq novamente e salva nova linha em `generations`.

Evidências: `components/history-list.tsx`, `app/api/ai/regenerate/route.ts`.

### 3.8 Download/exportação

1. Exportação PDF principal acontece no navegador por `window.open`, `document.write` e `window.print()`.
2. O conteúdo é escapado com `escapeHtml()` em `components/dashboard-generator.tsx`.
3. Plano gratuito recebe watermark “Criado com GlobalHire AI - plano grátis”.
4. Histórico permite baixar `.txt` por Blob local.
5. Existe rota `/api/pdf` que retorna HTML em JSON, mas o próprio endpoint informa que o MVP exporta via navegador e a rota está pronta para evolução server-side. Essa rota ecoa `title` e `content` em HTML sem escape no retorno JSON; se futuramente for renderizada como HTML, precisa sanitização.

Evidências: `components/dashboard-generator.tsx`, `components/history-list.tsx`, `app/api/pdf/route.ts`.

### 3.9 Checkout Stripe

1. Usuário inicia upgrade em pricing/assinatura.
2. Frontend chama `/api/stripe/checkout` com plano `starter`, `pro` ou `elite`.
3. Backend valida Origin, sessão, schema e price ID vindo das envs `NEXT_PUBLIC_STRIPE_*_PRICE_ID`.
4. Cria Stripe Checkout Session em modo subscription com:
   - `customer_email: user.email`;
   - `client_reference_id: user.id`;
   - metadata `user_id` e `plan`;
   - success/cancel URLs baseadas em `getAppUrl()`.
5. Stripe coleta e processa pagamento.

Evidências: `app/api/stripe/checkout/route.ts`, `lib/plans.ts`, `lib/app-url.ts`.

### 3.10 Pagamento aprovado, recusado, cancelamento e portal

1. Stripe envia eventos para `/api/stripe/webhook`.
2. Webhook valida assinatura com `STRIPE_WEBHOOK_SECRET`.
3. Eventos tratados:
   - `checkout.session.completed`;
   - `customer.subscription.created`;
   - `customer.subscription.updated`;
   - `customer.subscription.deleted`;
   - `invoice.payment_succeeded`;
   - `invoice.payment_failed`.
4. `syncStripeSubscription()` extrai price ID de `subscription.items.data[0].price.id`, mapeia plano, extrai período e sincroniza `subscriptions` e `profiles.plan`.
5. Portal Stripe é criado em `/api/stripe/portal` e retorna para `/dashboard?subscription=updated`.
6. Dashboard força sync quando recebe `checkout=success`, `subscription=updated` ou `billing=updated`.

Evidências: `app/api/stripe/webhook/route.ts`, `lib/stripe-subscription.ts`, `app/api/stripe/portal/route.ts`, `app/(app)/dashboard/page.tsx`.

### 3.11 Pagamento recusado

1. Evento `invoice.payment_failed` é tratado pelo webhook.
2. A subscription correspondente é buscada na Stripe e sincronizada com o Supabase.
3. O código sincroniza `status`; regras específicas de bloqueio por `past_due`/`unpaid` dependem de `effectivePlanFromSubscription()`, que retorna free para `unpaid`, `canceled` e `incomplete_expired`.
4. Não identificado no código um fluxo específico de e-mail ou notificação de cobrança falha — validar manualmente.

Evidências: `app/api/stripe/webhook/route.ts`, `lib/stripe-subscription.ts`, `lib/plans.ts`.

### 3.12 Exclusão de conta/dados

1. Usuário solicita exclusão com confirmação textual “EXCLUIR MINHA CONTA”.
2. `/api/account/delete` valida Origin, sessão e confirmação.
3. Usa `SUPABASE_SERVICE_ROLE_KEY` para:
   - cancelar assinatura Stripe, se houver `stripe_subscription_id`;
   - excluir `documents`;
   - excluir `generations`;
   - excluir `subscriptions`;
   - excluir `profiles`;
   - excluir usuário Supabase Auth via admin API.
4. A rota não remove dados já mantidos pela Stripe, Google, analytics ou logs de infraestrutura; estes dependem de cada fornecedor.
5. Dados locais do navegador (`globalhire-cookie-consent`, `globalhire-locale`, `globalhire-preferences`, `globalhire-anonymous-id`) não são limpos por essa rota.

Evidências: `app/api/account/delete/route.ts`, `supabase/schema.sql`.

### 3.13 Contato/suporte

1. Página `/support` existe no projeto e documentos indicam e-mails públicos.
2. Envio transacional de e-mail não foi identificado no código.
3. `NEXT_PUBLIC_SUPPORT_EMAIL` é usado/documentado para canal público.
4. Cloudflare Email Routing é mencionado em documentação de produção, mas não há integração programática de e-mail no repositório.

Evidências: `.env.example`, `README.md`, `docs/PRODUCTION_CHECKLIST.md`, `docs/OPERATIONS.md`.

---

## 4. Fornecedores e Subprocessadores

| Fornecedor | Serviço usado | Dados que recebe | Finalidade | Origem dos dados | Categoria | Variáveis relacionadas | Arquivos/rotas | Observações de risco |
|---|---|---|---|---|---|---|---|---|
| Supabase | Auth, database, SSR session, admin API | Nome, e-mail, usuário Auth, cookies/sessão, perfis, assinaturas, currículos, vagas, documentos, rate limits | Autenticação, armazenamento, RLS, sessão | Cadastro/login, APIs, banco | Dados pessoais, profissionais, técnicos | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` | `lib/supabase-server.ts`, `lib/supabase-browser.ts`, `middleware.ts`, `supabase/schema.sql` | RLS existe; validar no banco real; service role é segredo crítico. |
| Vercel | Hosting/serverless/logs | Requisições HTTP, IP, user-agent, logs de erro, payloads processados em runtime | Hospedagem e execução backend/frontend | Toda aplicação | Dados técnicos e possivelmente dados pessoais em logs se erro incluir payload | Não há env específica obrigatória; Vercel armazena envs | `next.config.ts`, rotas `app/api/*` | Retenção de logs não identificada no código — validar painel/contrato. |
| Stripe | Checkout, subscription, Customer Portal, webhooks | E-mail, customer ID, assinatura, plano, status, price ID, dados de pagamento diretamente no Stripe | Cobrança e gestão de assinatura | Checkout/portal/webhook | Dados de pagamento, cobrança, identificadores | `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_STRIPE_*_PRICE_ID` | `app/api/stripe/*`, `lib/stripe.ts`, `lib/stripe-subscription.ts` | Cartão não passa pelo app; retenção/chargebacks/fiscal dependem da Stripe. |
| Google OAuth | Login social | Identificador Google, e-mail, nome/metadados autorizados | Autenticação social | Clique “Continuar com Google” | Dados pessoais de login | Configuração externa no Supabase/Google Cloud; callback via `NEXT_PUBLIC_APP_URL` | `components/social-auth-buttons.tsx`, `app/auth/callback/route.ts` | Escopos efetivos não identificados no código — validar Google Cloud/Supabase. |
| Google Analytics 4 | Analytics | Page views, eventos sanitizados, anonymous ID local, dados técnicos de navegador/IP tratados pelo Google | Métricas de uso | Frontend após consentimento | Dados comportamentais/técnicos | `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `components/analytics-scripts.tsx`, `lib/analytics.ts` | Carrega apenas produção e consentimento; não envia conteúdo sensível por sanitização de propriedades. |
| Microsoft Clarity | Analytics/heatmap | Eventos, sessão/heatmap com campos mascarados, dados técnicos | UX analytics | Frontend após consentimento | Dados comportamentais/técnicos | `NEXT_PUBLIC_CLARITY_PROJECT_ID` | `components/analytics-scripts.tsx` | Campos sensíveis são marcados com `data-clarity-mask`; validar no painel Clarity se masking está efetivo. |
| PostHog | Product analytics | Eventos sanitizados, anonymous ID, metadados de plano/ação/status | Funil e métricas de produto | Frontend após consentimento | Dados comportamentais/técnicos | `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | `components/analytics-scripts.tsx`, `lib/analytics.ts` | Autocapture e session recording desativados; identifica via anonymous ID, não e-mail. |
| Cloudflare Turnstile | Captcha/anti-bot | Token de captcha, IP remoto quando disponível, dados técnicos do navegador | Segurança e antiabuso | Login, cadastro, geração, ATS, regeneração | Dados técnicos/segurança | `NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `TURNSTILE_SECRET_KEY` | `components/turnstile-widget.tsx`, `lib/turnstile.ts`, `app/api/security/turnstile/route.ts` | Secret não exposto; em produção sem secret o captcha falha. |
| Groq | API LLM/OpenAI-compatible | Currículo/base profissional, descrição da vaga, idioma, país, prompt, contexto ATS, output gerado | Geração e otimização de documentos | Rotas IA | Dados pessoais/profissionais e conteúdo gerado | `GROQ_API_KEY`, `GROQ_MODEL` | `lib/groq.ts`, `app/api/ai/*`, `prompts/ai-prompts.ts` | Principal subprocessador de conteúdo sensível/profissional; contrato/DPA e retenção do provedor devem ser validados. |
| Cloudflare DNS/Email Routing | Infraestrutura/DNS/e-mail roteado | DNS, tráfego se proxy ativo, metadados de e-mail se routing usado | Domínio, segurança e roteamento | Configuração externa | Dados técnicos; e-mail se routing | Não identificado no código | Documentação `docs/PRODUCTION_CHECKLIST.md` | Uso exato não identificado no código — validar Cloudflare dashboard. |
| Sentry | Error monitoring preparado | Potenciais erros e stack traces | Observabilidade futura | Não ativo no código encontrado | Dados técnicos, possivelmente PII se configurado sem filtros | `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, `SENTRY_PROJECT` | `.env.example`, docs | SDK ativo não identificado no código; validar se não há projeto externo conectado. |
| LinkedIn OIDC | Login social preparado | Dados OAuth do LinkedIn se habilitado | Autenticação social | Botão social | Dados pessoais de login | Configuração Supabase externa | `components/social-auth-buttons.tsx` | Provider preparado, ativação real não identificada no código. |
| Facebook OAuth | Login social preparado | Dados OAuth do Facebook se habilitado | Autenticação social | Botão social | Dados pessoais de login | Configuração Supabase externa | `components/social-auth-buttons.tsx` | Provider preparado, ativação real não identificada no código. |
| pdf-parse | Biblioteca server-side local | Buffer do PDF em runtime | Extração de texto | Upload do usuário | Documento profissional temporário | Dependência npm | `app/api/upload/parse/route.ts` | Não é fornecedor SaaS externo; processamento ocorre no servidor. |
| mammoth | Biblioteca server-side local | Buffer DOCX em runtime | Extração de texto | Upload do usuário | Documento profissional temporário | Dependência npm | `app/api/upload/parse/route.ts` | Não é fornecedor SaaS externo; processamento ocorre no servidor. |

---

## 5. Armazenamento de Dados

### 5.1 Supabase Auth

- Finalidade: autenticação, gerenciamento de usuários e sessão.
- Dados: e-mail, senha hash/credenciais gerenciadas pela Supabase, metadados OAuth, user ID.
- Relação com usuário: `auth.users.id` é referenciado por `profiles.id`.
- Evidência: `supabase/schema.sql` cria FK `profiles.id references auth.users(id) on delete cascade`.
- Risco: configurações de sessão, confirmação de e-mail, provedores OAuth e retenção Auth dependem do painel Supabase — validar manualmente.

### 5.2 Tabela `profiles`

| Aspecto | Detalhe |
|---|---|
| Finalidade | Perfil operacional do usuário, plano, admin, bloqueio. |
| Campos principais | `id`, `email`, `full_name`, `plan`, `is_admin`, `is_blocked`, `created_at`, `updated_at`. |
| Tipo de dado pessoal | Identificação, contato, controle operacional. |
| Relação com usuário | `id` é o próprio `auth.uid()`. |
| RLS | Usuário pode ler e atualizar próprio perfil. |
| Riscos | Policy de update permite atualizar o próprio perfil; se todos os campos forem expostos via client, poderia haver tentativa de alterar `plan`, `is_admin` ou `is_blocked`. No código analisado, plano é sincronizado pelo backend/service role, mas recomenda-se policy mais restritiva por coluna ou RPC controlado. |
| Evidência | `supabase/schema.sql`; `lib/auth.ts`; `lib/stripe-subscription.ts`. |

### 5.3 Tabela `subscriptions`

| Aspecto | Detalhe |
|---|---|
| Finalidade | Metadados de assinatura Stripe e plano atual. |
| Campos principais | `user_id`, `stripe_customer_id`, `stripe_subscription_id`, `stripe_price_id`, `plan`, `status`, `current_period_start`, `current_period_end`, `cancel_at_period_end`. |
| Tipo de dado pessoal | Dados de cobrança e identificadores pseudônimos Stripe vinculados ao usuário. |
| Relação com usuário | `user_id` referencia `profiles(id)` com cascade. |
| RLS | Usuário pode ler própria assinatura. Não há policy pública de insert/update. |
| Riscos | Dependência crítica do webhook e do sync manual para plano correto; registros antigos podem coexistir e a app seleciona assinatura ativa mais recente via helper. |
| Evidência | `supabase/schema.sql`; `lib/subscription-state.ts`; `lib/stripe-subscription.ts`. |

### 5.4 Tabela `generations`

| Aspecto | Detalhe |
|---|---|
| Finalidade | Histórico de documentos gerados e base para regeneração. |
| Campos principais | `user_id`, `type`, `language`, `target_country`, `input_resume`, `job_description`, `output`, `created_at`. |
| Tipo de dado pessoal | Altamente sensível do ponto de vista de privacidade: currículo, histórico profissional, possível telefone/e-mail/endereço, descrição de vaga e documento gerado. |
| Relação com usuário | `user_id` referencia `profiles(id)` com cascade. |
| RLS | Usuário pode ler, inserir e excluir próprias gerações. |
| Riscos | Armazena conteúdo completo. Necessário definir retenção, portabilidade e política clara de exclusão. Busca no histórico usa output no client e pesquisa local sobre conteúdo. |
| Evidência | `supabase/schema.sql`; `app/api/ai/generate/route.ts`; `app/api/ai/regenerate/route.ts`; `components/history-list.tsx`. |

### 5.5 Tabela `documents`

| Aspecto | Detalhe |
|---|---|
| Finalidade | Biblioteca de documentos finais, preparada para conteúdo salvo separado. |
| Campos principais | `user_id`, `generation_id`, `title`, `content`, `document_type`. |
| Tipo de dado pessoal | Documentos profissionais gerados. |
| Relação com usuário | `user_id` referencia `profiles`; `generation_id` referencia `generations` com `on delete set null`. |
| RLS | Usuário pode ler, inserir, atualizar e excluir próprios documentos. |
| Riscos | No fluxo atual, histórico usa principalmente `generations`; validar se `documents` está sendo usado em produção. |
| Evidência | `supabase/schema.sql`; `app/api/documents/delete/route.ts`. |

### 5.6 Tabela `usage_limits`

| Aspecto | Detalhe |
|---|---|
| Finalidade | Limites mensais por plano. |
| Campos principais | `plan`, `monthly_generations`. |
| Tipo de dado pessoal | Não pessoal. |
| RLS | Leitura pública para todos. |
| Riscos | Baixo; dados não sensíveis. Manter consistente com `lib/plans.ts`. |
| Evidência | `supabase/schema.sql`; `lib/plans.ts`. |

### 5.7 Tabela `rate_limits`

| Aspecto | Detalhe |
|---|---|
| Finalidade | Cooldown distribuído entre instâncias para endpoints sensíveis. |
| Campos principais | `key`, `count`, `reset_at`, `updated_at`. |
| Tipo de dado pessoal | Pode conter userId e IP na chave (`scope:userId:ip`). |
| RLS | RLS habilitado sem policies públicas; uso via service role. |
| Riscos | Chave é dado técnico pseudônimo, mas inclui IP; recomenda-se hashing de IP/userId no futuro e cleanup por `reset_at`. |
| Evidência | `lib/rate-limit.ts`; `supabase/rate-limits.sql`; `supabase/schema.sql`. |

### 5.8 Tabelas opcionais `usage_events` e `audit_logs`

| Aspecto | Detalhe |
|---|---|
| Finalidade | Logs operacionais internos sem currículo/vaga completa. |
| Campos principais | `event_name`, `feature`, `plan`, `status`, `metadata`, `actor_user_id`, `target_user_id`. |
| Status | SQL existe em `supabase/usage-events.sql`; não foi identificado uso ativo no código. |
| RLS | `usage_events` permite leitura do próprio usuário; insert público removido; `audit_logs` sem policy pública. |
| Riscos | Se aplicadas no banco, precisam de rotina server-side para escrita e política de retenção. |

### 5.9 Supabase Storage e buckets

Não foi identificado uso de Supabase Storage no código. O upload de PDF/DOCX é parseado em runtime e o arquivo bruto não é salvo em bucket.  
Evidência: buscas por `storage`/`bucket` não mostraram uso de Supabase Storage; `app/api/upload/parse/route.ts` usa `file.arrayBuffer()` e retorna texto.

### 5.10 Dados temporários no servidor

- PDF/DOCX: convertido de `File.arrayBuffer()` para `Buffer`, parseado em memória e descartado ao fim da requisição.
- Prompt IA: montado em memória e enviado à Groq.
- Stripe webhook: payload bruto é lido como texto para validar assinatura.

Evidências: `app/api/upload/parse/route.ts`; `prompts/ai-prompts.ts`; `app/api/stripe/webhook/route.ts`.

### 5.11 Dados no navegador

| Chave/local | Dado | Finalidade | Consentimento |
|---|---|---|---|
| `globalhire-cookie-consent` em localStorage | `all` ou `essential` | Persistir consentimento LGPD | Essencial para preferência de privacidade |
| `globalhire-locale` em localStorage | idioma selecionado | Internacionalização da interface | Funcional |
| `globalhire-preferences` em localStorage | idioma padrão, tipo de entrega, país-alvo, notificações, template | Preferências locais do gerador | Funcional |
| `globalhire-anonymous-id` em localStorage | UUID anônimo `gh_*` | Eventos de analytics sem e-mail | Analytics; só usado quando scripts estão ativos |
| Cookies Supabase | sessão/auth | Login e sessão | Necessário |

Evidências: `components/cookie-consent.tsx`; `components/language-provider.tsx`; `components/settings-panel.tsx`; `lib/analytics.ts`; `lib/supabase-server.ts`.

---

## 6. Cookies, Trackers e Armazenamento Local

### 6.1 Cookies próprios/necessários

| Item | Fornecedor | Finalidade | Categoria provável | Consentimento | Inicialização |
|---|---|---|---|---|---|
| Cookies de sessão Supabase | Supabase | Autenticação e refresh de sessão | Necessário | Não depende de consentimento analytics | `@supabase/ssr` em `middleware.ts` e `lib/supabase-server.ts` |
| Preferência de cookies no localStorage | GlobalHire AI | Guardar escolha LGPD | Necessário/funcional | Gerado pelo próprio banner | `components/cookie-consent.tsx` |

Nome exato dos cookies Supabase não foi definido manualmente no código — validar no navegador e documentação Supabase.

### 6.2 Trackers de analytics

| Tracker | Quando carrega | Dados enviados pelo app | Categoria provável | Consentimento |
|---|---|---|---|---|
| GA4 | Produção + env preenchida + consentimento `all` | `page_view` e eventos via `gtag`, propriedades sanitizadas e anonymous ID | Analytics | Sim |
| Microsoft Clarity | Produção + env preenchida + consentimento `all` | Eventos e sessão/heatmap; campos mascarados | Analytics/UX | Sim |
| PostHog | Produção + env preenchida + consentimento `all` | Eventos via `capture`, sem autocapture nem session recording | Analytics/produto | Sim |

Evidências: `components/analytics-scripts.tsx`, `lib/analytics.ts`.

### 6.3 Eventos de analytics identificados

Eventos disparados ou preparados no código:

- `page_view`;
- `checkout_completed`;
- `subscription_updated`;
- `subscription_canceled`;
- `login_started`;
- `login_completed`;
- `signup_started`;
- `signup_completed`;
- `resume_uploaded`;
- `generation_started`;
- `job_description_added`;
- `plan_limit_reached`;
- `generation_failed`;
- `resume_generated`;
- `cover_letter_generated`;
- `linkedin_summary_generated`;
- `recruiter_message_generated`;
- `interview_prep_generated`;
- `translation_generated`;
- `export_pdf_clicked`;
- `ats_analysis_started`;
- `ats_analysis_failed`;
- `ats_score_generated`;
- `document_regenerated`.

A função `sanitizeProperties()` remove propriedades cujo nome contenha termos sensíveis como `resume`, `curriculo`, `cv`, `jobDescription`, `description`, `vaga`, `email`, `phone`, `address`, `document`, `content`, `output`, `password`, `token`, `secret`.

Evidência: `lib/analytics.ts`.

### 6.4 Scripts externos

| Script | URL | Condição |
|---|---|---|
| Turnstile | `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit` | Quando componente Turnstile renderiza e há site key |
| GA4 | `https://www.googletagmanager.com/gtag/js?id=...` | Produção + consentimento + env |
| PostHog | `{NEXT_PUBLIC_POSTHOG_HOST}/static/array.js` | Produção + consentimento + env |
| Clarity | `https://www.clarity.ms/tag/{id}` | Produção + consentimento + env |
| Stripe hosted pages | Checkout/Portal via redirect/frames/scripts permitidos em CSP | Fluxos de assinatura |

---

## 7. Transferência Internacional de Dados

Com base nas integrações encontradas, há possível transferência internacional de dados ou processamento fora do Brasil pelos seguintes fornecedores:

| Fornecedor | Tipo de dado potencialmente transferido | Observação |
|---|---|---|
| Supabase | Dados cadastrais, Auth, banco, currículos/documentos, assinaturas | Possível transferência internacional — validar região do projeto, DPA e política do fornecedor. |
| Vercel | Tráfego, logs, execução de serverless, IP/user-agent | Possível transferência internacional — validar contrato e região/log retention. |
| Stripe | Dados de pagamento, e-mail, customer/subscription IDs | Possível transferência internacional — validar contrato Stripe e obrigações financeiras. |
| Google OAuth/GA4 | Dados de login e analytics | Possível transferência internacional — validar Google Cloud/OAuth/GA4. |
| Microsoft Clarity | Dados comportamentais e técnicos | Possível transferência internacional — validar termos Clarity. |
| PostHog | Dados comportamentais e técnicos | Possível transferência internacional — validar host/região configurada. |
| Cloudflare Turnstile | Token captcha, IP, dados técnicos | Possível transferência internacional — validar contrato Cloudflare. |
| Groq | Currículo, descrição de vaga, prompts e saída IA | Possível transferência internacional — validar DPA, retenção e uso de dados pela Groq. |

Não foi identificado no código país/região de processamento de cada fornecedor. Isso deve ser validado manualmente em contratos, DPAs e dashboards.

---

## 8. Segurança e Controles Técnicos Encontrados

### 8.1 Autenticação

- Supabase Auth é usado para e-mail/senha e OAuth social.
- Rotas privadas usam `requireUser()` e redirecionam para `/login`.
- Middleware atualiza sessão Supabase em todas as rotas compatíveis.
- Login/cadastro por e-mail/senha exigem Turnstile antes do Supabase.

Evidências: `lib/auth.ts`, `middleware.ts`, `app/(auth)/login/page.tsx`, `app/(auth)/cadastro/page.tsx`.

### 8.2 Autorização

- Usuários acessam apenas próprios dados via RLS e filtros `.eq("user_id", user.id)`.
- Admin usa `requireAdmin()`, verificando **somente** `ADMIN_EMAILS` no servidor (ver `lib/admin-access.ts`).
- Bloqueio de usuário por admin atualiza `profiles.is_blocked`.
- APIs de exclusão granular aplicam `eq("user_id", user.id)` mesmo usando service role.

Evidências: `lib/auth.ts`, `app/api/admin/block-user/route.ts`, `app/api/documents/delete/route.ts`, `supabase/schema.sql`.

### 8.3 RLS

RLS habilitado para:

- `profiles`;
- `subscriptions`;
- `generations`;
- `usage_limits`;
- `documents`;
- `rate_limits`.

Policies principais:

- usuário lê/atualiza próprio perfil;
- usuário lê própria assinatura;
- usuário lê/insere/exclui próprias gerações;
- todos leem `usage_limits`;
- usuário lê/insere/atualiza/exclui próprios documentos;
- `rate_limits` sem policies públicas, uso por service role.

Evidência: `supabase/schema.sql`.

### 8.4 HTTPS e headers

`next.config.ts` define:

- `Strict-Transport-Security`;
- `X-Frame-Options: DENY`;
- `X-Content-Type-Options: nosniff`;
- `Referrer-Policy: strict-origin-when-cross-origin`;
- `Permissions-Policy`;
- `Content-Security-Policy`.

CSP permite domínios necessários para Supabase, Stripe, Groq, Turnstile, GA4, Clarity e PostHog.

Evidência: `next.config.ts`.

### 8.5 Proteção CSRF/Origin

`rejectInvalidOrigin()` valida Origin/Referer contra:

- `NEXT_PUBLIC_APP_URL`/`getAppUrl()`;
- `https://globalhireai.com.br`;
- `https://www.globalhireai.com.br`;
- localhost em desenvolvimento.

Aplicado em:

- `/api/ai/generate`;
- `/api/ai/optimize-from-score`;
- `/api/ai/regenerate`;
- `/api/stripe/checkout`;
- `/api/stripe/portal`;
- `/api/account/delete`;
- `/api/documents/delete`;
- `/api/admin/block-user`.

Webhook Stripe não usa Origin por ser chamada servidor-a-servidor; proteção correta é assinatura `STRIPE_WEBHOOK_SECRET`.

Evidências: `lib/security.ts`, rotas API citadas.

### 8.6 Rate limiting

- `lib/rate-limit.ts` usa tabela Supabase `rate_limits` com service role quando disponível.
- Fallback em memória se tabela/serviço indisponível.
- Chave inclui escopo, userId/anonymous e IP.
- Rotas IA aplicam cooldown de 30 segundos.

Evidências: `lib/rate-limit.ts`, `app/api/ai/generate/route.ts`, `app/api/ai/regenerate/route.ts`, `app/api/ai/optimize-from-score/route.ts`.

### 8.7 Validação de inputs

- Zod em `lib/validation.ts`, rotas IA, checkout, PDF e exclusão de documentos.
- Limites de currículo/vaga: até 20.000 caracteres em rotas IA.
- Upload limitado a PDF/DOCX até 5 MB.

Evidências: `lib/validation.ts`, `app/api/upload/parse/route.ts`, `app/api/pdf/route.ts`.

### 8.8 Sanitização e XSS

- Exportação PDF client-side escapa `<`, `>` e `&` antes de escrever HTML.
- Campos sensíveis são marcados para Clarity mask.
- Analytics sanitiza propriedades.
- Risco: `/api/pdf` retorna HTML com `title` e `content` sem escape no campo `html`. Atualmente é rota preparada e não parece ser o fluxo principal, mas exige sanitização antes de uso renderizado.

Evidências: `components/dashboard-generator.tsx`, `lib/analytics.ts`, `app/api/pdf/route.ts`.

### 8.9 Webhooks assinados

- Stripe webhook valida `stripe-signature` com `STRIPE_WEBHOOK_SECRET`.
- Sem assinatura, retorna 400.

Evidência: `app/api/stripe/webhook/route.ts`.

### 8.10 Variáveis de ambiente

Segredos críticos ficam sem `NEXT_PUBLIC_`:

- `SUPABASE_SERVICE_ROLE_KEY`;
- `GROQ_API_KEY`;
- `STRIPE_SECRET_KEY`;
- `STRIPE_WEBHOOK_SECRET`;
- `TURNSTILE_SECRET_KEY`;
- `SENTRY_AUTH_TOKEN`.

Chaves públicas ou identificadores ficam com `NEXT_PUBLIC_` quando precisam ser usados no navegador.

Evidência: `.env.example`, `lib/groq.ts`, `lib/stripe.ts`, `lib/turnstile.ts`.

---

## 9. Lacunas e Riscos para LGPD

| Risco | Severidade técnica | Evidência | Comentário |
|---|---:|---|---|
| Armazenamento completo de currículo, vaga e output em `generations` | Alta | `supabase/schema.sql`, `app/api/ai/generate/route.ts` | Necessário para histórico/regeneração, mas requer política de retenção, exclusão e aviso claro. |
| Retenção configurada mas sem cleanup automático | Média/Alta | `lib/retention.ts` | Env `RETENTION_CLEANUP_ENABLED` existe, mas não há rotina automática identificada. |
| Envio de currículo e vaga para Groq | Alta | `app/api/ai/*`, `prompts/ai-prompts.ts` | Deve constar de forma clara na política e contrato/DPA com fornecedor. |
| Usuário pode inserir dados sensíveis desnecessários no currículo | Alta | Campos livres no gerador/ATS | Deve haver orientação preventiva e base legal/consentimento analisados por advogado. |
| Nome de arquivo pode ser logado | Média | `app/api/upload/parse/route.ts` | `fileName` pode conter nome completo do usuário; recomenda-se mascarar ou remover de logs. |
| Erros brutos podem conter metadados de fornecedor | Média | `console.error(error)` em várias rotas | Validar se SDK Groq/Stripe/Supabase não inclui payload sensível nos erros. |
| `profiles` policy permite update do próprio perfil | Média | `supabase/schema.sql` | Pode ser aceitável se frontend não expõe campos críticos; ideal restringir atualização de `plan/is_admin/is_blocked`. |
| `rate_limits.key` contém userId e IP em texto | Média | `lib/rate-limit.ts` | Recomenda-se hash para reduzir exposição. |
| Analytics depende de consentimento, mas precisa validação em produção | Média | `components/analytics-scripts.tsx` | Código condiciona corretamente; validar no browser/network após rejeitar analytics. |
| Clarity masking precisa validação externa | Média | `components/analytics-scripts.tsx`, campos `data-clarity-mask` | Validar no painel Clarity se não captura conteúdo de currículo/vaga. |
| `/api/pdf` ecoa HTML não escapado | Média | `app/api/pdf/route.ts` | Não parece fluxo principal; se usado, sanitizar antes de renderizar HTML. |
| Excluir conta não apaga dados mantidos por Stripe/Google/analytics/logs | Média | `app/api/account/delete/route.ts` | Precisa explicar exceções e subprocessadores na política. |
| Portabilidade de dados não identificada | Média | Não identificado no código | Usuário consegue copiar/baixar documentos, mas não há export completo estruturado de dados da conta. |
| Canal formal de titular LGPD depende de e-mail/documentação | Média | Docs/env | Não há workflow interno de solicitação DSR no código. |
| DPA/contratos com fornecedores | Alta jurídica | Não identificado no código | Validar Supabase, Vercel, Stripe, Groq, Google, Microsoft, PostHog, Cloudflare. |
| Storage policies | Baixa no código atual | Não há Supabase Storage identificado | Confirmar no Supabase real que não há buckets públicos indevidos. |
| Webhook Stripe seguro, mas depende de env correta | Alta operacional | `app/api/stripe/webhook/route.ts` | Sem `STRIPE_WEBHOOK_SECRET`, webhook retorna erro. |
| Logs de admin/usage não persistidos | Média operacional | `supabase/usage-events.sql` sem uso ativo | Para auditoria futura, implementar logs seguros server-side sem conteúdo sensível. |

---

## 10. Recomendações Técnicas para Adequação

### 10.1 Implementar no código

- Mascarar ou remover `fileName` dos logs de upload quando possível.
- Revisar `console.error(error)` em rotas IA/upload/Stripe para evitar payloads sensíveis em logs.
- Implementar rotina controlada de retenção futura usando `RETENTION_GENERATIONS_DAYS` e `RETENTION_DOCUMENTS_DAYS`, com dry-run e relatório antes de exclusão automática.
- Criar export de dados do usuário em formato JSON/ZIP para portabilidade LGPD.
- Restringir update em `profiles` para evitar alteração client-side de `plan`, `is_admin` e `is_blocked`, usando policy mais específica ou RPC segura.
- Hash de IP/userId em `rate_limits.key`.
- Sanitizar `/api/pdf` se essa rota vier a renderizar HTML server-side.
- Implementar logs em `usage_events`/`audit_logs` somente com metadados seguros.
- Criar endpoint ou fluxo administrativo para solicitações de titular: acesso, correção, exclusão, portabilidade e revogação de consentimento.
- Validar que `CookieConsent` consiga reabrir preferências via footer em produção.

### 10.2 Documentar

- Informar explicitamente na Política de Privacidade que currículos, descrições de vaga e outputs são enviados a provedor de IA Groq para geração.
- Explicar que o upload PDF/DOCX é usado para extração de texto e que arquivo bruto não é salvo pelo app.
- Explicar que documentos gerados ficam salvos no histórico até exclusão pelo usuário ou política de retenção.
- Descrever subprocessadores: Supabase, Vercel, Stripe, Google OAuth, Groq, Cloudflare Turnstile, GA4, Clarity, PostHog.
- Descrever transferência internacional como possível, dependente de fornecedores.
- Explicar que Stripe processa cartão/dados de pagamento diretamente; GlobalHire AI armazena apenas metadados de assinatura.
- Explicar cookies essenciais versus analytics.
- Incluir orientação para não inserir dados sensíveis desnecessários no currículo.

### 10.3 Validar manualmente

- Região do projeto Supabase e DPA.
- Configuração Supabase Auth: cookies, expiração, providers OAuth, redirect URLs.
- Google OAuth scopes e tela de consentimento.
- Stripe live mode, portal, políticas de reembolso/cancelamento e retenção.
- Groq: política de uso/treinamento/retenção de dados e DPA.
- Vercel: retenção de logs e acesso de equipe.
- Clarity: masking efetivo de todos os textareas, inputs e áreas de output.
- PostHog: autocapture e session recording desativados no ambiente real.
- GA4: IP anonymization e consent mode, se aplicável.
- Cloudflare Turnstile: domínios permitidos, analytics de captcha e retenção.
- Supabase real: RLS, policies, indexes, triggers, constraints e buckets.

### 10.4 Enviar ao advogado

- Este mapa de fluxo de dados.
- `docs/legal/privacy-policy.md`, `docs/legal/terms-of-service.md`, `docs/legal/legal-checklist.md`, se atualizados.
- `supabase/schema.sql` e scripts de migrations.
- Lista de envs `.env.example`.
- Lista de fornecedores e finalidades.
- Política atual de retenção e lacunas.
- Screenshots ou export de configuração real de Supabase, Stripe, Google OAuth, Clarity, GA4, PostHog, Cloudflare e Vercel.

---

## 11. Inventário Final em Tabela

| Dado pessoal | Titular | Origem | Finalidade | Base legal provável | Armazenamento | Fornecedor envolvido | Compartilhamento | Retenção | Risco | Ação recomendada |
|---|---|---|---|---|---|---|---|---|---|---|
| Nome | Usuário | Cadastro/OAuth | Perfil e identificação | Execução de contrato | `profiles.full_name`, Supabase Auth metadata | Supabase, Google se OAuth | Sim, com Supabase/Google | Até exclusão da conta | Baixo/Médio | Informar política e permitir correção. |
| E-mail | Usuário | Login/cadastro/OAuth/checkout | Auth, conta, cobrança | Execução de contrato | Supabase Auth, `profiles.email`, Stripe Customer | Supabase, Stripe, Google | Sim | Até exclusão; Stripe conforme contrato | Médio | Documentar subprocessadores e retenção. |
| Senha | Usuário | Cadastro/login | Autenticação | Execução de contrato/segurança | Supabase Auth | Supabase | Sim, diretamente para Supabase | Conforme Supabase | Alto se mal gerida, mas app não armazena | Validar política Supabase e MFA futuro. |
| OAuth Google ID/metadados | Usuário | Google OAuth | Login social | Execução de contrato | Supabase Auth | Google, Supabase | Sim | Conforme Supabase/Google | Médio | Validar scopes mínimos. |
| Plano/status | Usuário | App/Stripe | Controle de acesso | Execução de contrato | `profiles.plan`, `subscriptions` | Stripe, Supabase | Sim | Até exclusão/obrigações | Médio | Manter sync auditável. |
| Stripe customer/subscription IDs | Usuário pagante | Stripe webhook/checkout | Cobrança e suporte | Execução de contrato | `subscriptions` | Stripe, Supabase | Sim | Até exclusão app; Stripe retém | Médio | Documentar que cartão não é armazenado pelo app. |
| Dados de cartão/pagamento | Usuário pagante | Stripe Checkout | Pagamento | Execução de contrato/obrigação legal | Stripe | Stripe | Sim | Conforme Stripe/legal | Alto | Deixar claro que app não processa cartão diretamente. |
| Currículo/base profissional | Usuário | Textarea/upload | Geração e ATS | Execução de contrato; consentimento para dados sensíveis se inseridos | `generations.input_resume` | Supabase, Groq, Vercel | Sim | Até exclusão; retenção automática pendente | Alto | Política clara, retenção, exclusão e aviso de dados sensíveis. |
| Experiências/formação/competências | Usuário | Currículo/base | Otimização profissional | Execução de contrato | `generations.input_resume` | Supabase, Groq | Sim | Até exclusão | Alto | Mesmas medidas do currículo. |
| Descrição de vaga | Usuário/terceiros citados | Textarea | Adaptação, ATS, keywords | Execução de contrato | `generations.job_description` | Supabase, Groq | Sim | Até exclusão | Médio | Orientar a não inserir dados pessoais de terceiros desnecessários. |
| Documento gerado por IA | Usuário | Groq/API | Entrega do serviço/histórico | Execução de contrato | `generations.output`, possivelmente `documents.content` | Supabase, Groq | Sim | Até exclusão | Alto | Retenção e export/portabilidade. |
| Keywords/score/match | Usuário | ATS client/API | Análise e otimização | Execução de contrato | Não salvo isoladamente; contexto pode ir ao prompt | Groq se otimizar | Sim na otimização | Não persistido isoladamente no schema atual | Médio | Documentar como estimativa, não garantia. |
| IP | Usuário/dispositivo | Headers/request | Segurança, rate limit, Turnstile | Legítimo interesse/segurança | `rate_limits.key`, logs | Cloudflare, Vercel, Supabase | Sim | Reset conforme rate limit; logs fornecedor | Médio | Hash/minimização e cleanup. |
| User-agent/dispositivo | Usuário/dispositivo | Infra/analytics | Segurança/analytics | Legítimo interesse; consentimento para analytics | Fornecedores/logs | Vercel, GA4, Clarity, PostHog | Sim | Conforme fornecedor | Médio | Consentimento e política de cookies. |
| Cookie consent | Usuário/navegador | Banner | Registrar preferência | Obrigação/legítimo interesse | localStorage | GlobalHire AI | Não direto | Até limpar navegador | Baixo | Link para alterar preferências. |
| Idioma/preferências | Usuário/navegador | UI | Personalização | Funcional/legítimo interesse | localStorage | GlobalHire AI | Não direto | Até limpar navegador | Baixo | Informar armazenamento local. |
| Anonymous analytics ID | Usuário/navegador | `lib/analytics.ts` | Métricas sem PII | Consentimento | localStorage e analytics | GA4, Clarity, PostHog | Sim após consentimento | Conforme fornecedor | Médio | Manter sem e-mail/PII. |
| Logs técnicos | Usuário/conta/sistema | APIs | Diagnóstico/segurança | Legítimo interesse | Vercel logs, console | Vercel; possivelmente fornecedores | Sim | Não identificado no código | Médio/Alto | Reduzir PII em logs e definir retenção. |
| Arquivo PDF/DOCX bruto | Usuário | Upload | Extração de texto | Execução de contrato | Memória temporária, não salvo | Vercel runtime | Não identificado além do runtime | Somente requisição | Médio | Manter não persistência e documentar. |
| Nome do arquivo | Usuário | Upload | Log técnico | Legítimo interesse | Logs Vercel | Vercel | Sim | Não identificado | Médio | Remover/mascarar nos logs. |
| Dados de suporte | Usuário | E-mail externo | Atendimento | Execução de contrato/legítimo interesse | Não identificado no código | Provedor de e-mail externo | Não identificado | Não identificado | Médio | Definir canal e retenção. |

---

## 12. Evidências Técnicas

### 12.1 Arquivos de autenticação

- `app/(auth)/login/page.tsx`: formulário de login, Turnstile, Supabase `signInWithPassword`, tracking `login_started/login_completed`, campos mascarados para Clarity.
- `app/(auth)/cadastro/page.tsx`: formulário de cadastro, coleta `fullName`, e-mail, senha, Turnstile, Supabase `signUp`, tracking `signup_started/signup_completed`.
- `components/social-auth-buttons.tsx`: OAuth Google, LinkedIn OIDC e Facebook preparados; redirect seguro via `getAuthCallbackUrl`.
- `app/auth/callback/route.ts`: troca code OAuth por sessão e redireciona para dashboard.
- `middleware.ts`: Supabase SSR para atualização de cookies/sessão.
- `lib/auth.ts`: `requireUser()` e `requireAdmin()`.

### 12.2 Arquivos de IA e dados profissionais

- `components/dashboard-generator.tsx`: coleta currículo, vaga, idioma, país, tipo de entrega; upload; eventos; exportação PDF; masking Clarity.
- `components/ats-analyzer.tsx`: coleta currículo/vaga; análise client-side; envia contexto para otimização.
- `app/api/ai/generate/route.ts`: validações, rate limit, Turnstile, plano, chamada Groq e insert em `generations`.
- `app/api/ai/optimize-from-score/route.ts`: recebe score/match/keywords/recomendações e salva output.
- `app/api/ai/regenerate/route.ts`: busca geração original e salva nova versão.
- `prompts/ai-prompts.ts`: prompt inclui currículo e descrição de vaga e define regras de output.
- `lib/groq.ts`: cliente Groq com `GROQ_API_KEY` e `GROQ_MODEL`.

### 12.3 Upload e extração de arquivo

- `app/api/upload/parse/route.ts`: autenticação, valida PDF/DOCX até 5 MB, converte `File.arrayBuffer()` para `Buffer`, usa `pdf-parse/lib/pdf-parse.js` e `mammoth`, retorna `text`, logs técnicos.
- `components/dashboard-generator.tsx` e `components/ats-analyzer.tsx`: enviam `FormData` para upload e preenchem textarea com texto extraído.

### 12.4 Pagamentos e assinatura

- `app/api/stripe/checkout/route.ts`: cria Stripe Checkout Session.
- `app/api/stripe/portal/route.ts`: cria Customer Portal Session.
- `app/api/stripe/webhook/route.ts`: valida assinatura e sincroniza eventos Stripe.
- `lib/stripe-subscription.ts`: mapeia price ID para plano, extrai períodos, upsert em `subscriptions`, sync `profiles.plan`.
- `app/api/subscription/sync/route.ts`: sync manual autenticado.
- `lib/plans.ts`: planos, limites, features e envs de price ID.

### 12.5 Exclusão, histórico e documentos

- `components/history-list.tsx`: lista output, copia, baixa `.txt`, regenera, exclui.
- `app/(app)/historico/page.tsx`: busca `generations` do usuário.
- `app/api/documents/delete/route.ts`: exclusão granular por `generationId`/`documentId`.
- `app/api/account/delete/route.ts`: exclusão de dados do app e Supabase Auth, tentativa de cancelamento Stripe.
- `app/api/pdf/route.ts`: rota preparada para PDF server-side, atualmente retorna HTML em JSON.

### 12.6 Analytics, cookies e storage local

- `components/cookie-consent.tsx`: banner LGPD, localStorage `globalhire-cookie-consent`, preferências.
- `components/analytics-scripts.tsx`: carrega GA4, Clarity e PostHog somente em produção com consentimento.
- `lib/analytics.ts`: sanitização de propriedades, anonymous ID local, dispatch para GA4/PostHog/Clarity.
- `components/language-provider.tsx`: localStorage `globalhire-locale`.
- `components/settings-panel.tsx`: localStorage `globalhire-preferences`.

### 12.7 Segurança

- `next.config.ts`: CSP e headers de segurança.
- `lib/security.ts`: Origin/Referer check, allowed origins, client IP.
- `lib/rate-limit.ts`: rate limit Supabase/memory fallback.
- `components/turnstile-widget.tsx`: script Turnstile e retry.
- `lib/turnstile.ts`: valida token com Cloudflare.
- `app/api/security/turnstile/route.ts`: endpoint de validação de captcha.

### 12.8 Banco e migrations

- `supabase/schema.sql`: schema principal, RLS, policies, triggers, indexes.
- `supabase/rate-limits.sql`: storage distribuído de rate limit.
- `supabase/usage-events.sql`: tabelas opcionais de logs seguros.
- `supabase/schema-drift-introspection.sql`: script read-only para comparar banco real.
- `supabase/schema-drift-corrective-migration.sql`: migration corretiva segura proposta, não executada automaticamente.
- `supabase/subscription-sync-fields.sql`: ajuste de campos de assinatura.

### 12.9 Variáveis de ambiente relevantes

| Variável | Uso | Sensibilidade | Evidência |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | URL Supabase | Pública | `lib/supabase-*`, `.env.example` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Cliente Supabase | Pública | `lib/supabase-*` |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin DB/Auth | Secreta crítica | `lib/supabase-server.ts`, rotas delete/admin/rate-limit |
| `GROQ_API_KEY` | IA Groq | Secreta crítica | `lib/groq.ts` |
| `GROQ_MODEL` | Modelo IA | Configuração | `lib/groq.ts` |
| `STRIPE_SECRET_KEY` | Stripe server | Secreta crítica | `lib/stripe.ts` |
| `STRIPE_WEBHOOK_SECRET` | Validação webhook | Secreta crítica | `app/api/stripe/webhook/route.ts` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe client futuro | Pública | `.env.example` |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | Price Starter | Pública/não secreta | `lib/plans.ts` |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Price Pro | Pública/não secreta | `lib/plans.ts` |
| `NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID` | Price Elite | Pública/não secreta | `lib/plans.ts` |
| `NEXT_PUBLIC_APP_URL` | URL canônica | Pública | `lib/app-url.ts` |
| `ADMIN_EMAILS` | Admin por e-mail | Sensível operacional | `lib/admin-access.ts`, `lib/auth.ts` |
| `ADMIN_BYPASS_EMAILS` | Bypass teste | Sensível operacional | `lib/plans.ts` |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | Site key captcha | Pública | `components/turnstile-widget.tsx` |
| `TURNSTILE_SECRET_KEY` | Secret captcha | Secreta crítica | `lib/turnstile.ts` |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 | Pública | `components/analytics-scripts.tsx` |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Clarity | Pública | `components/analytics-scripts.tsx` |
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog | Pública | `components/analytics-scripts.tsx` |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host | Pública | `components/analytics-scripts.tsx` |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN preparado | Pública | `.env.example`, docs; SDK ativo não identificado |
| `SENTRY_AUTH_TOKEN` | Sentry release/source maps | Secreta | `.env.example`, docs |
| `SENTRY_ORG` | Sentry org | Configuração | `.env.example` |
| `SENTRY_PROJECT` | Sentry project | Configuração | `.env.example` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | E-mail suporte público | Pública | `.env.example`, docs |
| `RETENTION_GENERATIONS_DAYS` | Retenção sugerida gerações | Configuração | `lib/retention.ts` |
| `RETENTION_DOCUMENTS_DAYS` | Retenção sugerida documentos | Configuração | `lib/retention.ts` |
| `RETENTION_CLEANUP_ENABLED` | Habilitar cleanup futuro | Configuração | `lib/retention.ts` |

---

## Conclusão Técnica

A GlobalHire AI possui uma base técnica razoavelmente madura para MVP: autenticação Supabase, RLS documentado, Stripe com webhook assinado, Turnstile em fluxos críticos, rate limit distribuído, headers/CSP, consentimento LGPD para analytics e sanitização de eventos.

Os pontos que mais merecem atenção jurídica e técnica antes de escala pública são:

1. clareza contratual sobre envio de currículos e vagas à Groq;
2. retenção e exclusão de conteúdo profissional salvo em `generations`;
3. minimização de logs, especialmente nomes de arquivos e erros brutos;
4. validação real de Clarity/analytics sem captura de conteúdo sensível;
5. revisão de RLS/policies para impedir qualquer atualização indevida de plano/admin pelo cliente;
6. formalização de DPAs e transferências internacionais com subprocessadores;
7. criação de processo operacional para direitos do titular, portabilidade e resposta a incidentes.

Este documento deve ser revisado em conjunto com o estado real do Supabase, configurações de Vercel/Stripe/Google/Cloudflare/Groq e contratos dos fornecedores.

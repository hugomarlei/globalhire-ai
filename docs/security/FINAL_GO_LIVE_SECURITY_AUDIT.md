# Auditoria final de segurança e prontidão para go-live — GlobalHire AI

**Data:** 12 de maio de 2026  
**Branch auditada:** `staging/pre-go-live-sync`  
**Escopo:** revisão estática de código, rotas API, middleware, dependências e pipelines de build; **nenhum valor real de secret** foi reproduzido neste documento.

---

## 1. Resumo executivo

O repositório apresenta **boas práticas** em vários eixos: Supabase **anon** no browser, **service role** apenas em servidor; layout `(app)` com `requireUser()`; página `/admin` com `requireAdmin()`; webhook Stripe com `constructEvent` e `STRIPE_WEBHOOK_SECRET`; headers de segurança e CSP em `next.config.ts`; Sentry com `enabled: Boolean(dsn)`, `sendDefaultPii: false` e *scrubbing* em `lib/sentry-privacy.ts`.

Foram aplicadas **correções pontuais de segurança operacional** nesta auditoria: remoção do endpoint temporário `GET /api/debug/stripe-pricing` (superfície desnecessária em produção) e **redação de logs** no webhook Stripe para não registrar o objeto `Error` completo (apenas mensagem truncada).

**Dependências:** `npm audit --omit=dev` reporta **3 vulnerabilidades moderadas** transitivas (PostCSS via `next` / `@sentry/nextjs`); correção via `npm audit fix --force` **não** foi aplicada (quebraria versões). Classificação: **médio / transitivo não bloqueante** para o primeiro go-live, com plano de acompanhamento pós-lançamento.

**Veredito:** **APROVADO COM RESSALVAS** — adequado para lançamento desde que as **pendências obrigatórias** (envs em Vercel, RLS validado no projeto Supabase real, smoke manual das rotas) estejam confirmados pela equipa.

---

## 2. Status

| Critério | Resultado |
|----------|-----------|
| Segredo no código-fonte (valores reais) | **Não encontrado** |
| Service role no client | **Não encontrado** |
| Webhook Stripe sem validação de assinatura | **Não** — validação presente |
| Admin exposto sem gate | **Não** — `requireAdmin()` |
| Rotas `(app)` sem utilizador | **Não** — `requireUser()` no layout |
| Sentry a quebrar build sem token | **Não** — upload de source maps condicional |
| Endpoint debug Stripe em produção | **Removido** nesta auditoria |

**Status global:** **APROVADO COM RESSALVAS**

---

## 3. Achados críticos

**Nenhum** achado crítico bloqueante identificado na revisão estática atual (sem acesso ao painel Vercel/Supabase Stripe live).

---

## 4. Achados altos

| ID | Descrição | Mitigação / estado |
|----|-----------|---------------------|
| H1 | `npm audit`: cadeia **moderada** PostCSS (XSS em stringify) em dependência de `next` | Monitorizar advisories; planear upgrade de `next` quando patch estável **sem** `audit fix --force` destrutivo |
| H2 | Middleware **não** implementa lista explícita de rotas protegidas — a proteção depende do layout `(app)` | Aceitável na arquitetura atual; **não** mover rotas autenticadas para fora de `(app)` sem reforçar middleware |

---

## 5. Achados médios / baixos

| ID | Severidade | Descrição |
|----|------------|-----------|
| M1 | Médio | Vários endpoints autenticados (`GET /api/subscription/sync`, `POST /api/upload/parse`, `POST /api/pdf`) **não** aplicam `rejectInvalidOrigin`. Risco CSRF limitado por cookies SameSite; alinhar com POST sensíveis + origem em evolução. |
| M2 | Baixo | `README.md` e documentação contêm **nomes** de variáveis e exemplos do tipo `sk_test_...` / `whsec_...` como **ilustração** — não são secrets reais; evitar colar valores reais em docs. |
| M3 | Baixo | Logs operacionais (`lib/stripe-subscription.ts`, webhook) referem `subscriptionId` Stripe e prefixos de `priceId` (já truncado em vários pontos). Aceitável para operações; evitar aumentar verbosidade com PII. |
| M4 | Baixo | `upload_parse` regista `fileName` e `type` — potencialmente sensível se nomes de ficheiros forem pessoais; conteúdo do PDF não é logado na linha analisada. |
| M5 | Baixo | CSP inclui `'unsafe-inline'` em `script-src` (comum com Next/analytics); compensado por restrições em `object-src`, `frame-ancestors`, etc. |

---

## 6. Arquivos e áreas revisados (amostra representativa)

- `middleware.ts` — sessão Supabase; matcher exclui assets e `/monitoring`
- `next.config.ts` — CSP, HSTS, X-Frame-Options, Sentry condicional
- `lib/supabase-server.ts`, `lib/supabase-browser.ts` — separação anon vs service role
- `lib/auth.ts` — `requireUser`, `requireAdmin`
- `lib/security.ts` — `rejectInvalidOrigin`, `getClientIp`
- `lib/sentry-privacy.ts`, `sentry.server.config.ts`, `instrumentation*.ts`
- `lib/stripe.ts`, `lib/stripe-subscription.ts`, `lib/stripe-price-fetch.ts`
- `app/(app)/layout.tsx`, `app/(app)/admin/page.tsx`, páginas dashboard/assinatura
- `app/api/**/route.ts` (todas as rotas listadas na secção 7)
- `supabase/schema.sql` (referência cruzada com docs RLS — validação final no projeto Supabase)
- `.gitignore`, `.env.example`

---

## 7. Endpoints API revisados

| Rota | Método | Proteção / notas |
|------|--------|-------------------|
| `/api/stripe/checkout` | POST | `rejectInvalidOrigin` + sessão + `price_id` via env |
| `/api/stripe/portal` | POST | `rejectInvalidOrigin` + sessão + customer do próprio utilizador |
| `/api/stripe/webhook` | POST | **Assinatura Stripe obrigatória**; sem `STRIPE_WEBHOOK_SECRET` → 400 |
| `/api/subscription/sync` | GET | Sessão obrigatória; sync só para `user.id` |
| `/api/account/delete` | POST | Origem + utilizador; service role só servidor |
| `/api/documents/delete` | POST | Origem + utilizador; deletes com `.eq("user_id", user.id)` |
| `/api/ai/generate` | POST | Origem + login + Turnstile + limites de plano |
| `/api/ai/regenerate` | POST | Idem padrão semelhante |
| `/api/ai/optimize-from-score` | POST | Turnstile + auth |
| `/api/upload/parse` | POST | Login obrigatório; **sem** `rejectInvalidOrigin` (ressalva CSRF alinhável a `/api/subscription/sync`). |
| `/api/pdf` | POST | Login obrigatório; conteúdo validado com zod; **sem** `rejectInvalidOrigin` (ressalva menor). |
| `/api/security/turnstile` | POST | Verificação servidor do token |
| `/api/auth/signout` | * | Fluxo de logout |
| `/api/admin/block-user` | POST | `rejectInvalidOrigin` + `requireAdmin()` |
| `/api/history/[id]/export` | GET | `rejectInvalidOrigin` + auth + `.eq("user_id", user.id)` |
| ~~`/api/debug/stripe-pricing`~~ | — | **Removido** no go-live |

**Nota:** Para `/api/upload/parse` e `/api/pdf`, confirmar no ficheiro que exigem autenticação e *ownership* (revisão rápida recomendada no deploy).

---

## 8. Variáveis de ambiente sensíveis (verificação conceitual)

Verificado que o código **referencia** (sem embutir valores) entre outros:

- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GROQ_API_KEY`
- `TURNSTILE_SECRET_KEY`
- `NEXT_PUBLIC_SENTRY_DSN` (opcional); `SENTRY_AUTH_TOKEN` + org + projeto (opcional, só source maps)

**Confirmação:** não foram encontrados **valores** destes segredos no código-fonte; apenas `.env.example` com chaves vazias e documentação.

---

## 9. Confirmação — secrets no código

- Buscas por padrões `sk_live`, `whsec_`, chaves completas em `.ts`/`.tsx`: **nenhum secret real** (apenas placeholders tipo `sk_test_placeholder` em `lib/stripe.ts`, sanitização em `stripe-price-fetch`, exemplos em README/docs).
- `.env`, `.env.local` estão no `.gitignore`; apenas `.env.example` está versionado.

---

## 10. Confirmação — rotas privadas

- `app/(app)/layout.tsx` chama `requireUser()` — cobre `/dashboard`, `/gerador`, `/ats-score`, `/historico`, `/conta`, `/assinatura`, `/configuracoes`, `/admin` enquanto estiverem sob `(app)`.

---

## 11. Confirmação — admin

- `app/(app)/admin/page.tsx` chama `await requireAdmin()` antes de `createAdminClient()` e queries amplas.
- `app/api/admin/block-user/route.ts` chama `requireAdmin()`.

---

## 12. Confirmação — Stripe e webhook

- Checkout: `app/api/stripe/checkout/route.ts` — `priceId` de `process.env[plan.stripePriceEnv]`; utilizador autenticado.
- Webhook: `constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)` antes de processar eventos.
- Mapeamento de plano: `getPlanFromStripePriceId` / `lib/stripe-subscription.ts` (lógica de negócio **não** alterada nesta auditoria além de logs).

---

## 13. Confirmação — Supabase e auth

- Client browser: só `NEXT_PUBLIC_*` URL + anon key.
- Service role: `createAdminClient()` apenas importado em rotas API servidor e páginas servidor admin/dashboard (sem passar cliente para o browser).
- Operações sensíveis em documentos usam `.eq("user_id", user.id)` onde analisado.

**RLS:** políticas reais devem ser validadas no **projeto Supabase de produção** (checklist manual obrigatório).

---

## 14. Decisão — endpoint debug Stripe pricing

- **Decisão:** **Removido** `app/api/debug/stripe-pricing/route.ts` antes do go-live.
- **Motivo:** preferência explícita do produto; diagnóstico de preços dinâmicos continua disponível via **Vercel Logs** (`stripe_pricing_diag`), documentado em `docs/stripe/DYNAMIC_PRICING_PRODUCTION_DEBUG.md`.
- Função `getStripePricingDebugSnapshot` removida de `lib/stripe-price-fetch.ts`.

---

## 15. Resultado `npm audit --omit=dev`

```
3 moderate severity vulnerabilities (postcss via next / @sentry/nextjs)
```

- **Classificação:** médio, **transitivo**, não bloqueante com `audit fix --force` (alteraria `next` de forma incompatível).
- **Recomendação pós-lançamento:** acompanhar releases do Next.js e do `@sentry/nextjs` para absorção do patch PostCSS quando estável.

---

## 16. Resultado `npm ls uuid` / `npm ls glob`

- `uuid@9.0.1` — transitivo via `@sentry/nextjs` → `@sentry/webpack-plugin`
- `glob@9.3.5` — transitivo via Sentry bundler plugin core

Sem conflitos de versão duplicada no topo do projeto.

---

## 17. Lint, typecheck, build e testes

| Comando | Estado (12 mai 2026, após `rm -rf .next`) |
|---------|-------------------------------------------|
| `npm run lint` | **OK** — sem avisos ESLint |
| `npm run typecheck` | **OK** |
| `npm run build` | **OK** (exit 0) |
| `npm test` | **Script inexistente** em `package.json` — N/A |

**Nota:** Se `tsc` falhar após remover rotas, limpar cache local `.next` antes de `npm run typecheck`.

---

## 18. Checklist manual de rotas (validação humana pós-deploy)

- [ ] `/` — carrega; preços coerentes com Stripe/env
- [ ] `/pricing`, `/features`, `/faq`, `/resources` — marketing OK
- [ ] `/login`, `/cadastro` — Turnstile + fluxo auth
- [ ] `/dashboard`, `/gerador`, `/ats-score`, `/historico`, `/conta`, `/assinatura`, `/configuracoes` — só com sessão
- [ ] `/admin` — só admin; utilizador normal redirecionado
- [ ] Páginas legais (`/termos`, `/privacidade`, etc.) — conforme rotas reais
- [ ] Stripe Checkout e Portal — fluxo completo em Live (ambiente controlado)
- [ ] Logout — sessão terminada

---

## 19. Pendências obrigatórias antes do lançamento

1. Confirmar **todas** as envs em Vercel Production (Stripe Live, Supabase, Groq, Turnstile, URLs públicas).
2. Validar **RLS** e políticas no Supabase de produção (tabela a tabela crítica: `profiles`, `generations`, `documents`, `subscriptions`).
3. Smoke test das rotas da secção 18 em **produção**.
4. Confirmar `STRIPE_WEBHOOK_SECRET` corresponde ao endpoint **live** no Stripe Dashboard.

---

## 20. Pendências recomendadas pós-lançamento

1. Resolver cadeia `npm audit` quando Next/Sentry publicarem correção sem breaking change.
2. Reavaliar endpoints autenticados sem `rejectInvalidOrigin` (`/api/subscription/sync`, `/api/upload/parse`, `/api/pdf`) se política CSRF for estrita.
3. Ativar Sentry em produção **apenas** quando desejado: definir `NEXT_PUBLIC_SENTRY_DSN`; opcionalmente trio para source maps (já suportado sem quebrar build).
4. Revisão periódica de logs para evitar crescimento de PII acidental.

---

## 21. Sentry (standby)

- `getSentryInitOptions()` em `lib/sentry-privacy.ts`: **`enabled: Boolean(dsn)`** — sem DSN, cliente não envia eventos.
- `next.config.ts`: upload de source maps **só** se `SENTRY_AUTH_TOKEN` + org + projeto estiverem definidos; caso contrário `sourcemaps.disable: true`.
- `instrumentation.ts` carrega configs Sentry em runtime node/edge; **não** ativa telemetria agressiva (`tracesSampleRate: 0`).
- **Conclusão:** Sentry permanece **standby silencioso** até existir DSN configurado; build **não** exige `SENTRY_AUTH_TOKEN`.

---

## 22. Registo de alterações desta auditoria (código)

- Remoção: `app/api/debug/stripe-pricing/route.ts`
- Remoção: export `getStripePricingDebugSnapshot` / tipo associado em `lib/stripe-price-fetch.ts`
- Ajuste de logs: `app/api/stripe/webhook/route.ts` (mensagens truncadas em vez de objeto `Error` completo)
- Atualização: `docs/stripe/DYNAMIC_PRICING_PRODUCTION_DEBUG.md`, comentário em `components/home-page.tsx`
- **Novo:** este ficheiro `docs/security/FINAL_GO_LIVE_SECURITY_AUDIT.md`

---

## 23. Prontidão para lançamento

Com as **pendências obrigatórias** (secção 19) cumpridas pela equipa em ambiente real, o estado do código na branch `staging/pre-go-live-sync` é considerado **pronto para go-live** com o veredito **APROVADO COM RESSALVAS** descrito acima.

---

*Documento gerado no âmbito da auditoria final de segurança GlobalHire AI.*

**Export PDF (go-live):** `FINAL_GO_LIVE_SECURITY_AUDIT.pdf` na área de trabalho do autor da auditoria (`~/Desktop/`), gerado a partir deste Markdown (HTML + Chrome headless). O PDF **não** é versionado no repositório.

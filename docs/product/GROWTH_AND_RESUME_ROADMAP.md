# GlobalHire AI — Auditoria estratégica, fases e relatório (Resume Builder 2.0 + Growth Cockpit)

**Data:** maio de 2026  
**Escopo da solicitação:** duas frentes grandes (produto + cockpit interno) + múltiplas prioridades (persistência de currículos, PDF, templates, IA review, i18n, etc.).

---

## 1. Auditoria do estado atual (resumo)

| Área | Estado |
|------|--------|
| Auth | Supabase Auth; e-mail/senha; OAuth Google/LinkedIn/Facebook via `signInWithOAuth`; callback `/auth/callback`. |
| Pagamentos | Stripe checkout/portal/webhook; **não tocar** sem necessidade crítica. |
| Geração IA | `dashboard-generator`, prompts em `prompts/ai-prompts.ts`, tipos em `lib/types.ts`. |
| ATS | `ats-analyzer`, rotas API dedicadas. |
| Histórico | `generations` / documentos por `user_id`; **sem** “resume builder” multi-versão persistido como produto separado. |
| PDF | Fluxo híbrido (nota de `window.print()` / rota preparada); **não** download PDF server-side premium ainda. |
| Admin | `/admin` com `requireAdmin()` + `createAdminClient()`; **Growth Cockpit** em `/admin/growth` (admin-only, MVP localStorage). |
| i18n | PT/EN/ES/FR centralizado (`lib/i18n*.ts`). |
| Analytics | PostHog/GA4/Clarity com consentimento; `trackEvent` central. |

**Conclusão:** a base SaaS é estável. As novas peças pedidas são **ortogonais** entre si, mas **Resume Builder 2.0** exige **modelo de dados**, RLS, UX de gerador e export — alto acoplamento com o core.

---

## 2. Complexidade e estimativa

| Dimensão | Growth Cockpit (completo “paper”) | Resume Builder 2.0 (completo) |
|----------|-----------------------------------|-------------------------------|
| Risco arquitetural | **Baixo–médio** se **sem** novas tabelas (MVP cliente/localStorage). **Médio** com Supabase + RLS + painéis. | **Alto** (schema, migrações, RLS, compat com gerador atual, PDF server). |
| Arquivos (ordem de grandeza) | ~8–15 (MVP) / 20+ (com API persistida). | 30–80+ dependendo de templates e PDF. |
| Impacto operacional | Baixo; só admins. | Alto; todos os utilizadores + suporte. |
| Custo em contexto/créditos | **Implementar tudo de uma vez** = contexto gigante + risco de regressão. | Idem. |

**Estimativa:** executar **tudo** na mesma entrega = **reprovado** (risco de quebra, refactor perigoso, migrations sem QA dedicado).

---

## 3. Decisão: implementação **por fases**

| Fase | Conteúdo | ROI | Segurança | Status |
|------|-----------|-----|-----------|--------|
| **1** | Founder Growth Cockpit **MVP** — rota `/admin/growth`, `requireAdmin`, seed por locale, UTM builder, prompts copiáveis, fila de conteúdo, métricas manuais + decisão heurística simples, learning log + export `.ics` **client-side**, persistência **localStorage** opcional. | Alto para founder solo; zero impacto em utilizadores finais. | **Máxima** (sem Stripe/auth/RLS/schema). | **Implementada nesta entrega.** |
| **2** | Resume Builder 2.0 — **persistência** (tabela `resumes` ou equivalente), versões, duplicar, listar; RLS; entrada no gerador “abrir versão”. | Altíssimo | Médio (migrations + RLS + testes). | Pendente |
| **3** | UI builder (form + preview tempo real), templates base, tamanho/tom (i18n + prompts). | Alto | Médio | Pendente |
| **4** | Humanização IA (prompts recruiter/cover/LinkedIn + tonelength). | Alto | Baixo–médio (só prompts + UI seletores). | Pendente |
| **5** | PDF profissional server-side ou pipeline estável; remover dependência de `about:blank` onde existir. | Alto | Médio–alto | Pendente |
| **6** | AI Review (scoring + sugestões + “aplicar”). | Alto | Médio | Pendente |
| **7** | Renomear “Simular entrevista” → “Guia para entrevista” + UX do guia (cards). | Médio | Baixo | **Parcialmente entregue na Fase 2 limitada** (i18n + cartões + prompt); refinamentos posteriores opcionais. |
| **8** | Cockpit **persistido** (Supabase `growth_*` tables) + automações leves se ainda fizer sentido. | Médio | Médio | Opcional / posterior |

**Ordem ideal:** 1 → 2 → 3 → 4 em paralelo controlado com 5; 6 após preview estável; 7 a qualquer momento com baixo custo; 8 só se o MVP localStorage ficar pequeno para a operação.

---

## 4. O que **não** foi alterado (Fase 1)

- Stripe, webhooks, pricing.
- RLS, schema Supabase, migrações.
- Auth (`requireAdmin` reutilizado).
- ATS analyzer, gerador IA, dashboard público, onboarding.
- PostHog/GA4/Clarity/Sentry (evento `growth_cockpit_viewed` ao abrir o cockpit, sem alterar pipelines).

---

## 5. Fase 1 — Arquivos criados/alterados

**Criados**

- `app/(app)/admin/growth/page.tsx` — página servidor: `requireAdmin()`, `getServerLocale()`, `getAppUrl()`, renderiza `<GrowthCockpit />`.
- `components/growth-cockpit.tsx` — UI cliente: weekly focus, queue, UTM engine, métricas + decision engine, prompts (copiar), learning log, export `.ics`, `localStorage`, `trackEvent("growth_cockpit_viewed")`.

**Alterados**

- `lib/i18n-growth-cockpit.ts` — strings PT/EN/ES/FR (incl. `copied`, `rationale*`), seed, `suggestGrowthDecision(metrics, t)`.
- `lib/i18n.ts` — `navCopy.adminGrowth` (4 locales).
- `lib/i18n-admin.ts` — card no dashboard admin: `growthCardTitle`, `growthCardLead`, `growthCardCta`.
- `components/nav.tsx` — links `/admin` e `/admin/growth` (desktop + menu mobile, só se `isAdmin`).
- `app/(app)/admin/page.tsx` — card com CTA para o cockpit.

---

## 6. QA checklist (Fase 1)

- [x] Utilizador **não** admin: `/admin/growth` redireciona (mesmo comportamento que `/admin`).
- [x] Admin: página carrega; secções visíveis; seed aparece.
- [x] UTM: URL final bate com `getAppUrl()` + query.
- [x] Copiar prompt: clipboard funciona (HTTPS).
- [x] Download `.ics`: ficheiro gerado (validar import manual no Google/Apple Calendar).
- [x] Recarregar página: notas/métricas persistem se `localStorage` permitido.
- [x] Trocar idioma: textos do cockpit mudam (PT/EN/ES/FR).
- [x] `npm run lint` / `typecheck` / `build` OK.

---

## 7. Pendências manuais (produto / cockpit)

- Cockpit Fase 1 é **local-first**; backup/export JSON manual pode ser Fase 8.
- LinkedIn/Facebook OAuth continuam dependentes de config externa (`docs/social-auth-setup.md`).
- Resume Builder 2.0 exige desenho de **fonte de verdade** (um CV vs múltiplos ficheiros) antes da Fase 2.

---

## 8. Riscos e observações

- **Não** confundir cockpit interno com produto: evitar links públicos e SEO para `/admin/growth`.
- Resume 2.0 sem migração clara duplica lógica com “histórico” atual — na Fase 2 definir se versões convivem com `generations` ou substituem gradualmente.

---

*Documento vivo — atualizar após cada fase.*

# 2 — Inventário completo de ficheiros que impactam identidade visual

Legenda de **risco de alteração**: **Alto** — uma mudança afecta muitas páginas ou quebra contraste; **Médio** — afecta um fluxo ou requer coordenação; **Baixo** — localizado.

---

## Branding

| Ficheiro | Função | Impacto visual | Risco | Dependências | Importância |
|----------|--------|----------------|-------|----------------|-------------|
| [`public/branding/logo-symbol.svg`](../../public/branding/logo-symbol.svg) | Marca compacta (nav) | Logo principal em header | Médio | `next/image` em `nav.tsx` | Alta |
| [`public/branding/logo-horizontal.svg`](../../public/branding/logo-horizontal.svg) | Marca horizontal | Materiais / eventual uso | Baixo | — | Média |
| [`public/branding/logo-vertical.svg`](../../public/branding/logo-vertical.svg) | Marca vertical | Materiais | Baixo | — | Média |
| [`public/branding/logo-monochrome.svg`](../../public/branding/logo-monochrome.svg) | Versão monocromática | Fundos complexos | Baixo | — | Média |
| [`public/branding/favicon.svg`](../../public/branding/favicon.svg) | Favicon alternativo | Tab do browser se não houver `.ico` | Médio | `app/layout.tsx` resolve `/brand/*` primeiro | Alta |
| [`public/branding/og-image-v2.svg`](../../public/branding/og-image-v2.svg) | OG vector | Partilhas sociais (se usado) | Médio | — | Média |
| [`public/branding/linkedin-banner-v2.svg`](../../public/branding/linkedin-banner-v2.svg) | Banner LinkedIn | Off-product | Baixo | — | Baixa |
| [`public/branding/_backup-before-v2/*`](../../public/branding/_backup-before-v2/) | Backup pré-v2 | Não referenciado pelo app | Baixo | — | Arquivo |
| [`public/brand/favicon.svg`](../../public/brand/favicon.svg) | Favicon MVP | **Usado** se existir (prioridade em `layout.tsx`) | Médio | `app/layout.tsx` | Alta |
| [`public/brand/og-image.svg`](../../public/brand/og-image.svg) | OG fallback | Metadata OpenGraph | Médio | `app/layout.tsx` | Alta |
| [`public/brand/README.md`](../../public/brand/README.md) | Instruções assets | Documentação | Baixo | — | Baixa |
| [`public/og-image.svg`](../../public/og-image.svg) | OG raiz | Possível fallback legado | Baixo | Verificar referências | Média |
| [`docs/design-system/*`](../design-system/) | Especificação marca/tokens | **Referência** (pode divergir do código) | — | Equipa | Alta (governa rebranding) |

---

## Layout (App Router)

| Ficheiro | Função | Impacto | Risco | Dependências |
|----------|--------|-----------|-------|----------------|
| [`app/layout.tsx`](../../app/layout.tsx) | Root: `body`, providers, **metadata** OG/Twitter/icons | Fundo global, SEO visual | **Alto** | `globals.css`, `getAppUrl()`, `/public/brand` |
| [`app/(app)/layout.tsx`](../../app/(app)/layout.tsx) | Shell logado: main + gradient dark | Toda área autenticada | **Alto** | `AppNav`, footer |
| [`app/(auth)/layout.tsx`](../../app/(auth)/layout.tsx) | Shell auth + footer | Login/cadastro/recuperação | Médio | `AutoSiteFooter` |
| [`app/page.tsx`](../../app/page.tsx) | **Landing** | Identidade pública máxima | **Alto** | `brand-shell`, `PublicNav`, `ui`, i18n |
| [`app/pricing/page.tsx`](../../app/pricing/page.tsx) | Pricing marketing | Planos, cards | Médio | `Card`, `PublicNav` |
| [`app/features/page.tsx`](../../app/features/page.tsx) | Features | Marketing | Médio | Idem |
| [`app/faq/page.tsx`](../../app/faq/page.tsx) | FAQ | Marketing | Médio | Idem |
| [`app/resources/page.tsx`](../../app/resources/page.tsx) | Recursos | Marketing | Médio | Idem |
| [`app/support/page.tsx`](../../app/support/page.tsx) | Suporte (LegalPage) | Conteúdo + shell | Médio | `LegalPage` |
| [`app/(app)/dashboard/page.tsx`](../../app/(app)/dashboard/page.tsx) | Dashboard | Primeira experiência app | Médio | `Card` |
| [`app/(app)/gerador/page.tsx`](../../app/(app)/gerador/page.tsx) | Gerador | Fluxo core | Médio | `dashboard-generator` |
| [`app/(app)/historico/page.tsx`](../../app/(app)/historico/page.tsx) | Histórico | Listas, `<pre>` | Médio | `history-list` |
| [`app/(app)/ats-score/page.tsx`](../../app/(app)/ats-score/page.tsx) | ATS | Análise visual | Médio | `ats-analyzer` |
| [`app/(app)/conta/page.tsx`](../../app/(app)/conta/page.tsx) | Conta | Forms | Médio | `account-panel` |
| [`app/(app)/assinatura/page.tsx`](../../app/(app)/assinatura/page.tsx) | Assinatura | Pricing interno | Médio | `upgrade-plans` |
| [`app/(app)/configuracoes/page.tsx`](../../app/(app)/configuracoes/page.tsx) | Configurações | Settings | Médio | `settings-panel` |
| [`app/(app)/admin/page.tsx`](../../app/(app)/admin/page.tsx) | Admin | Tabelas/cards | Baixo | `Card` |
| [`app/(auth)/login/page.tsx`](../../app/(auth)/login/page.tsx) | Login | Auth visual | Médio | `Card`, Turnstile |
| [`app/(auth)/cadastro/page.tsx`](../../app/(auth)/cadastro/page.tsx) | Cadastro | Idem | Médio | Idem |
| [`app/(auth)/recuperar-senha/page.tsx`](../../app/(auth)/recuperar-senha/page.tsx) | Recuperar | Idem | Baixo | Idem |
| [`app/(auth)/redefinir-senha/page.tsx`](../../app/(auth)/redefinir-senha/page.tsx) | Redefinir | Idem | Baixo | Idem |
| [`app/termos/page.tsx`](../../app/termos/page.tsx) | Termos | Legal | Baixo | `LegalPage` |
| [`app/privacidade/page.tsx`](../../app/privacidade/page.tsx) | Privacidade | Legal | Baixo | Idem |
| [`app/privacy/page.tsx`](../../app/privacy/page.tsx) | Alias EN? | Redirect/legal | Baixo | Verificar |
| [`app/cookies/page.tsx`](../../app/cookies/page.tsx) | Cookies | Legal | Baixo | `LegalPage` |
| [`app/refund-policy/page.tsx`](../../app/refund-policy/page.tsx) | Reembolso | Legal | Baixo | Idem |
| [`app/data-processing/page.tsx`](../../app/data-processing/page.tsx) | Tratamento dados | Legal | Baixo | Idem |
| [`app/terms/page.tsx`](../../app/terms/page.tsx) | Redirect | — | Baixo | — |

---

## Global styles

| Ficheiro | Função | Impacto | Risco |
|----------|--------|---------|-------|
| [`app/globals.css`](../../app/globals.css) | Variáveis CSS, `brand-shell`, `brand-grid`, focus-ring, selection, autofill | **Todo o produto** | **Alto** |

---

## Tailwind

| Ficheiro | Função | Impacto | Risco |
|----------|--------|---------|-------|
| [`tailwind.config.ts`](../../tailwind.config.ts) | `darkMode: "class"`, cores extend, `shadow-soft` / `shadow-glow` | **Tokens globais Tailwind** | **Alto** |

---

## Theme

| Ficheiro | Função | Impacto | Risco |
|----------|--------|---------|-------|
| [`components/theme-provider.tsx`](../../components/theme-provider.tsx) | `html` class `dark` | Alternância paleta | **Alto** | `lib/theme.ts` |
| [`components/theme-toggle.tsx`](../../components/theme-toggle.tsx) | UI 3 estados | Chrome global | Médio | `useTheme` |
| [`lib/theme.ts`](../../lib/theme.ts) | Persistência + resolve system | Comportamento tema | Médio | localStorage |

---

## Components (UI / chrome)

| Ficheiro | Função | Impacto | Risco |
|----------|--------|---------|-------|
| [`components/ui.tsx`](../../components/ui.tsx) | `Button`, `Card`, `Field`, `inputClass`, `textareaClass`, `cn` | **Máximo** em surfaces | **Alto** |
| [`components/nav.tsx`](../../components/nav.tsx) | `PublicNav`, `AppNav` | Navbar todas áreas | **Alto** | `theme-toggle`, logos |
| [`components/site-footer.tsx`](../../components/site-footer.tsx) | Footer + redes | Todas páginas com footer | **Alto** | Lucide + TikTok SVG |
| [`components/legal-page.tsx`](../../components/legal-page.tsx) | Template legal | Páginas legais | Médio | `PublicNav`, `Card` |
| [`components/cookie-consent.tsx`](../../components/cookie-consent.tsx) | Banner fixo inferior | Overlay global | **Alto** (contraste tema) | `Button` |
| [`components/language-provider.tsx`](../../components/language-provider.tsx) | Locale | Copy (indirecto visual em comprimentos) | Baixo | — |
| [`components/dashboard-generator.tsx`](../../components/dashboard-generator.tsx) | UI gerador | Fluxo longo | Médio | `ui`, uploads |
| [`components/history-list.tsx`](../../components/history-list.tsx) | Lista + detalhe | Densidade informação | Médio | — |
| [`components/ats-analyzer.tsx`](../../components/ats-analyzer.tsx) | ATS UI | Idem | Médio | — |
| [`components/account-panel.tsx`](../../components/account-panel.tsx) | Conta/subscrição | Forms + tabs | Médio | — |
| [`components/settings-panel.tsx`](../../components/settings-panel.tsx) | Configurações | Forms | Médio | — |
| [`components/upgrade-plans.tsx`](../../components/upgrade-plans.tsx) | Planos Stripe | Pricing | Médio | — |
| [`components/upgrade-gate.tsx`](../../components/upgrade-gate.tsx) | Paywall | CTA | Baixo | `Button` |
| [`components/social-auth-buttons.tsx`](../../components/social-auth-buttons.tsx) | OAuth buttons | Auth | Médio | — |
| [`components/turnstile-widget.tsx`](../../components/turnstile-widget.tsx) | Captcha | Auth (tema `auto`) | Médio | Cloudflare |
| [`components/admin-block-button.tsx`](../../components/admin-block-button.tsx) | Admin | Baixo tráfego | Baixo | — |
| [`components/analytics-scripts.tsx`](../../components/analytics-scripts.tsx) | Scripts | Sem CSS directo significativo | Baixo | — |
| [`components/structured-data.tsx`](../../components/structured-data.tsx) | JSON-LD | Não visual | Baixo | — |

---

## Landing page

- Principal: [`app/page.tsx`](../../app/page.tsx).
- Suporte copy: [`lib/i18n.ts`](../../lib/i18n.ts) (landingCopy, navCopy, footerCopy, etc.) — **texto e hierarquia** afectam layout.

---

## Dashboard

- Layout: [`app/(app)/layout.tsx`](../../app/(app)/layout.tsx).
- Página: [`app/(app)/dashboard/page.tsx`](../../app/(app)/dashboard/page.tsx).
- Componentes: `dashboard-generator`, `history-list`, `ats-analyzer`, `account-panel`, `upgrade-*`.

---

## Navbar

- [`components/nav.tsx`](../../components/nav.tsx) — única implementação de `PublicNav` e `AppNav`.

---

## Backgrounds

- [`app/globals.css`](../../app/globals.css) — `.brand-shell`, `.brand-grid`.
- [`app/(app)/layout.tsx`](../../app/(app)/layout.tsx) — gradient dark inline class.
- Várias páginas: `bg-paper`, `dark:bg-ink`.

---

## Icons

- **Biblioteca:** `lucide-react` (importações dispersas em páginas e componentes).
- **Custom:** `TikTokGlyph` SVG inline em [`components/site-footer.tsx`](../../components/site-footer.tsx).

---

## Typography

- [`app/globals.css`](../../app/globals.css) — `body { font-family: Inter, ... }`.
- Escala tipográfica: principalmente **utility classes** Tailwind (`text-5xl`, `text-sm`, etc.) por página — **sem** escala centralizada em código além de docs.

---

## Animations

- Tailwind: `transition`, `hover:-translate-y-0.5` em `Button` e cards landing; `animate-spin` em loaders (`Loader2`, `RefreshCw`).
- Sem `framer-motion` detectado no grep limitado.

---

## Responsividade

- Classes Tailwind `sm:`, `md:`, `lg:` em `page.tsx`, `nav.tsx`, layouts.
- Regras mobile em [`docs/design-system/tokens.md`](../design-system/tokens.md) (documental).

---

## SEO / OpenGraph visuais

| Ficheiro | Função |
|----------|--------|
| [`app/layout.tsx`](../../app/layout.tsx) | `metadata.openGraph.images`, `twitter.images`, `icons` — paths resolvidos para `/brand/og-image.png` ou `.svg`, favicon |
| [`components/structured-data.tsx`](../../components/structured-data.tsx) | Dados estruturados (não imagem) |
| [`app/faq/page.tsx`](../../app/faq/page.tsx) | `FaqStructuredData` |

---

## Public assets (resumo)

- Pastas: `public/branding/`, `public/brand/`, ficheiros soltos `public/og-image.svg`.
- Ver capítulo dedicado [`05-assets-open-graph-public.md`](./05-assets-open-graph-public.md).

---

## Lib / copy (impacto indirecto em UI)

| Ficheiro | Nota |
|----------|------|
| [`lib/i18n.ts`](../../lib/i18n.ts) | Comprimentos de strings, headings |
| [`lib/plan-copy.ts`](../../lib/plan-copy.ts) / [`lib/plans.ts`](../../lib/plans.ts) | Pricing display |
| [`lib/social.ts`](../../lib/social.ts) | Links footer |

---

## Documentação existente (referência rebranding)

- [`docs/design-system/`](../design-system/)
- [`docs/ui-audit/`](../ui-audit/)
- [`docs/PREVIEW_QA_REPORT.md`](../PREVIEW_QA_REPORT.md)

---

*Este inventário cobre ficheiros **directamente** ligados a UI/branding no estado do repo analisado. Ficheiros de API sem superfície visual foram omitidos.*

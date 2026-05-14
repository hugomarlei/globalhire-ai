# 1 — Resumo executivo da identidade visual atual

## Identidade visual actual (o que o produto “é” hoje)

A GlobalHire AI apresenta-se como um **SaaS tech premium com viés “green/cyber”**: fundo **escuro profundo** (ink/graphite) ou **paper** mentolado no claro, **acento mint/brand** (`#2FBF8F` e escala `brand-*` no Tailwind), **realces cyan** (`cyber`) e secundárias **violet / amber / coral** para estados e alertas.

A **landing** (`app/page.tsx`) usa o modo **“marketing escuro simulado”**: o markup assume classes `text-white`, `border-white/10`, `bg-white/[opacity]`, enquanto o CSS global (`.brand-shell` em `app/globals.css`) **remapeia** essas classes para tons de **ink/graphite** quando `html` **não** tem classe `dark` — permitindo hero e secções coerentes em **light** sem reescrever todo o JSX.

## Cores predominantes

| Contexto | Predominância |
|----------|----------------|
| **Corpo global** | `bg-paper` / `text-ink` (light); `dark:bg-ink` / `dark:text-white` |
| **Marca / CTA** | `brand-500` (≈ mint), `brand-200` hover em botão primário |
| **Superfícies** | `graphite` com opacidades; `white/*` na landing dentro de `brand-shell` |
| **Acentos** | `cyber`, `mint` (alias visual), `coral` erros |

## Linguagem visual e referências aparentes

- **SaaS B2C moderno** (hero grande, cards com sombra suave, grelha, prova social estatística).
- **Inspiração próxima de:** Vercel-like dark shells + **glass** leve (`backdrop-blur` em `Card`, nav sticky).
- **Ícones:** Lucide (linha fina, consistente).
- **Tipografia:** stack **Inter** + system UI (`body` em `globals.css`); **sem** `next/font` no código analisado.

## Sensação estética transmitida

- **Profissionalismo e foco** (dark dashboard, baixo ruído).
- **Confiança / “ferramenta séria”** (ATS, scores, copy honesta na landing).
- **Ligeira complexidade técnica** — o utilizador percebe produto “engineered” mais do que “playful”.

## Nível de consistência visual

| Área | Consistência |
|------|----------------|
| **Componentes partilhados** (`Button`, `Card`, `inputClass`) | **Alta** após RC — são o núcleo visual. |
| **App autenticado** (`(app)/layout`, `AppNav`, páginas app) | **Alta** — padrão `paper`/gradient dark + cards claros no light. |
| **Landing** | **Média-alta** — patrão único, mas depende de **overrides CSS** em `.brand-shell` (fragilidade). |
| **Marketing estático** (`/pricing`, `/features`, …) | **Média** — shell alinhado; **conteúdo i18n** parcial (PT em várias rotas). |
| **Cookie consent** | **Média-baixa** — **sempre cromo escuro** (`#06100B`); em tema **claro** global pode parecer “ilha” escura (pendência consciente no QA). |

## Partes mais maduras

- **`components/ui.tsx`**: botão primário, card, campos — contraste e autofill tratados.
- **`components/nav.tsx`**: `PublicNav` + `AppNav` com variantes light/dark alinhadas ao RC.
- **`app/globals.css`**: `brand-shell`, grelha, `::selection`, autofill textarea/select.
- **Landing**: hierarquia tipográfica clara, CTAs, secções bem delimitadas.

## Partes mais improvisadas ou frágeis

- **Dupla verdade de tokens:** [`docs/design-system/tokens.md`](../design-system/tokens.md) vs valores reais em [`tailwind.config.ts`](../../tailwind.config.ts) (ex.: ink, brand green).
- **Landing “white-in-name-only”:** dependência de **dezenas** de regras `html:not(.dark) .brand-shell .text-white/...` — qualquer novo utilitário Tailwind na landing pode **não** ser coberto.
- **Hex espalhados** (`#06100B`, `#07120E`, `#1a222d`, `#0d1410`, …) misturados com tokens semânticos.
- **CookieConsent** desalinhado do tema claro (risco de percepção de inconsistência).

---

## Análise por superfície

### Desktop

- Landing: duas colunas hero + card de demo; pricing em grelha larga.
- Dashboard: `max-w-7xl`, cards e listas confortáveis.
- **Risco:** dropdowns `AppNav` com `group-hover` — testar foco/teclado e viewport estreito.

### Mobile

- Landing: stacks verticais; nav pública com wrap (login + signup visíveis — alinhado a regras em `tokens.md`).
- App: menu móvel no `AppNav` (padrão drawer-like em header).

### Landing (`/`)

- Única página com `brand-shell` + `brand-grid`.
- Forte identidade; maior acoplamento a overrides CSS.

### Dashboard e app (`(app)/*`)

- Fundo: `bg-paper` + gradient linear em dark (`app/(app)/layout.tsx`).
- Conteúdo: `Card` + listagens com bordas `graphite/15` e variantes `dark:`.

### Auth (`(auth)/*`)

- Layout: `bg-paper` / `dark:bg-ink` sem `brand-shell`.
- Páginas: `Card` centrado — **coerente** com resto app pós-RC.

### Componentes reutilizáveis

- Núcleo pequeno mas crítico: `ui.tsx`, `nav.tsx`, `site-footer.tsx`, `theme-toggle.tsx`, `theme-provider.tsx`, `cookie-consent.tsx`.

---

## §9 — Listas finais solicitadas

### Ficheiros críticos (prioridade máxima num rebranding)

1. [`tailwind.config.ts`](../../tailwind.config.ts) — paleta e sombras.
2. [`app/globals.css`](../../app/globals.css) — `brand-shell`, focus ring, autofill, selection.
3. [`components/ui.tsx`](../../components/ui.tsx) — `Button`, `Card`, `inputClass`/`textareaClass`.
4. [`components/nav.tsx`](../../components/nav.tsx) — navbar pública e app.
5. [`app/page.tsx`](../../app/page.tsx) — landing completa.
6. [`app/layout.tsx`](../../app/layout.tsx) — body, metadata OG/favicon.
7. [`components/site-footer.tsx`](../../components/site-footer.tsx) — footer + social buttons.
8. [`components/cookie-consent.tsx`](../../components/cookie-consent.tsx) — overlay global.

### Pontos fortes

- Tema **claro/escuro** funcional com `class` no `html`.
- **Contraste** em formulários e cards melhorado documentado no QA RC.
- **Marca** legível (verde + dark) e CTAs evidentes.
- Poucos primitives — refactors centralizados são viáveis.

### Pontos fracos

- Drift **docs tokens ↔ código**.
- **Overrides** massivos `.brand-shell` para light mode.
- **Hex hardcoded** paralelos a tokens Tailwind.
- Consent banner **não** segue tema claro.
- i18n de conteúdo marketing incompleto (não é só visual, afecta percepção de produto “global”).

---

*Documento A/E/F (resumo executivo, síntese, riscos resumidos); detalhes em [`07-plano-rebranding-e-checklist.md`](./07-plano-rebranding-e-checklist.md) e [`03-controles-mapa-dependencias.md`](./03-controles-mapa-dependencias.md).*

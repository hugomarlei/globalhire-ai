# 5 — Últimas alterações importantes (build estável + correções visuais)

## Fonte primária

O repositório documenta uma **rodada RC** focada em UI, tema e footer em [`docs/PREVIEW_QA_REPORT.md`](../PREVIEW_QA_REPORT.md). Os commits Git mais relevantes nos ficheiros visuais centrais:

| Commit | Mensagem (resumo) |
|--------|-------------------|
| `f50c449` | fix(rc): grid doc cards, landing/nav contrast, prefs hydration, settings MVP copy |
| `7a4d6bb` | fix(rc): app shell light/dark contrast, AppNav, fields |
| `6494ac0` | fix(rc): unify theme (html.dark), fix auth inputs, social defaults |
| `2d2af15` | feat(ui): localized landing, theme toggle, footer, history export |
| `d11e8e2` | feat: implement GlobalHire AI brand system v2 |

*(Lista via `git log` em `app/globals.css`, `tailwind.config.ts`, `components/ui.tsx`, `components/nav.tsx`, `app/page.tsx`.)*

## O que foi corrigido (contraste / fundo / legibilidade)

### Causa raiz (RC — light + dark)

1. **`(app)/layout` com `text-white` no `<main>`** enquanto `Card` em modo claro usava superfície clara + `text-ink` → texto branco ilegível em cards brancos.
2. **`AppNav`** assumia cromo escuro fixo → inconsistente com tema claro.
3. **Campos** (`dark:bg-white/7`, etc.) frágeis para autofill/contraste.

### Intervenções (ficheiros participantes)

- [`components/ui.tsx`](../../components/ui.tsx): `Card` com `bg-white` opaco no light; `inputClass` com `#1a222d` no dark, caret, selection, disabled, autofill via utilities Tailwind.
- [`app/globals.css`](../../app/globals.css): `::selection` global; autofill WebKit para **textarea** e **select**.
- [`components/nav.tsx`](../../components/nav.tsx): `AppNav` com superfícies **light + `dark:``**.
- Múltiplas páginas/componentes app: dashboard, gerador, ATS, histórico, conta, settings, upgrade, admin, turnstile (`theme: "auto"`), social auth buttons.

### Polish posterior (QA manual)

- **Histórico:** comportamento de expansão de documentos; `<pre>` com fundos e texto explícitos por tema.
- **Theme toggle** e **ícones sociais** do footer: remoção de `bg-white/6` problemático no dark em favor de hex estáveis (`#0d1410`, `#162018`, etc.).
- **Landing/nav:** ajustes de contraste (commit `f50c449`).

## Build

O relatório de QA indica **`npm run typecheck`**, **`lint`**, **`build`** — OK após a rodada RC documentada.

## Riscos de legibilidade remanescentes

| Risco | Evidência |
|-------|-----------|
| **CookieConsent** sempre escuro | [`components/cookie-consent.tsx`](../../components/cookie-consent.tsx); QA menciona smoke recomendado, não revisão visual completa no RC |
| **Novos utilitários na landing** sem override em `.brand-shell` | Padrão `text-white/XX` novo pode ficar errado em light até adicionar regra em `globals.css` |
| **`<option>` nativos** | Aparência depende do SO/browser (nota no QA) |
| **Inter sem `next/font`** | Possível FOUT/FOIT ou fallback system se Inter não instalada no cliente |

## Inconsistências remanescentes

- **Documentação de tokens** vs **código** (cores hex diferentes — ver [`06-arquitetura-visual-e-divida.md`](./06-arquitetura-visual-e-divida.md)).
- **Duas árvores de brand assets:** `public/brand/` (consumido por metadata) vs `public/branding/` (logos na UI).
- **Conteúdo marketing** parcialmente PT em rotas EN-adjacente (i18n — percepção de marca “global”).

---

*Este capítulo responde ao §5 do pedido de auditoria; não substitui o QA canónico.*

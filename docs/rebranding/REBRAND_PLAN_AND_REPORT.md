# GlobalHire AI — Rebranding visual (plano, execução e relatório)

**Data:** 2026-05-14  
**Auditoria base:** `docs/branding-audit/*`  
**Referências estéticas (inspiração, não clone):** Durable, Stripe, Linear, Vercel, OpenAI — maturidade, ritmo, whitespace, hierarquia editorial.

## 1. Plano visual (direcção)

| Pilar | Antes | Depois |
|-------|-------|--------|
| Tom | AI experimental / cyber-adjacente | SaaS AI **enterprise**, calmo, confiante |
| Cor | Mint/cyan vivos, glow perceptível | Mint **mais contido**, cyan **menos neon**, neutros **mais quentes** |
| Superfície | Glass/blur forte em cartões | **Matte** + sombra suave; blur reduzido |
| Tipografia | Inter genérico | **Inter** (UI) + **Fraunces** (display marketing) — hierarquia editorial |
| Landing | `text-white` + overrides CSS massivos | **Tokens semânticos `shell.*`** (RGB + opacidade Tailwind) definidos em `.brand-shell` |
| Cookie | Cromo sempre escuro | **Alinhado light/dark** com resto do produto |

## 2. Arquitectura técnica — SSOT

| Camada | SSOT | Notas |
|--------|------|-------|
| Cores Tailwind (`ink`, `paper`, `brand`, …) | **`tailwind.config.ts`** | Paleta evoluída; `mint`/`cyber` alinhados à nova marca |
| Cores da landing (fg/muted/borda/glass) | **CSS variables em `.brand-shell`** (`globals.css`) + **`shell.*` no Tailwind** | Variáveis **herdam** para descendentes; `text-shell-muted/70` válido |
| Tipografia | **`next/font`** (`app/layout.tsx`) + `theme.extend.fontFamily` | `--font-sans`, `--font-display` |
| Raio / sombra | **`tailwind.config.ts`** | `rounded-xl`/`2xl` padrão produto; sombras menos agressivas |
| Documentação | **`docs/design-system/tokens.md`** | Sincronizado com o código **após** merge deste rebranding |

## 3. Estratégia (resolver `brand-shell`)

1. Introduzir `--shell-*-rgb` em `.brand-shell` para **modo claro** e `html.dark .brand-shell` para **modo escuro**.
2. Registar `shell` em `tailwind.config.ts` com padrão `rgb(var(--shell-*-rgb) / <alpha-value>)`.
3. Substituir na **landing** todas as classes `text-white`, `text-white/xx`, `border-white/xx`, `bg-white/[…]` por **`text-shell-fg`**, **`text-shell-muted`**, **`border-shell-line`**, **`bg-shell-glass`**, **`bg-shell-band`**, etc.
4. **Eliminar** o bloco de overrides `html:not(.dark) .brand-shell .text-white/...` (dezenas de regras) — **rollback:** restaurar `globals.css` + `app/page.tsx` do commit anterior.

## 4. Ordem de execução (fases)

| Fase | Entrega |
|------|---------|
| F0 | Este documento + checklist |
| F1 | `tailwind.config.ts`, `app/globals.css` (tokens + shell + gradientes) |
| F2 | `app/layout.tsx` (fonts) + `fontFamily` no Tailwind |
| F3 | `app/page.tsx` (landing semântica + `font-display` em títulos) |
| F4 | `components/ui.tsx` (Card/Button — menos glow, radius, blur) |
| F5 | `cookie-consent.tsx`, `nav.tsx`, `site-footer.tsx` (polish + tema) |
| F6 | `app/(app)/layout.tsx` (gradiente app refinado) |
| F7 | `docs/design-system/tokens.md` + relatório final |
| F8 | `npm run lint` → `typecheck` → `build` |

## 5. Riscos e mitigação

| Risco | Mitigação |
|-------|-----------|
| Contraste WCAG na landing | Testar combinações `shell-*` em light e dark antes de merge |
| Regressão em `Card` fora da landing | `Card` mantém API; apenas classes base ajustadas |
| Fontes (FOUT) | `display: "swap"` em `next/font` |
| Cookie em light | Copy e botões secundários com cores **ink/graphite** explícitas |

## 6. Rollback

```bash
git checkout HEAD~1 -- tailwind.config.ts app/globals.css app/layout.tsx app/page.tsx components/ui.tsx components/cookie-consent.tsx components/nav.tsx components/site-footer.tsx app/\(app\)/layout.tsx docs/design-system/tokens.md docs/rebranding/REBRAND_PLAN_AND_REPORT.md
```

(ou revert do commit único de rebranding)

## 7. Ficheiros alterados (previstos / efectivos)

- `tailwind.config.ts`
- `app/globals.css`
- `app/layout.tsx`
- `app/page.tsx`
- `app/(app)/layout.tsx`
- `components/ui.tsx`
- `components/cookie-consent.tsx`
- `components/nav.tsx`
- `components/site-footer.tsx`
- `docs/design-system/tokens.md`
- `docs/rebranding/REBRAND_PLAN_AND_REPORT.md` (este ficheiro)

**Não alterado:** Stripe, APIs, `lib/plans`, `lib/plan-copy`, auth, analytics, metadata URLs (OG continua a apontar para `/brand/*`).

## 8. Rationale de design (resumo)

- **Menos glow:** `shadow-glow` passa a ser halo mais tenue — CTA continua destacado sem “gamer”.
- **Fraunces só em marketing:** SaaS premium usa par serif/sans; o app autenticado permanece **Inter-first** para densidade e legibilidade.
- **`shell.*`:** a landing torna-se **semanticamente honesta** (não há “branco que não é branco”) e **escalável** para novas secções.

## 9. Checklist pós-merge (QA manual)

- [ ] `/` landing — light + dark, mobile + desktop
- [ ] `/pricing`, `/login` — regressão visual
- [ ] Dashboard + gerador + histórico — cards e inputs
- [ ] Cookie banner — light + dark
- [ ] Focus visível em botões e links

## 10. Melhorias de UX visual (sem mudar fluxos)

- Hierarquia de títulos na landing (`tracking-tight`, escala consistente).
- Espaçamento entre secções (`py-24` onde faz sentido).
- Cookie legível em tema claro.
- Botão primário com micro-interacção mais discreta (menos `translate-y`).

---

## 11. Relatório final — resultado

| Verificação | Estado |
|-------------|--------|
| `npm run lint` | OK (sem erros ESLint) |
| `npm run typecheck` | OK (`tsc --noEmit`) |
| `npm run build` | OK (Next.js 15.5.18, 40 páginas) |

**Alterações entregues (resumo):**

- **SSOT:** `tailwind.config.ts` com paleta refinada, `shell.*`, `fontFamily`, `borderRadius`, sombras mais contidas.
- **Landing:** `app/page.tsx` usa tokens `shell.*` + `font-display` (Fraunces); removidos anti-patterns de `text-white` + overrides massivos em CSS.
- **`globals.css`:** variáveis `--shell-*-rgb`, gradientes mais subtis, grelha mais leve; removido bloco `html:not(.dark) .brand-shell .text-white/...`.
- **Tipografia:** `next/font` — Inter + Fraunces em `app/layout.tsx`; corpo com `font-sans`.
- **Primitives:** `components/ui.tsx` — cards e botões com radius XL, menos blur/glow agressivo, hover sem `translate-y`.
- **Cookie:** alinhado a light/dark com superfícies `paper` / `ink`.
- **Nav / footer / tema:** refinamento de radius, sombras do logo, header app.
- **App shell:** gradiente dark alinhado à nova profundidade de cor.
- **Docs:** `docs/design-system/tokens.md` sincronizado com o código.

**Rollback:** ver §6 (reverter ficheiros listados no plano).

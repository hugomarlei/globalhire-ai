# 8 — Preparação para rebranding + checklist (§9D)

## Ordem sugerida de trabalho (minimizar regressão)

1. **Congelar SSOT de cor** — planilha ou `tokens.json` único; actualizar **primeiro** `tailwind.config.ts` e **`globals.css`**, depois docs em `docs/design-system/`.
2. **`components/ui.tsx`** — `Button`, `Card`, `inputClass`/`textareaClass` (validar contraste WCAG em ambos os temas).
3. **`components/nav.tsx` + footers + cookie** — chrome visível em todas as rotas.
4. **Resolver `brand-shell`** — preferência: **refactor landing** para usar tokens semânticos (`text-foreground`, `text-muted`) em vez de remapear `text-white/*`; ou introduzir componente `<MarketingShell>` com variantes explícitas.
5. **Assets** — export único de logos/OG; actualizar `app/layout.tsx` paths.
6. **Páginas de marketing** secundárias — `pricing`, `features`, …
7. **App densas** — gerador, histórico, ATS (testes visuais longos).
8. **Polish** — focus states, motion, hover coerentes.

## Ficheiros prioritários (repetição intencional)

`tailwind.config.ts` → `app/globals.css` → `components/ui.tsx` → `components/nav.tsx` → `app/page.tsx` → `app/layout.tsx` → `site-footer.tsx` → `cookie-consent.tsx`

## Mudanças mais perigosas

| Mudança | Risco |
|---------|-------|
| Trocar estratégia `darkMode` ou remover `class` do `html` | Quebra **todas** as variantes `dark:` |
| Alterar `Card` sem testar auth + legal + dashboard | Regressão de contraste |
| Tocar em `.brand-shell` sem checklist landing | Texto ilegível em light |
| Substituir `shadow-glow` / `brand-500` sem actualizar CTAs | Perda de hierarquia visual |

## Como não quebrar o visual actual

- **Feature flag visual** ou branch longeva com screenshots (Percy/Chromatic ou manual estruturado).
- **Checklist por página** (ver abaixo) em **dois temas** + **mobile**.
- **Congelar** alterações de produto não relacionadas durante o sprint de marca.

## Estrutura profissional de rebranding

1. **Brief de marca** (posicionamento, tom, competidores).
2. **Audit (este pacote)** — estado actual.
3. **Direction** — moodboards, 2–3 direcções, escolha única.
4. **Tokenização** — cor, tipo, radius, elevation, motion.
5. **Implementação incremental** — primitives → chrome → páginas.
6. **QA acessibilidade** — contraste, foco, teclado.
7. **Comunicação** — OG, favicon, email templates (fora deste repo).

## Tokens globais (recomendação técnica)

- Opção A: **`tailwind.config.ts`** como SSOT + script que gera `docs/design-system/tokens.md`.
- Opção B: **CSS variables** em `:root` e `.dark` para semântica (`--color-surface`, `--color-fg-muted`) e mapear Tailwind via `theme.extend.colors`.
- Opção C: **OKLCH** no config (Tailwind v4 style) — avaliar compatibilidade com stack actual.

## Facilitar mudanças futuras

- Introduzir **`cn()` + variants** já existe; considerar **`cva`** (class-variance-authority) para `Button`/`Card` variants nomeadas (`primary`, `secondary`, `ghost`).
- **`PageSection`** component: `title`, `lede`, `children` — reduz duplicação de spacing.
- **`next/font`** com Inter subconjunto + `display: swap`.

---

## Checklist de rebranding (operacional)

### Descoberta

- [ ] Inventário de assets actualizado (este audit)
- [ ] Lista de páginas públicas + app + auth
- [ ] Screenshots baseline (light/dark/mobile) arquivados

### Tokens

- [ ] Paleta final aprovada (primária, secundária, neutros, semântica success/warn/error)
- [ ] Tipografia final (famílias, pesos, escala)
- [ ] Radius e sombras definidos
- [ ] Doc `tokens.md` sincronizado com código

### Implementação

- [ ] `tailwind.config.ts` actualizado
- [ ] `globals.css` (brand-shell, focus, selection, autofill) revisto
- [ ] `ui.tsx` revisto
- [ ] `nav.tsx` + footers + cookie revistos
- [ ] Landing refactor ou overrides testados
- [ ] `app/layout.tsx` metadata / OG / favicon
- [ ] Substituir hex soltos prioritários

### QA

- [ ] Contraste mínimo AA em textos principais (ferramenta)
- [ ] Todos os fluxos auth com Turnstile light/dark
- [ ] Dashboard + gerador + histórico + ATS
- [ ] Legal pages long scroll
- [ ] Cookie banner legível em **ambos** os temas (se mantiver dark-only, documentar decisão)

### Go-live marca

- [ ] Novos SVG/PNG em `/public`
- [ ] Validar partilha LinkedIn/WhatsApp (OG 1200×630)
- [ ] Comunicar mudança visual a suporte (macros de email, se existirem)

---

## §9F — Riscos consolidados (identidade visual)

| Risco | Mitigação |
|-------|-----------|
| Regressão contraste light em landing | Testes visuais + reduzir dependência de overrides |
| Drift doc↔código | SSOT único + geração de docs |
| Assets duplicados | Unificar `brand` vs `branding` |
| Fonte inconsistente entre plataformas | `next/font` + fallbacks explícitos |
| Scope creep no rebranding | Fases + congelamento de features paralelas |

---

*Capítulos §8 e §9D/F consolidados; resumo narrativo em [`01-resumo-executivo-e-sintese.md`](./01-resumo-executivo-e-sintese.md).*

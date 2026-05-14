# GlobalHire AI — rebranding: relatório final (ETAPA 2)

Data: 2026-05-12

## Commits (fases pedidas, alinhadas ao histórico)

| Fase | Commit (resumo) |
|------|-----------------|
| 1 — tokens + tipografia | `c24466f` feat(ds): tokens semânticos + tipografia (Inter, Fraunces) |
| 2–3 — landing | `3bcb42c` feat(landing): home editorial…; `7e708ff` refactor(css): remover shims text-white… |
| 4 — chrome | `ab6e773` feat(chrome): navbar, footer, cookie e theme toggle com tokens DS |
| 5 — app + marketing + QA | `8be32a1` feat(app): superfícies semânticas no app e marketing (contraste QA) |

## Arquivos alterados nesta sessão (fases 4–5)

**Chrome:** `components/nav.tsx`, `components/site-footer.tsx`, `components/cookie-consent.tsx`, `components/theme-toggle.tsx`

**App e marketing:** `app/(app)/*`, `app/(auth)/*`, `app/faq|features|pricing|resources|page.tsx`, `components/account-panel.tsx`, `admin-block-button.tsx`, `ats-analyzer.tsx`, `dashboard-generator.tsx`, `history-list.tsx`, `legal-page.tsx`, `settings-panel.tsx`, `social-auth-buttons.tsx`, `turnstile-widget.tsx`, `ui.tsx`, `upgrade-gate.tsx`, `upgrade-plans.tsx`

## O que mudou visualmente

- Remoção sistemática de `graphite`, `text-ink`, `dark:text-white/xx` e hex arbitrários em botões OAuth em favor de **tokens semânticos** (`background`, `foreground`, `card`, `muted`, `border`, `primary`).
- **Pré-formatados** (gerador, ATS, histórico): `bg-muted` + `text-foreground` + `border-border`.
- **Botões primários**: `bg-primary text-primary-foreground` (sem `brand-500` solto onde substituído).
- **Conta / links secundários**: `border-border bg-muted text-foreground` com hover coerente.
- **Inputs**: seleção de texto com `selection:bg-primary/15 selection:text-foreground` (`components/ui.tsx`).
- **Landing (callout)**: `text-foreground` no bloco com `bg-brand-50` no tema claro para não herdar contraste errado.

## Referência Durable (como foi aplicada, sem copiar)

- Hierarquia e ritmo já estabelecidos na landing (commits anteriores): tipografia display (Fraunces) + corpo Inter, seções com respiro, bordas suaves via tokens.
- Nesta rodada: **consistência** do mesmo vocabulário visual no app autenticado e páginas estáticas, evitando “segundo design system” com classes legadas.

## Identidade: mudança real

- De paleta **ad hoc** (`graphite/*`, opacidades de branco) para **superfícies nomeadas** alinhadas a `:root` / `.dark` em `app/globals.css`, consumidas pelo Tailwind em `tailwind.config.ts`.

## Checklist de contraste (light / dark) — verificação manual recomendada

- [ ] Texto principal sempre `text-foreground` ou `text-card-foreground` sobre `card`/`background`.
- [ ] Texto secundário: `text-muted-foreground` sobre `background`, `card` ou `muted`.
- [ ] Bordas: `border-border`; hover de linha: `hover:bg-muted`.
- [ ] Primário: `primary` + `primary-foreground` em CTAs.
- [ ] Nenhum card branco isolado no dark sem `text-card-foreground` escuro/claro correspondente ao token.
- [ ] Placeholders: herdados de `inputClass` (`placeholder:text-muted-foreground`).
- [ ] Cookie banner e nav: revisar nos dois temas após deploy.

## Páginas / áreas verificadas (código + build)

- Build de produção: **sucesso** (`next build`).
- Lint: **sem erros**.
- Typecheck (`tsc --noEmit`): **sem erros**.

Áreas cobertas por alteração de classes: landing (`app/page.tsx`), marketing (`pricing`, `faq`, `features`, `resources`, `legal-page`), auth, dashboard, admin, assinatura, gerador, componentes ATS/histórico/upgrade/settings/conta.

## Stripe / pricing — confirmação

- **`components/upgrade-plans.tsx`**: `checkout(plan.id)` continua a chamar `POST /api/stripe/checkout` com o identificador do plano; nenhuma alteração de `price_id`, rotas Stripe ou lógica de preço nesta sessão.
- Alterações restritas a **classes Tailwind** e tokens visuais.

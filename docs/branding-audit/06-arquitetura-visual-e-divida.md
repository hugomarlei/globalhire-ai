# 7 — Arquitectura visual do projecto

## Como a identidade está estruturada (camadas)

1. **Tokens Tailwind** (`tailwind.config.ts`) — base semântica limitada (`ink`, `paper`, `brand`, …).
2. **CSS global** (`globals.css`) — comportamentos transversais: tema, landing shell, focus, selection, autofill.
3. **Primitives React** (`components/ui.tsx`) — interacção e surfaces mais repetidas.
4. **Chrome** (`nav`, `site-footer`, `cookie-consent`, `theme-toggle`).
5. **Páginas** — composição com utilities; landing é caso especial (`brand-shell`).

## Existe design system?

- **Em documentação:** sim — [`docs/design-system/`](../design-system/) (v2, tokens, components).
- **Em código:** **partial** — não há Storybook nem pacote `@/design-system`; o “system” **é** sobretudo `ui.tsx` + convenções Tailwind + comentários no QA.

## Padrão consistente?

- **Sim** na vertical **app + auth + legal** pós-RC (cards claros no light, texto `ink`/`graphite`, variantes `dark:`).
- **Parcial** na vertical **marketing global**: landing usa patrão “dark-first JSX + CSS invert”; outras páginas marketing usam patrão “paper/ink” clássico.

## Tailwind organizado?

- **Prós:** `content` paths claros (`app`, `components`, `lib`); poucos plugins (lista vazia).
- **Contras:** sem `theme.extend` para **spacing**, **fontSize**, **borderRadius** alinhados ao doc; cores **ad hoc** em class strings além do config.

## Estilos duplicados

- Blocos “surface secundária” repetidos (ver §4 no doc de dependências).
- Containers `max-w-7xl` + padding repetidos.

## Anti-patterns visuais identificados

| Anti-pattern | Porquê importa |
|--------------|----------------|
| **Overrides massivos** `html:not(.dark) .brand-shell .text-white/…` | Manutenção difícil; fácil regressão |
| **Hex inline** paralelos a tokens | Rebrand exige grep global, não só config |
| **Cookie bar** fixa escura independente do tema | Quebra narrativa “light mode polish” |
| **Drift doc↔código** em tokens | Equipa segue docs errados |

## Débito técnico visual (resumo)

| Débito | Severidade |
|--------|------------|
| Falta de **font loading** explícito (`next/font`) | Média |
| Ausência de **componente layout** partilhado (`PageShell`) | Baixa-média |
| Duplicação `public/brand` vs `public/branding` | Média |
| Landing acoplada a CSS global | Alta para evolução de marca |

---

## Cruzamento: `tokens.md` vs `tailwind.config.ts` (exemplos)

| Token | Documentado (`docs/design-system/tokens.md`) | Código (`tailwind.config.ts` / `globals.css`) |
|-------|-----------------------------------------------|------------------------------------------------|
| Ink | `#050B08` | `#070A0D` (`ink`) / `--gh-ink: #070a0d` |
| Paper | `#F4FFF8` | `#F4F7F5` (`paper`) |
| Brand / Signal | `#32E875`, liga a `brand-500` | `brand.500` = `#2FBF8F` |

**Conclusão:** o rebranding deve **reconciliar** documentação e código numa única fonte de verdade (idealmente **tokens gerados** ou Tailwind como SSOT com docs gerados).

---

*Capítulo §7 do pedido.*

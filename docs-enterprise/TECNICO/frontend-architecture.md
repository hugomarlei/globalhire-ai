# Arquitetura de frontend

**Fontes canónicas:** [`docs/design-system/design-system-v2.md`](../../docs/design-system/design-system-v2.md), [`docs/design-system/components.md`](../../docs/design-system/components.md)

## Stack UI

- **Framework:** Next.js App Router (`app/`)
- **Estilo:** Tailwind + tokens (`globals.css`, design system em `docs/design-system/`)
- **Estado cliente:** React 19; providers (tema, idioma) em `components/`

## Rotas principais (grupos)

| Grupo | Propósito |
|-------|-----------|
| `(auth)/` | Login, cadastro, recuperação |
| `(app)/` | Área logada (dashboard, gerador, histórico, configurações, etc.) |
| Marketing/legal | Páginas estáticas e legais em `app/` |

## Tema e acessibilidade

- Dark/light — componentes documentados em auditorias UI: [`docs/ui-audit/ui-audit-v2.md`](../../docs/ui-audit/ui-audit-v2.md)
- Diretrizes enterprise de acessibilidade: [`PRODUTO/accessibility-guidelines.md`](../PRODUTO/accessibility-guidelines.md)

## Performance e bundles

- Revisões de performance: [`docs/audit/08_PERFORMANCE_AUDIT.md`](../../docs/audit/08_PERFORMANCE_AUDIT.md)

## Integração com analytics (cliente)

- Scripts: ver implementação referenciada em [`docs/ANALYTICS_SETUP.md`](../../docs/ANALYTICS_SETUP.md)

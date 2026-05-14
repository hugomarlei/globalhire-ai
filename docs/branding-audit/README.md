# Auditoria de identidade visual — GlobalHire AI

**Escopo:** mapeamento e documentação do estado **atual** do projeto (pós-RC documentado em [`docs/PREVIEW_QA_REPORT.md`](../PREVIEW_QA_REPORT.md)), **sem alterações** a código, Tailwind, CSS ou assets.

**Objetivo:** preparar uma futura **reformulação completa** da identidade visual com inventário, dependências, riscos e plano técnico.

## Documentos (relatório técnico por capítulos)

| Ficheiro | Conteúdo |
|----------|----------|
| [`01-resumo-executivo-e-sintese.md`](./01-resumo-executivo-e-sintese.md) | §1 Identidade atual + §9E resumo executivo + forças/fraquezas + ficheiros críticos (lista curta) |
| [`02-inventario-completo-de-arquivos.md`](./02-inventario-completo-de-arquivos.md) | §2 Inventário por categoria (Branding, Layout, Tailwind, …) |
| [`03-controles-mapa-dependencias.md`](./03-controles-mapa-dependencias.md) | §3 Onde cada aspecto visual é controlado + §4 Mapa de dependências + diagrama (mapa visual do projeto) |
| [`04-mudancas-recentes-e-build.md`](./04-mudancas-recentes-e-build.md) | §5 Últimas alterações importantes (RC + histórico Git relevante) |
| [`05-assets-open-graph-public.md`](./05-assets-open-graph-public.md) | §6 Assets, `/public`, OG/Twitter, logos |
| [`06-arquitetura-visual-e-divida.md`](./06-arquitetura-visual-e-divida.md) | §7 Arquitetura visual, design system em docs vs código, anti-patterns |
| [`07-plano-rebranding-e-checklist.md`](./07-plano-rebranding-e-checklist.md) | §8 Plano técnico + §9D checklist de rebranding + §9F riscos consolidados |

## Fontes canónicas já existentes (não substituir)

- [`docs/design-system/design-system-v2.md`](../design-system/design-system-v2.md)
- [`docs/design-system/tokens.md`](../design-system/tokens.md) — **nota:** existem divergências face ao `tailwind.config.ts` actual; ver capítulo 6 do relatório de arquitetura.
- [`docs/design-system/components.md`](../design-system/components.md)
- [`docs/ui-audit/ui-audit-v2.md`](../ui-audit/ui-audit-v2.md)
- [`docs/PREVIEW_QA_REPORT.md`](../PREVIEW_QA_REPORT.md)

**Data da auditoria:** 2026-05-12 (ficheiros analisados no workspace).

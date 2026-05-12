# GlobalHire AI — UI Audit V2

## Escopo

Análise visual e de risco sobre landing, navbar, pricing, dashboard, auth pages, mobile, footer e CTAs.

| Área | Severidade | Problema | Arquivo | Correção |
|---|---:|---|---|---|
| Logo/nav | Alta | Ícone anterior parecia placeholder e não comunicava carreira global | `components/nav.tsx` | Corrigido com símbolo globo + maleta |
| Hero | Média | Copy longa e estética com verde muito neon | `app/page.tsx` | Corrigido com tagline, subheadline mais madura e paleta refinada |
| Paleta | Alta | Verde neon dominante | `tailwind.config.ts`, `app/globals.css` | Corrigido para emerald/teal sóbrio |
| LinkedIn | Alta | Banner em dimensão errada e visual genérico | `public/branding/*` | Corrigido com 1128x191 V2 |
| OG image | Média | OG antigo parecia template e usava shield | `public/brand/og-image.svg` | Corrigido com OG V2 |
| Pricing | Baixa | Estrutura funcional, só precisava refinamento de destaque | `app/page.tsx` | Ajustado com sombra/borda controlada |
| Auth pages | Baixa | Fluxo preservado; visual herdará tokens | `app/(auth)/*` | Sem alteração funcional |
| Dashboard | Baixa | Fluxo preservado; logo/nav atualizados | `components/nav.tsx` | Corrigido parcialmente |
| Mobile | Média | Precisa validação visual real pós-build | manual | Pendente |
| Footer | Baixa | Links legais ok | `app/page.tsx` | Mantido |

## Riscos

- Necessário validar assets no LinkedIn real.
- Necessário conferir contraste em device real.
- Sem alteração em auth, Stripe, Supabase, Groq, banco ou webhooks.

# GlobalHire AI — Design System Tokens

**SSOT (código):** `tailwind.config.ts` + variáveis `--shell-*-rgb` em `app/globals.css` (`.brand-shell`) + `next/font` em `app/layout.tsx`.

**Tipografia:** `Inter` (`--font-sans`) para UI; `Fraunces` (`--font-display`) para títulos da **landing** (`font-display`).

## Core colors

| Token | HEX | Tailwind | Notas |
|-------|---:|----------|-------|
| Ink | `#06120F` | `ink` | Texto principal / fundo dark base |
| Graphite | `#0F1714` | `graphite` | Superfícies elevadas |
| Paper | `#F5F7F6` | `paper` | Fundo claro global |
| Brand (primary) | `#2A9B76` | `brand-500`, `mint` | Mint sofisticado (menos neon) |
| Cyber | `#5BA9BC` | `cyber` | Acento frio contido |
| Violet | `#7168D4` | `violet` | Secundário |
| Amber | `#C8943A` | `amber` | Destaque quente |
| Coral | `#D96B6B` | `coral` | Erro / alerta |

## Marketing shell (`shell.*`)

Usar **apenas** dentro de `.brand-shell` (landing). Os valores RGB vêm de `app/globals.css` e mudam com `html.dark`.

| Token Tailwind | Uso típico |
|----------------|------------|
| `text-shell-fg` | Títulos e corpo principal na landing |
| `text-shell-muted` | Subtítulos, parágrafos secundários |
| `text-shell-subtle` | Meta, disclaimers |
| `border-shell-line` | Linhas e contornos |
| `bg-shell-glass` | Painéis translúcidos leves |
| `bg-shell-band` | Faixas de secção |

## Radius

| Uso | Valor | Tailwind |
|-----|------|----------|
| Botões, inputs | 10–12px | `rounded-xl` |
| Cards | 12px | `rounded-xl` |
| Secções / cartões hero | 16px | `rounded-2xl` |

## Shadows

| Token | Descrição |
|-------|-----------|
| `shadow-soft` | Profundidade ambiente (sombra longa, opacidade moderada) |
| `shadow-glow` | Halo **restrito** em CTAs primários (brand) |

## Spacing (convénio)

- Secções landing: `py-24`–`py-28` (resp. `sm:`).
- Grelha marketing: `gap-5`–`gap-6`.
- Container horizontal: `max-w-7xl` + `px-4 sm:px-6`.

## Estados

- **Focus:** anel `brand-500` (`.focus-ring` em `globals.css`).
- **Disabled:** `opacity-60` em botões.
- **Erro:** superfície `coral/15` + texto `coral`.

## Mobile

- CTAs principais altura mínima confortável (`h-11` / `h-12` em landing).
- Inputs largura total em formulários estreitos.

---

*Última actualização: rebranding 2026-05-14 — alinhado ao código.*

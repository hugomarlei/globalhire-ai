# 6 — Assets, marca e metadata visual

## Duas pastas principais

| Pasta | Uso actual típico |
|-------|-------------------|
| [`public/brand/`](../../public/brand/) | **Metadata** em [`app/layout.tsx`](../../app/layout.tsx): verifica existência de `og-image.png` / `og-image.svg`, `favicon.ico` / `favicon.svg` e define `metadata.openGraph.images`, `twitter.images`, `icons`. |
| [`public/branding/`](../../public/branding/) | **UI runtime:** logos em [`components/nav.tsx`](../../components/nav.tsx) (`/branding/logo-symbol.svg`), SVGs v2 (OG, LinkedIn banner), backups `_backup-before-v2/`. |

**Risco para rebranding:** duplicação de “verdade” — alguém pode actualizar um logo numa pasta e esquecer a outra.

## Logos e símbolos

| Ficheiro | Uso |
|----------|-----|
| `public/branding/logo-symbol.svg` | Nav pública e app (`next/image` 36×36) |
| `logo-horizontal.svg`, `logo-vertical.svg`, `logo-monochrome.svg` | Materiais / futuro; não vistos no grep de páginas core |
| `public/brand/README.md` | Lista **nomes esperados** (`logo.png`, `icon.png`, etc.) — vários **ainda opcionais** |

## Favicons

- Resolução dinâmica em `app/layout.tsx`: preferência `.ico` em `/brand/`, senão `.svg`.
- Existe também `public/branding/favicon.svg` (paralelo ao set branding).

## Open Graph e Twitter

- Definidos em **`app/layout.tsx`** com URLs relativas a `/brand/...`.
- **`public/brand/og-image.svg`** presente.
- **`public/branding/og-image-v2.svg`** — verificar se algum sistema externo referencia; o layout **não** aponta automaticamente para `/branding/`.

## Banners

- `public/branding/linkedin-banner-v2.svg` (+ backups) — uso **fora** da app web típica (LinkedIn empresa).

## Imagens raster

- `logo.png`, `og-image.png`, etc. — opcionais segundo `public/brand/README.md`; `layout.tsx` usa PNG se existir.

## Elementos gráficos inline

- **TikTok** path SVG em [`components/site-footer.tsx`](../../components/site-footer.tsx).
- **Ícones** restantes via `lucide-react`.

## Centralização recomendada (rebranding)

1. **Uma pasta canónica** por ambiente: ex. `public/brand/` para *tudo* o que `metadata` consome + **symlink** ou build step para logos UI — ou um único módulo `lib/brand-assets.ts` com constantes de path.
2. **Versionamento** de OG (`og-image-v3`) com **uma** referência em `layout.tsx`.
3. **Eliminar ou arquivar** `_backup-before-v2` da árvore de produção se não forem necessários (reduz confusão).

## O que parece “antigo” vs “v2”

- Nome `_backup-before-v2` e ficheiros `*-v2.svg` sugerem **migração de identidade** já iniciada; o código de nav usa **logo-symbol** actual (verificar visualmente se corresponde ao v2).

## Inconsistências

- `docs/design-system/tokens.md` **não bate** com `tailwind.config.ts` (ver capítulo 7).
- Dois caminhos OG (`/brand/` vs ficheiros em `/branding/`) podem divergir em futuras campanhas.

---

*Capítulo §6 do pedido; alinhar com [`02-inventario-completo-de-arquivos.md`](./02-inventario-completo-de-arquivos.md) (categoria SEO/Public).*

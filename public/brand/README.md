# GlobalHire AI — public brand assets

Canonical **Orbital Case** raster set consumed by the app and metadata (`app/layout.tsx`, `lib/brand-assets.ts`, `app/icon.png`).

| File | Role |
|------|------|
| `icon-mark-1024.png` | Master mark (source for other sizes). |
| `icon-mark-512.png` | OG / JSON-LD logo URL, large placements. |
| `icon-mark-192.png` | Navigation + compact UI (`next/image`). |
| `og-image.png` | Open Graph + Twitter card (1200×630). |
| `favicon-16.png` / `favicon-32.png` | Browser tab icons. |
| `apple-touch-icon.png` | iOS home screen (180×180). |
| `favicon.svg` / `og-image.svg` | Legacy vector fallbacks if PNG missing. |

Marketing-only exports (LinkedIn banner, IG templates, etc.) live under `docs/brand/exports/`. Regenerate those from **`icon-mark-1024.png`** when updating campaigns so everything stays visually unified.

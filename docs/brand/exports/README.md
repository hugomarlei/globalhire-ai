# GlobalHire AI — Export-ready media pack

**Scope:** Marketing and social assets only. **No application code** was changed to produce this pack.

**Disclaimer:** Raster assets were produced with AI image generation and macOS `sips` resizing/cropping. Have design/legal review before trademark filings or paid media. Prefer redrawing the **Orbital Case** mark in vector (Figma/Illustrator) for absolute sharpness at all sizes.

**Canonical mark (post-rollout):** the live product uses **`public/brand/icon-mark-*.png`** as the single source of truth. This folder includes **`UNIFIED-*.png`** copies of that mark, favicon, and OG image for design archives. Regenerate social templates from `UNIFIED-icon-mark-1024.png` when refreshing campaigns.

| File | Notes |
|------|--------|
| `UNIFIED-icon-mark-1024.png` | Same bytes as `public/brand/icon-mark-1024.png`. |
| `UNIFIED-og-image-1200x630.png` | Same as `public/brand/og-image.png`. |
| `UNIFIED-favicon-32.png` / `UNIFIED-favicon-16.png` | Same as `public/brand/favicon-*.png`. |

---

## Folder layout

| Path | Contents |
|------|----------|
| This folder (`exports/`) | **Production-oriented** PNGs: platform-sized `FINAL-*` files, favicons, logo lockups, brand presentation slides. |
| `_ai-masters/` | Original **1536×1024** AI outputs used as sources before crop/scale (archive / design reference). |

---

## Primary deliverables (exact or target pixels)

| File | Size | Use |
|------|------|-----|
| `linkedin-banner-FINAL-1584x396.png` | **1584 × 396** | LinkedIn company / personal banner |
| `linkedin-profile-FINAL-400x400.png` | **400 × 400** | LinkedIn profile photo |
| `instagram-profile-FINAL-1080x1080.png` | **1080 × 1080** | Instagram profile (downscale in-app if needed) |
| `ig-post-FINAL-ats-tips-1080.png` | **1080 × 1080** | Feed template — ATS tips |
| `ig-post-FINAL-ai-hiring-insights-1080.png` | **1080 × 1080** | Feed template — AI hiring insights |
| `ig-post-FINAL-product-announcement-1080.png` | **1080 × 1080** | Feed template — product announcement |
| `ig-post-FINAL-motivational-career-1080.png` | **1080 × 1080** | Feed template — motivational / career |
| `ig-story-FINAL-01-1080x1920.png` | **1080 × 1920** | Story template A |
| `ig-story-FINAL-02-1080x1920.png` | **1080 × 1920** | Story template B |
| `tiktok-profile-FINAL-1080x1080.png` | **1080 × 1080** | TikTok profile (high-res source; platform may crop) |
| `tiktok-cover-FINAL-1920x1080.png` | **1920 × 1080** | TikTok-style horizontal cover / video header |
| `tiktok-thumbnail-FINAL-1920x1080.png` | **1920 × 1080** | Video thumbnail composition |
| `og-image-FINAL-1200x630.png` | **1200 × 630** | Open Graph / link previews |
| `website-hero-FINAL-1920x1080.png` | **1920 × 1080** | Hero / landing / deck widescreen mockup |
| `app-icon-FINAL-1024x1024.png` | **1024 × 1024** | App Store / Play master (apply platform mask in store consoles) |
| `brand-presentation-FINAL-dark-1920x1080.png` | **1920 × 1080** | Dark-mode brand slide |
| `brand-presentation-FINAL-light-1920x1080.png` | **1920 × 1080** | Light-mode brand slide |

---

## Logo lockups (raster reference)

| File | Notes |
|------|--------|
| `logo-primary-horizontal-lockup.png` | Horizontal mark + wordmark (AI raster; trace to SVG for production). |
| `logo-secondary-stacked-lockup.png` | Stacked / vertical emphasis lockup. |

---

## Favicon set

| File | Use |
|------|-----|
| `favicon-mono-16x16.png` / `favicon-mono-32x32.png` | Monochrome mark from dedicated mono **512** master (AI-simplified strokes). |
| `favicon-emerald-accent-16x16.png` / `favicon-emerald-accent-32x32.png` | Emerald-accent variant from emerald **512** master. |
| `favicon-from-appicon-16x16.png` / `favicon-from-appicon-32x32.png` | Downscaled from **`app-icon-FINAL-1024x1024.png`** — often cleaner if the app icon matches web favicon. |

**ICO / SVG:** Convert in your asset pipeline (e.g. RealFaviconGenerator, Figma export) if the product later wires these into the Next app.

---

## Pipeline notes

1. AI images were generated at **1536 × 1024** (model canvas).  
2. **`FINAL-*`** files were produced with **`sips`** (`--resampleWidth` / `--resampleHeight` + **`-c`** center crop) to match standard social and product dimensions.  
3. Cropping may remove peripheral composition; adjust in Figma if you need different framing.

---

## Not included (by design)

- Vector source (`.svg`) — commission from `GLOBALHIRE_AI_PREMIUM_BRAND_SYSTEM.md` geometry spec.  
- Lottie / MP4 “animated feel” for stories — export video/motion separately.  
- ICO pack — generate from favicon PNGs when wiring the site.

---

## Related documentation

- `docs/brand/GLOBALHIRE_AI_PREMIUM_BRAND_SYSTEM.md` — full brand system and future implementation rules.

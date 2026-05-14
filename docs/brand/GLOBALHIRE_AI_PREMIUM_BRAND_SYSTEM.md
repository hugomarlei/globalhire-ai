# GlobalHire AI — Complete Premium Brand System (Creative Phase)

**Status:** Concept & specification only — not tied to any assets in the current codebase.  
**Purpose:** Investor- and production-ready creative direction before UI implementation.

**Concept render (AI-generated reference, not final trademark art):**  
`docs/brand/globalhire-ai-primary-logo-concept.png` — use as mood / geometry reference; designers should redraw in vector to match §4 construction.

---

## 1. Positioning line (internal)

**“Premium AI infrastructure for global careers.”**

Instant signals: international mobility, ATS-grade rigor, executive calm, enterprise trust, frontier technology without gimmick.

---

## 2. Brand pillars (what every touchpoint must prove)

| Pillar | Expression |
|--------|------------|
| International careers | Scale, clarity, neutral “global” typography, no regional kitsch |
| AI-powered recruitment | Precision geometry, subtle motion, data-light glow — not “robot brains” |
| ATS optimization | Structure, grid, measurable rhythm — “engineered clarity” |
| Executive professionalism | Restraint, depth, high contrast, generous whitespace |
| Global mobility | Orbit arcs, meridian curves, implied trajectory — abstract only |
| Elite technology | Monochrome discipline + one accent; no decoration for its own sake |
| Trust | Stable lockups, predictable spacing, WCAG-minded contrast targets |
| Premium SaaS | Glass layers, soft specular highlights, cinematic depth on black |

---

## 3. Reference blend (mood, not imitation)

| Reference | Borrow |
|-----------|--------|
| Stripe | Systematic spacing, documentation-grade clarity, restrained green |
| Linear | Sharp type hierarchy, minimal chrome, purposeful motion |
| Apple | Icon reducibility, single-mark confidence, product-first framing |
| Revolut | Bold black base, premium fintech discipline |
| Deel | Global workforce sobriety, enterprise calm |
| Arc Browser | Soft depth, spatial UI, subtle gradients |
| OpenAI Enterprise | Serious AI infra tone — intelligence as infrastructure |

**Avoid:** neon cyberpunk, literal globes with pins, cartoon people, suitcase clipart, rainbow mesh gradients, “HR handshake” stock, Canva-style badge logos.

---

## 4. Main logo concept — “Orbital case”

### 4.1 Narrative

One symbol: a **compressed globe** suggested by **two meridian arcs** (not a full sphere outline) fused with a **single vertical case silhouette** formed by **negative space** between the arcs. A **thin orbital ring** clips the form at one corner — implying movement and global reach without depicting a map.

**Read at small size:** reads as a **rounded lozenge or squircle** with a **bright emerald seam** (accent) and **white or off-white** primary stroke on dark, or **deep black** mark on light.

### 4.2 Construction (for designers)

- **Grid:** 24 × 24 unit keyline; icon lives in 20 × 20 safe area (favicon padding).
- **Stroke:** 1.5–2px equivalent at 24px export; optically thicker at 16px favicon (2–2.25px).
- **Globe component:** Two elliptical arcs (longitude), asymmetric — shorter arc left, longer arc right, suggesting rotation.
- **Suitcase component:** A vertical rectangle with **one chamfered corner** (top-right) only — suggests executive luggage, not a box icon.
- **Orbital element:** Single 270° arc offset 15° from horizontal; does not close into a full ring — implies trajectory.
- **Merge rule:** Arcs **define** the case edges; the case is not drawn as a second object on top.

### 4.3 Variants

| Variant | Use |
|---------|-----|
| **Primary** | Full color on deep black or charcoal: mark + wordmark “GlobalHire” + “AI” in lighter weight or smaller optical size |
| **Secondary** | Mark + wordmark horizontal; tighter letterspacing on “GlobalHire” |
| **Monochrome** | White on black / black on white — no emerald, test at 16px |
| **App icon** | Mark only inside rounded square (iOS/Android); no wordmark |
| **Favicon** | Monochrome mark only, 32×32 and 16×16 with simplified arc count if needed |

### 4.4 Wordmark

- **Grotesk neo-grotesk:** Inter, SF Pro, or Neue Haas Grotesk / similar.
- **“GlobalHire”:** Semibold 600; **“AI”:** Medium 500, +2–4% letterspacing, baseline-aligned or superscript-style micro shift (1–2px up) — optional, must stay legible at small sizes.

---

## 5. Color system

### 5.1 Core

| Token | Role | Suggested hex (starting point) |
|-------|------|-------------------------------|
| `void` | Primary background | `#030304` – `#0A0B0C` |
| `surface` | Elevated panels | `#111114` at 72–88% opacity over void |
| `border-subtle` | Hairlines | `rgba(255,255,255,0.06–0.10)` |
| `text-primary` | Headlines | `#F4F4F5` |
| `text-secondary` | Body | `#A1A1AA` |

### 5.2 Accent — premium emerald

| Token | Role | Suggested hex |
|-------|------|---------------|
| `emerald` | Primary accent | `#10B981` (tune to `#0D9488`–`#059669` for less “web default”) |
| `emerald-glow` | Soft bloom | `radial-gradient` 40–60% opacity, blur 48–120px |
| `emerald-line` | Focus rings, key CTAs | 1px solid + outer glow 8px |

**Rule:** Emerald is **signal**, not fill — lines, small fills, progress, active states. Large emerald fields only for hero gradients **mixed with black** (5–15% opacity stops).

### 5.3 Gradients (allowed, restrained)

- **Hero:** `linear-gradient(165deg, #030304 0%, #0B1A16 45%, #030304 100%)` — barely visible green in shadow corner.
- **Glass:** `backdrop-filter: blur(20–40px)` + `background: rgba(255,255,255,0.03–0.06)`.

---

## 6. Typography scale (web / deck)

| Level | Weight | Size (desktop) | Usage |
|-------|--------|----------------|--------|
| Display | 600–700 | 56–72px | Hero only |
| H1 | 600 | 40–48px | Page titles |
| H2 | 600 | 28–32px | Sections |
| H3 | 500–600 | 20–24px | Cards |
| Body | 400–450 | 15–17px | UI body (Inter 16px default) |
| Caption | 450–500 | 12–13px | Meta, labels |
| Mono (optional) | 400 | 12–14px | ATS / “system” hints only |

**Tracking:** Tighten display -1% to -2%; body neutral.

---

## 7. Visual language — UI & marketing

- **Lighting:** Single key light from top-left; soft rim on glass cards; no harsh spotlight cones.
- **Texture:** Optional 2–4% noise overlay on black for “cinema” depth — never on text.
- **Photography (if used):** Abstract architecture, night city bokeh as extreme background blur only — no literal “airport” shots.
- **Iconography (UI):** Stroke 1.5px, rounded caps, same grid as logo — **do not** reuse logo strokes inside UI icons (different family).

---

## 8. Asset specifications (create in Figma / design export)

All dimensions are **pixel** unless noted. Export **SVG** for logo where possible; **PNG @2x** for raster social.

### 1. Primary logo  
Full color horizontal lockup — min width **180px** digital; print vector unlimited.

### 2. Secondary logo  
Stacked lockup (mark above wordmark) — min height **96px** for app splash / narrow headers.

### 3. Monochrome version  
Black on white + white on black — register with legal/comms.

### 4. App icon  
**1024×1024** master; deliver **iOS** rounded mask preview + **Android** adaptive foreground.

### 5. Favicon  
**32×32**, **16×16**; optional **48×48**; SVG favicon if supported.

### 6. LinkedIn banner  
**1584×396** — mark left, headline + one line subcopy right, safe zone left **72px**, bottom **48px** (UI chrome).

### 7. LinkedIn profile image  
**400×400** — mark centered, 10% padding inside circle crop preview.

### 8. Instagram profile image  
**320×320** minimum (display 110); use same master as LinkedIn profile.

### 9. Instagram post templates  
**1080×1080** (feed); templates: announcement, quote, feature card, ATS tip — **safe title zone** top 200px, bottom 140px for UI overlay on mobile.

### 10. Instagram story templates  
**1080×1920** — top 250px and bottom 320px **safe** (thumb UI); vertical gradient void → deep emerald haze.

### 11. TikTok profile branding  
**200×200** visible; prepare **20%** inner padding for ring crop.

### 12. TikTok cover assets  
**horizontal video thumbnail style** **1920×1080** master; text in center third; test on mobile crop.

### 13. Open Graph image  
**1200×630** — mark + one headline + optional subline; **file < 8MB**; contrast AAA for white text on dark.

### 14. Website hero branding mockup  
Full-width **1440–1920** artboard: headline, subcopy, single CTA, glass dashboard silhouette (abstract), emerald accent line — **no real product screenshot** in concept phase unless approved.

### 15. Dark mode brand presentation  
**16:9** slides (1920×1080): cover, pillars, color, type, logo grid, wrong vs right, social strip.

### 16. Light mode brand presentation  
Same structure on **#FAFAFA** background; mark uses **void** fill; emerald unchanged or slightly darkened (+4% saturation) for contrast.

---

## 9. Motion (future implementation hint only)

- **Duration:** 180–320ms UI; 600–900ms hero reveals.
- **Easing:** `cubic-bezier(0.22, 1, 0.36, 1)` (ease-out-expo class).
- **Logo:** Orbital arc may **rotate 3–6°** on load once — no perpetual spin.

---

## 10. Legal & trademark note

Before public launch: trademark search on “GlobalHire” / “GlobalHire AI” in target jurisdictions; logo distinctiveness review.

---

## 11. Future implementation rule (locked)

When this system is **approved** and applied to the product:

- **Preserve:** all business logic, auth, Stripe, Supabase, i18n, ATS tools, dashboards, analytics, forms, onboarding, responsiveness, SEO structure, accessibility, routing, APIs, production stability.
- **Improve:** UI, UX, spacing, typography, hierarchy, component aesthetics, animations, brand consistency, modern SaaS appearance.
- **Do not:** break features, remove translations, alter functional flows without need, destabilize production, rewrite business logic unnecessarily, remove integrations.

Treat rollout as a **world-class visual evolution** of a working platform.

---

## 12. Deliverable checklist for design team

- [ ] Master Figma file: logo construction + all variants  
- [ ] Color & type styles as variables  
- [ ] Social template pages (IG/TikTok/LinkedIn)  
- [ ] OG + favicon export batch  
- [ ] Light + dark brand deck PDF for investors  
- [ ] Handoff doc: spacing tokens, radius scale (e.g. 8/12/16/24), elevation shadows  

---

## 13. Exported media pack (raster production)

**Location:** `docs/brand/exports/`  

**Index:** `docs/brand/exports/README.md` — lists every `FINAL-*` PNG (LinkedIn, Instagram posts/stories, TikTok, OG, hero mockup, app icon, favicon variants, dark/light brand slides), logo lockups, `_ai-masters/` source frames, and **`UNIFIED-*`** copies of the canonical `public/brand` mark.  

The marketing pack was first produced without app wiring; **§14** documents the live product integration.

---

## 14. Web product rollout (implemented)

The Next.js app now consumes **`public/brand/`** for OG, favicons, Apple touch icon, **`app/icon.png`** / **`app/apple-icon.png`**, and navigation mark (`lib/brand-assets.ts`). Design tokens in **`app/globals.css`** and **`tailwind.config.ts`** follow the void + teal emerald system aligned with the brand presentations. **Fraunces** was removed from the root layout; **display** and **sans** both use **Inter** for a single premium grotesk stack.

---

*Document version: 1.2 — web rollout wired to `public/brand` + unified tokens.*

# Marketing tracking — GlobalHire AI

Camada leve de UTMs, eventos de growth e landing pages. Sem CMS, sem backend extra.

## Visão geral

| Peça | Onde |
|------|------|
| Captura UTM (first-touch) | `lib/utm.ts` + `components/utm-capture.tsx` (root layout) |
| Envio de eventos | `lib/analytics.ts` → PostHog, GA4, Clarity (com consentimento) |
| Landing pages | `/lp/curriculo-ats`, `/lp/curriculo-rejeitado`, `/lp/conseguir-entrevista` |
| Conteúdo das LPs | `lib/lp-content.ts` |

Persistência: **localStorage** (`globalhire-attribution`). Só a **primeira** visita com UTM ou referrer grava dados; visitas seguintes não sobrescrevem.

## UTMs — campos

| Campo | Origem |
|-------|--------|
| `utm_source` | Query `utm_source` ou `referral` se só houver referrer |
| `utm_medium` | Query `utm_medium` ou `referral` |
| `utm_campaign` | Query `utm_campaign` |
| `utm_content` | Query `utm_content` |
| `utm_term` | Query `utm_term` |
| `referrer` | Host + path do `document.referrer` (sanitizado, sem query) |
| `landing_page` | Path da primeira página capturada (ex.: `/lp/curriculo-ats`) |

Esses campos são anexados automaticamente a **todos** os `trackEvent()` via `getAttributionProperties()`.

## Como gerar links de campanha

Base de produção (exemplo):

`https://globalhireai.com.br`

### Landing + cadastro

```
https://globalhireai.com.br/lp/curriculo-ats?utm_source=linkedin&utm_medium=social&utm_campaign=curriculo-ats&utm_content=post-maio
```

CTAs internos das LPs já acrescentam:

`utm_source=lp&utm_medium=landing&utm_campaign=<slug>&utm_content=hero`

### Home ou pricing

```
https://globalhireai.com.br/pricing?utm_source=google&utm_medium=cpc&utm_campaign=brand-search&utm_term=curriculo+ats
```

### Regras práticas

- **utm_source** — canal (`google`, `linkedin`, `newsletter`, `lp`)
- **utm_medium** — tipo (`cpc`, `social`, `email`, `landing`)
- **utm_campaign** — campanha (`curriculo-ats-maio`, `black-friday`)
- **utm_content** — criativo (`hero`, `carousel-1`)
- **utm_term** — palavra-chave paga (opcional)

Use sempre **minúsculas** e **hífens** (sem espaços) para facilitar filtros no PostHog/GA4.

## Eventos de growth (mínimos)

| Evento | Quando dispara | Onde no código |
|--------|----------------|----------------|
| `signup_started` | Início cadastro (senha ou OAuth) | `cadastro/page.tsx`, `social-auth-buttons.tsx` |
| `signup_completed` | Cadastro concluído | `cadastro/page.tsx` |
| `resume_upload_completed` | Upload PDF/DOCX com texto extraído | `ats-analyzer.tsx`, `dashboard-generator.tsx` |
| `ats_score_generated` | Score/otimização ATS concluída | `ats-analyzer.tsx` |
| `checkout_started` | Clique em upgrade → Stripe Checkout | `upgrade-plans.tsx` |
| `subscription_completed` | Retorno `?checkout=success` no dashboard | `analytics-scripts.tsx` |

Eventos auxiliares (já existentes): `page_view`, `lp_viewed`, `lp_cta_clicked`, `resume_uploaded` (legado), `checkout_completed` (legado), `share_linkedin_clicked`, `share_whatsapp_clicked`, `share_text_copied` (banner `/?logout=success`, `location: logout_success_banner`).

**Produção:** scripts de analytics só carregam com consentimento (`globalhire-cookie-consent` = `all` ou `accepted`) e `NODE_ENV=production`.

## Onde ver os dados

| Ferramenta | O que ver |
|------------|-----------|
| **PostHog** | Events → filtrar por nome; breakdown por `utm_source`, `utm_campaign`, `lp_slug` |
| **GA4** | Relatórios → Engajamento → Eventos; explorar parâmetros customizados do evento |
| **Clarity** | Sessões + eventos custom (`clarity("event", ...)`) |

Não há dashboard interno no app — use os painéis dos provedores.

## Criar nova campanha (checklist)

1. Definir `utm_source`, `utm_medium`, `utm_campaign` (e opcionalmente `content` / `term`).
2. Montar URL final (LP ou home) com query string.
3. Testar em janela anônima: aceitar cookies analytics → verificar no PostHog Live events que `lp_viewed` ou `page_view` traz UTMs.
4. Acompanhar funil: `lp_viewed` → `signup_started` → `signup_completed` → `resume_upload_completed` → `checkout_started` → `subscription_completed`.

## Criar nova landing page

1. Adicionar entrada em `lib/lp-content.ts` (`LpSlug` + objeto em `lpPages`).
2. Criar `app/lp/<slug>/page.tsx` (copiar uma LP existente e trocar a chave).
3. Opcional: campanha padrão no CTA via `buildCadastroHref(slug, "hero")` (já usado em `MarketingLanding`).
4. Deploy; validar SEO (`metadata`) e mobile.

## Exemplos reais

**LinkedIn orgânico → LP rejeitado**

```
/lp/curriculo-rejeitado?utm_source=linkedin&utm_medium=social&utm_campaign=rejeitado-maio
```

**Google Ads → cadastro direto**

```
/cadastro?utm_source=google&utm_medium=cpc&utm_campaign=ats-br&utm_term=curriculo+ats
```

**Newsletter**

```
/lp/conseguir-entrevista?utm_source=newsletter&utm_medium=email&utm_campaign=nl-012
```

## Privacidade

- UTMs e paths **não** incluem e-mail, CV ou tokens.
- `lib/analytics.ts` sanitiza propriedades sensíveis antes de enviar.
- Clarity mascara campos com `data-clarity-mask="true"`.

## Variáveis de ambiente (analytics)

| Variável | Uso |
|----------|-----|
| `NEXT_PUBLIC_POSTHOG_KEY` | PostHog |
| `NEXT_PUBLIC_POSTHOG_HOST` | Host PostHog (opcional) |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | GA4 (`G-XXXXXXXX`) |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | Microsoft Clarity |

Sem essas variáveis, o app funciona; apenas não há envio externo.

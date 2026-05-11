# 6. Auditoria Analytics

## Camada central

Arquivo: `lib/analytics.ts`

Status: IMPLEMENTADO

- `trackEvent()`: envia eventos para GA4, PostHog e Clarity.
- `sanitizeProperties()`: remove chaves sensíveis.
- `identifyUser()`: usa anonymous internal ID, não e-mail.
- `resetAnalytics()`: reset PostHog.

## Scripts

Arquivo: `components/analytics-scripts.tsx`

Status: IMPLEMENTADO/PARCIAL

- GA4 via `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
- Clarity via `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
- PostHog via `NEXT_PUBLIC_POSTHOG_KEY` e `NEXT_PUBLIC_POSTHOG_HOST`.
- Carrega apenas em produção.
- Carrega apenas após consentimento analytics.
- `send_page_view` automático do GA4 está desativado; page_view é manual.
- PostHog autocapture e session recording desativados.
- Clarity masking automático aplicado a campos sensíveis.

## Consentimento

Arquivo: `components/cookie-consent.tsx`

Status: IMPLEMENTADO

- Consentimento salvo em `localStorage`.
- Valores: `all` e `essential`.
- Evento `globalhire:cookie-consent` atualiza scripts.
- Link no footer abre preferências.

## Eventos implementados

- `page_view`
- `signup_started`
- `signup_completed`
- `login_started`
- `login_completed`
- `resume_uploaded`
- `job_description_added`
- `resume_generated`
- `cover_letter_generated`
- `linkedin_summary_generated`
- `recruiter_message_generated`
- `interview_prep_generated`
- `translation_generated`
- `ats_score_generated`
- `checkout_started`
- `checkout_completed`
- `subscription_updated`
- `subscription_canceled`
- `plan_limit_reached`
- `generation_failed`
- `ats_analysis_failed`
- `export_pdf_clicked`
- `document_regenerated`

## Funil recomendado

1. `page_view` `/`.
2. `signup_started`.
3. `signup_completed`.
4. `resume_uploaded` ou texto colado.
5. `job_description_added`.
6. `resume_generated` ou `ats_score_generated`.
7. `plan_limit_reached`.
8. `upgrade_clicked`.
9. `checkout_started`.
10. `checkout_completed`.
11. `subscription_updated`.

## Riscos

- Analytics precisa ser testado em produção porque `NODE_ENV=production` e consentimento são requisitos.
- `Clarity` mesmo com masking deve ser revisado visualmente para garantir que outputs não sejam capturados.
- Eventos não devem incluir IDs Stripe, e-mail ou texto livre.

## Pendências

- Criar dashboard de funil no GA4/PostHog.
- Confirmar consent mode avançado se campanhas Google Ads forem usadas.
- Criar política operacional de revisão de eventos antes de adicionar novos campos.

# Analytics Setup — GlobalHire AI

Status: IMPLEMENTADO  
Última revisão: 2026-05-11

## Visão geral

A GlobalHire AI suporta Google Analytics 4, Microsoft Clarity e PostHog no frontend Next.js. Todos os scripts são carregados somente quando:

- `NODE_ENV` é `production`;
- a respectiva variável pública existe;
- o usuário aceitou analytics no banner LGPD.

## Variáveis Vercel

```bash
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

## Consentimento

O consentimento é salvo em `localStorage` com a chave `globalhire-cookie-consent`.

- `all`: analytics liberado.
- `essential`: analytics bloqueado.
- valor ausente: banner exibido.

O evento browser `globalhire:cookie-consent` sincroniza scripts após mudança de preferência.

## Google Analytics 4

GA4 usa `NEXT_PUBLIC_GA_MEASUREMENT_ID` e `gtag`.

Configuração:

- carregamento via `next/script`;
- `send_page_view: false`;
- `anonymize_ip: true`;
- `page_view` manual no App Router;
- sem query string no path enviado.

## Microsoft Clarity

Clarity usa `NEXT_PUBLIC_CLARITY_PROJECT_ID`.

Proteções:

- carregamento somente pós-consentimento;
- mascaramento automático de `textarea`, upload, e-mail, senha, telefone, endereço, token, billing, profile e payment;
- elementos com documentos gerados usam `data-clarity-mask="true"`.

## PostHog

PostHog usa `NEXT_PUBLIC_POSTHOG_KEY` e `NEXT_PUBLIC_POSTHOG_HOST`.

Configuração:

- `capture_pageview: false`;
- `autocapture: false`;
- `disable_session_recording: true`;
- `person_profiles: "identified_only"`;
- identificação por anonymous internal ID, não por e-mail.

## Dados proibidos em analytics

Nunca enviar:

- currículo completo;
- descrição de vaga;
- e-mail;
- telefone;
- endereço;
- token;
- dados de pagamento;
- dados de cobrança;
- conteúdo gerado por IA.

Eventos devem conter apenas metadados seguros como tipo de ferramenta, plano, idioma, país, status e buckets.

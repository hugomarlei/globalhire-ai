# GlobalHire AI - Analytics Stack

Status: IMPLEMENTADO/PARCIAL.

## Providers

- Google Analytics 4.
- Microsoft Clarity.
- PostHog.

## Consentimento

Analytics só deve carregar após consentimento do usuário no banner LGPD.

## Dados Proibidos em Eventos

- currículo;
- descrição de vaga;
- documento gerado;
- e-mail;
- telefone;
- endereço;
- tokens;
- dados de pagamento.

## Eventos Principais

- `page_view`
- `signup_started`
- `signup_completed`
- `login_started`
- `login_completed`
- `resume_generated`
- `ats_score_generated`
- `checkout_started`
- `checkout_completed`
- `subscription_updated`
- `plan_limit_reached`

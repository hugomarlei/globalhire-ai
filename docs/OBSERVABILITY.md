# GlobalHire AI - Observability

Status: IMPLEMENTADO/PARCIAL.

## Analytics

- GA4 preparado.
- Microsoft Clarity preparado.
- PostHog preparado.
- Scripts carregam somente com consentimento analytics.

## Logs

Logs técnicos existem para:

- geração IA;
- sync Stripe;
- rate limit;
- Turnstile;
- exclusão granular;
- webhook Stripe.

## Regras de Privacidade

Não logar:

- currículos;
- descrições de vaga;
- documentos gerados;
- e-mails completos;
- tokens;
- dados de pagamento.

## Sentry

Status: PENDENTE.

Variáveis documentadas, mas SDK formal ainda não instalado. Antes de instalar, configurar scrub de PII.

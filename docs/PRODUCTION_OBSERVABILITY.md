# Production Observability — GlobalHire AI

Status: PARCIAL  
Última revisão: 2026-05-11

## Camadas implementadas

- GA4: métricas agregadas e aquisição.
- PostHog: funil de produto com autocapture desligado.
- Microsoft Clarity: sessão/heatmap pós-consentimento com masking.
- Logs server-side: webhook Stripe, IA, upload, assinatura e erros relevantes.
- Sentry: variáveis preparadas, SDK não obrigatório se DSN estiver vazio.

## Proteções de privacidade

- Analytics só carrega pós-consentimento.
- Scripts só carregam em produção.
- Conteúdos sensíveis são mascarados por `data-clarity-mask`.
- `trackEvent()` sanitiza propriedades.
- Eventos não devem conter conteúdo de currículo, vaga ou IA.

## Monitoramento mínimo recomendado

1. Vercel: build failures, function errors, usage e domains.
2. Supabase: auth errors, database errors e RLS.
3. Stripe: webhook failures, failed payments e subscription updates.
4. GA4/PostHog: queda em signup, geração, checkout e upgrade.
5. Clarity: erros visuais e rage clicks, sem capturar conteúdo sensível.
6. Sentry: ativar quando o DSN estiver definido e antes de tráfego pago.

## Alertas manuais recomendados

- Webhook Stripe falhando.
- Aumento de `generation_failed`.
- Aumento de `plan_limit_reached` sem upgrade.
- Queda de `checkout_completed`.
- Erros em upload PDF/DOCX.
- Aumento de usuários presos em `/login`.

## Pendente

- Definir orçamento e retenção no PostHog/Clarity/GA4.
- Configurar Sentry SDK se for usado oficialmente.
- Criar dashboard operacional semanal.
- Criar playbook de incidente de analytics/privacidade.

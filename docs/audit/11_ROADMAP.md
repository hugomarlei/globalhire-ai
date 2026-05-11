# 11. Roadmap

## Curto prazo — 1 a 2 semanas

- Monitorar headers de segurança e CSP após deploy em produção.
- Aplicar `supabase/schema.sql` atualizado em produção para alinhar `usage_limits` Starter com 10 usos/mês.
- Validar GA4/PostHog/Clarity em produção com consentimento.
- Configurar Google OAuth verification com URLs legais.
- Confirmar Stripe live mode com Price IDs `price_`.
- Criar assets reais de marca: favicon e OG image.
- Revisar `ADMIN_BYPASS_EMAILS` antes do lançamento público.
- Criar rotina manual de backup Supabase.

## Médio prazo — 1 a 2 meses

- Evoluir rate limit Supabase para RPC transacional ou Redis se o volume crescer.
- Implementar Sentry com scrub de PII.
- Criar `audit_logs` persistente.
- Criar exclusão granular de documentos.
- Implementar paginação server-side em histórico.
- Criar dashboards PostHog/GA4 para funil de produto.
- Formalizar SLA LGPD e fluxo de atendimento.
- Revisar DPAs dos fornecedores.

## Longo prazo — 3 a 6 meses

- Criar governança formal de IA.
- Preparar GDPR/PIPEDA para expansão internacional.
- Implementar encryption-at-rest adicional para campos sensíveis se necessário.
- Criar plano de disaster recovery testado.
- Criar painel financeiro/admin mais robusto.
- Evoluir arquitetura para jobs/background processing.
- Avaliar storage dedicado para documentos.

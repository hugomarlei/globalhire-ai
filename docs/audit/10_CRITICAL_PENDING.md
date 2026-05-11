# 10. Pendências Críticas

| Prioridade | Severidade | Item | Impacto | Urgência | Recomendação |
|---:|---|---|---|---|---|
| 1 | Alta | Headers/CSP ausentes | Reduz proteção contra XSS, clickjacking e abuso de browser | Antes de tráfego pago | Implementar headers em `next.config.ts`. |
| 2 | Alta | Retenção de dados profissionais | Risco LGPD por manter currículos/vagas indefinidamente | Antes de escala | Criar retenção e exclusão granular. |
| 3 | Alta | Rate limit em memória | Pode falhar em serverless distribuído e permitir abuso de IA | Antes de tráfego real | Migrar para Redis/Upstash/Supabase. |
| 4 | Média | CSRF em POSTs sensíveis | Risco de ações autenticadas indevidas em contexto de cookie | Curto prazo | Validar Origin/Referer e/ou CSRF token. |
| 5 | Média | Sentry não implementado | Erros críticos dependem só de logs Vercel | Curto prazo | Instalar SDK Sentry com scrub PII. |
| 6 | Média | Admin sem audit logs persistentes | Baixa rastreabilidade em bloqueios/ações | Curto/médio prazo | Criar `audit_logs`. |
| 7 | Média | Histórico sem paginação robusta | Performance degrada em usuários intensivos | Médio prazo | Paginação e filtros server-side. |
| 8 | Baixa | `usage_limits` alinhado para Starter=10 | Risco mitigado no schema base | Concluído | Validar que produção recebeu o SQL atualizado. |
| 9 | Baixa/Média | `SearchAction` JSON-LD sem busca real | Pode ser inconsistente para rich results | Curto prazo | Remover ou implementar busca. |
| 10 | Baixa | Assets OG/favicon ausentes | Menor qualidade de compartilhamento e marca | Antes de lançamento público | Criar assets em `public/brand`. |

## Observação sobre Starter

O código em `lib/plans.ts` define Starter com 10 gerações/mês e o `supabase/schema.sql` foi alinhado para `starter = 10` em `usage_limits`. A pendência operacional é aplicar o SQL atualizado no Supabase de produção quando houver janela de manutenção.

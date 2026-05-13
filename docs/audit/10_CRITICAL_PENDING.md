# 10. Pendências Críticas

Última revisão documental: 2026-05-12 (alinhamento pós-auditoria de produção pública e código).

| Prioridade | Severidade | Item | Impacto | Urgência | Recomendação |
|---:|---|---|---|---|---|
| 1 | Média | `Access-Control-Allow-Origin: *` em respostas HTML (observado em produção) | Superfície CORS ampla em documento; origem fora do repo | Antes de tráfego pago | Confirmar se vem de Vercel / Cloudflare / padrão da plataforma; ver [`../PRODUCTION_VERIFICATION_LOG.md`](../PRODUCTION_VERIFICATION_LOG.md). Não há header CORS definido no código da app. |
| 2 | Alta | Retenção de dados profissionais | Risco LGPD por manter currículos/vagas indefinidamente | Antes de escala | Criar retenção e exclusão granular. |
| 3 | Alta | Rate limit em memória | Pode falhar em serverless distribuído e permitir abuso de IA | Antes de tráfego real | Migrar para Redis/Upstash/Supabase. |
| 4 | Média | CSRF em POSTs sensíveis | Risco de ações autenticadas indevidas em contexto de cookie | Curto prazo | Validar Origin/Referer e/ou CSRF token. |
| 5 | Média | Sentry não implementado | Erros críticos dependem só de logs Vercel | Curto prazo | Instalar SDK Sentry com scrub PII. |
| 6 | Média | Admin sem audit logs persistentes | Baixa rastreabilidade em bloqueios/ações | Curto/médio prazo | Criar `audit_logs`. |
| 7 | Média | Histórico sem paginação robusta | Performance degrada em usuários intensivos | Médio prazo | Paginação e filtros server-side. |
| 8 | Baixa | `usage_limits` alinhado para Starter=10 | Risco mitigado no schema base | Concluído | Validar que produção recebeu o SQL atualizado. |
| ~~9~~ | — | ~~`SearchAction` JSON-LD sem busca real~~ | — | — | **Resolvido no repo:** `potentialAction` removido de `WebSite` em `components/structured-data.tsx` (2026-05-12). |
| 10 | Baixa | Assets OG/favicon ausentes | Menor qualidade de compartilhamento e marca | Antes de lançamento público | Garantir assets em `public/brand` em deploy. |

## Headers / CSP (estado atual)

**Implementado** em `next.config.ts`: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`.  
Verificação HTTP pública (2026-05-12): respostas de `https://www.globalhireai.com.br/` incluem CSP coerente com o arquivo de configuração.

## Observação sobre Starter

O código em `lib/plans.ts` define Starter com 10 gerações/mês e o `supabase/schema.sql` foi alinhado para `starter = 10` em `usage_limits`. A pendência operacional é aplicar o SQL atualizado no Supabase de produção quando houver janela de manutenção.

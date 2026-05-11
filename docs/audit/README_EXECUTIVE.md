# Auditoria Executiva — GlobalHire AI

Data: 2026-05-11  
Escopo: auditoria técnica, segurança, SEO, analytics, LGPD, produção e escalabilidade do projeto real em Next.js.

## Resumo

A GlobalHire AI é um SaaS B2C de carreira com IA generativa para otimização de currículos ATS, análise de compatibilidade com vagas, preparação para entrevistas, tradução/adaptação internacional e geração de documentos profissionais.

O projeto já possui uma base funcional sólida para MVP:

- Next.js App Router com rotas públicas, auth e painel logado.
- Supabase Auth e banco com RLS.
- Stripe checkout, Customer Portal e webhook.
- Groq para IA generativa.
- Upload PDF/DOCX.
- Controle de planos e limites.
- Páginas legais e documentação operacional.
- Sitemap, robots, metadata, JSON-LD e analytics pós-consentimento.

## Estado geral

| Área | Status | Observação |
|---|---|---|
| Produto MVP | IMPLEMENTADO | Fluxos principais existem e estão integrados. |
| Auth | IMPLEMENTADO | Supabase Auth, login senha, OAuth social preparado e reset. |
| Planos/Stripe | IMPLEMENTADO | Checkout, portal e webhook existem. |
| IA/Groq | IMPLEMENTADO | Prompts internos e rotas protegidas. |
| Upload | IMPLEMENTADO | PDF/DOCX com validação e parsing server-side Node. |
| Segurança | IMPLEMENTADO/PARCIAL | Há auth, RLS, zod, Turnstile, CSP, headers, Origin check e rate limit distribuído com fallback. |
| LGPD | PARCIAL | Páginas, consentimento e docs existem; retenção configurável e exclusão granular foram preparadas; falta job automático e governança formal. |
| SEO | IMPLEMENTADO/PARCIAL | Sitemap/robots/metadata/JSON-LD existem; favicon e OG fallback foram adicionados; assets finais de marca ainda podem evoluir. |
| Analytics | IMPLEMENTADO/PARCIAL | GA4, Clarity e PostHog preparados pós-consentimento; falta teste em produção e monitoramento formal. |
| Observabilidade | PARCIAL | Logs existem; Sentry preparado em env/docs, mas SDK não implementado. |
| Escalabilidade | PARCIAL | MVP adequado; rate limit agora usa Supabase com fallback, mas queries e paginação ainda devem evoluir. |

## Principais riscos

1. **Headers/CSP exigem revisão contínua**  
   Headers globais foram implementados, mas qualquer novo provedor externo precisa ser incluído explicitamente na CSP.

2. **Rate limit distribuído ainda é MVP**  
   `lib/rate-limit.ts` usa Supabase em produção com fallback em memória. Para alto volume, evoluir para RPC transacional ou Redis.

3. **Dados sensíveis persistidos em `generations`**  
   Currículos, descrições de vaga e outputs são salvos completos. É aceitável para histórico, mas exige retenção, exclusão e proteção operacional.

4. **CSRF mitigado por Origin/Referer**  
   Endpoints sensíveis de browser usam validação same-origin. Avaliar token CSRF dedicado se houver integrações externas legítimas no futuro.

5. **Observabilidade sem Sentry SDK**  
   Variáveis e docs existem, mas captura estruturada de erro ainda depende de logs Vercel.

## Prioridade recomendada

Curto prazo:

- Aplicar SQL de rate limit no Supabase de produção.
- Revisar política de retenção e criar rotina automática futura.
- Monitorar CSP após deploy em produção.
- Testar GA4, Clarity e PostHog em produção com consentimento.
- Confirmar OAuth Google com URLs legais.

Médio prazo:

- Implementar Sentry com scrub de PII.
- Criar audit logs persistentes para ações críticas.
- Melhorar admin com métricas reais e logs operacionais.
- Criar rotina de backup/restore testada no Supabase.

Longo prazo:

- Internacionalização legal e GDPR/PIPEDA.
- Multi-tenant readiness se houver B2B.
- DPA próprio e governança formal de IA.

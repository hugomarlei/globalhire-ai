# GlobalHire AI — Documentação empresarial (`docs-enterprise`)

Esta árvore é a **camada executiva e operacional**: governança, SOPs, runbooks, growth, produto, financeiro, suporte e IA — **alinhada ao código e à documentação técnica já existente** em `docs/`.

## Princípios

1. **Uma verdade técnica** continua em `docs/` (arquitetura, legal, auditorias). Aqui: decisões, processos, narrativa para equipa, auditores e investidores.
2. Cada ficheiro referencia **fontes canónicas** no repositório sempre que possível.
3. **Não inventar stack**: Next.js 15, Supabase, Stripe, Groq, Turnstile, GA4/Clarity/PostHog, Vercel, Sentry opcional — conforme o projeto.

## Índice mestre

Ver [`00_INDEX.md`](./00_INDEX.md).

## Pastas

| Pasta | Conteúdo |
|-------|----------|
| `GOVERNANCA/` | Missão, visão, valores, estrutura, manual do founder, decisões, SOS |
| `TECNICO/` | Arquitetura, integrações, envs, deploy, observabilidade |
| `RUNBOOKS/` | Incidentes, rollback, emergências por provider, checklists |
| `SEGURANCA_COMPLIANCE/` | Políticas, segredos, LGPD, retenção, backups, acessos, terceiros |
| `GROWTH_MARKETING/` | Estratégia, funis, SEO, social, monetização |
| `PRODUTO/` | Visão de produto, roadmap, priorização, UX, experimentação |
| `FINANCEIRO/` | Modelo de negócio, unit economics, métricas SaaS, orçamento, due diligence |
| `SUPORTE/` | Filosofia, macros, escalação, FAQ interno, churn, reembolsos |
| `IA_AUTOMACOES/` | Política de uso de IA, prompts, qualidade, automações internas, risco de fornecedor |
| `EXECUTIVO/` | One-pager, OKRs, relatório conselho, comunicação de crise, stakeholders |

---

**Última materialização:** documentação gerada para onboarding interno e auditoria; revisar trimestralmente com founders.

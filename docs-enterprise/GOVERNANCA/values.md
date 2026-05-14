# Valores operacionais — GlobalHire AI

## 1. Transparência

- Declarar limitações da IA e do ATS score (não é garantia de entrevista).
- **Referência:** [`docs/product/AI_LIMITATIONS.md`](../../docs/product/AI_LIMITATIONS.md)

## 2. Privacidade e minimização

- Dados pessoais e conteúdos sensíveis tratados segundo fluxo descrito em [`docs/legal/data-flow-map.md`](../../docs/legal/data-flow-map.md).
- Analytics com mascaramento onde aplicável — [`docs/ANALYTICS_EVENTS.md`](../../docs/ANALYTICS_EVENTS.md).

## 3. Segurança por defeito

- Secrets apenas no servidor; nunca expor chaves em `NEXT_PUBLIC_*`.
- **Referência:** [`docs/security/SECURITY_POLICY.md`](../../docs/security/SECURITY_POLICY.md)

## 4. Velocidade com disciplina

- Alterações em produção com preview e checklists (`RUNBOOKS/`).
- Rollback planeado — [`RUNBOOKS/rollback-procedures.md`](../RUNBOOKS/rollback-procedures.md)

## 5. Integridade comercial

- Preços e reembolsos alinhados a páginas legais e Stripe.
- **Referência:** políticas em `docs/legal/` e rotas públicas do site.

## Comportamentos esperados (equipa)

| Comportamento | Exemplo |
|---------------|---------|
| Documentar decisões irreversíveis | ADR ou nota em `PRODUTO/` |
| Não “resolver rápido” sem runbook em SEV1/2 | `RUNBOOKS/incident-response.md` |
| Respeitar escopo em PRs | Evitar mudanças colaterais não listadas |

# Risco de terceiros (subprocessadores)

**Fontes canónicas:** [`docs/legal/THIRD_PARTY_SERVICES.md`](../../docs/legal/THIRD_PARTY_SERVICES.md), [`docs/compliance/THIRD_PARTY_DATA_MAP.md`](../../docs/compliance/THIRD_PARTY_DATA_MAP.md), [`docs/compliance/RISK_REGISTER.md`](../../docs/compliance/RISK_REGISTER.md)

## Inventário (alto nível — manter sincronizado com legal)

| Fornecedor | Dados | Risco residual | Mitigação |
|------------|-------|----------------|-----------|
| Vercel | Tráfego, logs | Médio | contrato, minimização logs |
| Supabase | Dados utilizador | Alto | RLS, backups, acessos |
| Stripe | Pagamentos | Alto | webhooks, reconciliação |
| Groq | Conteúdo prompts | Alto | não logar PII, rate limits |
| Cloudflare | Turnstile metadata | Baixo-médio | política privacidade |
| Google/Microsoft/PostHog | analytics | Médio | consentimento |

## Revisão

- **Anual** ou quando novo fornecedor entra no stack.
- Atualizar `RISK_REGISTER` canónico quando classificação mudar.

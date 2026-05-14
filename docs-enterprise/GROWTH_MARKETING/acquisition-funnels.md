# Funis de aquisição

## Funil principal (macro)

```mermaid
flowchart TD
  V[Visitante] --> L[Landing]
  L --> S[Signup]
  S --> A[Ativação: 1ª geração]
  A --> R[Retenção]
  R --> P[Pagamento]
```

## Eventos a medir

- Ver instrumentação: [`docs/ANALYTICS_EVENTS.md`](../../docs/ANALYTICS_EVENTS.md)

## Canais

| Canal | Notas |
|-------|-------|
| Orgânico | SEO + LinkedIn |
| Pago | Ativar quando unit economics definidos — `FINANCEIRO/unit-economics.md` |

## Leaks comuns

- Fricção no signup — revisar auth flow docs.
- Desconfiança na IA — messaging + limitações.

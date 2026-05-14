# Riscos de fornecedores de IA

| Risco | Mitigação |
|-------|-----------|
| Indisponibilidade API | `RUNBOOKS/` + degradar graciosamente |
| Mudança de modelo | pinning/versionamento quando API permitir |
| Compliance dados | DPAs, minimização, `docs/legal/data-flow-map.md` |
| Custo explosivo | rate limits, alertas de uso Groq |

## Contingência

- Documentar fallback (mensagem ao utilizador + retry) — ver implementação em rotas `/api`.

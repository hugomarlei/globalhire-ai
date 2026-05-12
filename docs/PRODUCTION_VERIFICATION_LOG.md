# Production Verification Log

Registro **append-only** de verificações feitas contra o ambiente real (`https://www.globalhireai.com.br`).  
Não colar secrets, tokens nem corpo de currículos.

## Como usar

1. Adicione uma nova entrada na tabela abaixo após cada rodada de verificação.
2. Para checks HTTP públicos, pode colar **apenas** linhas de headers relevantes (sem cookies).
3. Para painéis (Vercel, Supabase, Stripe), anote **resultado** e data; não versionar exports com PII.

## Investigação: `Access-Control-Allow-Origin: *`

- **Repositório:** não há `Access-Control-Allow-*` definido no código da aplicação (`grep` em `*.ts`, `*.tsx`, `*.json` do projeto).
- **Headers de segurança (CSP, HSTS, etc.):** definidos em `next.config.ts` e observáveis na resposta HTTP de produção.
- **Ação manual:** se `curl -sSIL https://www.globalhireai.com.br/ | grep -i access-control` ainda mostrar `*`, validar no **Vercel** (Project → Settings → Headers / `vercel.json` se existir no projeto) e na **Cloudflare** (Transform Rules / Response headers). Documente a origem aqui quando encontrada.

## Entradas

| Data (UTC) | Responsável | Escopo | Resultado resumido | Evidência (link interno / PR / nota) |
|--------------|-------------|--------|---------------------|--------------------------------------|
| 2026-05-12 | — | Auditoria pública HTTP | 200 www; CSP+HSTS+XFO presentes; apex→www 307; webhook OPTIONS 204; POST sem assinatura 400 | Ver relatório de auditoria no chat / reexecutar `curl` conforme `docs/GO_LIVE_CHECKLIST.md` |

## Comandos úteis (sem segredos)

```bash
curl -sSIL "https://www.globalhireai.com.br/" | head -n 45
curl -sSIL "https://globalhireai.com.br/" | head -n 25
curl -sS "https://www.globalhireai.com.br/robots.txt"
```

## Relacionados

- Checklist operacional: [`GO_LIVE_CHECKLIST.md`](./GO_LIVE_CHECKLIST.md)
- Introspection SQL (somente leitura): [`../supabase/schema-drift-introspection.sql`](../supabase/schema-drift-introspection.sql)
- CI local / PR: [`../.github/workflows/ci.yml`](../.github/workflows/ci.yml)

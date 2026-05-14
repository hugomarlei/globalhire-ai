# Runbook — Falhas Vercel / deploy

## Sintomas

- Build falha no pipeline.
- Site 5xx após deploy.
- Funções server a timeout.

## Diagnóstico

1. Vercel → último deployment → **Build logs** / **Runtime logs**.
2. Comparar commit com alterações em `next.config`, env, middleware.
3. Verificar limites de função e região.

## Recuperação

- Promover deployment anterior (`rollback-procedures.md`).
- Corrigir env ou config e **redeploy**.

## Preview vs Production

- Problemas de origem/CSRF em Preview: [`docs/PREVIEW_QA_REPORT.md`](../../docs/PREVIEW_QA_REPORT.md)

## Prevenção

- PRs sempre com preview.
- Evitar alterações grandes de env em horário de pico sem janela.

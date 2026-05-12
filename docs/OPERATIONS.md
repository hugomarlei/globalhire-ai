# Operations

Status: PARCIAL  
Última revisão: 2026-05-10

Contexto de produto, domínio canônico, riscos e prioridades: [`MASTER_CONTEXT.md`](./MASTER_CONTEXT.md).

Verificações de produção (append-only, sem secrets): [`PRODUCTION_VERIFICATION_LOG.md`](./PRODUCTION_VERIFICATION_LOG.md).  
CI no GitHub: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) (`npm ci`, `typecheck`, `lint`, `build`).

## Rodar localmente

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Testes antes de deploy

```bash
npm run typecheck
npm run build
```

`npm run lint` existe no `package.json`, mas depende da configuração de lint do Next/ESLint no projeto.

## Stripe sandbox

1. Use chaves `sk_test_` e `pk_test_`.
2. Configure Price IDs `price_`.
3. Configure webhook local ou em ambiente Vercel preview.
4. Teste checkout, retorno `checkout=success` e atualização de plano via webhook.

## Analytics

PostHog e Clarity são opcionais. O sistema deve funcionar com envs vazias.

## Sentry

Sentry está documentado e com envs preparadas, mas SDK completo ainda está PENDENTE para evitar nova dependência sem decisão operacional.

## Suporte

Use `NEXT_PUBLIC_SUPPORT_EMAIL` para trocar o e-mail público sem alterar código.

# Operations

Status: PARCIAL  
Última revisão: 2026-05-10

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

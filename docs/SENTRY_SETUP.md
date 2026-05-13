# Sentry — configuração e operação

Integração mínima com **`@sentry/nextjs`** (cliente, servidor Node, runtime Edge, rotas API e Server Components). O SDK fica **desligado** até existir `NEXT_PUBLIC_SENTRY_DSN`.

## Estado no repositório

| Ficheiro | Função |
|----------|--------|
| `next.config.ts` | `withSentryConfig` — túnel `/monitoring`, upload opcional de source maps em CI. |
| `instrumentation.ts` | Carrega `sentry.server.config` / `sentry.edge.config`; exporta `onRequestError`. |
| `instrumentation-client.ts` | Inicialização no browser. |
| `sentry.server.config.ts` | Node (SSR, rotas API, server actions). |
| `sentry.edge.config.ts` | Middleware / Edge. |
| `lib/sentry-privacy.ts` | `beforeSend`, `beforeSendTransaction`, `beforeBreadcrumb`, `sendDefaultPii: false`, lista de chaves sensíveis. |
| `app/global-error.tsx` | Captura erros não tratados na árvore App Router. |
| `middleware.ts` | Exclui o path `/monitoring` do matcher (túnel Sentry). |

## Criar projeto no Sentry

1. Em [sentry.io](https://sentry.io), crie uma organização (se ainda não existir).
2. **Projects → Create project → Plataforma “Next.js”**.
3. Copie o **DSN** do projeto (aparece nas definições do cliente).

## Variáveis na Vercel

Defina no projeto Vercel (Preview + Production, ou por ambiente):

| Variável | Obrigatório | Notas |
|----------|-------------|--------|
| `NEXT_PUBLIC_SENTRY_DSN` | Sim, para ativar | Pública; só o DSN, sem segredos. |
| `SENTRY_ENVIRONMENT` | Recomendado | Ex.: `production`, `preview`, `development`. Se vazio, usa-se `VERCEL_ENV` ou `NODE_ENV`. |
| `SENTRY_ORG` | Para source maps em CI | Slug da organização. |
| `SENTRY_PROJECT` | Para source maps em CI | Slug do projeto. |
| `SENTRY_AUTH_TOKEN` | Para source maps em CI | Token com scope `project:releases` (não commitar). |

A Vercel injeta `VERCEL_GIT_COMMIT_SHA` (e a variante `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` quando aplicável) — usada como **`release`** no SDK para correlacionar erros com commits.

**Preview vs Production:** use `SENTRY_ENVIRONMENT=preview` nos deployments de preview e `SENTRY_ENVIRONMENT=production` em produção, ou deixe apenas `VERCEL_ENV` (`preview` / `production`) para o SDK inferir.

## Privacidade (PII e conteúdo)

- **`sendDefaultPii: false`** — não enviar IP/e-mail automáticos do utilizador.
- **`beforeSend` / `beforeSendTransaction`** — remoção de query strings, `request.data`, cookies, cabeçalhos sensíveis; redação de chaves que correspondam a currículo, vaga, tokens, e-mail, telefone, etc., em `extra`, `contexts` e breadcrumbs.
- **`beforeBreadcrumb`** — breadcrumbs `fetch` para `/api/ai/*`, `/api/upload/*` e `/api/stripe/*` são descartados para reduzir risco de vazamento de metadados de pedidos.
- **Sem Session Replay** e **sem widget de User Feedback** nesta configuração (menor superfície de dados).

Reveja periodicamente no Sentry um evento real e confirme que **não** aparecem corpos de pedido, outputs de IA nem PII.

## Túnel e CSP

Os eventos do browser são enviados para **`/monitoring`** no mesmo origin e reencaminhados pelo servidor para o Sentry, reduzindo bloqueios por extensões e **evitando acrescentar domínios do Sentry ao `connect-src`** da CSP.

## Teste manual (sem botão na UI)

1. Defina `NEXT_PUBLIC_SENTRY_DSN` e `SENTRY_ENVIRONMENT=development` em `.env.local`.
2. `npm run dev`.
3. Numa página qualquer, abra as DevTools → Consola e execute (apenas em desenvolvimento):

   ```js
   throw new Error("Sentry manual check");
   ```

4. Confirme o evento em **Issues** no Sentry (pode levar alguns segundos).

Não commite erros de teste nem deixe scripts permanentes na aplicação.

## Rollback / desativação

1. Remova ou esvazie `NEXT_PUBLIC_SENTRY_DSN` no ambiente Vercel e redeploy.
2. O SDK trata `enabled: false` quando o DSN está vazio — deixa de enviar eventos.
3. Opcional: remover dependência `@sentry/nextjs` e ficheiros listados acima (reverter commit).

## Build local sem org Sentry

Se `SENTRY_ORG` / `SENTRY_PROJECT` / `SENTRY_AUTH_TOKEN` não estiverem definidos, o plugin de build pode emitir avisos; o `errorHandler` em `next.config.ts` regista o aviso e o build continua. Para source maps legíveis em produção, configure os três em CI (por exemplo GitHub Actions com secrets).

## Referências

- [Manual setup Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/)
- [Scrubbing Data](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#before-send)

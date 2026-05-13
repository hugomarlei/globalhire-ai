# Sentry — configuração e operação

## Modo standby (pré-monetização)

A integração **`@sentry/nextjs`** está **no repositório e pronta a ativar**, mas a decisão operacional atual é **não incorrer em custo fixo** nem tráfego de erros até haver monetização ou volume que o justifique.

- **Sem `NEXT_PUBLIC_SENTRY_DSN`** (ou DSN vazio / só espaços): o SDK fica **`enabled: false`** — **nenhum evento** é enviado; a aplicação comporta-se como sem Sentry.
- **Sem `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT`**: o **build não falha**; o upload de **source maps fica desligado** (`sourcemaps.disable` no `next.config.ts`).
- **Observabilidade de produto/UX/funil** continua a cargo de **PostHog**, **Microsoft Clarity** e **GA4** (variáveis em `.env.example` — **não alteradas** por esta integração).

**Ativação futura:** definir `NEXT_PUBLIC_SENTRY_DSN` (e opcionalmente `SENTRY_ENVIRONMENT` + trio de source maps) na Vercel e validar um evento de teste conforme a secção “Teste manual” abaixo.

---

Integração mínima com **`@sentry/nextjs`** (cliente, servidor Node, runtime Edge, rotas API e Server Components). O SDK fica **desligado** até existir um DSN válido em `NEXT_PUBLIC_SENTRY_DSN`.

## Estado no repositório

| Ficheiro | Função |
|----------|--------|
| `next.config.ts` | `withSentryConfig` — túnel `/monitoring`; upload de source maps **apenas** se `SENTRY_AUTH_TOKEN`, `SENTRY_ORG` e `SENTRY_PROJECT` estiverem definidos; `telemetry: false` no passo de build do plugin. |
| `instrumentation.ts` | Carrega `sentry.server.config` / `sentry.edge.config`; exporta `onRequestError`. |
| `instrumentation-client.ts` | Inicialização no browser (`enabled` conforme DSN). |
| `sentry.server.config.ts` | Node (SSR, rotas API, server actions). |
| `sentry.edge.config.ts` | Middleware / Edge. |
| `lib/sentry-privacy.ts` | `sendDefaultPii: false`, `beforeSend` / `beforeSendTransaction`, `beforeBreadcrumb`, redação de PII/conteúdo sensível. |
| `app/global-error.tsx` | Reporta erros globais da App Router (sem envio se o SDK estiver inativo). |
| `middleware.ts` | Exclui o path `/monitoring` do matcher (túnel Sentry). |

## Criar projeto no Sentry (quando for ativar)

1. Em [sentry.io](https://sentry.io), crie uma organização (se ainda não existir).
2. **Projects → Create project → Plataforma “Next.js”**.
3. Copie o **DSN** do projeto (aparece nas definições do cliente).

## Variáveis na Vercel (todas opcionais até ativação)

| Variável | Quando usar |
|----------|-------------|
| `NEXT_PUBLIC_SENTRY_DSN` | **Obrigatória apenas para enviar eventos.** Sem ela, custo Sentry ≈ 0. |
| `SENTRY_ENVIRONMENT` | Recomendada após ativar (`production`, `preview`, `development`). Se vazio, usa-se `VERCEL_ENV` ou `NODE_ENV`. |
| `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN` | **Opcionais**; só necessárias em conjunto para **upload de source maps** no build (CI ou Vercel com secrets). |

A Vercel injeta `VERCEL_GIT_COMMIT_SHA` (e a variante `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` quando aplicável) — usada como **`release`** no SDK para correlacionar erros com commits.

**Preview vs Production:** após ativar, use `SENTRY_ENVIRONMENT=preview` nos deployments de preview e `SENTRY_ENVIRONMENT=production` em produção, ou deixe apenas `VERCEL_ENV` (`preview` / `production`).

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

## Rollback / desativação (standby)

1. Remova ou esvazie `NEXT_PUBLIC_SENTRY_DSN` no ambiente Vercel e redeploy.
2. O SDK usa `enabled: false` quando o DSN está ausente — **nenhum evento** é enviado.
3. Não é necessário remover o código `@sentry/nextjs` do repositório.

## Build sem credenciais Sentry

- **DSN:** não é necessário para o build.
- **Source maps:** sem `SENTRY_AUTH_TOKEN` + `SENTRY_ORG` + `SENTRY_PROJECT`, o upload fica **desativado** (`sourcemaps.disable: true`). O `errorHandler` em `next.config.ts` continua a impedir que falhas residuais do plugin interrompam o build.

## Referências

- [Manual setup Next.js](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/)
- [Scrubbing Data](https://docs.sentry.io/platforms/javascript/guides/nextjs/configuration/options/#before-send)

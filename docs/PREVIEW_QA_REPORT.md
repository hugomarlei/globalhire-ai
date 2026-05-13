# Preview QA — Release Candidate (UI + tema)

Última rodada focada em **consistência visual**, **tema** e **footer** sem alterar Stripe, Supabase schema, Auth, middleware ou CSP.

## Rodada RC — contraste definitivo (light + dark)

### Causa raiz

- O layout logado (`app/(app)/layout.tsx`) aplicava **`text-white` no `<main>`** enquanto `Card` em modo claro (`html` sem `.dark`) usa **superfície clara + `text-ink`**. O conteúdo interno do dashboard/gerador/ATS/histórico/conta ainda declarava **`text-white/*`**, gerando **texto branco em card branco** e controles ilegíveis.
- **`AppNav`** assumia **sempre** cromo escuro (bordas, dropdowns, texto branco), inconsistente com `main` em tema claro e com selects claros.
- **Campos**: `dark:bg-white/7` era frágil para autofill/contraste; reforçado para **`#1a222d`** + `caret-*`, `selection:*`, estados `disabled` e autofill WebKit alinhados.

### Correções aplicadas (resumo)

- **`components/ui.tsx`**: `inputClass` / `textareaClass` — fundo escuro estável, caret, seleção, disabled, autofill; `Card` superfície `bg-white` (sem translucidez que confundia contraste).
- **`app/globals.css`**: `::selection` global; autofill explícito para **textarea** e **select** (WebKit).
- **`components/nav.tsx`**: `AppNav` com header, dropdowns e menu mobile **claro + `dark:`** (painéis claros no light, `#07120E` no dark).
- **App**: `dashboard`, `dashboard-generator`, `ats-analyzer`, `history-list`, `settings-panel`, `account-panel`, `upgrade-plans`, `upgrade-gate`, `admin`, `admin-block-button`, `gerador/page`, `assinatura/page`, `turnstile-widget` (apenas textos/cores + `theme: "auto"`), `social-auth-buttons` (contraste ícone/botão).
- **Turnstile**: `theme: "auto"` para acompanhar `color-scheme` do documento (sem mudar lógica de verificação).

### O que foi validado no código / build

- `npm run typecheck`, `npm run lint`, `npm run build` — **OK** após esta rodada.
- Contexto RC anterior (6494ac0) permanece válido: ThemeProvider único, `body` paper/ink, landing `brand-shell`, defaults de redes, export TXT do histórico, prompts IA sem alteração de escopo.

## Pendências conscientes

- **PDF/DOCX a partir do histórico:** o modelo persiste texto; export binário exigiria pipeline novo (fora do escopo RC).
- **i18n profundo** em `/faq`, `/pricing`, `/features`, `/resources`: conteúdos continuam em **PT**; apenas **shell visual** (fundo, tipografia, footer) foi alinhado ao tema. Tradução completa = trabalho pós-launch.
- **CookieConsent / analytics**: não revisados visualmente nesta passada; smoke rápido na Preview recomendado.
- **Listas nativas `<option>`**: aparência ainda depende parcialmente do SO/navegador (limitação conhecida).

## Preview — CSRF / origem (403 em APIs)

### Causa raiz

- Em Vercel, `NODE_ENV` é **`production`** também nos deployments de **Preview**.
- `getAppUrl()` caía no URL de produção (`https://www.globalhireai.com.br`) quando `NEXT_PUBLIC_APP_URL` não estava alinhado ao host real do Preview.
- `getAllowedOrigins()` não incluía o **Origin** do browser (`https://<deployment>.vercel.app`), então `rejectInvalidOrigin` devolvia **403** em `/api/ai/*`, `/api/stripe/*`, etc.

### Solução

- `lib/app-url.ts`: em `VERCEL_ENV === "preview"`, `getAppUrl()` usa `https://` + **`VERCEL_URL`** (e `listVercelPreviewPublicOrigins()` agrega também **`VERCEL_BRANCH_URL`** quando existir).
- `lib/security.ts`: `getAllowedOrigins()` passa a incluir todas as origens de preview listadas + `NEXT_PUBLIC_APP_URL` (se definido). Opcional e **restrito**: `VERCEL_PREVIEW_PROJECT_HOST_SUFFIX` (sufixo de host do projeto na Vercel) para o mesmo `VERCEL_ENV=preview`.
- Logs de rejeição: em dev / preview / `VERCEL_ENV=development`, loga `origin`, prefixo curto de `referer` e lista de origens permitidas; em produção Vercel “live”, mantém log mínimo.

### Turnstile (widget)

- Um único carregamento do script Turnstile (evita múltiplos `<Script>` / `onLoad` concorrentes).
- `turnstile.remove` + limpeza do container no **unmount**; reset do captcha só quando `resetSignal` **muda** de fato (evita reset na montagem inicial).

### Stripe no Preview

- Com origem válida, checkout/portal deixam de receber 403 por CSRF. Chaves (`STRIPE_SECRET_KEY`, price IDs) continuam sendo as definidas no ambiente Preview — use **modo teste** no Preview quando possível; não alteramos produtos/webhook.

### Riscos residuais

- OAuth / redirect URLs: no Preview, `getAppUrl()` passa a ser o host do deployment; é preciso autorizar esse URL nos provedores (ex.: Supabase) se testar login social no Preview.
- `VERCEL_PREVIEW_PROJECT_HOST_SUFFIX`, se usado, amplia origens a **todos** os subdomínios daquele sufixo no ambiente preview — use apenas sufixo do **seu** projeto Vercel.

## Smoke manual sugerido na Preview

1. Home: idioma ×3; tema ×3; scroll até footer (redes + CNPJ).
2. `/login`, `/cadastro`, `/recuperar-senha`: tema claro e escuro; preencher e-mail (autofill se possível); botões sociais com **rótulo e ícones** visíveis.
3. Logado — **tema claro e escuro**: `/dashboard`, `/gerador`, `/ats-score`, `/historico`, `/configuracoes`, `/assinatura`, `/conta`; **AppNav** (desktop + mobile), seletor de idioma, toggles de filtro no histórico.
4. `/faq`, `/pricing`: tema + footer.
5. Logado: `/historico` → download `.txt`.
6. **Preview — APIs:** `/gerador` (gerar), `/ats-score` (analisar + otimizar), `/assinatura#planos` (checkout / portal) — **sem** mensagem de origem inválida; rede 200 nas rotas `/api/ai/*` e `/api/stripe/*` (exceto erros de negócio esperados, ex. cartão teste).
7. Consola: sem spam repetido de Turnstile “Cannot find Widget…” ao navegar / trocar tema.
8. CSP/Turnstile: sem regressão óbvia.

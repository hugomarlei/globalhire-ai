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

## Rodada RC — polish final (histórico, tema, footer)

### Bugs (QA manual / Preview)

1. **Contraste residual no dark** em `<pre>` e previews (histórico, gerador, ATS): superfícies sem contraste explícito vs. texto.
2. **“Abrir documento” expandia vários cards** na grelha de documentos: `<details>` em lista pode acoplar comportamento de **acordeão exclusivo** entre itens (especificação HTML / browser).
3. **Theme toggle**: `dark:bg-white/6` e hovers claros geravam **halos** no modo escuro.
4. **Ícones sociais (footer)**: fundos `white/6` no dark desalinhados do restante do chrome.

### Solução

- **Histórico**: `<details>` → **estado** `docOpenById[item.id]` com botão + `aria-expanded`; cada card expande **só o seu** conteúdo.
- **`<pre>`** (histórico, gerador, ATS): fundo `#eef2ef` + `text-ink` (light); dark `#0b100e` + `text-white/90` + borda explícita.
- **ThemeToggle** / **socialBtn**: superfícies escuras `#121a16` / hover `#1a2520` no dark (sem `bg-white/6` no track dos ícones de tema ou nos sociais).

### Componentes tocados

`components/history-list.tsx`, `components/dashboard-generator.tsx`, `components/ats-analyzer.tsx`, `components/theme-toggle.tsx`, `components/site-footer.tsx`.

### Validação de build (pós-polish)

- `npm run typecheck` — **OK**
- `npm run lint` — **OK** (sem warnings)
- `npm run build` — **OK** (Next.js 15.5.18)

### Status final (RC polish)

**Pronto para QA final na Preview** neste escopo (UI dark/light, expansão independente de cards no histórico, toggle de tema, footer social). Sentry, merge para `main` e produção permanecem fora desta entrega, conforme plano RC.

## Rodada RC — last blockers antes do Sentry

### Bugs / inconsistências tratados

1. **Contraste**: botão **Entrar** (`PublicNav`) e chrome de conta/menu mobile com halos `white/7` no dark; card **ATS simulado** na landing com hierarquia fraca e faixa final branca pura.
2. **Histórico / documentos**: grelha com **stretch** padrão + `flex flex-col` no `Card` fazia vizinhos na mesma linha acompanharem a altura do card expandido.
3. **Theme toggle / footer social**: resíduos claros no dark.
4. **Configurações**: notificações pareciam configuráveis sem backend; template de exportação não aplicava ao Gerador; faltava **Brasil** no país-alvo.

### Causa raiz

- **CSS Grid**: `align-items: stretch` (default) iguala a altura de todos os itens da linha à célula mais alta.
- **Preferências**: `globalhire-preferences` era salvo nas Configurações, mas o Gerador não hidratava `language` / `targetCountry` / `template` na montagem.

### Solução

- **nav.tsx**, **theme-toggle.tsx**, **site-footer.tsx**: superfícies graphite no dark, sem `bg-white/7` nos CTAs secundários.
- **history-list.tsx**: `items-start`, cards `h-fit self-start min-h-0`, sem `flex-1` no corpo; preview `max-h-72` + `min-h-0` + overflow.
- **app/page.tsx**: texto explícito no mock ATS; dica em faixa mint/ink menos gritante.
- **settings-panel.tsx**: notificações **“Em breve”**; Brasil no select; copy MVP para template e tipo de entrega.
- **dashboard-generator.tsx**: Brasil na lista; `useEffect` hidrata idioma, país e template de PDF a partir do `localStorage` (whitelist).

### O que permanece “em breve”

- Notificações por e-mail (marketing / frequência): sem implementação.
- Tipo de entrega padrão nas Configurações → ainda não sincroniza o seletor do Gerador (documentado no painel).

### Template de exportação — status

- **Funcional para PDF no Gerador**: ao abrir `/gerador`, o template salvo nas Configurações define o **`pdfTemplate`** inicial (pode ser alterado na tela antes de exportar).

### Validação de build (esta rodada)

- `npm run typecheck` — **OK**
- `npm run lint` — **OK**
- `npm run build` — **OK**

### Recomendação — Sentry

Após smoke na Preview nestes pontos: **pronto para integrar Sentry** (quando você autorizar o escopo).

## Smoke manual sugerido na Preview

1. Home: idioma ×3; tema ×3; scroll até footer (redes + CNPJ).
2. `/login`, `/cadastro`, `/recuperar-senha`: tema claro e escuro; preencher e-mail (autofill se possível); botões sociais com **rótulo e ícones** visíveis.
3. Logado — **tema claro e escuro**: `/dashboard`, `/gerador`, `/ats-score`, `/historico`, `/configuracoes`, `/assinatura`, `/conta`; **AppNav** (desktop + mobile), seletor de idioma, toggles de filtro no histórico.
4. `/faq`, `/pricing`: tema + footer.
5. Logado: `/historico` → download `.txt`; **Meus documentos** → “Abrir documento” em **vários** cards: só o card clicado expande; **vizinhos na mesma linha não crescem de altura**; `<pre>` legível em dark/light.
6. **Preview — APIs:** `/gerador` (gerar), `/ats-score` (analisar + otimizar), `/assinatura#planos` (checkout / portal) — **sem** mensagem de origem inválida; rede 200 nas rotas `/api/ai/*` e `/api/stripe/*` (exceto erros de negócio esperados, ex. cartão teste).
7. Consola: sem spam repetido de Turnstile “Cannot find Widget…” ao navegar / trocar tema.
8. CSP/Turnstile: sem regressão óbvia.

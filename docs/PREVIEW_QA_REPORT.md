# Preview QA — Release Candidate (UI + tema)

Última rodada focada em **consistência visual**, **tema** e **footer** sem alterar Stripe, Supabase schema, Auth, middleware ou CSP.

## O que foi validado no código / build

- `npm run typecheck`, `npm run lint`, `npm run build` executados com sucesso após as alterações.
- Tema: **única fonte** `document.documentElement.classList.toggle("dark", …)` via `ThemeProvider`; `body` usa `bg-paper text-ink dark:bg-ink dark:text-white`.
- Removido o wrapper extra `div.dark` no layout do app; removidos overrides globais `html:not(.dark) input { color-scheme: light }` que causavam **inputs brancos** no fluxo escuro.
- Landing: estilos claros escopados em `html:not(.dark) .brand-shell` (sem classe paralela `marketing-theme-light` no React).
- Formulários: `inputClass` / `textareaClass` / `Card` / `Field` com pares **claro + `dark:`** e autofill WebKit ajustado.
- Redes sociais: defaults em `lib/social.ts` (LinkedIn empresa, Instagram, TikTok); env `NEXT_PUBLIC_SOCIAL_*` **sobrescrevem** se definidas.
- Histórico: rótulo **“Baixar texto (.txt)”** (e equivalentes i18n); export continua `GET /api/history/[id]/export` autenticado.
- IA (preservação de contato + idioma): regras já presentes em `prompts/ai-prompts.ts` e rotas `/api/ai/*` — **sem mudança nesta rodada**; considerado estável.

## Pendências conscientes

- **PDF/DOCX a partir do histórico:** o modelo persiste texto; export binário exigiria pipeline novo (fora do escopo RC).
- **i18n profundo** em `/faq`, `/pricing`, `/features`, `/resources`: conteúdos continuam em **PT**; apenas **shell visual** (fundo, tipografia, footer) foi alinhado ao tema. Tradução completa = trabalho pós-launch.
- **CookieConsent / analytics**: não revisados visualmente nesta passada; smoke rápido na Preview recomendado.

## Smoke manual sugerido na Preview

1. Home: idioma ×3; tema ×3; scroll até footer (redes + CNPJ).
2. `/login`, `/cadastro`, `/recuperar-senha`: tema claro e escuro; preencher e-mail (autofill se possível).
3. `/faq`, `/pricing`: tema + footer.
4. Logado: `/historico` → download `.txt`.
5. Consola: CSP/Turnstile sem regressão óbvia.

# Relatório pós-correção (QA) — rebranding GlobalHire AI

**Data:** 2026-05-12  
**Restrição:** sem push, merge ou deploy nesta etapa.

---

## 1. Arquivos alterados (working tree)

### Modificados

- `app/(app)/dashboard/page.tsx` — i18n via `getServerLocale`, `dashboardPageCopy`, `deliveryLabel`; datas com `dateLocale`.
- `app/(auth)/login/page.tsx` — cópia de login via `i18n-app-wide`.
- `app/faq/page.tsx`, `app/features/page.tsx`, `app/pricing/page.tsx`, `app/resources/page.tsx` — locale servidor + cópias de marketing.
- `app/layout.tsx` — `CookieConsent` dentro de `LanguageProvider` + `ThemeProvider` (corrige build `/_not-found` e mantém tema no banner).
- `app/page.tsx` — hero / card ATS simulado com contraste reforçado (evitar mint sobre mint no score).
- `components/cookie-consent.tsx`, `components/dashboard-generator.tsx`, `components/nav.tsx`, `components/settings-panel.tsx`, `components/social-auth-buttons.tsx`, `components/turnstile-widget.tsx`
- `lib/i18n.ts`
- `tsconfig.tsbuildinfo` (artefato de build; pode ser revertido ou ignorado no commit conforme política do repo)

### Novos (untracked até `git add`)

- `docs/rebranding/VISUAL_ACCEPTANCE_REPORT.md`
- `lib/i18n-app-wide.ts` — strings amplas (nav, settings, cookie, auth login, marketing, dashboard, Turnstile, etc.)
- `lib/i18n-generator.ts` — UI do gerador por locale
- `lib/server-locale.ts` — leitura do cookie `globalhire-locale` no servidor
- `lib/target-countries.ts` — Brasil, Estados Unidos, Europa (rótulos por idioma; valores canónicos PT estáveis para API)

---

## 2. O que foi corrigido

| Item | Descrição |
|------|------------|
| **Hero ATS (light)** | Card “antes/depois”: score e hierarquia com foregrounds legíveis (sem `text-brand-100` sobre fundo mint claro); faixa explicativa com leitura mais nítida. Dark mode tratado no mesmo bloco sem regressão intencional. |
| **Lista de países** | Fonte única `lib/target-countries.ts`: apenas Brasil, Estados Unidos e Europa (rótulo regional por i18n; valor canônico `Europa` para prompts/ATS). |
| **i18n (parcial ampliada)** | Landing parcialmente coberta por `lib/i18n.ts`; marketing (FAQ, features, pricing, resources), login, nav app, cookie, Turnstile, social auth, settings, gerador e **dashboard** passam por cópias centralizadas + locale servidor onde aplicável. |
| **Build** | Erro de prerender `useLanguage must be used inside LanguageProvider` em `/_not-found` resolvido ao aninhar `CookieConsent` corretamente. |

---

## 3. Contraste (validação)

- **Código / tokens:** removidas combinações problemáticas no bloco ATS do hero conforme auditoria em `docs/rebranding/VISUAL_ACCEPTANCE_REPORT.md` (seção 2.1).
- **Validação humana recomendada:** light/dark, desktop/mobile no hero e no card ATS — não substitui inspeção visual no browser.

---

## 4. Páginas / fluxos revisados (código)

- `/` (landing + hero ATS)
- `/dashboard`
- `/gerador`, `/configuracoes` (via componentes)
- `/login`, nav app, cookie, Turnstile, botões sociais
- `/faq`, `/features`, `/pricing`, `/resources`

---

## 5. Idiomas (pt-BR, en, es, fr)

- Chaves adicionadas/ampliadas nos módulos acima para os quatro locales onde o objeto `Record<Locale, …>` existe.
- **Pendência:** várias rotas ainda contêm PT literal (ex.: `cadastro`, `recuperar-senha`, `redefinir-senha`, `conta`, `assinatura`, `historico`, `ats-score`, painéis em `components/account-panel`, `upgrade-*`, `ats-analyzer`, `history-list`, páginas legais longas). Para cumprir 100% “nenhum texto hardcoded” no produto inteiro, é necessário estender o mesmo padrão a esses arquivos.

---

## 6. Stripe e pricing

- **Confirmado:** nenhuma alteração em `app/api/stripe/**` nem em `lib/plans.ts` neste conjunto de mudanças (`git diff` vazio nesses caminhos).

---

## 7. ATS hero card — legibilidade (light)

- **Confirmado em implementação:** coluna “depois” e score não usam mais o par mint-claro sobre mint-claro descrito na auditoria; score e labels usam contraste explícito (incl. texto claro sobre gradiente escuro na coluna otimizada onde aplicável).

---

## 8. i18n — cobertura de textos visíveis

- **Ampliado** para os fluxos listados na secção 4 e componentes associados.
- **Não afirmado como 100% concluído** em todo o site: ainda há strings visíveis fora do fluxo i18n nas rotas/componentes da secção 5. Próximo passo: inventariar cada `.tsx` restante e migrar para `i18n-app-wide` / `i18n-generator` / `i18n` conforme server vs client.

---

## 9. Comandos executados

- `npm run lint` — sem erros.
- `npm run typecheck` — sucesso.
- `npm run build` — sucesso (após correção do `app/layout.tsx`).

---

## 10. Notas

- Não executar `git push` / merge / deploy até revisão humana das telas e conclusão do i18n nas rotas pendentes, se essa for a barra de aceite do produto.

# Relatório QA — i18n em todo o site (go-live)

**Data:** 2026-05-12  
**Branch:** `staging/pre-go-live-sync` (após commit desta entrega)

---

## 1. Arquivos alterados / novos (principais)

### Novos módulos i18n

- `lib/i18n-auth-pages.ts` — cadastro, recuperar senha, redefinir senha
- `lib/i18n-account-subscription.ts` — conta, assinatura (comparar planos), upgrade plans, mensagens de upgrade de plano
- `lib/i18n-history-ats.ts` — histórico, datas UI, ATS analyzer (copy + recomendações localizadas + `outputLanguageLabelForApi`)
- `lib/i18n-admin.ts` — painel admin + botão bloquear/desbloquear
- `lib/i18n-legal-chrome.ts` — rótulos de navegação legal, títulos de documento, prefixo “última atualização”, datas por locale
- `lib/i18n-legal-intros.ts` — parágrafos introdutórios das páginas legais (4 idiomas)
- `lib/i18n-legal-notice.ts` — aviso de texto jurídico vinculante em PT-BR para visitantes en/es/fr
- `lib/i18n-global-error.ts` — página de erro global + leitura de cookie de locale

### Produto / UI

- `app/page.tsx` — card ATS da landing: painel **sempre escuro** (`zinc-950` / `zinc-50`) para contraste estável em light e dark; faixa “dica” com texto escuro sobre branco
- `lib/target-countries.ts` — rótulos ES/FR conforme pedido (Europa sem sufixo “región”)
- `lib/plan-copy.ts` — `getLocalizedPlanRow`
- `components/upgrade-gate.tsx`, `components/upgrade-plans.tsx`, `components/account-panel.tsx`, `components/history-list.tsx`, `components/ats-analyzer.tsx`, `components/admin-block-button.tsx`, `components/legal-page.tsx`
- `app/(auth)/cadastro/page.tsx`, `recuperar-senha`, `redefinir-senha`
- `app/(app)/conta/page.tsx`, `assinatura/page.tsx`, `gerador/page.tsx`, `ats-score/page.tsx`, `admin/page.tsx`
- `app/privacidade`, `termos`, `cookies`, `support`, `refund-policy`, `data-processing` — `async` + `getServerLocale` + intros i18n + aviso de vinculação
- `app/global-error.tsx`

*(Demais arquivos já existentes de i18n anterior, ex.: `lib/i18n-app-wide.ts`, `lib/i18n-generator.ts`, continuam em uso.)*

---

## 2. Páginas revisadas (UI orientada ao utilizador)

- Landing `/`
- Login, cadastro, recuperar / redefinir senha
- Dashboard, gerador, ATS Score, histórico, conta, assinatura, configurações (via `SettingsPanel` existente), admin
- FAQ, pricing, features, resources (fluxo servidor + cópias já centralizadas)
- Legal: privacidade, termos, cookies, suporte, reembolso, tratamento de dados
- Erro global

---

## 3. Componentes revisados (lista resumida)

`PublicNav`, `AppNav`, `SiteFooter`, `CookieConsent`, `TurnstileWidget`, `SocialAuthButtons`, `DashboardGenerator`, `SettingsPanel`, `UpgradePlans`, `UpgradeGate`, `AccountPanel`, `HistoryList`, `AtsAnalyzer`, `AdminBlockButton`, `LegalPage`, `global-error`.

---

## 4. Quatro idiomas (pt-BR, en, es, fr)

- Cópias novas acima estão definidas nos quatro `Locale`.
- O seletor de idioma (`LanguageProvider` + cookie `globalhire-locale`) continua a fonte de verdade no cliente; páginas legais e outras rotas servidor usam `getServerLocale()` alinhado ao mesmo cookie.

---

## 5. Textos hardcoded visíveis — estado honesto

- **Grande maioria** da UI de produto (fluxos listados) passa por ficheiros `lib/i18n*.ts` ou `getLocalizedPlans` / `getGeneratorUi`.
- **Ainda em português fixo no código** (não traduzidos por locale):
  - **Corpo jurídico detalhado** (secções numeradas, parágrafos longos e listas) em `lib/legal-content.ts` — mantido em PT para todos os idiomas, com **intro traduzida** + **banner explícito** (`legalBindingNotice`) para en/es/fr a indicar que a versão vinculante é em português (Brasil).
  - **Metadados SEO** estáticos em várias `page.tsx` (ex.: `title`/`description` em português nas rotas legais) — não alterados nesta tarefa para não misturar SEO com cookie de UI.
  - **Mensagens de erro brutas** devolvidas por APIs de terceiros (ex.: Supabase) podem aparecer no idioma do fornecedor.
  - **Nomes técnicos de plano** na tabela admin (`free`, `starter`, etc.) e **tipos de geração** na lista admin — identificadores de sistema.

Não afirmar “0 strings hardcoded em todo o `.tsx`” seria falso; afirmar que **toda a cópia de produto prioritária** foi migrada é mais preciso.

---

## 6. Card ATS da landing — legibilidade

- Painel interno passou a usar fundo **zinc-950** fixo, texto **zinc-50 / zinc-300**, scores **42%** / **91%** em alto contraste, e faixa inferior com **texto zinc sobre branco**.
- Evita herança de `text-card-foreground` do `Card` pai e combinações “claro sobre claro” no modo claro.

---

## 7. Países / regiões

- Continuam apenas **Brasil**, **Europa**, **Estados Unidos** com valores canónicos PT para API (`lib/target-countries.ts`).
- Rótulos: PT-BR / EN / ES / FR conforme especificação atualizada (ES: “Brasil, Europa, Estados Unidos”; FR: “Brésil, Europe, États-Unis”).

---

## 8. Stripe, `price_id` e lógica de preços

- **Sem alterações** a rotas `app/api/stripe/**`, `lib/plans.ts` (preços, `stripePriceEnv`, `price_id`), ou lógica de checkout além de **texto** em `UpgradePlans` (mensagens e links legais localizados).

---

## 9. Limitações reais (ficheiro + motivo)

| Limite | Motivo |
|--------|--------|
| `lib/legal-content.ts` — corpo das secções | Texto jurídico longo em PT; tradução integral profissional para 3 línguas excede o âmbito desta entrega; há aviso vinculante + intros traduzidas. |
| Metadados `export const metadata` em várias páginas | SEO/canonicals; exigiriam `generateMetadata` + política de URL por idioma. |
| Erros de API terceiros | Conteúdo não controlado pela app. |

---

## 10. Comandos

- `npm run lint` — OK  
- `npm run typecheck` — OK  
- `npm run build` — OK  

---

## 11. Próximos passos recomendados (opcional)

- Tradução jurídica integral EN/ES/FR com revisão jurídica.
- `generateMetadata` por `getServerLocale` nas rotas públicas.
- Localizar identificadores exibidos no admin (plan keys) se forem considerados “texto visível” para utilizadores não técnicos.

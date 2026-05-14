# Relatório: correção de i18n em `/dashboard`

## 1. Causa raiz

O conteúdo de `/dashboard` é um **Server Component** (`async function DashboardPage`) que resolve o idioma com `getServerLocale()` → cookie HTTP `globalhire-locale`. O seletor de idioma no cliente atualizava **estado React** e **localStorage**, e em `setLocale` também gravava o cookie — mas havia dois problemas:

1. **Restauração só via `localStorage`:** no `useLayoutEffect` do `LanguageProvider`, quando não havia cookie mas havia `globalhire-locale` no `localStorage`, o idioma da UI era aplicado **sem** gravar o cookie. O servidor continuava sem `globalhire-locale` e caía no fallback **`pt-BR`** em `getServerLocale()`, enquanto o seletor e a navegação mostravam outro idioma.

2. **Sem revalidação do Server Component após mudança de idioma:** mesmo com o cookie correto, trocar o idioma no mesmo fluxo não disparava nova renderização do RSC. Faltava **`router.refresh()`** após atualizar cookie/estado para o Next.js refazer o fetch do segmento servidor com o novo `Cookie`.

Efeito colateral visível: o **nome do plano** vinha de `plan.name` em `lib/plans.ts` (cópia em português), não de `getLocalizedPlanRow()`, então parte do card de plano podia parecer “travada” em PT mesmo com locale correto.

`export const dynamic = "force-dynamic"` já existia; não era o principal bloqueio.

## 2. Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `components/language-provider.tsx` | Escrita do cookie ao sincronizar a partir do `localStorage`; `router.refresh()` após essa sincronização e após `setLocale`; helper `writeLocaleCookie`; `setLocale` estável com `useCallback`. |
| `app/(app)/dashboard/page.tsx` | `generateMetadata` com título alinhado a `navCopy[locale].dashboard` e canonical; nome do plano via `getLocalizedPlanRow(locale, planId).name` (mantendo `d.eliteTest` no bypass admin). |

Nenhuma alteração em Stripe, preços, backend, auth, middleware de produto ou lógica de assinatura.

## 3. Textos / mecanismos migrados ou alinhados

- **Título da aba (metadata):** `generateMetadata` usa o mesmo rótulo de “Dashboard” que a navegação (`navCopy`) por locale (ex.: ES “Panel”, FR “Tableau de bord”).
- **Card “Plano atual”:** rótulos continuam em `dashboardPageCopy`; o **nome do plano** passa a usar **`getLocalizedPlanRow`** (mesma fonte que `/gerador` e `/ats-score`), sem mudar IDs de plano nem preços.
- Demais blocos já usavam `dashboardPageCopy`, `deliveryLabel` e `dateLocale`; sem mudança de copy além do necessário acima.

**Plataformas de carreira:** os rótulos dos links permanecem **nomes de marca** (LinkedIn, Indeed, Glassdoor, InfoJobs, Gupy), como antes; títulos e descrição da seção vêm de `dashboardPageCopy` (`careerTitle`, `careerLead`).

## 4. Mecanismo final de idioma

| Camada | Comportamento |
|--------|----------------|
| Cliente | `LanguageProvider`: lê cookie; se ausente, lê `localStorage`, **grava cookie** `globalhire-locale` (Path=/, Max-Age, SameSite=Lax), alinha `document.documentElement.lang` e chama **`router.refresh()`** quando sincroniza a partir do storage. |
| Mudança manual | `setLocale` atualiza estado, `localStorage`, cookie e **`router.refresh()`**. |
| Servidor | `getServerLocale()` em `lib/server-locale.ts` lê `cookies().get("globalhire-locale")` e valida com `isLocale`; fallback `pt-BR` só quando cookie inválido/ausente. |
| `/dashboard` | `force-dynamic` + `await getServerLocale()` no `page` e em `generateMetadata`. |

## 5. Confirmação dos quatro idiomas

Comportamento esperado após a correção:

- **pt-BR:** textos de `dashboardPageCopy["pt-BR"]`, datas `pt-BR`, título de aba “Dashboard \| GlobalHire AI”, nomes de plano da tabela PT em `plan-copy`.
- **en:** cópia `en`, datas `en-US`, título “Dashboard \| …”, nomes EN em `getLocalizedPlanRow`.
- **es:** cópia `es`, datas `es-ES`, título “Panel \| …”, nomes ES.
- **fr:** cópia `fr`, datas `fr-FR`, título “Tableau de bord \| …”, nomes FR.

## 6. Escopo não alterado

- **Stripe / checkout / webhooks:** inalterados.
- **Preços e strings de preço em `plan-copy`:** inalterados (apenas uso de `name` já existente por locale).
- **Backend / API / Supabase queries na página:** mesmas consultas e filtros.
- **Auth / `requireUser` / middleware Supabase:** inalterados.

## 7. Checklist manual de validação (preview) — textos de `/dashboard` nos 4 idiomas

Repetir para **pt-BR**, **English (US)**, **Español**, **Français**:

| # | Bloco / elemento | Onde verificar |
|---|------------------|----------------|
| 1 | Título da aba do navegador | Deve refletir `navCopy[locale].dashboard` + “\| GlobalHire AI”. |
| 2 | Banner pós-checkout (se abrir com `?checkout=success` etc.) | `paymentConfirmed`, `checkoutCancelled`, `subscriptionUpdated`, corpos de texto. |
| 3 | Card plano atual | `currentPlan`, nome do plano (localizado), `viewPlans`. |
| 4 | Card uso mensal | `monthlyUsage`, fração `used/limit`. |
| 5 | Bypass admin (se aplicável) | `adminBypassTitle`, `adminBypassBody`. |
| 6 | Inteligência de candidatura | `intelTitle`; empty: `intelEmpty`. |
| 7 | Com dados: documentos gerados | `docsGenerated`. |
| 8 | Tipo mais usado | `topType` + rótulo via `deliveryLabel`. |
| 9 | Último documento | `lastDoc` + data `toLocaleDateString(dateLocale)`. |
| 10 | Idiomas usados | `languagesUsed` + lista ou `noData`. |
| 11 | Países-alvo | `targetCountries` + lista ou `noData`. |
| 12 | ATS Score | `atsScoreCard`, `atsScoreHint`. |
| 13 | Contagem por tipo | `deliveryLabel` por tipo. |
| 14 | Ferramentas do plano | `toolsTitle`, links por tipo, `atsKeywords` ou `unlockAts`. |
| 15 | Plataformas de carreira | `careerTitle`, `careerLead`, links externos. |
| 16 | Atividades recentes | `activityTitle`, linhas com tipo + data, `activityEmpty`. |
| 17 | Links internos | “Ver planos”, histórico, gerador — textos dos `d.*` e `deliveryLabel`. |

**Fluxo obrigatório:** trocar idioma no seletor → abrir `/dashboard` → **recarregar (F5)** → idioma deve permanecer coerente (cookie + refresh).

## 8. Validação local (CI do repositório)

Comandos executados com sucesso (`exit code 0`):

- `npm run lint`
- `npm run typecheck`
- `npm run build`

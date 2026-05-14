# Relatório de auditoria visual (aceitação) — GlobalHire AI

**Data:** 2026-05-12  
**Escopo:** revisão por código + tokens CSS/Tailwind (sem deploy, sem merge).  
**Regra:** nenhuma correção aplicada antes da conclusão deste documento.

---

## 1. Metodologia

- Leitura de `app/page.tsx`, `app/globals.css`, `tailwind.config.ts` e componentes de alto tráfego.
- Verificação de pares **fundo / primeiro plano / muted** e de combinações proibidas indicadas pelo produto (`text-brand-*` sobre `bg-brand-*`, opacidades em texto crítico).
- Mapeamento de strings **hardcoded** (PT ou EN fixo) vs `lib/i18n.ts` / `useLanguage`.

---

## 2. Achados críticos (bloqueantes de aceitação)

### 2.1 Hero — card ATS simulado (landing, `app/page.tsx`)

**Local:** coluna “depois” + faixa explicativa inferior, dentro do painel `bg-ink/93`.

| Elemento | Classes / padrão observado | Risco |
|----------|---------------------------|--------|
| Label “Versão alinhada” | `text-brand-50` sobre `bg-primary/15` + `border-primary/40` | Texto muito claro sobre verde muito claro → **contraste insuficiente** (estimativa abaixo de WCAG AA para texto normal). |
| Score “91%” | `text-brand-100` (`#C8E9DD`) sobre fundo verde translúcido | **Quase sem hierarquia**; regra explícita do pedido: evitar combinação “mint sobre mint claro”. |
| Barra de progresso “depois” | trilho `bg-white/15` + preenchimento `bg-primary` | Preenchimento aceitável; trilho ok no painel escuro. |
| Faixa inferior (dica) | `bg-brand-50/95` + `text-brand-800` (título) + `text-muted-foreground` (corpo) | No **tema claro**, área clara aninhada em cartão escuro: título ok; corpo em **muted** pode ficar **lavado** em relação ao fundo mint. |

**Conclusão:** falha **crítica de legibilidade** no modo claro (e percepção “bugada”) no bloco “91%” / labels mint — **reprova** até correção dedicada.

---

## 3. Achados médios / baixos

### 3.1 `components/nav.tsx`

- `PublicNav`: lógica `copy.login === "Login" ? "Entrar" : copy.login` — **string fixa PT** ignorando i18n para `en`/`es`/`fr`.
- `AppNav`: grupos e itens (“Ferramentas”, “Currículo ATS”, “Conta”, “Menu”, etc.) **100% hardcoded PT**.

### 3.2 `components/cookie-consent.tsx`

- Títulos, parágrafos e botões **hardcoded PT**; não usa `useLanguage` nem dicionário.

### 3.3 `components/settings-panel.tsx`

- Títulos, labels de campos, opções de entrega, países, templates, mensagens de save — **hardcoded PT**.

### 3.4 `components/dashboard-generator.tsx`

- Listas de tipo, templates PDF, `generatorContext` (títulos, placeholders, CTAs), mensagens de upload/limite — **hardcoded PT** (parcialmente duplicado de `dashboardCopy`).

### 3.5 `components/account-panel.tsx`, `components/ats-analyzer.tsx`, `components/history-list.tsx`, `components/upgrade-plans.tsx`, `components/upgrade-gate.tsx`, `components/turnstile-widget.tsx`, `components/social-auth-buttons.tsx`

- Grande volume de copy em **PT fixo**; alguns ficheiros já consomem `dashboardCopy` / `navCopy` de forma parcial.

### 3.6 Páginas `app/(app)/*`, `app/(auth)/*`, `app/faq`, `app/pricing`, `app/features`, `app/resources`

- Copy majoritariamente **hardcoded PT** (FAQ, pricing, dashboard, admin, assinatura, etc.).

### 3.7 Páginas legais (`app/privacidade`, `app/termos`, … + `lib/legal-content.ts`)

- Conteúdo jurídico longo em **PT**; não há versões equivalentes nos outros idiomas no repositório. **Risco para “i18n completo”:** exige estratégia à parte (conteúdo legal traduzido), fora do escopo de só trocar chaves de UI.

### 3.8 `components/site-footer.tsx`

- Links de e-mail são conteúdo factual (ok); restante já usa `footerCopy`.

---

## 4. Inventário — lista de países (produto)

| Ficheiro | Conteúdo atual |
|----------|----------------|
| `components/dashboard-generator.tsx` | `allowedTargetCountries`: Brasil, Estados Unidos, Canadá, Reino Unido, Portugal, Alemanha, Europa. |
| `components/settings-panel.tsx` | Mesmo conjunto em `allowedTargetCountries` e `<option>`. |

**Pedido de produto:** reduzir a **Brasil**, **Estados Unidos**, **Europa** (região). Canadá, Reino Unido, Portugal e Alemanha devem sair da UI e da whitelist local; valores antigos em histórico/BD podem continuar a aparecer como dados legados.

---

## 5. Inventário — i18n (texto visível vs dicionário)

**Já centralizado em `lib/i18n.ts` (exemplos):** `landingCopy`, `dashboardCopy` (parcial), `navCopy` (parcial), `footerCopy`, `plan-copy` / planos.

**Fora do fluxo i18n ou incompleto (ficheiros com texto humano relevante):**

| Área | Ficheiros |
|------|-----------|
| Navegação app | `components/nav.tsx` |
| Cookies | `components/cookie-consent.tsx` |
| Configurações | `components/settings-panel.tsx` |
| Gerador | `components/dashboard-generator.tsx` |
| ATS | `components/ats-analyzer.tsx` |
| Histórico | `components/history-list.tsx` |
| Conta / upgrade | `components/account-panel.tsx`, `components/upgrade-plans.tsx`, `components/upgrade-gate.tsx` |
| Auth / social / Turnstile | `app/(auth)/*`, `components/social-auth-buttons.tsx`, `components/turnstile-widget.tsx` |
| Marketing | `app/faq/page.tsx`, `app/pricing/page.tsx`, `app/features/page.tsx`, `app/resources/page.tsx` |
| App shell | `app/(app)/dashboard/page.tsx`, `app/(app)/assinatura/page.tsx`, `app/(app)/admin/page.tsx`, `app/(app)/gerador/page.tsx`, `app/(app)/ats-score/page.tsx` |
| Legal / suporte | `app/privacidade`, `app/termos`, `app/cookies`, `app/support`, `app/data-processing`, `app/refund-policy`, `components/legal-page.tsx`, `lib/legal-content.ts` |
| Erros globais | `app/global-error.tsx` |

**Riscos de migração i18n:**

- Páginas **Server Components** com copy dinâmica: exige `"use client"` ou passagem de `locale` do servidor (cookie/header) para evitar flash/hidratação inconsistente.
- **JSON-LD** (`structured-data.tsx`, FAQ): deve refletir o idioma ativo no cliente.
- **Legal:** tradução completa ≠ refator técnica; pode exigir conteúdo jurídico revisado por idioma.

---

## 6. Decisão de aceitação (pré-correção)

| Critério | Estado |
|----------|--------|
| Hero ATS “91%” / labels mint | **REPROVADO** |
| Dark mode global (tokens) | **APROVADO** no código atual (sem regressão intencional nesta auditoria) |
| i18n cobertura total | **REPROVADO** — grande volume fora do dicionário |
| Lista de países vs especificação | **REPROVADO** — ainda inclui países extra |

---

## 7. Próximos passos (pós-relatório, por ordem)

1. Corrigir **definitivamente** o bloco ATS simulado na landing (contraste AA nos textos críticos; sem `text-brand-100` em score sobre fundo claro-mint).
2. Unificar whitelist + opções: **Brasil, Estados Unidos, Europa** apenas.
3. Migrar copy listada para o sistema i18n (4 locales), com validação manual PT / EN / ES / FR.
4. `npm run lint`, `npm run typecheck`, `npm run build`.
5. Preencher `docs/rebranding/POST_FIX_QA_REPORT.md`.

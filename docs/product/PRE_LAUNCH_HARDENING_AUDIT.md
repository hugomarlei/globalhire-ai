# Pré-lançamento — hardening e leitura de go-live

**Data:** maio de 2026  
**Branch:** `staging/pre-go-live-sync`  
**Contexto:** Fase final pré-lançamento — sem novas features grandes; foco estabilidade e readiness.

---

## 1. Commits organizados (Fase 2 limitada)

| Hash | Mensagem |
|------|----------|
| `8dd5c9e` | `feat(pdf): add resume print stylesheet registry` |
| `3d27d63` | `feat(ai): humanize prompts and add length/tone to generate API` |
| `f8edd12` | `feat(generator): add interview guide card output component` |
| `7e9fd84` | `feat(generator): premium layout, iframe PDF export, and voice controls` |
| `a3d776e` | `docs(product): phase 2 limited report and roadmap note` |

*(Commits Growth Cockpit anteriores permanecem no histórico: `246a4b3` … `4063313`.)*

---

## 2. Push

- **Remote:** `origin`  
- **Atualização:** `4063313..a3d776e` → `staging/pre-go-live-sync`  
- **Nota:** Ambiente local com sandbox pode falhar `next build` com `ENOENT` em `.next/export`; build completo validado com filesystem completo (exit 0).

---

## 3. Launch blockers (críticos)

| ID | Descrição | Status |
|----|------------|--------|
| B1 | Falha de build / types / lint na branch | **Não encontrado** — `lint` e `typecheck` OK; `build` OK em ambiente sem restrição a `.next`. |
| B2 | Regressão Stripe / auth / RLS | **Fora do âmbito desta wave** — não alterado. |
| B3 | Erro de runtime óbvio no gerador pós-refactor | **Não identificado** em revisão estática; requer smoke manual (gerar, PDF, entrevista). |

**Conclusão:** nenhum **bloqueador crítico de código** identificado nesta auditoria focada; permanecem **riscos operacionais** (abaixo) típicos de go-live controlado.

---

## 4. Riscos e edge cases (não bloqueadores; monitorar)

| Área | Observação |
|------|-------------|
| **i18n servidor vs cliente** | `getServerLocale()` (cookie) pode diferir do primeiro paint do `LanguageProvider` até `useLayoutEffect` sincronizar — comportamento já documentado no repo; mitigação: cookie `globalhire-locale` + `router.refresh()`. |
| **PDF / print** | Fluxo por iframe + `print()` depende do browser; validar Safari iOS/macOS e “Save as PDF”. |
| **Entrevista / modelo** | Se o modelo ignorar marcadores `===`, o fallback por parágrafos mantém UX legível. |
| **Regenerar histórico** | Não reenvia `outputLength` / `outputTone` — usa defaults do prompt; aceitável para launch; alinhar pós-launch se necessário. |
| **Analytics** | Eventos existentes preservados; novos campos opcionais não exigidos no backend. |
| **A11y** | `focus-ring` e labels em `Field` presentes; landmark explícito na zona de preview seria melhoria incremental. |
| **Mobile** | Preview sticky só `lg+`; em mobile a ordem é form → preview; toolbar com `flex-wrap`. |
| **Console** | `turnstile-widget` usa `console.warn` em falha de render — útil para suporte; não removido. |

---

## 5. Correções realizadas nesta wave

- **Commits** da Fase 2 separados logicamente (PDF / IA / componente entrevista / UX+i18n / docs).  
- **Exclusão** de `tsconfig.tsbuildinfo` dos commits (restaurado antes do commit).  
- **Validação:** `npm run lint`, `npm run typecheck`, `npm run build` (build com permissões completas no ambiente de validação).

---

## 6. O que **não** foi alterado

- Migrações, schema Supabase, RLS.  
- Stripe (checkout, portal, webhook), auth profunda, onboarding.  
- Resume Builder persistido, AI Review pesado, refactors amplos.  
- Novas integrações ou automações.

---

## 7. QA checklist final (manual)

- [ ] Login / sessão expirada → redirect esperado.  
- [ ] Gerador: gerar ATS, carta, LinkedIn, mensagem (com voz), guia entrevista.  
- [ ] PDF: impressão / guardar PDF em Chrome e um segundo browser.  
- [ ] Mobile: scroll form + preview, botões acessíveis.  
- [ ] i18n: trocar PT/EN/ES/FR e ver nav + gerador coerentes.  
- [ ] Consentimento analytics + evento smoke (ex.: login / page_view).  
- [ ] ATS Score fluxo principal sem erro 500.  
- [ ] Admin + Growth cockpit apenas para admin.  
- [ ] `npm run lint && npm run typecheck && npm run build` na CI / máquina limpa.

---

## 8. Veredito

### **READY FOR CONTROLLED GO-LIVE**

**Condições:**

1. Smoke QA manual na checklist acima em **produção de staging** antes de tráfego amplo.  
2. Monitorização (Sentry / PostHog) ativa nas primeiras 24–48 h.  
3. Plano de rollback via deploy anterior (Vercel) acordado.

Não há evidência nesta auditoria de **bloqueador crítico** que imponha **BLOCKED WITH CRITICAL ISSUES**, assumindo ambiente de build/deploy equivalente ao validado.

---

*Ver também: `docs/product/PHASE2_LIMITED_REPORT.md`, `docs/product/GROWTH_AND_RESUME_ROADMAP.md`, `docs/security/FINAL_GO_LIVE_SECURITY_AUDIT.md`.*

# Fase 2 limitada — relatório (premium UX + IA + PDF)

**Data:** maio de 2026  
**Escopo:** evolução de percepção e UX do gerador **sem** migrações, schema, RLS, persistência de versões ou Resume Builder completo.

---

## Validação de risco (pré-implementação)

| Critério | Avaliação |
|----------|-----------|
| Risco arquitetural | **Baixo** — alterações concentradas em UI do gerador, um módulo de PDF, prompts e validação `zod` na rota `/api/ai/generate`. |
| Impacto no go-live | **Controlado** — sem Stripe/Supabase schema; regressão mais provável seria UX do PDF (mitigada com iframe oculto + `afterprint`). |
| Volume de ficheiros | ~15 toques (novos + alterados), execução única razoável. |
| Créditos/contexto | Moderado; entrega dividida por commits sugeridos abaixo se quiseres PRs menores. |

**Conclusão:** fase segura para o estágio pre–go-live, alinhada às restrições explícitas (nada de DB).

---

## O que foi implementado

1. **Resume builder UX (incremental)** — Layout em grelha 12 colunas (formulário ~5 col, preview ~7 col), preview com cartão “papel”, melhor hierarquia, upload em bloco destacado, **preview fixo** (`sticky`) em desktop, melhorias de espaçamento e CTAs.
2. **Sistema de templates PDF leve** — `lib/resume-pdf-templates.ts`: registo por `PdfTemplateKey` + categoria (`ats` / `modern` / `compact`), CSS centralizado e **extensível**; rótulos de template atualizados no i18n.
3. **PDF UX** — deixa de usar `window.open("","_blank")` + `document.write` + `print` inline no mesmo fluxo visível; usa **iframe 0×0** com HTML completo, `print()` no `requestAnimationFrame`, limpeza em `afterprint` (fallback timeout).
4. **Humanização IA** — `prompts/ai-prompts.ts`: reforço anti-“GPTzão” em carta, LinkedIn e mensagem ao recrutador; bloco **tamanho + tom** quando aplicável.
5. **Controles tamanho e tom** — `short | medium | detailed` e `natural | professional | confident | direct`; enviados no body do `POST` `/api/ai/generate`; validados em `lib/validation.ts`; **apenas** recruiter / carta / LinkedIn.
6. **Guia para entrevista** — i18n (nav, dashboard `deliveryTypes`, gerador, planos, `plan-copy` EN/ES/FR); prompt com seções `=== TITULO ===`; UI em **cartões** (`components/interview-guide-output.tsx`) com fallback por parágrafos.
7. **Polish** — loading na lista de melhorias; hierarquia de botões (PDF primário); persistência opcional de `outputLength` / `outputTone` em `globalhire-preferences` (merge).

---

## Ficheiros alterados ou criados

| Ficheiro | Notas |
|----------|--------|
| `lib/resume-pdf-templates.ts` | **Novo** — meta + CSS + `buildResumePdfPrintDocument` |
| `components/interview-guide-output.tsx` | **Novo** — cartões + parser de secções |
| `components/dashboard-generator.tsx` | Layout, voz, PDF, preview condicional |
| `prompts/ai-prompts.ts` | Voz, anti-clichê, guia entrevista, export `VOICE_CONTROLLED_GENERATION_TYPES` |
| `lib/validation.ts` | `outputLength`, `outputTone` com defaults |
| `app/api/ai/generate/route.ts` | Passa campos ao `buildPrompt` |
| `lib/i18n-generator.ts` | Novos rótulos UI + guia entrevista + nomes PDF |
| `lib/i18n.ts` | `deliveryTypes.interview_prep` |
| `lib/i18n-app-wide.ts` | `toolInterview` (ES/FR corrigidos) |
| `lib/plans.ts` | Labels PT “Guia para entrevista” |
| `lib/plan-copy.ts` | Features locais (interview wording) |
| `docs/product/PHASE2_LIMITED_REPORT.md` | Este relatório |

---

## O que **não** foi alterado

- Migrações, schema Supabase, RLS, buckets, persistência multi-versão de CV.
- Stripe (checkout, portal, webhook), auth, Founder Growth Cockpit.
- ATS analyzer profundo, rota `regenerate` (não guarda tamanho/tom — usa defaults do prompt).
- `optimize-from-score` (continua só ATS; defaults de voz no prompt quando não aplicável).
- Redesign global do design system ou onboarding.

---

## QA checklist

- [ ] Gerador: layout responsivo; sticky preview em viewport larga.
- [ ] Tipos com voz: selects aparecem; request inclui `outputLength` / `outputTone` (network tab).
- [ ] PDF: abre diálogo de impressão **sem** separador `about:blank` óbvio; conteúdo e watermark (free) corretos.
- [ ] Guia entrevista: texto em cartões; se o modelo ignorar `===`, ainda há fallback por parágrafos.
- [ ] i18n PT/EN/ES/FR nos novos rótulos e renomeação “Guia para entrevista”.
- [ ] `npm run lint`, `typecheck`, `build` — executados com sucesso nesta entrega.

---

## Próximos passos sugeridos (fora desta fase)

- Fase com **persistência** de CV (quando autorizado): tabela + RLS + ligação ao gerador.
- Regeneração com os mesmos controlos de voz (persistir `outputLength`/`outputTone` em `generations` ou reaproveitar último pedido).
- PDF **server-side** quando quiseres “Download” sem passar pelo print do browser.

---

*Documento alinhado a `docs/product/GROWTH_AND_RESUME_ROADMAP.md`.*

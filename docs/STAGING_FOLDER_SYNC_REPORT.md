# Staging + consolidação de pasta antiga — relatório

**Branch:** `staging/pre-go-live-sync` (base: `b7124d2`)  
**Data:** 2026-05-12  
**Pastas comparadas:**

| Papel | Caminho absoluto |
|-------|-------------------|
| **Repo atual (fonte de verdade)** | `…/Codex/2026-05-07 copie/voc-meu-cto-product-manager-desenvolvedor` |
| **Snapshot antigo (referência)** | `…/Codex/2026-05-07/voc-meu-cto-product-manager-desenvolvedor` |

> O pedido citava `codex/2026-05-07 copie/...` como pasta do projeto; não existe segunda cópia **dentro** do repositório. A comparação útil é entre o snapshot **sem** `copie` (mais antigo) e o repo **com** `copie` (atual, com `b7124d2`).

---

## Fase 1 — Branch de staging

| Verificação | Estado |
|-------------|--------|
| Branch atual | `staging/pre-go-live-sync` |
| Working tree | Limpo |
| `b7124d2` presente | Sim (`git merge-base --is-ancestor b7124d2 HEAD`) |
| Push para `main` | **Não realizado** (conforme regra) |

---

## Fase 2 — Análise da pasta antiga (`2026-05-07/…` sem `copie`)

### 1. Arquivos novos (só no snapshot antigo)

**Nenhum** ficheiro relativo existe apenas no OLD: o conjunto de paths em OLD ⊆ NEW (após normalizar exclusões). Ou seja, o snapshot antigo **não traz** ficheiros que já não existam no repo atual.

### 2. Arquivos iguais

A maior parte da árvore (código app, `lib/`, `supabase/schema.sql`, etc.) é **idêntica** entre OLD e NEW; `diff -rq` não listou diferenças para esses paths.

### 3. Arquivos modificados (OLD vs NEW — conteúdo diferente)

| Ficheiro | Nota |
|----------|------|
| `components/structured-data.tsx` | NEW = JSON-LD sem `SearchAction` falso (pós `b7124d2`). OLD ainda tinha `SearchAction`. |
| `docs/GO_LIVE_CHECKLIST.md` | NEW expandido. |
| `docs/OPERATIONS.md` | NEW com links CI + log. |
| `docs/audit/04_SECURITY_AUDIT.md` | NEW com nota CORS produção. |
| `docs/audit/05_SEO_AUDIT.md` | NEW com SearchAction removido. |
| `docs/audit/10_CRITICAL_PENDING.md` | NEW com CSP/CORS atualizados. |

### 4. Arquivos conflitantes

Não há “dois ficheiros diferentes com o mesmo path de origens distintas”. Há apenas **versões antigas (OLD)** vs **versões novas (NEW)**. **Nunca** copiar OLD por cima de NEW nestes paths — seria **regressão**.

### 5. Perigosos — nunca copiar

- `.env`, `.env.local`, `.env.*`
- `.vercel/`
- `node_modules/`, `.next/`
- Qualquer ficheiro com chaves API, `service_role`, `whsec_`, `sk_live_`, etc.
- `package-lock.json` do OLD (se no futuro divergir: risco de **downgrade** de dependências)

### 6. Documentação útil

- Toda a documentação **relevante** já está no NEW **igual ou mais recente** que no OLD.
- Ficheiros **só no NEW:** `docs/MASTER_CONTEXT.md`, `docs/PRODUCTION_VERIFICATION_LOG.md`, pasta `.github/workflows/` (CI).

### 7. Código com impacto em produção

Os únicos diffs de código em aplicação são os listados em §3; todos já refletem **melhorias** no NEW. Copiar OLD **reverteria** SEO e docs de segurança.

### 8. Branding / assets

Sem diferenças reportadas por `diff -rq` entre árvores (ex.: `public/brand`, `public/branding` iguais).

### 9. Configuração

Sem diferenças listadas em `next.config.ts`, `middleware.ts`, `package.json` entre OLD e NEW nesta comparação (ficheiros alinhados).

### 10. Possíveis secrets

- Não inspecionar nem versionar `.env*` da pasta antiga.
- Se existir `.env.local` só no disco OLD: **não** copiar para o repo; recriar variáveis manualmente na Vercel / local.

---

## Fase 3 — Obsoleto vs trazer vs arquivar

| Classificação | Conteúdo |
|---------------|----------|
| **Obsoleto** | Snapshot `2026-05-07/voc-…` como fonte de merge de código/docs (está atrás do `copie`). |
| **Já existe no atual** | Quase toda a árvore. |
| **Pode sobrescrever melhorias recentes** | Qualquer cópia **OLD → NEW** nos ficheiros da §3. **Proibido** sem revisão explícita. |
| **Trazer para o repo** | **Nada** identificado como exclusivo e seguro no OLD. |
| **Arquivar como referência** | Manter a pasta `2026-05-07/voc-…` no disco como backup histórico; não integrar ao git automaticamente. |

---

## Fase 4 — Plano de merge seguro

| Ação | Ficheiros | Risco | Rollback |
|------|-----------|-------|----------|
| **Copiar da pasta antiga** | *Nenhum* nesta rodada | N/A | N/A |
| **Ignorar** | Todo o OLD para propósito de merge | — | — |
| **Revisão manual futura** | Se no futuro aparecerem PDFs/outros **só** no OLD, tratar caso a caso | Baixo se só docs sem código | Revert commit |
| **Testes** | `npm run typecheck`, `lint`, `build` na branch `staging/pre-go-live-sync` | — | — |

**Sem alterações** a: Stripe, Supabase, Auth, `middleware`, env vars, `next.config.ts`, `package.json`, `package-lock.json` (conforme autorização).

---

## Fase 5 — Aplicado (seguro)

- Nenhuma cópia de ficheiros da pasta antiga para o repo.
- Apenas este relatório + [`VERCEL_PREVIEW_CHECKLIST.md`](./VERCEL_PREVIEW_CHECKLIST.md) na branch de staging.

---

## Fase 6 — Testes

Executar na raiz do repo (branch `staging/pre-go-live-sync`):

```bash
npm run typecheck && npm run lint && npm run build
```

*(Resultado registado no commit desta branch.)*

---

## Fase 7 — Preview na Vercel

Ver instruções passo a passo em [`VERCEL_PREVIEW_CHECKLIST.md`](./VERCEL_PREVIEW_CHECKLIST.md).

**Resumo:** push da branch `staging/pre-go-live-sync` para `origin` abre **Preview Deployment** com URL `*.vercel.app` ou domínio de preview; **não** altera `https://www.globalhireai.com.br` enquanto o domínio de produção continuar associado a `main` (ou à branch configurada em Production).

---

## Critérios de sucesso

- [x] Produção (`www`) não foi alterada por esta fase (sem deploy forçado daqui).
- [x] Branch `staging/pre-go-live-sync` contém `b7124d2` + documentação de staging/sync/preview.
- [x] Nenhum secret nem `.env` versionado.
- [ ] Preview na Vercel validado por ti após push da branch (checklist externo).

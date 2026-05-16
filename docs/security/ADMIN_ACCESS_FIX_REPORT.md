# Correção do controlo de acesso admin — relatório

**Data:** maio de 2026  
**Branch:** conforme deploy (não foi feito merge em `main` por esta entrega).

---

## 1. Causa raiz

`requireAdmin()` em `lib/auth.ts` autorizava admin se **qualquer uma** das condições fosse verdadeira:

- `profiles.is_admin === true`, **ou**
- o e-mail do utilizador constasse em `ADMIN_EMAILS`.

Assim, **`hugo.master21@gmail.com` conseguia /admin** se:

1. a sua linha em `public.profiles` tivesse `is_admin = true` (configuração errada, seed, ou teste anterior), **mesmo que** não estivesse em `ADMIN_EMAILS`, **ou**
2. `ADMIN_EMAILS` no ambiente (ex.: Vercel) incluísse esse e-mail (ou lista demasiado larga).

A navegação mostrava links admin com base **apenas** em `profile.is_admin`, mas o **servidor** aceitava também a lista de e-mails — um utilizador podia **abrir /admin diretamente** se `is_admin` estivesse errado na base.

**Fonte de verdade era dupla** (DB + env), o que é uma origem típica de “admin por acidente”.

---

## 2. Fonte de verdade depois da correção

| Superfície | Regra |
|------------|--------|
| `/admin`, `/admin/growth`, `POST /api/admin/block-user` | **`ADMIN_EMAILS` apenas** — lista normalizada no servidor (`lib/admin-access.ts`). |
| Navegação (links Admin / Growth) | **Mesma função** `isAllowedAdminEmail(user.email)` no layout da app. |
| `profiles.is_admin` | **Não** usado para gates de rota. Pode continuar a existir para higiene de dados / relatórios; opcional limpar com SQL fornecido. |

**Fail closed:** se `ADMIN_EMAILS` estiver vazio ou só espaços, **ninguém** passa `requireAdmin` (evita fallback permissivo por coluna na base).

---

## 3. Admins “antes” (lógica antiga)

Não há acesso ao teu projeto Supabase a partir deste ambiente. Formalmente, **antes**:

- Qualquer utilizador com **`is_admin = true`** em `profiles`, **ou**
- qualquer e-mail em **`ADMIN_EMAILS`** (variável de ambiente),

era tratado como admin nas rotas servidas por `requireAdmin`.

Para listar **em produção** quem tinha a flag na base, executar no SQL Editor:

```sql
SELECT id, email, is_admin
FROM public.profiles
WHERE is_admin = true
ORDER BY email;
```

E em Vercel (ou outro host): rever o valor exacto de **`ADMIN_EMAILS`** (sem o colar aqui em chats públicos).

---

## 4. Admins “depois” (esperado)

- **Único e-mail na allowlist:** `hugomarcianoleite@gmail.com` → definir em `ADMIN_EMAILS` (único valor ou com separação por vírgula só se fizer sentido; para um só admin, uma entrada basta).
- **`hugo.master21@gmail.com`:** não deve aparecer em `ADMIN_EMAILS`; após correcão de código, **`is_admin` na base deixa de abrir /admin** mesmo que ainda esteja `true`, até corrigires dados.

---

## 5. Ficheiros alterados

| Ficheiro | Alteração |
|----------|-----------|
| `lib/admin-access.ts` | **Novo** — allowlist a partir de `ADMIN_EMAILS`, `isAllowedAdminEmail`. |
| `lib/auth.ts` | `requireAdmin` usa só `isAllowedAdminEmail` (remove OR com `profiles.is_admin`). |
| `app/(app)/layout.tsx` | `isAdmin` na nav = mesma função; removido uso de `profile.is_admin` para o menu. |
| `supabase/sql/cleanup_admin_flags.sql` | **Novo** — SQL opcional para alinhar `is_admin` na base. |
| `docs/security/ADMIN_ACCESS_FIX_REPORT.md` | Este relatório. |
| `docs/security/ACCESS_CONTROL.md` | Actualizado para reflectir a política. |
| `README.md` | Secção Admin alinhada. |
| `.env.example` | Comentário sobre `ADMIN_EMAILS` obrigatório para admin. |

**Sem** migrations automáticas no repo além do ficheiro SQL opcional.  
**Sem** alteração a Stripe, pricing, onboarding, RLS policies.

---

## 6. SQL / migration

- Não foi aplicada migration via CI.
- Opcional: correr `supabase/sql/cleanup_admin_flags.sql` no **Supabase Dashboard → SQL Editor** após definir `ADMIN_EMAILS` correctamente no deploy.

---

## 7. O que **não** foi alterado

- Stripe, webhooks, preços.
- `requireUser`, cookie de sessão, middleware (continua sem gate específico de admin — correcto).
- `ADMIN_BYPASS_EMAILS` / `hasAdminBypass` (plano Elite de teste — outro controle).
- RLS em `profiles` (não era a causa do bug de rota admin).

---

## 8. Validação automática (nesta máquina)

Execução após alterações:

- `npm run lint` — OK  
- `npm run typecheck` — OK  
- `npm run build` — OK

---

## 9. Como validar manualmente

1. Em **produção/staging**: definir `ADMIN_EMAILS=hugomarcianoleite@gmail.com` (sem espaços desnecessários; uma entrada).
2. Fazer deploy.
3. Com **`hugomarcianoleite@gmail.com`**: abrir `/admin` e `/admin/growth` → deve carregar.
4. Com **`hugo.master21@gmail.com`**: abrir `/admin` e `/admin/growth` → redireccionamento para `/dashboard`.
5. Conta **free** qualquer: mesmo teste → `/dashboard`.
6. Opcional: correr o SQL de limpeza e repetir o ponto 4.

---

## 10. Riscos remanescentes

- **`ADMIN_EMAILS` vazio em produção** bloqueia **todos** os admins até corrigir env (comportamento intencional, fail closed).
- **Erro de digitação** no e-mail em `ADMIN_EMAILS` bloqueia o operador real.
- **Contas partilhadas / aliases** de e-mail: a allowlist compara o e-mail reportado pelo Supabase Auth.

---

## 11. Checklist operacional imediato (Vercel / host)

- [ ] `ADMIN_EMAILS` = exactamente `hugomarcianoleite@gmail.com` (ou lista explícita aprovada).
- [ ] Confirmar que **não** existe `hugo.master21@gmail.com` nessa variável.
- [ ] Opcional: SQL `cleanup_admin_flags.sql` na base.
- [ ] Redeploy se só alteraste variáveis.

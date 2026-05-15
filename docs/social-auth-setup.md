# Login social — Google, LinkedIn e Facebook (Supabase Auth)

Guia manual para ativar OAuth no **Supabase Dashboard** e nos portais LinkedIn/Meta.  
O código da GlobalHire AI **não** armazena Client ID nem Client Secret — apenas chama `supabase.auth.signInWithOAuth()`.

## Código (referência)

| Peça | Caminho |
|------|---------|
| Botões sociais | `components/social-auth-buttons.tsx` |
| Provider IDs | `lib/social-oauth.ts` (`google`, `linkedin_oidc`, `facebook`) |
| Callback OAuth | `app/auth/callback/route.ts` |
| Redirect pós-login | `getAuthCallbackUrl("/dashboard")` em `lib/app-url.ts` |
| Tracking OAuth concluído | `components/oauth-session-tracker.tsx` (layout autenticado) |

## URLs oficiais

**Site:** `https://www.globalhireai.com.br`

**Callback OAuth (obrigatório no Supabase e nos provedores):**

```text
https://www.globalhireai.com.br/auth/callback
https://globalhireai.com.br/auth/callback
http://localhost:3000/auth/callback
```

**Redirect interno após sucesso:** `/dashboard` (via query `?next=/dashboard` no callback).

---

## 1. Supabase — configuração geral

1. Abra [Supabase Dashboard](https://supabase.com/dashboard) → projeto de produção.
2. **Authentication** → **URL Configuration**:
   - **Site URL:** `https://www.globalhireai.com.br`
   - **Redirect URLs:** inclua as três URLs de callback acima (+ preview Vercel se usar).
3. **Authentication** → **Providers** — ative cada provider abaixo.

Variáveis no app (já usadas pelo cliente):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Não é necessário expor secrets OAuth no Vercel.

---

## 2. Google OAuth (já em uso)

Documentação detalhada: [`docs/GOOGLE_OAUTH_REVIEW.md`](./GOOGLE_OAUTH_REVIEW.md)

Resumo:

1. Google Cloud Console → OAuth client (Web).
2. Authorized redirect URI: URL do Supabase (formato `https://<project-ref>.supabase.co/auth/v1/callback`) **e** `/auth/callback` do app se exigido pelo fluxo.
3. Copiar Client ID + Secret → Supabase → **Google** provider.
4. Testar em produção com `Continuar com Google`.

---

## 3. LinkedIn OAuth (`linkedin_oidc`)

### 3.1 LinkedIn Developer Portal

1. Acesse [LinkedIn Developers](https://www.linkedin.com/developers/).
2. Crie um app (ou use existente).
3. Em **Products**, habilite **Sign In with LinkedIn using OpenID Connect**.
4. Em **Auth**:
   - **Authorized redirect URLs:** adicione o callback do Supabase (copie em Supabase → Authentication → Providers → LinkedIn → “Callback URL”).
   - Exemplo típico: `https://<project-ref>.supabase.co/auth/v1/callback`
5. Copie **Client ID** e **Client Secret**.

### 3.2 Supabase

1. **Authentication** → **Providers** → **LinkedIn (OIDC)**.
2. Ative o provider.
3. Cole Client ID e Client Secret.
4. Salve.

### 3.3 Código

Provider string: `linkedin_oidc`  
Scopes solicitados: `openid profile email` (em `lib/social-oauth.ts`).

### 3.4 Teste

1. Produção → `/login` ou `/cadastro`.
2. **Continuar com LinkedIn** → consentimento LinkedIn → retorno em `/dashboard`.
3. Verificar eventos `login_completed` / `signup_completed` no PostHog (com consentimento de cookies).

---

## 4. Facebook OAuth (`facebook`)

### 4.1 Meta for Developers

1. Acesse [Meta for Developers](https://developers.facebook.com/).
2. Crie um app tipo **Consumer** ou **Business** (conforme política Meta).
3. Adicione produto **Facebook Login**.
4. **Facebook Login** → **Settings**:
   - **Valid OAuth Redirect URIs:** callback do Supabase (mesmo padrão `https://<project-ref>.supabase.co/auth/v1/callback`).
5. **Settings** → **Basic:** copie **App ID** e **App Secret**.
6. Coloque o app em modo **Live** quando for testar usuários reais (modo Development limita testadores).

### 4.2 Supabase

1. **Authentication** → **Providers** → **Facebook**.
2. Ative e cole App ID / App Secret.
3. Salve.

### 4.3 Código

Provider string: `facebook`

### 4.4 Teste

Mesmo fluxo que LinkedIn; botão **Continuar com Facebook**.

---

## 5. Preview (Vercel) vs produção

| Ambiente | `getAppUrl()` | OAuth |
|----------|---------------|--------|
| Produção | `https://www.globalhireai.com.br` | Use providers Live |
| Preview | host `*.vercel.app` do deploy | Adicione redirect no Supabase **e** no Google/LinkedIn/Meta para esse host |
| Local | `http://localhost:3000` | `localhost` callback na lista Supabase |

Se o provider não estiver configurado, o usuário vê mensagem amigável e pode usar **e-mail e senha**. Erros de redirect costumam enviar para `/login?social=not_configured`.

---

## 6. Troubleshooting

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| Botão volta sem login | Provider desativado no Supabase | Ativar provider + credenciais |
| `redirect_uri_mismatch` | URL de callback errada no LinkedIn/Meta/Google | Alinhar com callback exibido no Supabase |
| Volta para `/login?social=not_configured` | Erro OAuth (provider off, app em dev, domínio não autorizado) | Logs Supabase Auth + revisar redirect URLs |
| Google OK, LinkedIn/Facebook falham | Só Google configurado | Seguir secções 3 e 4 |
| Preview falha, produção OK | Redirect não listado para host preview | Adicionar URL preview em Supabase e no provedor |
| Sem evento `login_completed` OAuth | Cookies analytics recusados ou sessão não chegou ao `(app)` | Aceitar cookies; confirmar redirect até `/dashboard` |

---

## 7. Segurança

- Secrets **somente** no Supabase (e portais Google/LinkedIn/Meta).
- Nenhum Client Secret no repositório ou no bundle Next.js.
- Callback troca `code` por sessão no servidor (`exchangeCodeForSession`).

---

## 8. Compartilhamento pós-logout (relacionado)

Banner em `/?logout=success` — ver `components/logout-share-actions.tsx` e `lib/logout-share.ts`.  
Não depende de OAuth; usa links públicos LinkedIn/WhatsApp e cópia de texto.

---

Última atualização: maio de 2026 — alinhado ao branch `staging/pre-go-live-sync`.

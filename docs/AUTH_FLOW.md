# GlobalHire AI - Auth Flow

Status: IMPLEMENTADO.

## Fluxos

- Login e senha via Supabase Auth.
- Cadastro e senha via Supabase Auth.
- Google OAuth via Supabase.
- Recuperação e redefinição de senha.
- Logout via `/api/auth/signout`.

## URLs

- Login: `/login`
- Cadastro: `/cadastro`
- Recuperar senha: `/recuperar-senha`
- Redefinir senha: `/redefinir-senha`
- OAuth callback: `/auth/callback`

## UX Go-Live

- Landing mobile mostra `Entrar` e `Criar conta`.
- Login e cadastro mostram `Continuar com Google`.
- Login e cadastro mostram `Continuar com e-mail`.
- Erros sociais não configurados são tratados com mensagem amigável.

## Segurança

- Login/cadastro com e-mail validam Turnstile antes de chamar Supabase Auth.
- OAuth não expõe client secret no frontend.
- Redirect OAuth usa `getAuthCallbackUrl()`.

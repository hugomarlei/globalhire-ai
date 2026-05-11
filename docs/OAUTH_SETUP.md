# GlobalHire AI - OAuth Setup

Status: GOOGLE IMPLEMENTADO.

## Google OAuth

Google OAuth é configurado no Supabase Auth. O app não guarda client secret no código.

## URLs Importantes

- App: `https://www.globalhireai.com.br`
- Callback app: `/auth/callback`
- Privacy Policy: `https://www.globalhireai.com.br/privacidade`
- Terms: `https://www.globalhireai.com.br/termos`
- Support: `https://www.globalhireai.com.br/support`

## Verificações

- `NEXT_PUBLIC_APP_URL` deve ser `https://www.globalhireai.com.br`.
- Supabase Site URL deve usar o domínio oficial.
- Google Cloud deve apontar para a URL de callback Supabase exigida pelo provider.
- Não usar domínio antigo Vercel em OAuth.

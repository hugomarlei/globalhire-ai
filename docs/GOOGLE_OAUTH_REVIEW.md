# Google OAuth Review — GlobalHire AI

Status: READY WITH MANUAL CONFIGURATION  
Última revisão: 2026-05-11

## Domínio oficial

```text
https://www.globalhireai.com.br
```

O domínio raiz `https://globalhireai.com.br` deve redirecionar para `https://www.globalhireai.com.br`.

## URLs públicas para Google OAuth

- Homepage: `https://www.globalhireai.com.br`
- Privacy Policy: `https://www.globalhireai.com.br/privacidade`
- Terms of Service: `https://www.globalhireai.com.br/termos`
- Support: `https://www.globalhireai.com.br/support`
- Cookies: `https://www.globalhireai.com.br/cookies`
- Data Processing: `https://www.globalhireai.com.br/data-processing`

## Configuração Supabase

Site URL:

```text
https://www.globalhireai.com.br
```

Redirect URLs permitidas:

```text
https://www.globalhireai.com.br/auth/callback
https://globalhireai.com.br/auth/callback
http://localhost:3000/auth/callback
```

## Código revisado

- `getAppUrl()` usa `NEXT_PUBLIC_APP_URL` e fallback canônico para `https://www.globalhireai.com.br`.
- Domínio antigo `globalhire-ai.vercel.app` é rejeitado pela função central.
- Google OAuth usa `getAuthCallbackUrl("/dashboard")`.
- Login social não solicita scopes sensíveis no código.
- Query params Google usados: `access_type=offline` e `prompt=consent`.

## Pontos para tela de consentimento Google

- App name: `GlobalHire AI`.
- User support email: `support@globalhireai.com.br`.
- Developer contact email: `contato@globalhireai.com.br`.
- Authorized domain: `globalhireai.com.br`.
- Privacy Policy: `/privacidade`.
- Terms: `/termos`.

## Riscos e pendências

- Verificar visual de marca no Google Cloud quando logo oficial existir.
- Confirmar que Supabase Google Provider usa Client ID/Secret corretos de produção.
- Confirmar que não há redirect para domínio Vercel nas configurações do Supabase.
- Confirmar que o Turnstile aceita `www.globalhireai.com.br` e `globalhireai.com.br`.
- Repetir teste após cada troca de domínio.

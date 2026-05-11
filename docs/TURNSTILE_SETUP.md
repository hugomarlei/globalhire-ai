# GlobalHire AI - Cloudflare Turnstile Setup

Status: IMPLEMENTADO.

## Variáveis

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY`: pública, usada no frontend.
- `TURNSTILE_SECRET_KEY`: secreta, usada somente no servidor.

## Onde é usado

- Login.
- Cadastro.
- Geração IA.
- ATS Score otimizado.
- Regeneração.

## Comportamento do Widget

Arquivo:

- `components/turnstile-widget.tsx`

O widget:

- carrega o script Cloudflare uma única vez;
- renderiza explicitamente;
- reseta token em expiração, erro e timeout;
- mostra fallback amigável se não carregar;
- permite recarregar o captcha sem atualizar a página.

## CSP

`next.config.ts` permite:

- `https://challenges.cloudflare.com` em `script-src`;
- `https://challenges.cloudflare.com` em `connect-src`;
- `https://challenges.cloudflare.com` em `frame-src`.

## Checklist Produção

1. Cloudflare > Turnstile > Widget.
2. Permitir domínios:
   - `www.globalhireai.com.br`
   - `globalhireai.com.br`
   - `localhost`
3. Configurar envs na Vercel.
4. Testar em Safari mobile, Chrome Android, Chrome desktop e aba anônima.

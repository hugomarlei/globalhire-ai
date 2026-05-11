# Deploy Flow

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Documentar o fluxo seguro de deploy da GlobalHire AI.

## Ambientes

| Ambiente | URL | Status |
| --- | --- | --- |
| Local | `http://localhost:3000` | IMPLEMENTADO |
| Produção futura | `https://globalhireai.com.br` | PARCIAL |
| Preview Vercel | URLs automáticas | PARCIAL |

## Processo recomendado

1. Criar branch ou trabalhar em mudança pequena.
2. Rodar localmente:
   - `npm run typecheck`
   - `npm run build`
3. Revisar diff.
4. Confirmar que `.env.local` não aparece no Git.
5. Commitar.
6. Push para GitHub.
7. Vercel gera preview.
8. Testar preview.
9. Fazer merge/deploy produção.

## Variáveis na Vercel

IMPLEMENTADO/PARCIAL:

- Supabase públicas e service role.
- Groq API key.
- Stripe keys e webhook secret.
- Stripe Price IDs.
- App URL.
- Turnstile.
- Clarity.
- Sentry opcional.

## Riscos

- Variável ausente pode quebrar login, IA ou checkout.
- Price ID errado impede upgrade de plano.
- Webhook secret errado impede atualização de assinatura.
- Google OAuth sem domínio real impede login social em produção.

## Checklist antes de deploy final

- `npm run build` passou.
- Login e cadastro testados.
- Geração IA testada.
- Checkout sandbox testado.
- Webhook testado.
- Páginas legais revisadas.
- Banner cookies testado.

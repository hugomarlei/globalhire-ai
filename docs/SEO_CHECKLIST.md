# SEO Checklist — GlobalHire AI

Status: IMPLEMENTADO/PARCIAL  
Última revisão: 2026-05-11

## Metadata

- IMPLEMENTADO: `metadataBase` usa `getAppUrl()`.
- IMPLEMENTADO: domínio canônico `https://www.globalhireai.com.br`.
- IMPLEMENTADO: OpenGraph global.
- IMPLEMENTADO: Twitter Card global.
- IMPLEMENTADO: canonical nas páginas legais e FAQ.
- PARCIAL: adicionar imagens reais em `public/brand/og-image.png` e `public/brand/favicon.ico`.

## Sitemap

Arquivo: `app/sitemap.ts`

Rotas públicas incluídas:

- `/`
- `/pricing`
- `/login`
- `/cadastro`
- `/privacidade`
- `/termos`
- `/cookies`
- `/support`
- `/refund-policy`
- `/data-processing`

Cada rota possui URL absoluta, `lastModified`, `changeFrequency` e `priority`.

## Robots

Arquivo: `app/robots.ts`

Permite indexação pública e bloqueia:

- `/admin`
- `/api`
- `/assinatura`
- `/ats-score`
- `/auth/callback`
- `/configuracoes`
- `/conta`
- `/dashboard`
- `/gerador`
- `/historico`
- `/redefinir-senha`

Sitemap declarado:

```text
https://www.globalhireai.com.br/sitemap.xml
```

## Structured Data

IMPLEMENTADO:

- `Organization`
- `WebSite`
- `SoftwareApplication`
- `FAQPage` em `/faq`

## Pós-deploy

1. Abrir `https://www.globalhireai.com.br/robots.txt`.
2. Abrir `https://www.globalhireai.com.br/sitemap.xml`.
3. Enviar `sitemap.xml` no Google Search Console.
4. Validar rich results de `/faq`.
5. Confirmar que páginas privadas retornam `noindex` via robots/bloqueio de crawl.

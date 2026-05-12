# GlobalHire AI — Auditoria da Identidade Visual V1

Data: 2026-05-12  
Objetivo: avaliar a rodada anterior de branding e definir correções para a V2 sem quebrar o produto.

## Problemas encontrados

### Logo e símbolo

- O símbolo anterior usava `Sparkles`/monograma implícito, sem conceito proprietário.
- Não comunicava carreira global, mobilidade profissional ou trabalho.
- Parecia placeholder de UI, não marca de SaaS premium.
- Não era forte como favicon, app icon ou avatar social.
- Não diferenciava a GlobalHire AI de ferramentas genéricas de IA.

### Paleta

- O verde `#32E875` funcionava como CTA, mas estava dominante e com sensação neon/cyber.
- A combinação de grid + glow criava estética mais template SaaS do que marca sóbria.
- Faltavam tons intermediários premium para superfícies, bordas e estados.

### Banners LinkedIn

- Dimensão anterior era 1584x396, não a dimensão solicitada para company cover `1128x191`.
- Composição tinha texto demais para uma área baixa.
- O mock de ATS Score ficava grande demais e competia com o logo.
- O grid era muito presente.
- A hierarquia não transmitia autoridade de marca.

### Copy visual

- “AI career infrastructure for global candidates” é útil como conceito interno, mas longo para banner.
- Faltava uma frase curta, memorável e aplicável a LinkedIn/OG.

### Sistema

- Havia documentos, mas sem um sistema V2 completo com logo, favicon, OG, LinkedIn, copy bilíngue e pasta de uso.
- Assets antigos estavam separados entre `public/brand` e `public/branding`.

## Arquivos que serão substituídos ou atualizados

- `public/branding/linkedin-banner.png`
- `public/branding/linkedin-banner-dark.png`
- `public/branding/linkedin-banner-light.png`
- `public/branding/linkedin-banner.svg`
- `public/brand/favicon.svg`
- `public/brand/og-image.svg`
- `app/page.tsx`
- `components/nav.tsx`
- `components/ui.tsx`
- `app/globals.css`
- `tailwind.config.ts`

## Arquivos mantidos

- Documentação V1 será mantida para histórico.
- Backup criado em `public/branding/_backup-before-v2/`.
- Fluxos de autenticação, Stripe, Supabase, Groq, webhooks e banco não serão alterados.

## Riscos de alteração

- Mudanças de cor podem afetar contraste se aplicadas de forma ampla demais.
- Substituir favicon/OG exige garantir que `app/layout.tsx` continue encontrando assets.
- Alterar navbar pode afetar acesso mobile se não preservar links de login/cadastro.
- Gerar PNG por script local exige validar dimensões e peso final.

## Plano de correção V2

1. Criar logo minimalista com globo + maleta, sem monograma GA/IA.
2. Refinar paleta para emerald/teal sofisticado e off-black.
3. Gerar LinkedIn banner V2 em 1128x191 com safe margins.
4. Gerar OG image V2 em 1200x630.
5. Atualizar frontend de forma incremental para usar logo V2 e tokens refinados.
6. Criar documentação V2 completa e pasta de Desktop organizada.
7. Rodar lint, typecheck e build.

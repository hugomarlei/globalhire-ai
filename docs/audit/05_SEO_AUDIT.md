# 5. Auditoria SEO

## Sitemap

Status: IMPLEMENTADO

Arquivo: `app/sitemap.ts`

Inclui:

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

Cada entrada possui:

- URL absoluta via `getAppUrl()`;
- `lastModified`;
- `changeFrequency`;
- `priority`.

## Robots

Status: IMPLEMENTADO

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

Sitemap aponta para `https://www.globalhireai.com.br/sitemap.xml`.

## Metadata

Status: IMPLEMENTADO/PARCIAL

- `app/layout.tsx` define metadata global.
- Páginas legais têm canonical próprio.
- FAQ tem metadata própria.
- `metadataBase` usa `getAppUrl()`.

Pendências:

- Criar metadata específica para páginas públicas como `/pricing`, `/features`, `/resources`.
- Adicionar `robots: noindex` em páginas auth se desejado para evitar indexação de `/login` e `/cadastro`; atualmente sitemap inclui ambas por solicitação.

## OpenGraph e Twitter

Status: IMPLEMENTADO/PARCIAL

- OpenGraph global.
- Twitter Card global.
- Usa `/brand/og-image.png` se existir.
- Usa `/brand/favicon.ico` se existir.

Pendência:

- Adicionar assets reais em `public/brand/`.

## Canonical

Status: IMPLEMENTADO

- `getAppUrl()` força `https://www.globalhireai.com.br`.
- Reduz risco de canonical para Vercel antigo.

## Structured data

Status: IMPLEMENTADO

- `Organization`.
- `WebSite`.
- `SoftwareApplication`.
- `FAQPage` em `/faq`.

Risco:

- `SearchAction` aponta para `/pricing?q=` sem busca real. Melhor remover ou criar busca real se quiser 100% aderente.

## Indexing

Status: BOM

- Páginas privadas bloqueadas por robots.
- Middleware/auth também impede acesso de usuário não autenticado.

## Performance SEO

Status: PARCIAL

- Landing usa pouco JS comparada a dashboard.
- Analytics só carrega pós-consentimento e produção.
- Falta auditoria Lighthouse real em produção.
- Falta imagem OG real.

## Semantic HTML

Status: BOM/PARCIAL

- Páginas usam `main`, headings e sections.
- Componentes de dashboard usam cards e botões acessíveis.
- Alguns elementos de UI poderiam melhorar `aria-label` em botões iconográficos.

# 8. Auditoria de Performance

## Build e bundle

Último build informado pelo projeto mostra:

- Landing `/`: aproximadamente 125 kB First Load JS.
- Auth `/login` e `/cadastro`: aproximadamente 182 kB First Load JS.
- Gerador `/gerador`: aproximadamente 125 kB First Load JS.
- Middleware: aproximadamente 88.8 kB.

Status: BOM para MVP.

## SSR/SSG

- Páginas públicas são majoritariamente estáticas.
- Área logada é dinâmica e protegida por Supabase.
- APIs são Route Handlers.
- `dynamic = "force-dynamic"` é usado em páginas logadas críticas.

## Lazy loading e scripts

Status: BOM/PARCIAL

- Analytics usa `next/script` com `afterInteractive`.
- Scripts só carregam pós-consentimento.
- Não há bibliotecas pesadas de UI.

Pendências:

- Considerar dynamic import para componentes pesados de dashboard se bundle crescer.
- Rodar Lighthouse em produção.

## Imagens

Status: PARCIAL

- Não há dependência pesada de imagens.
- Assets reais de branding ainda pendentes.
- OG image e favicon dependem de arquivos em `public/brand`.

## Queries

Status: PARCIAL

- Dashboard busca até 100 gerações para estatísticas.
- Histórico pode carregar lista de documentos sem paginação avançada.
- Admin faz consultas agregadas simples.

Recomendações:

- Paginar histórico.
- Criar views/materialized stats se volume crescer.
- Indexar por `user_id, created_at` já existe em `generations`.

## Re-renderizações

Status: OK

- Componentes client têm estado local.
- Analytics global evita query hook problemático.
- Linguagem usa provider local.

## Gargalos prováveis

1. Groq latency em geração.
2. PDF parsing server-side para arquivos grandes.
3. Histórico sem paginação em usuários intensivos.
4. Rate limit em memória não escala.
5. Middleware em muitas rotas pode acrescentar custo, mas é necessário para Supabase.

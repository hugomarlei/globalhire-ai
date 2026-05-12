# GlobalHire AI — Visual Implementation V2

## Arquivos modificados

- `tailwind.config.ts`: tokens de cor refinados para emerald/teal premium.
- `app/globals.css`: shell visual, glass surface e grid mais discreto.
- `components/nav.tsx`: novo símbolo em navbar pública e app nav.
- `components/ui.tsx`: botões, cards e inputs mantidos, com tokens refinados.
- `app/page.tsx`: copy do hero e elementos visuais ajustados.
- `public/brand/favicon.svg`: favicon V2.
- `public/brand/og-image.svg`: OG V2.
- `public/brand/og-image.png`: OG PNG V2.

## Risco por alteração

| Alteração | Risco | Mitigação |
|---|---|---|
| Troca de tokens | Baixo/médio | Mantidos nomes Tailwind existentes |
| Troca do logo no nav | Baixo | Usado `<img>` estático em `/public` |
| Hero copy | Baixo | Não altera rotas nem CTA |
| Assets públicos | Baixo | Backup criado em `public/branding/_backup-before-v2/` |

## Como validar manualmente

1. Abrir `/` desktop e mobile.
2. Confirmar logo V2 no topo.
3. Confirmar botões Entrar e Criar conta no mobile.
4. Abrir `/login` e `/cadastro`.
5. Abrir `/dashboard` logado.
6. Confirmar que imagens `/branding/logo-symbol.svg`, `/branding/linkedin-banner-v2.png` e `/og-image.png` carregam.
7. Conferir console do navegador.

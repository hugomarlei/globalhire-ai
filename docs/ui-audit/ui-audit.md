# GlobalHire AI — UI Audit

Data: 2026-05-12

## Resumo

A interface já possuía base funcional, responsiva e alinhada ao tema preto/verde. A rodada atual elevou a percepção de SaaS premium com tokens mais precisos, navegação com marca mais tecnológica, hero com posicionamento internacional e cards com profundidade visual controlada.

## Problemas encontrados

| Problema | Prioridade | Observação |
|---|---:|---|
| Marca ainda parecia muito próxima de “gerador de currículo” | Alta | Headline forte, mas faltava sinal de infraestrutura SaaS/IA global. |
| Logo no nav usava briefcase, remetendo a RH tradicional | Alta | Substituído por mark com Sparkles/Signal Green. |
| Paleta era funcional, mas pouco extensível | Média | Foram adicionados cyber, violet, amber e graphite para uso futuro controlado. |
| Cards não tinham distinção premium suficiente | Média | Glass surface e shadow foram refinados. |
| Social/LinkedIn assets ausentes | Alta | Criados banners, copy e estratégia. |

## Melhorias implementadas

- Hero com tagline oficial “Get Hired Smarter.”
- Estatísticas compactas no hero para percepção de produto.
- Mock de ATS Score mais premium.
- Botão primário com glow contido.
- Marca no nav com símbolo mais tecnológico.
- Cards com hover discreto.
- Documentação de brand, design system e social kit.

## Arquivos alterados

- `app/page.tsx`
- `app/globals.css`
- `components/nav.tsx`
- `components/ui.tsx`
- `tailwind.config.ts`

## Riscos

- As mudanças são visuais e não devem impactar auth, Stripe, Supabase, Groq ou banco.
- O script `npm run lint` do projeto usa `next lint`, removido/depreciado em versões recentes do Next; validar na execução.
- Banners PNG foram gerados por script local com Pillow; se a marca evoluir, ideal editar o SVG-fonte.

## Validação recomendada

- Abrir home desktop e mobile.
- Testar links Entrar/Criar conta no topo.
- Verificar pricing e footer.
- Rodar `npm run typecheck` e `npm run build`.

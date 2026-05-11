# SOP Deployment

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Padronizar o processo de publicação de mudanças.

## Antes do deploy

1. Revisar escopo da mudança.
2. Rodar:
   - `npm run typecheck`
   - `npm run build`
3. Verificar se não há secrets no diff.
4. Verificar se `.env.example` foi atualizado quando necessário.
5. Testar fluxo afetado localmente.

## Deploy

1. Commitar mudança.
2. Fazer push para GitHub.
3. Conferir build da Vercel.
4. Abrir preview deployment.
5. Testar fluxo principal.
6. Promover para produção ou mergear.

## Pós-deploy

1. Testar login.
2. Testar geração IA.
3. Testar checkout, se mudança afetar planos.
4. Testar webhook, se mudança afetar Stripe.
5. Monitorar logs por 30 minutos.

## Rollback

PENDENTE:

- Processo formal de rollback ainda não documentado em produção.

Recomendação:

- Usar rollback da Vercel para deployment anterior.
- Reverter commit se necessário.
- Não alterar banco sem plano de reversão.

# Data Retention Policy

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Definir critérios de retenção e exclusão de dados na GlobalHire AI, equilibrando operação do SaaS, obrigações legais, suporte e direitos do titular conforme LGPD.

## Categorias de dados

| Categoria | Exemplo | Retenção atual | Status |
| --- | --- | --- | --- |
| Conta | e-mail, user id, provider auth | Enquanto a conta existir | IMPLEMENTADO |
| Perfil | plano, status, preferências | Enquanto a conta existir | IMPLEMENTADO |
| Gerações | currículo, vaga, saída IA | Enquanto a conta existir | IMPLEMENTADO |
| Pagamentos | customer id, subscription id, plano | Conforme Stripe e necessidade fiscal | PARCIAL |
| Cookies | consentimento local | Até limpeza do navegador ou nova escolha | IMPLEMENTADO |
| Logs técnicos | erros, eventos limitados | Retenção da Vercel/provedor | PARCIAL |

## Exclusão de dados

IMPLEMENTADO:

- Fluxo de exclusão de conta e dados pelo usuário.
- Remoção de dados relacionados quando suportado pelo backend.

PARCIAL:

- Exclusão completa do usuário Auth depende de uso correto do admin client.
- Não há relatório automático de exclusão enviado ao usuário.

PENDENTE:

- SLA formal para atendimento de exclusão manual.
- Política final de retenção fiscal/contábil.
- Tabela de auditoria de pedidos LGPD.

## Regras recomendadas

- Conta ativa: manter dados necessários para operar o produto.
- Conta excluída: apagar histórico de documentos e dados profissionais, salvo obrigação legal.
- Assinaturas: manter referências de cobrança necessárias para reconciliação.
- Logs: nunca armazenar conteúdo completo de currículo ou vaga.
- Analytics: só coletar se o usuário aceitar cookies analíticos.

## Procedimento manual atual

1. Confirmar identidade do solicitante pelo e-mail da conta.
2. Verificar se há assinatura ativa no Stripe.
3. Cancelar assinatura, se solicitado.
4. Executar exclusão pelo produto ou via Supabase com cuidado.
5. Confirmar ao usuário quando finalizado.

## Pontos para auditoria futura

- Criar registro de pedidos de acesso/exclusão.
- Criar política de retenção aprovada pela liderança.
- Validar obrigações fiscais com contador/advogado.

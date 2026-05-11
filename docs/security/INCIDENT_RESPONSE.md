# Incident Response

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Definir procedimento mínimo de resposta a incidentes de segurança, privacidade, pagamento ou indisponibilidade.

## Tipos de incidente

- Vazamento ou exposição de chave.
- Acesso indevido a conta.
- Falha de webhook Stripe.
- Cobrança incorreta.
- Exposição de dados profissionais.
- Indisponibilidade do app.
- Abuso de IA ou automação.

## Severidade

| Nível | Critério | Resposta |
| --- | --- | --- |
| SEV1 | Dados pessoais expostos, pagamentos afetados, app fora do ar | Resposta imediata |
| SEV2 | Funcionalidade crítica quebrada | Corrigir no mesmo dia |
| SEV3 | Bug limitado ou UX ruim | Planejar correção |

## Procedimento

1. Confirmar o incidente.
2. Registrar horário, escopo e impacto.
3. Conter o problema.
4. Preservar logs técnicos sem copiar dados sensíveis.
5. Corrigir causa raiz.
6. Validar correção.
7. Comunicar usuários afetados, se necessário.
8. Documentar aprendizado.

## Contenção por cenário

Chave exposta:

- Revogar chave no provedor.
- Criar nova chave.
- Atualizar Vercel.
- Verificar commits e histórico.

Webhook Stripe falhando:

- Conferir `STRIPE_WEBHOOK_SECRET`.
- Verificar eventos no painel Stripe.
- Reprocessar eventos quando seguro.

Dados profissionais expostos:

- Remover acesso indevido.
- Avaliar escopo.
- Consultar jurídico para obrigação de notificação.

## Pendências

- Criar template de postmortem.
- Criar canal `security@globalhireai.com.br`.
- Definir SLA formal de comunicação.

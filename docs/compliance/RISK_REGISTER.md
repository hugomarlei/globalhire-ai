# Risk Register

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Registrar riscos relevantes para operação, segurança, produto, compliance e due diligence.

## Riscos

| ID | Risco | Impacto | Probabilidade | Status | Mitigação |
| --- | --- | --- | --- | --- | --- |
| R-001 | Usuário envia dados sensíveis no currículo | Alto | Média | PARCIAL | Avisos em privacidade e produto |
| R-002 | Chave secreta exposta | Alto | Baixa/Média | PARCIAL | `.env` ignorado, rotação recomendada |
| R-003 | Webhook Stripe falha | Alto | Média | PARCIAL | Webhook implementado, precisa monitoramento |
| R-004 | IA inventa informação | Médio/Alto | Média | PARCIAL | Prompts e avisos de revisão |
| R-005 | Rate limit insuficiente em serverless | Médio | Baixa | PARCIAL | Rate limit Supabase implementado; evoluir para Redis/RPC em escala |
| R-006 | Consentimento não auditável no banco | Médio | Média | PENDENTE | Criar tabela de consentimentos |
| R-007 | Falta de backup testado | Alto | Média | PENDENTE | Configurar e testar restore Supabase |
| R-008 | Texto jurídico não revisado | Médio/Alto | Média | PENDENTE | Revisão com advogado |
| R-009 | Login social mal configurado em produção | Médio | Média | PARCIAL | Checklist Google/Supabase |
| R-010 | Dependência de solo founder | Alto | Alta | PARCIAL | Documentação e SOPs |

## Processo de revisão

- Revisar mensalmente durante fase MVP.
- Atualizar após incidentes.
- Atualizar antes de fundraising ou venda.

## Critérios de prioridade

- Alto impacto em dados, receita ou disponibilidade.
- Alta probabilidade.
- Exigência legal ou contratual.

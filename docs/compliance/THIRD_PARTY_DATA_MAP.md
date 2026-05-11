# Third-Party Data Map

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Mapa de dados por terceiro

| Terceiro | Dados | Finalidade | Base operacional | Status |
| --- | --- | --- | --- | --- |
| Supabase | e-mail, auth id, perfil, histórico | Auth e banco | Execução do serviço | IMPLEMENTADO |
| Stripe | customer, assinatura, pagamento | Cobrança | Execução de contrato | IMPLEMENTADO |
| Groq | currículo, vaga, prompt | IA generativa | Execução do serviço | IMPLEMENTADO |
| Vercel | logs, IP, requests | Hospedagem | Segurança/operação | IMPLEMENTADO |
| Google OAuth | e-mail, perfil OAuth | Login social | Consentimento/execução | IMPLEMENTADO |
| Microsoft Clarity | navegação, cliques | Analytics | Consentimento | PARCIAL |
| Cloudflare | IP, tráfego, captcha | Segurança/DNS | Segurança | PARCIAL |

## Regras

- Não enviar dados profissionais completos para analytics.
- Não copiar currículos para ferramentas externas de suporte.
- Revisar fornecedores antes de adicionar SDK novo.
- Documentar qualquer novo terceiro neste mapa.

## Pendências

- DPA/termos de processamento por fornecedor.
- Avaliação de transferência internacional.
- Revisão jurídica das bases legais.

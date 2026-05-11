# Third-Party Services

Status: IMPLEMENTADO/PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Listar serviços terceiros usados pela GlobalHire AI, finalidade, tipo de dado processado e risco associado.

## Serviços

| Serviço | Finalidade | Dados envolvidos | Status | Observação |
| --- | --- | --- | --- | --- |
| Vercel | Hospedagem Next.js | Logs técnicos, requests, IP | IMPLEMENTADO | Evitar logs com conteúdo profissional |
| Supabase | Auth e banco | E-mail, perfil, histórico, documentos | IMPLEMENTADO | Requer RLS e service role protegida |
| Stripe | Pagamentos | Customer, assinatura, pagamento | IMPLEMENTADO | Cartão não passa pelo app |
| Groq AI | IA generativa | Currículo, vaga, prompts | IMPLEMENTADO | Processa conteúdo enviado pelo usuário |
| Google OAuth | Login social | E-mail, perfil OAuth | PARCIAL | Depende de configuração no Google/Supabase |
| Microsoft Clarity | Analytics | Navegação e eventos | PARCIAL | Só deve carregar com consentimento |
| Cloudflare | DNS/segurança | IP, tráfego, Turnstile | PARCIAL | Depende de configuração do domínio |

## Regras operacionais

- Secrets de terceiros devem ficar apenas na Vercel e `.env.local`.
- Variáveis públicas só podem conter chaves explicitamente públicas.
- Nenhum currículo completo deve ser enviado para analytics ou logs.
- Mudanças de fornecedor devem ser registradas neste documento.

## Pendências

- Contratos/DPA com fornecedores, quando aplicável.
- Avaliação formal de transferência internacional de dados.
- Registro de suboperadores na Política de Privacidade.

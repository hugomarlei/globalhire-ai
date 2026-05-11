# Access Control

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Documentar como acessos administrativos e operacionais devem ser controlados.

## Acessos atuais

| Sistema | Acesso | Status |
| --- | --- | --- |
| GitHub | Repositório do código | PARCIAL |
| Vercel | Deploy e variáveis | PARCIAL |
| Supabase | Auth, banco, service role | PARCIAL |
| Stripe | Pagamentos e webhooks | PARCIAL |
| Groq | API keys | PARCIAL |
| Cloudflare | DNS, Turnstile, e-mail | PARCIAL |
| Microsoft Clarity | Analytics | PARCIAL |

## Princípios

- Menor privilégio.
- MFA obrigatório em contas críticas.
- Contas individuais, não compartilhadas.
- Revogação imediata ao encerrar colaboração.
- Secrets nunca enviados por chat, print ou commit.

## Admin no produto

IMPLEMENTADO:

- `ADMIN_EMAILS` libera acesso administrativo.
- `ADMIN_BYPASS_EMAILS` permite testar recursos pagos sem cobrança.

Risco:

- Configuração por env é simples e adequada para MVP, mas não gera trilha completa de auditoria.

PENDENTE:

- Registro de ações admin.
- Papéis granulares.
- Aprovação dupla para ações destrutivas.

## Checklist de novo colaborador

1. Criar conta individual.
2. Ativar MFA.
3. Conceder menor permissão necessária.
4. Registrar sistemas concedidos.
5. Revisar acesso após 30 dias.

## Checklist de saída

1. Remover GitHub.
2. Remover Vercel.
3. Remover Supabase.
4. Remover Stripe.
5. Rotacionar chaves compartilhadas, se houve exposição.

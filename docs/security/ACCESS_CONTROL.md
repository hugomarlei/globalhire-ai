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

- **`ADMIN_EMAILS`** (servidor) é a **única** fonte de verdade para `/admin`, `/admin/growth` e `/api/admin/*`. Lista separada por vírgulas, case-insensitive. Se vazia, **ninguém** tem acesso admin (fail closed).
- A coluna `profiles.is_admin` **não** é usada para autorizar estas rotas (evita admin por flag errada na base).
- `ADMIN_BYPASS_EMAILS` continua separado: apenas simula plano Elite para testes (ver `lib/plans.ts`).

Risco residual:

- Lista em variável de ambiente não gera, por si só, trilha completa de auditoria.
- Erro de configuração (`ADMIN_EMAILS` vazio ou errado) bloqueia ou expõe admin conforme o valor.

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

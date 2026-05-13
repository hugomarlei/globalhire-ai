# 4. Auditoria de Segurança

## Autenticação

Status: IMPLEMENTADO

- Supabase Auth gerencia sessão.
- Middleware atualiza cookies de sessão.
- `requireUser()` protege área logada.
- Reset de senha e OAuth callback existem.
- Logout redireciona para landing.

Mitigação recente: endpoints POST sensíveis validam `Origin`/`Referer` via `lib/security.ts`. Webhook Stripe permanece protegido por assinatura Stripe.

## Autorização

Status: IMPLEMENTADO/PARCIAL

- Admin protegido por `requireAdmin()`.
- Admin também pode ser autorizado por `ADMIN_EMAILS`.
- Usuário bloqueado é redirecionado.
- RLS protege leitura/inserção própria.

Riscos:

- `ADMIN_EMAILS` depende de env e não gera trilha de auditoria.
- `ADMIN_BYPASS_EMAILS` concede plano Elite para teste; deve ser controlado em produção.
- Falta `audit_logs` persistente para ações administrativas.

## Headers, CORS e CSP

Status: IMPLEMENTADO/PARCIAL

`next.config.ts` define headers de segurança globais, incluindo CSP compatível com os provedores atuais.

Implementado:

- `Strict-Transport-Security`.
- `X-Frame-Options: DENY`.
- `X-Content-Type-Options: nosniff`.
- `Referrer-Policy: strict-origin-when-cross-origin`.
- `Permissions-Policy`.
- CSP compatível com Vercel, Supabase, Stripe, Groq, GA4, Clarity, PostHog e Turnstile.

CORS: APIs são same-origin por padrão no App Router. Não há `Access-Control-Allow-*` definido no código-fonte da aplicação (ausência confirmada por busca no repositório).

**Produção (verificação externa):** respostas do documento HTML em `https://www.globalhireai.com.br` têm sido observadas com `Access-Control-Allow-Origin: *`. Isso **não** é emitido por `next.config.ts`. Tratar como item de **infra** (Vercel headers, Cloudflare, ou comportamento da CDN) e registrar origem em [`../PRODUCTION_VERIFICATION_LOG.md`](../PRODUCTION_VERIFICATION_LOG.md).

## Rate limiting

Status: PARCIAL

- IA usa cooldown de 30 segundos por usuário/IP.
- Implementação distribuída em Supabase via tabela `rate_limits`, com fallback em memória para desenvolvimento/falha controlada.

Risco residual: a implementação usa select/update simples; para alto volume, considerar RPC SQL transacional ou Upstash Redis.

## Validação de inputs

Status: IMPLEMENTADO

- `zod` valida geração, checkout, PDF, regenerate, optimize-from-score e admin block.
- Upload valida tipo e tamanho.
- IA limita tamanho via schema.

Riscos:

- `request.json()` em algumas APIs não está sempre dentro de try/catch antes de `safeParse`; risco baixo, pois catch global cobre muitas rotas.

## Sanitização e XSS

Status: PARCIAL

- PDF client-side usa `escapeHtml()` no output.
- Analytics sanitiza propriedades.
- React escapa conteúdo renderizado por padrão.

Riscos:

- `/api/pdf` retorna HTML com conteúdo interpolado sem escape. Embora seja autenticado e pareça placeholder, se usado futuramente pode abrir XSS.
- Conteúdo gerado por IA é exibido em `<pre>`, seguro por React, mas exportações/HTML devem continuar escapando.

## CSRF

Status: PARCIAL

Endpoints POST autenticados:

- `/api/stripe/checkout`
- `/api/stripe/portal`
- `/api/account/delete`
- `/api/admin/block-user`
- `/api/ai/*`

Mitigadores atuais:

- Supabase auth server-side.
- Turnstile em IA e regenerate.
- Confirmação forte em exclusão de conta.

Mitigação recente:

- Validação `Origin`/`Referer` em endpoints sensíveis por `lib/security.ts`.
- `/api/stripe/webhook` não usa Origin por ser chamada servidor-a-servidor; depende de assinatura Stripe.

## Exposição de chaves

Status: BOM

- Segredos críticos ficam sem `NEXT_PUBLIC_`.
- `getAppUrl()` bloqueia domínio antigo Vercel.
- `GROQ_API_KEY` só usado no server.
- `SUPABASE_SERVICE_ROLE_KEY` só usado no admin/server.

## Armazenamento de dados

Status: PARCIAL

`generations` salva:

- currículo/base do usuário;
- descrição da vaga;
- output.

Isso é necessário para histórico/regeneração, mas é dado pessoal/profissional sensível em sentido operacional.

Implementado/parcial:

- Retenção configurável preparada em `lib/retention.ts`.
- Exclusão granular de documentos/gerações via `/api/documents/delete`.

Recomendações:

- Criptografia adicional em campos sensíveis se o risco aumentar.
- Logs nunca devem conter conteúdo completo.

## LGPD

Status: PARCIAL

- Há políticas públicas, consentimento e páginas legais.
- Há exclusão de conta.
- Há docs de compliance.

Pendências:

- Formalizar encarregado/ponto focal.
- Definir SLA de resposta LGPD.
- Criar rotina de retenção.
- Criar registro de operações de tratamento.

## Riscos críticos

| Severidade | Risco | Recomendação |
|---|---|---|
| Média | CSP pode precisar de ajuste ao adicionar novos provedores | Revisar `next.config.ts` a cada integração externa. |
| Alta | Dados profissionais completos persistidos sem retenção automatizada | Criar job futuro de retenção; exclusão manual já existe. |
| Baixa | Rate limit distribuído sem operação atômica avançada | Evoluir para RPC SQL transacional ou Upstash se houver escala. |
| Baixa | CSRF sem token dedicado | Origin/Referer já implementado; considerar token dedicado se houver formulários cross-origin legítimos. |
| Média | `/api/pdf` HTML sem escape | Remover rota ou escapar output antes de usar. |
| Média | Admin sem audit log | Criar `audit_logs`. |

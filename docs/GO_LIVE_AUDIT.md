# GlobalHire AI - Auditoria Final de Go-Live

Data: 2026-05-11  
Ambiente alvo: `https://www.globalhireai.com.br`  
Status: APTO COM PENDÊNCIAS OPERACIONAIS CONTROLADAS

## Resumo Executivo

A GlobalHire AI está em estágio avançado de produção para go-live público. Os fluxos principais já existem e a rodada atual corrigiu dois riscos de primeira experiência:

- Header mobile da landing agora mostra claramente `Entrar` e `Criar conta`.
- Cloudflare Turnstile agora tem retry local, fallback amigável, callbacks de erro/expiração e script deduplicado.

Nenhuma regra de plano, preço, Stripe, Groq ou Supabase Auth foi alterada.

## Correções Implementadas nesta Rodada

### UX Mobile da Landing

Status: IMPLEMENTADO.

Arquivo:

- `components/nav.tsx`

Alterações:

- `Entrar` não fica mais escondido em mobile.
- `Criar conta` continua visível.
- Header público agora usa wrap responsivo para evitar overflow.
- Seletor de idioma vai para uma linha própria em telas pequenas, preservando login/cadastro.

Risco mitigado:

- Usuário mobile não encontrava caminho claro para login.

### Autenticação

Status: IMPLEMENTADO.

Arquivos:

- `app/(auth)/login/page.tsx`
- `app/(auth)/cadastro/page.tsx`

Alterações:

- Formulários agora indicam explicitamente `Continuar com e-mail`.
- Botões sociais já exibem `Continuar com Google`, LinkedIn e Facebook.
- Login e cadastro continuam usando Supabase Auth.

### Cloudflare Turnstile

Status: IMPLEMENTADO.

Arquivos:

- `components/turnstile-widget.tsx`
- `lib/turnstile.ts`

Alterações:

- Script do Turnstile usa `id="globalhire-turnstile"` para evitar múltiplos carregamentos.
- Widget tem timeout controlado.
- Widget mostra estado `Carregando verificação de segurança...`.
- Widget mostra erro amigável se o captcha não carregar.
- Usuário pode clicar em `Recarregar captcha` sem atualizar a página.
- Token é limpo em expiração, erro, timeout, unsupported browser e reset.
- Mensagem server-side não manda mais atualizar a página inteira.

Risco mitigado:

- Usuário ficava bloqueado quando o widget não carregava na primeira tentativa.

## Fluxos Críticos Revisados

| Fluxo | Status | Observação |
|---|---|---|
| Cadastro e login e-mail/senha | IMPLEMENTADO | Captcha validado antes de Supabase Auth. |
| Login Google | IMPLEMENTADO | Mantido sem alteração. |
| Geração de currículo | IMPLEMENTADO | Protegida por auth, Origin check, captcha e rate limit. |
| ATS Score | IMPLEMENTADO | Mantido. |
| Upload PDF/DOCX | IMPLEMENTADO | Parser server-side existente mantido. |
| Histórico | IMPLEMENTADO | Mantido. |
| Exclusão granular | IMPLEMENTADO | Mantida e protegida por Origin. |
| Checkout/Portal Stripe | IMPLEMENTADO | Mantido com return URL oficial. |
| Logout | IMPLEMENTADO | Mantido. |

## Observabilidade e Privacidade

Status: IMPLEMENTADO/PARCIAL.

- Analytics sanitiza eventos e não deve receber currículos, descrições de vaga, documentos, tokens, e-mails ou dados de pagamento.
- Logs adicionados na aplicação não devem conter conteúdo de currículo/vaga/documento.
- Sentry está documentado/preparado, mas SDK formal não está instalado.

## Segurança de Produção

Status: IMPLEMENTADO/PARCIAL.

Confirmado em código:

- CSP e headers globais em `next.config.ts`.
- Origin/Referer check em endpoints POST sensíveis.
- Rate limit distribuído via Supabase com fallback local.
- Turnstile client/server sem expor `TURNSTILE_SECRET_KEY`.
- Groq, Stripe secret e Supabase service role somente server-side.

Pendência operacional:

- Testar CSP no navegador real em produção após deploy desta rodada, especialmente Turnstile, Stripe, GA4, Clarity e PostHog.

## Banco de Dados

Status: PARCIALMENTE VALIDADO.

Auditoria anterior confirmou via Supabase OpenAPI:

- Tabelas principais existem.
- Colunas principais estão alinhadas com `supabase/schema.sql`.
- `usage_limits.starter = 10`.
- `rate_limits` existe.

Limitação:

- Constraints, policies RLS, triggers e índices precisam ser confirmados via `supabase/schema-drift-introspection.sql` no SQL Editor.

Arquivos relevantes:

- `docs/audit/SUPABASE_SCHEMA_DIVERGENCE.md`
- `supabase/schema-drift-introspection.sql`
- `supabase/schema-drift-corrective-migration.sql`

## Pendências Antes do Go-Live Público

1. Rodar `supabase/schema-drift-introspection.sql` no Supabase SQL Editor.
2. Salvar o resultado como evidência de produção.
3. Confirmar constraints, RLS, triggers e índices.
4. Testar Turnstile em:
   - iPhone Safari;
   - Android Chrome;
   - Chrome desktop normal;
   - aba anônima.
5. Testar cadastro, login, geração, ATS Score, checkout e webhook após deploy.
6. Confirmar Search Console após sitemap final.

## Recomendação de Go-Live

Pode seguir para um go-live controlado se:

- o deploy desta rodada passar;
- o Turnstile carregar corretamente em produção;
- o SQL de introspecção não apontar RLS/unique constraints ausentes em tabelas críticas.

Para tráfego pago ou lançamento amplo, concluir a confirmação SQL completa antes.

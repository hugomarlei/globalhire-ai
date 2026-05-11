# 7. Compliance e LGPD

## Dados coletados

Categorias:

- Dados cadastrais: nome, e-mail, perfil.
- Dados de autenticação: sessão Supabase, OAuth Google.
- Dados profissionais: currículo, vaga, documentos, respostas IA.
- Dados de assinatura: plano, status, IDs Stripe, períodos.
- Dados técnicos: IP, user agent, logs, eventos de segurança.
- Dados de analytics: eventos sanitizados pós-consentimento.

## Consentimento

Status: IMPLEMENTADO/PARCIAL

- Banner permite aceitar todos, rejeitar analytics e preferências.
- Analytics só carrega após consentimento.
- Consentimento fica no navegador, não no banco.

Pendência:

- Registrar consentimento server-side se houver necessidade probatória maior.

## Cookies e tracking

Status: IMPLEMENTADO/PARCIAL

- Cookies essenciais: Supabase/session e funcionamento.
- Analytics: GA4, PostHog e Clarity pós-consentimento.
- Política de cookies existe.

## Políticas públicas

Status: IMPLEMENTADO

- `/privacidade`
- `/termos`
- `/cookies`
- `/refund-policy`
- `/data-processing`
- `/support`

## Retenção

Status: PARCIAL

Documentos e gerações ficam salvos enquanto o usuário mantém conta/histórico.

Pendências:

- Definir prazo padrão de retenção para `generations`.
- Criar exclusão granular.
- Criar rotina de limpeza para usuários inativos.
- Registrar exceções legais para billing/fraude.

## Direitos do titular

Status: PARCIAL

- Canal `privacy@globalhireai.com.br`.
- Exclusão de conta implementada.

Pendências:

- SLA de atendimento.
- Processo de confirmação de identidade.
- Modelo interno de resposta.
- Registro de solicitações LGPD.

## Transferência internacional

Status: DOCUMENTADO

Provedores como Supabase, Vercel, Stripe, Groq, Google, Cloudflare, PostHog e Microsoft podem processar dados fora do Brasil.

Pendência:

- Revisar DPAs/termos dos operadores.

## Riscos legais

| Severidade | Risco | Mitigação |
|---|---|---|
| Alta | Currículos podem conter dados sensíveis | Aviso existe; reforçar UX e retenção. |
| Alta | Conteúdo profissional completo salvo | Implementar retenção/exclusão granular. |
| Média | Clarity capturar dados sensíveis | Masking implementado; testar produção. |
| Média | Google OAuth verification | Documentação pronta; configurar Console. |
| Média | Reembolso/cancelamento | Política existe; validar com operação real. |

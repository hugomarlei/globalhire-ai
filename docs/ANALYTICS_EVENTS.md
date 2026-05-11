# Analytics Events

Status: PARCIAL  
Última revisão: 2026-05-10

## Objetivo

Documentar eventos seguros para PostHog, Microsoft Clarity e futura auditoria de produto.

## Regra principal

Não enviar para analytics:

- currículo completo;
- descrição completa de vaga;
- e-mail;
- telefone;
- endereço;
- documento gerado;
- tokens, secrets ou identificadores sensíveis.

Enviar apenas metadados seguros, como plano, tipo de ferramenta, idioma, país, status, duração, score agregado e origem da ação.

## Eventos implementados ou preparados

| Evento | Status | Observação |
| --- | --- | --- |
| `page_view` | IMPLEMENTADO | Capturado no client apenas em produção e com consentimento |
| `resume_uploaded` | IMPLEMENTADO | Tipo, tamanho e caracteres extraídos |
| `job_description_added` | IMPLEMENTADO | Bucket de tamanho, sem conteúdo |
| `ats_analysis_started` | IMPLEMENTADO | Score/match agregados |
| `ats_analysis_completed` | IMPLEMENTADO | Score/match agregados |
| `ats_analysis_failed` | IMPLEMENTADO | Status HTTP |
| `recruiter_message_generated` | IMPLEMENTADO | Tipo/idioma/país |
| `interview_prep_generated` | IMPLEMENTADO | Tipo/idioma/país |
| `translation_generated` | IMPLEMENTADO | Tipo/idioma/país |
| `pricing_page_viewed` | IMPLEMENTADO | Página de assinatura/logada |
| `checkout_started` | IMPLEMENTADO | Plano |
| `plan_limit_reached` | IMPLEMENTADO | Tipo/status |
| `upgrade_clicked` | IMPLEMENTADO | Plano |
| `export_pdf_clicked` | IMPLEMENTADO | Tipo/template/plano pago |
| `signup_started` | PENDENTE | Pode ser adicionado em `/cadastro` |
| `signup_completed` | PENDENTE | Depende de callback auth |
| `login_completed` | PENDENTE | Depende de callback auth |
| `checkout_completed` | PARCIAL | Pode ser inferido via `checkout=success` |
| `subscription_cancel_started` | PENDENTE | Depende de portal Stripe |
| `subscription_cancel_completed` | PENDENTE | Depende de webhook/status |
| `dashboard_viewed` | PENDENTE | Pode ser adicionado com client tracker |
| `language_changed` | PENDENTE | Pode ser adicionado no seletor de idioma |

## Configuração

Variáveis:

```bash
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
NEXT_PUBLIC_CLARITY_PROJECT_ID=
```

Analytics só carrega em produção e quando o usuário aceita analytics no banner de cookies.

## Logs internos opcionais

O arquivo `supabase/usage-events.sql` cria tabelas opcionais `usage_events` e `audit_logs`.

Status: PARCIAL

- Leitura de `usage_events` é restrita ao próprio usuário.
- Escrita pública pelo frontend não é permitida.
- Eventos internos devem ser gravados por rotas server-side usando service role, após sanitização.
- `audit_logs` não possui policies públicas por padrão.

# Tracking Events — GlobalHire AI

Status: IMPLEMENTADO  
Última revisão: 2026-05-11

## Princípios

Eventos são enviados para GA4, PostHog e Clarity somente após consentimento de analytics e somente em produção.

Todos os eventos passam por `sanitizeProperties()` em `lib/analytics.ts`, que remove propriedades sensíveis por nome e trunca strings longas.

## Eventos principais

| Evento | Origem | Dados permitidos |
|---|---|---|
| `page_view` | App Router | path sem query, flag de query |
| `signup_started` | cadastro/social auth | método, provider sem PII |
| `signup_completed` | cadastro | método |
| `login_started` | login/social auth | método, provider sem PII |
| `login_completed` | login | método |
| `resume_uploaded` | upload PDF/DOCX | tipo de arquivo, tamanho KB, chars extraídos |
| `job_description_added` | gerador | tipo, bucket de tamanho |
| `resume_generated` | currículo ATS | tipo, idioma, país |
| `recruiter_message_generated` | mensagem recrutador | tipo, idioma, país |
| `interview_prep_generated` | entrevista | tipo, idioma, país |
| `translation_generated` | tradução | tipo, idioma, país |
| `ats_score_generated` | ATS Score otimizado | score, match, modo |
| `checkout_started` | pricing/upgrade | plano |
| `checkout_completed` | retorno Stripe | origem |
| `subscription_updated` | retorno portal Stripe | origem |
| `subscription_canceled` | retorno portal Stripe | origem |
| `plan_limit_reached` | APIs/UX | tipo/status |
| `export_pdf_clicked` | exportação PDF | tipo, template, paid |
| `document_regenerated` | histórico | sem conteúdo |

## Dados proibidos

Não enviar:

- texto de currículo;
- descrição de vaga;
- documento final;
- e-mail;
- telefone;
- endereço;
- nome completo;
- dados de cartão;
- Stripe customer/subscription id;
- Supabase auth token;
- Turnstile token;
- prompts e respostas completas da IA.

## Identificação de usuário

PostHog usa anonymous internal ID salvo no navegador. Não identificar por e-mail. A função `identifyUser()` ignora PII e usa `globalhire-anonymous-id`.

# Privacy Architecture

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Descrever como a GlobalHire AI coleta, processa, armazena e compartilha dados pessoais e profissionais dentro da arquitetura atual do SaaS.

## Stack envolvida

- Next.js App Router: interface, rotas privadas e APIs server-side.
- Vercel: hospedagem e execução serverless.
- Supabase: autenticação, banco de dados e armazenamento dos registros do usuário.
- Stripe: checkout, assinaturas, portal de pagamentos e eventos de webhook.
- Groq AI: processamento de conteúdo enviado pelo usuário para geração e otimização.
- Google OAuth: login social via Supabase Auth.
- Microsoft Clarity: analytics condicionado ao consentimento.
- Cloudflare: DNS, segurança, Turnstile e possível roteamento de e-mail.

## Dados tratados

IMPLEMENTADO:

- E-mail e identificador de usuário via Supabase Auth.
- Perfil, plano, status e informações operacionais do usuário.
- Currículos, descrições de vaga, idioma, país-alvo e tipo de documento.
- Histórico de gerações e documentos resultantes.
- Dados de assinatura e plano sincronizados via Stripe webhook.
- Consentimento de cookies salvo no navegador.

PARCIAL:

- Registro estruturado de consentimento no banco.
- Mapa formal de base legal por finalidade.
- Processo documentado de atendimento LGPD com SLA.

PENDENTE:

- Revisão jurídica externa da Política de Privacidade.
- Nomeação formal de encarregado/DPO, se aplicável.
- Registro de operações de tratamento em formato auditável.

## Fluxo de dados

1. Usuário acessa o frontend Next.js.
2. Login/cadastro é processado pelo Supabase Auth.
3. Usuário envia currículo e descrição da vaga.
4. API server-side valida autenticação, plano, limite e captcha.
5. Conteúdo é enviado ao Groq para geração.
6. Resultado é salvo no Supabase como histórico.
7. Se houver pagamento, Stripe processa assinatura e envia webhook.
8. Supabase é atualizado com plano e status da assinatura.

## Princípios de privacidade

- Minimização: solicitar apenas dados necessários para gerar documentos profissionais.
- Transparência: páginas públicas de privacidade e termos.
- Segurança: secrets apenas no servidor, rotas privadas e RLS/Supabase.
- Controle do usuário: exclusão de conta e dados implementada no produto.
- Consentimento: analytics depende de escolha no banner LGPD.

## Riscos conhecidos

- Conteúdo profissional pode conter dados pessoais sensíveis enviados pelo próprio usuário.
- Groq processa conteúdo para entregar funcionalidade de IA.
- Logs técnicos devem evitar currículos completos e descrições de vaga completas.
- Consentimento ainda é localStorage, não registro central auditável.

## Próximas ações

- Criar tabela de consentimentos no Supabase.
- Criar procedimento formal de solicitação LGPD.
- Revisar textos legais com advogado.
- Definir matriz de retenção por tipo de dado.

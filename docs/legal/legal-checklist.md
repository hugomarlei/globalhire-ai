# Estrutura Legal Mínima para SaaS com IA — GlobalHire AI

Última atualização: 11 de maio de 2026

## 1. Objetivo

Este documento organiza os requisitos jurídicos, operacionais e de compliance mínimo para a GlobalHire AI operar como SaaS brasileiro com IA generativa, pagamentos online, autenticação social e analytics.

## 2. Checklist jurídico mínimo

- IMPLEMENTADO: Política de Privacidade pública em `/privacidade`.
- IMPLEMENTADO: Termos de Uso públicos em `/termos`.
- IMPLEMENTADO: Política de Cookies em `/cookies`.
- IMPLEMENTADO: Página de cancelamento e reembolso em `/refund-policy`.
- IMPLEMENTADO: Página de tratamento de dados em `/data-processing`.
- IMPLEMENTADO: Página de suporte em `/support`.
- PARCIAL: Identificação empresarial formal. Inserir razão social, CNPJ e endereço comercial quando a pessoa jurídica estiver definida.
- PARCIAL: Processo interno de resposta a solicitações LGPD. Há canais de contato, mas é necessário definir SLA operacional.
- PENDENTE: Revisão final por advogado brasileiro com dados societários, tributários e modelo real de contratação.

## 3. Checklist LGPD

- IMPLEMENTADO: Mapeamento de categorias de dados tratados.
- IMPLEMENTADO: Indicação de finalidades e bases legais.
- IMPLEMENTADO: Canal `privacy@globalhireai.com.br`.
- IMPLEMENTADO: Aviso sobre dados sensíveis em currículos.
- IMPLEMENTADO: Referência a Supabase, Stripe, Google OAuth, Cloudflare, Groq, PostHog e Microsoft Clarity.
- PARCIAL: Registro formal de operações de tratamento. Documentar internamente cada fluxo de dado.
- PARCIAL: Retenção e exclusão. Há diretrizes, mas recomenda-se configurar rotinas periódicas de limpeza.
- PARCIAL: Contratos com operadores. Revisar DPAs e termos dos provedores.
- PENDENTE: Nomeação formal de encarregado ou ponto focal de privacidade.

## 4. Google OAuth verification

Para configurar Google OAuth em produção:

- Privacy Policy URL: `https://www.globalhireai.com.br/privacidade`
- Terms URL: `https://www.globalhireai.com.br/termos`
- Support URL: `https://www.globalhireai.com.br/support`
- Authorized domain: `globalhireai.com.br`
- Redirect URIs: URLs de callback do Supabase em produção e localhost.

Recomendações:

- Usar escopos mínimos, preferencialmente e-mail e perfil básico.
- Não solicitar permissões sensíveis sem necessidade.
- Manter a tela de consentimento coerente com o nome GlobalHire AI.

## 5. Stripe compliance

- Usar Price IDs reais iniciados por `price_`.
- Manter webhook ativo para checkout, subscription updated/deleted e invoice events.
- Customer Portal deve retornar para `https://www.globalhireai.com.br/dashboard?subscription=updated`.
- Exibir política de cancelamento e reembolso antes ou durante o fluxo de contratação.
- Manter e-mail `billing@globalhireai.com.br` para cobrança.

## 6. Cookies e consentimento

- IMPLEMENTADO: Banner de cookies com aceitar, rejeitar analytics e preferências.
- IMPLEMENTADO: Carregamento condicional de analytics quando a variável existir e houver consentimento.
- PARCIAL: Mascaramento de campos sensíveis em ferramentas de replay/session analytics. Revisar DOM e classes de masking antes de campanhas pagas.
- PENDENTE: Revisão periódica de scripts adicionados no front-end.

## 7. Segurança e auditoria

Recomendações operacionais:

- Rotacionar chaves expostas ou usadas em ambiente de teste.
- Manter `GROQ_API_KEY`, `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `SUPABASE_SERVICE_ROLE_KEY` e `TURNSTILE_SECRET_KEY` somente no servidor.
- Aplicar MFA em Vercel, Supabase, Stripe, Google Cloud, Cloudflare e GitHub.
- Registrar acessos administrativos e alterações críticas.
- Não logar currículo completo, descrição de vaga, telefone, endereço, e-mail completo ou dados sensíveis em analytics.

## 8. Retenção recomendada

- Conta e perfil: enquanto a conta estiver ativa ou até exclusão.
- Documentos gerados: enquanto o usuário mantiver histórico ou até exclusão.
- Logs técnicos: prazo compatível com segurança, auditoria e Marco Civil da Internet.
- Dados de pagamento: conforme Stripe, obrigações fiscais e defesa de direitos.
- Analytics: manter apenas metadados, sem conteúdo profissional completo.

## 9. Riscos jurídicos principais

- Usuário inserir dados falsos no currículo e atribuir o resultado à plataforma.
- Usuário inserir dados sensíveis desnecessários.
- IA gerar conteúdo impreciso, exagerado ou inadequado.
- Analytics capturar campos profissionais ou pessoais sem masking.
- Falha de webhook causar exibição incorreta de plano ou cobrança.
- Falta de razão social/CNPJ visível quando operação comercial escalar.
- Expansão internacional sem adequar GDPR, UK GDPR, PIPEDA ou leis locais.

## 10. Roadmap jurídico recomendado

- Curto prazo: inserir dados societários, revisar DPAs, validar política de reembolso e configurar masking de analytics.
- Médio prazo: criar procedimento formal de resposta LGPD, playbook de incidente, registro de operações de tratamento e matriz de fornecedores.
- Longo prazo: preparar termos multilíngues, adequação internacional, políticas B2B, DPA próprio e governança de IA.

## 11. Pontos para revisão humana posterior

- Identificação da controladora: razão social, CNPJ, endereço e responsável.
- Adequação tributária e emissão de nota fiscal.
- Modelo real de cancelamento e reembolso conforme checkout e operação.
- Cláusulas para expansão fora do Brasil.
- Avaliação de risco de analytics com Microsoft Clarity e PostHog.
- Contratos de operadores e subprocessadores.
- Definição formal de encarregado de dados ou ponto focal LGPD.

# GlobalHire AI

SaaS em Next.js para criar curriculos ATS, cartas de apresentacao, resumo de LinkedIn, respostas para recrutadores, preparacao para entrevista e traducao/adaptacao de curriculo para vagas internacionais.

## O que ja vem pronto

- Landing page responsiva com CTA, planos, beneficios e FAQ.
- Cadastro, login, logout e recuperacao de senha com Supabase.
- Dashboard para colar curriculo, vaga, idioma, pais e tipo de entrega.
- Backend seguro para Groq usando `GROQ_API_KEY` apenas no servidor.
- Historico de geracoes salvo no Supabase.
- Exportacao para PDF pelo navegador.
- Construtor de curriculos em `/resumes` com CRUD, importacao PDF/DOCX, templates, cor principal, preview em tempo real, pontuacao ATS, certificacoes, revisao de IA, chat com IA e assistente de escrita com Groq.
- Stripe Checkout, assinatura mensal e webhook para atualizar plano.
- Bloqueio por limite de uso mensal.
- Painel admin para ver usuarios, geracoes, planos, receita estimada e bloquear usuarios.
- Schema SQL pronto para colar no Supabase.
- Pasta `/marketing` com posts, roteiros, anuncios, e-mails e pagina de vendas.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Groq API
- Stripe
- Vercel
- GitHub

## Como rodar no seu computador

1. Abra o Terminal dentro desta pasta.
2. Instale as dependencias:

```bash
npm install
```

3. Copie o arquivo de exemplo de variaveis:

```bash
cp .env.example .env.local
```

4. Abra `.env.local` e preencha as chaves de Supabase, Groq e Stripe.
5. Rode o projeto:

```bash
npm run dev
```

6. Abra no navegador:

```text
http://localhost:3000
```

## Como configurar o Supabase

1. Entre em [supabase.com](https://supabase.com).
2. Clique em **New project**.
3. Crie um projeto e espere finalizar.
4. No menu lateral, clique em **SQL Editor**.
5. Clique em **New query**.
6. Abra o arquivo `supabase/schema.sql`, copie tudo e cole no Supabase.
7. Clique em **Run**.
8. No Supabase, va em **Project Settings > API**.
9. Copie:
   - Project URL para `NEXT_PUBLIC_SUPABASE_URL`.
   - anon public key para `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
   - service_role key para `SUPABASE_SERVICE_ROLE_KEY`.
10. No menu **Authentication > URL Configuration**, coloque:
    - Site URL local: `http://localhost:3000`
    - Depois no deploy: sua URL da Vercel.

### Tabela de curriculos

O construtor usa a tabela `public.resumes`, incluida em `supabase/schema.sql` e na migracao `supabase/migrations/202605260001_add_resumes.sql`.

Para projetos existentes, aplique a migracao antes de usar `/resumes`. Ela cria:

- `id`, `user_id`, `title`, `data`, `created_at`, `updated_at`.
- RLS para cada usuario ler, criar, atualizar e excluir apenas os proprios curriculos.
- Trigger de `updated_at` e indice por usuario.

O campo `data` guarda o curriculo estruturado em JSON: dados pessoais, resumo, experiencias, educacao, habilidades, template, cor, idioma e descricao da vaga alvo.

## Construtor de curriculos

1. Acesse `/resumes`.
2. Clique em **Criar curriculo**.
3. Opcionalmente importe um PDF/DOCX existente. O app extrai o texto e preenche nome, contato, experiencias, educacao, habilidades e certificacoes quando consegue identificar essas secoes.
4. Preencha ou ajuste informacoes pessoais, resumo, experiencias, educacao, certificacoes e habilidades.
5. Cole a descricao da vaga para orientar a pontuacao ATS e as sugestoes de IA.
6. Escolha template e cor principal.
7. Reordene experiencias, educacao e certificacoes arrastando os cards; use os controles para expandir, contrair ou excluir entradas.
8. Use **Obter ajuda de escrita** em resumo, experiencia, educacao ou certificacao para gerar bullets com Groq.
9. Abra **Revisao de IA** para avaliar estrutura e organizacao, conteudo e clareza, e posicionamento de cargo. O usuario pode aceitar ou rejeitar as sugestoes.
10. Use **Falar com a IA** para conversar sobre ajustes de carreira e texto dentro do editor.
11. Clique em **Salvar** e depois em **PDF** para exportar pelo navegador.

As sugestoes de IA usam `POST /api/ai/suggest-description` e retornam apenas bullets JSON. O prompt exige o idioma selecionado e proibe inventar empresas, cargos, metricas, diplomas ou tecnologias.
`POST /api/ai/review-resume` retorna um relatorio estruturado e uma versao melhorada conservadora do JSON do curriculo.
`POST /api/ai/resume-chat` responde perguntas abertas sobre o curriculo, respeitando o idioma escolhido e as mesmas regras de nao inventar dados.

## Como configurar Groq

1. Entre em [console.groq.com](https://console.groq.com).
2. Va em **API Keys**.
3. Crie uma chave.
4. Cole em `.env.local`:

```bash
GROQ_API_KEY=sua_chave_aqui
GROQ_MODEL=llama-3.3-70b-versatile
```

Importante: essa chave nunca aparece no frontend. Ela e usada apenas no backend em `app/api/ai/generate/route.ts`.

## Como configurar Stripe

1. Entre em [stripe.com](https://stripe.com).
2. Va em **Product catalog**.
3. Crie 3 produtos com preco mensal:
   - Starter: R$29/mes
   - Pro: R$79/mes
   - Elite: R$149/mes
4. Copie os **Price IDs** e cole no `.env.local`. Eles começam com `price_`. Não use IDs que começam com `prod_`.

```bash
NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_PRO_PRICE_ID=price_...
NEXT_PUBLIC_STRIPE_ELITE_PRICE_ID=price_...
```

5. Va em **Developers > API keys** e copie:

```bash
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

6. Va em **Developers > Webhooks**.
7. Crie um endpoint:

```text
https://sua-url-da-vercel.vercel.app/api/stripe/webhook
```

8. Marque os eventos:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
9. Copie o signing secret para:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Admin

Para libertar o painel admin (**única fonte de verdade no servidor**):

1. Abra `.env.local` (e defina o mesmo em Vercel / produção).
2. Preencha **apenas** os e-mails autorizados (separados por vírgula se mais de um):

```bash
ADMIN_EMAILS=hugomarcianoleite@gmail.com
ADMIN_BYPASS_EMAILS=hugomarcianoleite@gmail.com
```

`ADMIN_EMAILS` controla **somente** o acesso a `/admin` e `/admin/growth` e APIs admin. Não basta `profiles.is_admin` na base.
`ADMIN_BYPASS_EMAILS` serve para testar o plano Elite sem pagamento (ver documentação de planos).

3. Crie conta no app com o mesmo e-mail que está em `ADMIN_EMAILS` (se ainda não existir).
4. Aceda:

```text
http://localhost:3000/admin
```

## Build

Para testar se o projeto compila:

```bash
npm run build
```

Para iniciar a versao de producao local:

```bash
npm run start
```

## Deploy na Vercel

1. Crie uma conta em [github.com](https://github.com).
2. Crie um repositorio chamado `globalhire-ai`.
3. Envie esta pasta para o GitHub.
4. Entre em [vercel.com](https://vercel.com).
5. Clique em **Add New > Project**.
6. Escolha o repositorio `globalhire-ai`.
7. Em **Environment Variables**, cole todas as variaveis do `.env.example`.
8. Troque `NEXT_PUBLIC_APP_URL` para o domínio final `https://www.globalhireai.com.br`.
9. Clique em **Deploy**.
10. Depois do deploy, volte no Supabase e Stripe para trocar URLs locais pela URL da Vercel.

## Microsoft Clarity e cookies

O app ja tem banner LGPD com tres escolhas:

- Aceitar todos.
- Rejeitar analytics.
- Preferencias.

O Microsoft Clarity so carrega se:

1. `NEXT_PUBLIC_CLARITY_PROJECT_ID` estiver preenchido.
2. O usuario aceitar analytics no banner de cookies.

Para configurar:

1. Entre em [clarity.microsoft.com](https://clarity.microsoft.com).
2. Crie um projeto para `https://www.globalhireai.com.br`.
3. Copie o Project ID.
4. Cole na Vercel em `NEXT_PUBLIC_CLARITY_PROJECT_ID`.

Importante: nao envie curriculos completos, descricoes de vaga ou documentos gerados para ferramentas de analytics.

## PostHog

PostHog e opcional e funciona sem instalar SDK adicional. Ele so carrega em producao, se o usuario aceitar analytics e se as variaveis estiverem preenchidas:

```bash
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

A camada central fica em `lib/analytics.ts` e remove campos sensiveis antes de enviar eventos. Nao envie curriculos, descricoes de vaga, e-mails, telefones, enderecos, documentos gerados ou tokens para analytics.

## Sentry

O projeto esta preparado para receber variaveis do Sentry sem obrigar instalacao imediata:

```bash
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=
```

Use Sentry apenas para erros tecnicos. O SDK completo ainda deve ser instalado/configurado quando voce decidir ativar monitoramento. Nao registre conteudo completo de curriculos, descricoes de vaga, mensagens de recrutador ou respostas de entrevista em logs.

Quando decidir ativar:

1. Crie um projeto Next.js no Sentry.
2. Copie o DSN para `NEXT_PUBLIC_SENTRY_DSN`.
3. Configure `SENTRY_AUTH_TOKEN` se for publicar source maps.
4. Revise custos, retencao e politicas de privacidade.

## Suporte

Configure o e-mail publico de suporte com:

```bash
NEXT_PUBLIC_SUPPORT_EMAIL=contato@globalhireai.com.br
```

A pagina publica fica em `/support`.

## Estrutura de pastas

```text
app/                 Telas e rotas do Next.js
app/api/             Backend seguro: Groq, Stripe, PDF, admin
components/          Componentes de UI
lib/                 Supabase, Stripe, Groq, validacoes, planos
prompts/             Prompts internos profissionais
supabase/schema.sql  Banco de dados pronto
marketing/           Material de marketing
public/              Arquivos publicos
```

## Checklist de lancamento

- Preencher `.env.local`.
- Rodar o SQL no Supabase.
- Criar produtos e Price IDs no Stripe.
- Configurar webhook do Stripe.
- Criar chave da Groq.
- Testar cadastro e login.
- Testar geracao de curriculo.
- Testar limite do plano Free.
- Testar checkout em modo teste.
- Testar webhook usando Stripe test mode.
- Criar usuario admin.
- Revisar textos da landing page.
- Configurar dominio na Vercel.
- Configurar politicas de privacidade e termos de uso.
- Publicar conteudo da pasta `/marketing`.

## Checklist amanhã — Produção

1. **Cloudflare Active**
   - Adicione `globalhireai.com.br` na Cloudflare.
   - Troque os nameservers no registrador do dominio.
   - Aguarde o status ficar **Active**.

2. **DNS Vercel na Cloudflare**
   - Adicione `globalhireai.com.br` na Vercel.
   - Copie os registros DNS pedidos pela Vercel.
   - Cole esses registros na Cloudflare.

3. **Email Routing no Cloudflare**
   - Ative Email Routing.
   - Crie redirecionamentos para `contato@globalhireai.com.br` e `privacy@globalhireai.com.br`.

4. **Vercel Environment Variables**
   - Cadastre todas as variaveis do `.env.example`.
   - Use `NEXT_PUBLIC_APP_URL=https://www.globalhireai.com.br`.
   - Nunca coloque chaves secretas em variaveis `NEXT_PUBLIC_`.

5. **Google OAuth com dominio real**
   - No Google Cloud, adicione os callbacks do Supabase.
   - No Supabase, configure Site URL e Redirect URLs para producao.
   - Teste login Google em `https://www.globalhireai.com.br`.

6. **Stripe Price IDs corretos**
   - Confirme que Starter, Pro e Elite usam IDs `price_...`.
   - Nao use IDs `prod_...`.

7. **Stripe webhook**
   - Configure `https://www.globalhireai.com.br/api/stripe/webhook`.
   - Ative eventos de checkout e assinatura.
   - Cole o `STRIPE_WEBHOOK_SECRET` na Vercel.

8. **Clarity Project ID**
   - Crie projeto no Microsoft Clarity.
   - Cole `NEXT_PUBLIC_CLARITY_PROJECT_ID`.
   - Confirme que o script so carrega apos aceitar analytics.

9. **Sentry DSN**
   - Opcional para MVP.
   - Se ativar, use `NEXT_PUBLIC_SENTRY_DSN` e evite logs com dados profissionais sensiveis.

10. **Rotacionar chaves expostas**
    - Se alguma chave real foi enviada por print, chat ou commit, gere outra chave no provedor.
    - Atualize Vercel e `.env.local`.

11. **Deploy final**
    - Rode `npm run build`.
    - Faça deploy na Vercel.
    - Teste auth, Groq, Stripe, webhook, upload, cookies, privacidade e termos.

## Proximos passos para vender

1. Criar uma oferta simples: "Curriculo internacional em 5 minutos".
2. Gravar 10 Reels usando os roteiros da pasta `/marketing`.
3. Fazer uma campanha de teste com R$20 por dia.
4. Oferecer o plano Starter como porta de entrada.
5. Criar prova social com antes/depois de curriculos.
6. Medir: visitantes, cadastros, checkouts iniciados e assinaturas.
7. Melhorar a landing com base nas perguntas dos usuarios.

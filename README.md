# GlobalHire AI

SaaS em Next.js para criar curriculos ATS, cartas de apresentacao, resumo de LinkedIn, respostas para recrutadores, preparacao para entrevista e traducao/adaptacao de curriculo para vagas internacionais.

## O que ja vem pronto

- Landing page responsiva com CTA, planos, beneficios e FAQ.
- Cadastro, login, logout e recuperacao de senha com Supabase.
- Dashboard para colar curriculo, vaga, idioma, pais e tipo de entrega.
- Backend seguro para Groq usando `GROQ_API_KEY` apenas no servidor.
- Historico de geracoes salvo no Supabase.
- Exportacao para PDF pelo navegador.
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
4. Copie os Price IDs e cole no `.env.local`:

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

Para liberar seu e-mail como admin:

1. Abra `.env.local`.
2. Preencha:

```bash
ADMIN_EMAILS=seuemail@dominio.com
ADMIN_BYPASS_EMAILS=hugomarcianoleite@gmail.com
```

`ADMIN_EMAILS` libera acesso ao painel admin.
`ADMIN_BYPASS_EMAILS` libera teste como plano Elite sem pagar, sem limite Free e sem marca d'agua no PDF.

3. Crie conta no app com esse mesmo e-mail.
4. Acesse:

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
8. Troque `NEXT_PUBLIC_APP_URL` para a URL final da Vercel.
9. Clique em **Deploy**.
10. Depois do deploy, volte no Supabase e Stripe para trocar URLs locais pela URL da Vercel.

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

## Proximos passos para vender

1. Criar uma oferta simples: "Curriculo internacional em 5 minutos".
2. Gravar 10 Reels usando os roteiros da pasta `/marketing`.
3. Fazer uma campanha de teste com R$20 por dia.
4. Oferecer o plano Starter como porta de entrada.
5. Criar prova social com antes/depois de curriculos.
6. Medir: visitantes, cadastros, checkouts iniciados e assinaturas.
7. Melhorar a landing com base nas perguntas dos usuarios.

# User Flow

Status: IMPLEMENTADO/PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Fluxo público

1. Usuário acessa landing page.
2. Lê proposta de valor, planos, FAQ e limites honestos.
3. Aceita ou rejeita analytics no banner LGPD.
4. Clica em CTA de cadastro.

Status: IMPLEMENTADO

## Fluxo de autenticação

1. Usuário cria conta por e-mail/senha ou Google OAuth.
2. Supabase cria sessão.
3. Usuário é direcionado para dashboard.
4. Se esquecer senha, usa recuperação.

Status: IMPLEMENTADO

## Fluxo de geração

1. Usuário escolhe ferramenta.
2. Cola ou envia currículo.
3. Cola descrição da vaga quando aplicável.
4. Seleciona idioma/país.
5. API valida sessão, plano, limite e captcha.
6. Groq gera resposta.
7. Resultado é exibido e salvo no histórico.

Status: IMPLEMENTADO

## Fluxo de upgrade

1. Usuário atinge limite ou escolhe plano.
2. App cria Stripe Checkout.
3. Stripe processa pagamento.
4. Webhook atualiza Supabase.
5. Dashboard mostra novo plano.

Status: IMPLEMENTADO

## Pontos de fricção conhecidos

PARCIAL:

- Upload de PDF escaneado depende de colagem manual.
- Rate limit em memória pode variar em produção serverless.
- Algumas configurações externas ainda dependem de setup manual.

## Melhorias futuras

- Onboarding guiado.
- Checklist de candidatura.
- Templates visuais de currículo mais robustos.
- Recomendações baseadas em histórico.

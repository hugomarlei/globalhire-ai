# Backup and Recovery

Status: PENDENTE/PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Definir estratégia de backup e recuperação para dados críticos.

## Dados críticos

- Usuários e perfis no Supabase.
- Histórico de gerações.
- Assinaturas e plano sincronizado.
- Configurações de ambiente na Vercel.
- Produtos, preços e webhooks no Stripe.

## Situação atual

PARCIAL:

- Supabase oferece mecanismos de backup dependendo do plano contratado.
- Stripe mantém histórico de pagamentos e assinaturas.
- Código está versionado no Git.

PENDENTE:

- Teste formal de restore.
- Export periódico do banco.
- Runbook de recuperação.
- Backup das configurações Vercel/Cloudflare.

## Estratégia recomendada MVP

1. Usar plano Supabase com backups automáticos.
2. Exportar schema SQL após mudanças relevantes.
3. Manter `.env.example` atualizado sem secrets.
4. Documentar manualmente variáveis configuradas na Vercel.
5. Testar restore em projeto Supabase separado a cada trimestre.

## Recovery Time Objective

Proposta MVP:

- RTO alvo: 24 horas.
- RPO alvo: 24 horas.

Esses valores são estimativas operacionais para bootstrap e devem ser revisados conforme receita e volume de usuários.

## Cenários

Banco corrompido:

- Pausar geração, comunicar usuários afetados, restaurar backup Supabase.

Webhook falhou:

- Reprocessar eventos no Stripe e reconciliar assinaturas.

Chave exposta:

- Rotacionar no provedor e atualizar Vercel imediatamente.

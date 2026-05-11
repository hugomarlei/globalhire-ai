# Cookie Policy Overview

Status: IMPLEMENTADO/PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Documentar uso de cookies e tecnologias similares.

## Categorias

Essenciais:

- Login e sessão.
- Segurança.
- Funcionamento da aplicação.

Status: IMPLEMENTADO

Analytics:

- Microsoft Clarity.
- Só carrega se `NEXT_PUBLIC_CLARITY_PROJECT_ID` existir e usuário aceitar analytics.

Status: PARCIAL

## Implementação atual

- Banner no primeiro acesso.
- Botões: aceitar todos, rejeitar analytics, preferências.
- Consentimento salvo no localStorage.
- Footer permite reabrir preferências.

## Limitações

- Consentimento não é salvo no servidor.
- Não há CMP certificada.
- Não há granularidade além de essencial/analytics.

## Próximas ações

- Registrar consentimento no banco.
- Criar versão formal da política de cookies.
- Mapear todos os scripts de terceiros periodicamente.

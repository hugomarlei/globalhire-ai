# Governança de prompts (produto)

## Versão e registo

- Prompts “core” devem viver no **código** ou em repositório privado versionado — não em docs públicos com segredos.
- Mudanças significativas: nota em changelog interno + teste de regressão qualitativo.

## Testes de qualidade

- Conjunto fixo de casos (CV curto, JD longa, língua mista) avaliados antes de deploy de prompt crítico.

## Segurança

- Instruções do sistema devem incluir **fronteiras** (não inventar experiência, não dados pessoais de terceiros) — alinhar com implementação real em `lib/` / rotas API.

# ATS Optimization Logic

Status: PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Explicar a lógica de otimização ATS usada pela GlobalHire AI.

## Entradas

- Currículo do usuário.
- Descrição da vaga.
- Tipo de entrega.
- Idioma.
- País-alvo.
- Plano do usuário.
- Score/recomendações quando origem é ATS Score.

## Processamento

IMPLEMENTADO:

- Backend valida autenticação, plano e limite.
- Prompt profissional é montado server-side.
- Groq recebe currículo e vaga.
- IA reescreve o documento com foco em aderência.
- Resultado é salvo no histórico.

## Intensidade por plano

| Plano | Intensidade | Status |
| --- | --- | --- |
| Free | Prévia premium semelhante ao Elite, 1 uso mensal | IMPLEMENTADO |
| Starter | Otimização moderada | IMPLEMENTADO |
| Pro | Otimização forte | IMPLEMENTADO |
| Elite | Otimização máxima sem inventar fatos | IMPLEMENTADO |

## O que a otimização busca

- Clareza de cargo, escopo e impacto.
- Termos compatíveis com a vaga.
- Experiências reordenadas por relevância.
- Bullets orientados a resultado.
- Linguagem profissional no idioma alvo.

## Limites

- Não deve criar experiência inexistente.
- Não deve inferir cidade ou dados não informados.
- Não deve garantir aprovação em ATS real.
- ATS Score é estimativa, não certificação.

## Pendências

- Métrica ATS mais auditável e versionada.
- Registro de versão dos prompts usados.
- Testes automatizados de regressão de prompt.

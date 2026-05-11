# AI Limitations

Status: IMPLEMENTADO/PARCIAL  
Owner atual: Solo founder / operador técnico  
Última revisão: 2026-05-10

## Objetivo

Documentar limitações conhecidas do uso de IA generativa no produto.

## Limitações principais

- IA pode gerar erros factuais.
- IA pode simplificar demais ou exagerar linguagem.
- IA pode interpretar mal uma vaga.
- IA pode sugerir termos ATS que não se aplicam ao candidato.
- IA não garante entrevista, emprego ou aprovação.
- IA não substitui revisão humana.

## Mitigações implementadas

IMPLEMENTADO:

- Prompts orientam preservar fatos verdadeiros.
- Textos públicos deixam claro que não há garantia de contratação.
- Usuário visualiza e revisa documento antes de usar.
- IA é chamada server-side, sem expor chave Groq.

PARCIAL:

- Não há revisão humana interna.
- Não há detecção avançada de alucinação factual.
- Não há comparação automática completa contra documentos comprobatórios.

## Regras de produto

- Nunca prometer contratação.
- Nunca incentivar fraude.
- Sempre orientar revisão.
- Não afirmar que ATS Score representa decisão real de empresa.

## Próximas ações

- Adicionar alertas contextuais no resultado.
- Criar testes de qualidade de prompt.
- Registrar versões de prompt.

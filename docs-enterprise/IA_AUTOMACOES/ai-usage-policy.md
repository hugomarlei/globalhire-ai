# Política de uso de IA (empresa)

**Fontes canónicas técnicas:** [`docs/GROQ_SETUP.md`](../../docs/GROQ_SETUP.md), `TECNICO/ai-pipeline.md`

## Princípios

1. **Transparência:** o produto comunica que o conteúdo é gerado por IA.
2. **Human-in-the-loop:** o utilizador revê e edita antes de submeter a terceiros.
3. **Minimização de dados:** apenas enviar ao modelo o necessário para a tarefa.

## O que não fazer

- Enviar dados de terceiros sem base legal clara.
- Guardar prompts completos em logs de analytics (ver `SEGURANCA_COMPLIANCE/`).

## Fornecedor

- **Groq** — chave `GROQ_API_KEY`; sem armazenar chave em docs ou tickets.

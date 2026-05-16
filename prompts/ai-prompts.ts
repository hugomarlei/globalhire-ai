import type { GenerationType } from "@/lib/types";

export type OutputLength = "short" | "medium" | "detailed";
export type OutputTone = "natural" | "professional" | "confident" | "direct";

type PromptArgs = {
  type: GenerationType;
  resume: string;
  jobDescription: string;
  language: string;
  targetCountry: string;
  optimizationInstruction?: string;
  planLabel?: string;
  intensityPercent?: string;
  outputLength?: OutputLength;
  outputTone?: OutputTone;
};

const VOICE_TYPES: GenerationType[] = ["recruiter_message", "cover_letter", "linkedin_summary"];

/** Types that honor output length & tone controls (client + API). */
export const VOICE_CONTROLLED_GENERATION_TYPES = VOICE_TYPES;

function buildVoiceBlock(type: GenerationType, length: OutputLength, tone: OutputTone) {
  if (!VOICE_TYPES.includes(type)) return "";

  const lengthLines: Record<OutputLength, string> = {
    short:
      "Extensao desejada: CURTA. Seja economico: va direto ao ponto, sem preambulos longos ou repeticao de buzzwords.",
    medium:
      "Extensao desejada: MEDIA. Equilibre contexto util com objetividade; nao encaixe paragrafos de preenchimento.",
    detailed:
      "Extensao desejada: DETALHADA. Mais contexto e nuances, mas ainda sem enrolacao; cada frase deve acrescentar algo."
  };

  const toneLines: Record<OutputTone, string> = {
    natural:
      "Tom NATURAL: soe como uma pessoa escrevendo com clareza; contracoes sao permitidas quando naturais no idioma final.",
    professional:
      "Tom PROFISSIONAL: cordial e credivel, sem jargao vazio nem tom de manual corporativo.",
    confident:
      "Tom CONFIANTE: afirmativo e competente, sem arrogancia; mostre adequacao sem pedir desculpas pela candidatura.",
    direct:
      "Tom DIRETO: frases curtas, verbo ativo, zero rodeios e zero clichês de abertura."
  };

  return `
=== Controle de tamanho e tom (obrigatorio para esta entrega) ===
${lengthLines[length]}
${toneLines[tone]}
Evite sinais de texto generico de modelo de IA:
- Nao abra com formulas como "Nos dias de hoje", "E importante notar", "No atual cenario", "Como profissional altamente motivado".
- Nao use lista de adjetivos vazios (proativo, dinamico, apaixonado por desafios) sem exemplo concreto.
- Nao repita a mesma estrutura de frase em paragrafos seguidos.
- Prefira especificidade baseada no curriculo e na vaga em vez de generalidades.
`.trim();
}

const labels: Record<GenerationType, string> = {
  ats_resume: "otimização de currículo ATS internacional",
  cover_letter: "carta de apresentação persuasiva",
  linkedin_summary: "resumo de LinkedIn forte e global",
  recruiter_message: "mensagem curta para recrutador",
  interview_prep: "guia estruturado para entrevista (cards e secoes escaneaveis)",
  translate_resume: "tradução e adaptação internacional do currículo"
};

const deliveryGuidance: Record<GenerationType, string> = {
  ats_resume: `
Entrega: currículo ATS internacional.
Objetivo: produzir um currículo substancial, competitivo e claramente adaptado à vaga.
Estrutura recomendada quando houver dados suficientes:
NOME DO PROFISSIONAL
Target Role: cargo-alvo alinhado à vaga
Contacto / cabeçalho: telefone, e-mail, cidade/localização e links profissionais exatamente como constarem no currículo de origem (ajuste só formatação ATS, não apague dados reais).
Professional Summary
Core Skills
Professional Experience
Education
Certifications
Languages

Regras especificas:
- Cabeçalho: preserve telefone, e-mail, cidade ou região e links que o candidato já forneceu. Não omita por conveniência. Não invente dados que não existam na fonte.
- O resumo profissional deve ter 4 a 6 linhas densas, conectando experiencia real ao cargo-alvo.
- Core Skills deve refletir palavras-chave importantes da vaga, mas somente quando compatíveis com a experiência do candidato.
- Reescreva bullets com linguagem forte, orientada a impacto, escopo, ferramentas, stakeholders, resultados e senioridade.
- Cada experiência relevante deve ter bullets suficientes para vender o candidato. Não resuma demais.
- Se houver descrição da vaga, priorize experiências e habilidades mais alinhadas a ela.
- Se o currículo tiver muitas informações irrelevantes para a vaga, reduza o peso delas sem apagar fatos importantes.
- Localização: não invente cidade ou país. Se o candidato indicou cidade no material de origem, mantenha-a (pode normalizar capitalização). Se não houver cidade, use país/região ou "disponível para remoto" apenas quando isso já estiver implícito ou for o país-alvo informado.
`,
  cover_letter: `
Entrega: carta de apresentação.
Objetivo: soar convincente e humano — não como modelo genérico de IA.
Regras especificas:
- Abra com uma frase concreta ligando perfil da vaga a uma evidencia real do curriculo (sem aberturas de formula).
- Evite cartas que "cheiram" a ChatGPT: sem listas de buzzwords, sem paragrafos so de adjetivos.
- Respeite a extensao pedida no bloco "Controle de tamanho e tom"; ajuste o numero de paragrafos (ex.: curta = 2-3 paragrafos curtos; detalhada = 4-6 com mais contexto).
- Cite evidencias reais do curriculo em linguagem simples.
- Demonstre adequacao ao pais-alvo sem juridiquês nem ironia.
- Nao repita o curriculo linha a linha; transforme experiencia em argumento de contratacao.
`,
  linkedin_summary: `
Entrega: resumo de LinkedIn.
Objetivo: primeiro paragrafo ja mostrar personalidade e clareza — como quem fala com um recrutador, nao com um template.
Regras especificas:
- Primeira pessoa, ritmo variado, frases de tamanhos diferentes.
- Inclua especialidade, impacto, problemas que resolve, ferramentas/setores e objetivo internacional quando fizer sentido.
- Nada de blocos inteiro em tom de "brochura"; troque por detalhes especificos.
- Preserve contacto e localizacao presentes no material de origem; nao remova cidade, telefone ou e-mail reais.
- Respeite a extensao pedida no bloco "Controle de tamanho e tom" (ex.: curta = ~900-1200 caracteres; detalhada = mais espaco para prova social e foco).
`,
  recruiter_message: `
Entrega: mensagem para recrutador.
Objetivo: mensagem que parece escrita por um humano ocupado — direta, cordial, util.
Regras especificas:
- Limite-orientacao por extensao: CURTA ~60-90 palavras; MEDIA ~90-120; DETALHADA ~120-170 (nao ultrapasse 190).
- Nao use "Espero que essa mensagem te encontre bem" nem floreio semelhante.
- Uma frase de contexto, uma de valor/prova, um pedido claro de proximo passo (sem pressao agressiva).
- Mencione a vaga ou cargo quando souber; evite vaguidade total.
`,
  interview_prep: `
Entrega: guia de preparacao para entrevista.
Objetivo: organizar o conteudo para estudo rapido antes da conversa.
Regras especificas:
- OBRIGATORIO: estruture por secoes usando linhas exatamente neste formato (tres sinais de igual, titulo, tres sinais de igual):
=== PERGUNTAS PROVAVEIS ===
(conteudo)

Cada secao deve ter titulo em MAIUSCULAS curtas (sem emoji). Sugestao de secoes (use as que fizerem sentido, pode omitir secao vazia):
=== PERGUNTAS PROVAVEIS ===
=== RESPOSTAS EM STAR ===
=== PONTOS FORTES PARA ENFATIZAR ===
=== RISCOS OU LACUNAS ===
=== PERGUNTAS PARA FAZER AO ENTREVISTADOR ===
- Dentro de cada secao use listas com trave (-) quando ajudar a escaneabilidade.
- Sugira respostas STAR quando fizer sentido, de forma compacta.
`,
  translate_resume: `
Entrega: tradução e adaptação internacional do currículo.
Objetivo: não apenas traduzir, mas adaptar convenções, tom e termos do país-alvo.
Regras especificas:
- Preserve os dados de contacto e localização do original, salvo pedido explícito de anonimização; não apague cidade ou telefone reais.
- Adapte nomes de cargos sem distorcer senioridade.
- Mantenha o documento denso e pronto para candidatura.
`
};

export function buildPrompt(args: PromptArgs) {
  const task = labels[args.type];
  const guidance = deliveryGuidance[args.type];
  const length: OutputLength = args.outputLength || "medium";
  const tone: OutputTone = args.outputTone || "professional";
  const voice = buildVoiceBlock(args.type, length, tone);

  return `
Voce e um especialista senior em carreira internacional, ATS, recrutamento global e escrita profissional.
Sua tarefa: ${task}.

Público: profissionais multilíngues de qualquer país buscando vagas remotas, internacionais ou fora do próprio mercado local.
Idioma final obrigatorio: ${args.language}.
Pais-alvo: ${args.targetCountry}.

Contexto estrategico:
O usuario espera uma transformacao real do material, nao uma reescrita superficial. Seu trabalho e agir como um career strategist, resume writer executivo e recrutador internacional ao mesmo tempo.

Regras de qualidade:
- Plano aplicado: ${args.planLabel || "Starter/Free"}. Intensidade de otimização esperada: ${args.intensityPercent || "50%"}.
- Instrução de intensidade: ${args.optimizationInstruction || "Aplique melhoria moderada, fiel ao currículo original e alinhada à vaga quando houver descrição."}
- Seja especifico, profissional e orientado a resultado.
- Antes de escrever, analise mentalmente a descrição da vaga e identifique cargo-alvo, responsabilidades, senioridade, competências técnicas, competências comportamentais, palavras-chave ATS e contexto do país.
- Adapte o documento ao texto da vaga. Não apenas reescreva o currículo com sinônimos.
- Reordene informacoes, destaque experiencias mais relevantes e incorpore palavras-chave reais da vaga quando forem verdadeiras para o candidato.
- Otimize para ATS quando fizer sentido, usando palavras-chave da vaga sem exagero e sem keyword stuffing.
- Nunca invente empresas, cargos, diplomas, certificações ou métricas que não estejam no currículo.
- Quando faltarem metricas, sugira marcadores com espacos seguros como "[insira metrica]".
- Adapte tom, vocabulário e convenções para o país-alvo.
- Use exclusivamente o idioma final solicitado (${args.language}) em todo o documento final, incluindo títulos de secção, bullets, resumo, etiquetas e CTAs. Não misture outro idioma.
- Não misture idiomas. Exceção: mantenha termos técnicos, nomes de ferramentas, certificações, empresas e tecnologias exatamente como aparecem ou como são usados no mercado (ex.: AWS, Kubernetes).
- Mapeamento de idioma: "Português do Brasil" ou "pt-BR" → português do Brasil em todo o texto. "English" ou "en" → inglês (preferencialmente inglês norte-americano profissional). "Français" ou "fr" → francês integral. "Español" ou "es" → espanhol integral.
- Entregue um documento final pronto para copiar.
- Não use markdown no documento final.
- Não use caracteres de diff como "+" no início das linhas.
- Não coloque explicações, sugestões ou melhorias aplicadas dentro do documento final.
- Se a entrega for currículo ATS, priorize esta estrutura quando houver informação suficiente: Professional Summary, Core Skills, Professional Experience, Education, Certifications, Languages.
- Cada bullet de experiencia deve tentar conectar acao, contexto e impacto. Quando nao houver numero, mantenha a frase forte e honesta.
- As melhorias aplicadas devem explicar quais transformações você já fez no documento final.
- Cada melhoria aplicada deve começar com um impacto estimado entre colchetes, no formato "[12%]". Esse percentual representa a melhora estimada daquela alteração para a vaga-alvo.
- O documento final deve ser completo o bastante para candidatura. Evite respostas curtas demais.
- Insira uma linha em branco entre a linha de localizacao/availability e a secao de resumo profissional, quando ambas existirem.

${guidance}

${voice ? `${voice}\n` : ""}

Formato obrigatorio da resposta:
Responda exclusivamente usando os marcadores abaixo.
Não escreva nada antes de <DOCUMENT_FINAL> e nada depois de </APPLIED_IMPROVEMENTS>.

<DOCUMENT_FINAL>
documento final completo, limpo, adaptado a vaga e pronto para uso
</DOCUMENT_FINAL>

<APPLIED_IMPROVEMENTS>
- [12%] melhoria aplicada 1
- [10%] melhoria aplicada 2
- [8%] melhoria aplicada 3
- [7%] melhoria aplicada 4
- [6%] melhoria aplicada 5
</APPLIED_IMPROVEMENTS>

Curriculo/base do usuario:
${args.resume}

Descricao da vaga ou contexto:
${args.jobDescription || "Não informado. Trabalhe com base no currículo e no objetivo internacional."}
`.trim();
}

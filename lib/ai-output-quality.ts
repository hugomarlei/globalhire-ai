import type { GenerationType } from "@/lib/types";

type QualityInput = {
  type: GenerationType;
  resume: string;
  jobDescription?: string;
  document: string;
  recommendations?: string[];
};

export type AssetQualityEvaluation = {
  score: number;
  shouldRevise: boolean;
  checks: {
    transformation: number;
    jobAlignment: number;
    specificity: number;
    structure: number;
    humanTone: number;
    experienceRetention: number;
  };
  issues: string[];
  matchedJobKeywords: string[];
  missingJobKeywords: string[];
  missingExperienceAnchors: string[];
};

const stopWords = new Set([
  "para",
  "como",
  "com",
  "uma",
  "um",
  "que",
  "por",
  "das",
  "dos",
  "and",
  "the",
  "with",
  "from",
  "this",
  "that",
  "role",
  "job",
  "vaga",
  "cargo",
  "empresa",
  "experience",
  "experiencia",
  "experiência"
]);

const genericAiPhrases = [
  "profissional altamente",
  "paixao por desafios",
  "sou uma pessoa proativa",
  "ambiente dinamico",
  "buscando constantemente",
  "habilidades excepcionais",
  "comprovada capacidade",
  "apaixonado por tecnologia",
  "apaixonada por tecnologia",
  "proven track record",
  "highly motivated",
  "dynamic environment",
  "results-driven professional",
  "passionate about"
];

const negativeDisclosurePatterns = [
  /nenhum(?:a)?\s+(?:certifica[cç][aã]o|certificado|curso|forma[cç][aã]o)\s+relevante/i,
  /sem\s+(?:certifica[cç][oõ]es|certificados|cursos)\s+relevantes/i,
  /no\s+relevant\s+(?:certifications|certificates|courses)/i,
  /not\s+applicable/i,
  /n\/a\b/i
];

function words(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\p{L}\p{N}+#.\s-]/gu, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function uniqueTokens(value: string) {
  return new Set(words(value).filter((item) => item.length > 3 && !stopWords.has(item)));
}

function overlapRatio(a: Set<string>, b: Set<string>) {
  if (!a.size || !b.size) return 0;
  let overlap = 0;
  for (const item of a) {
    if (b.has(item)) overlap += 1;
  }
  return overlap / Math.min(a.size, b.size);
}

function extractJobKeywords(jobDescription = "") {
  const counts = new Map<string, number>();
  for (const token of words(jobDescription)) {
    if (token.length <= 3 || stopWords.has(token)) continue;
    counts.set(token, (counts.get(token) || 0) + 1);
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 18)
    .map(([keyword]) => keyword);
}

function clamp(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function countMatches(value: string, patterns: RegExp[]) {
  return patterns.reduce((sum, pattern) => sum + (pattern.test(value) ? 1 : 0), 0);
}

function normalizeForSearch(value: string) {
  return words(value).join(" ");
}

function extractExperienceAnchors(resume: string) {
  const lines = resume
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
  const datePattern =
    /\b(?:jan|fev|mar|abr|mai|jun|jul|ago|set|out|nov|dez|jan|feb|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-zç.]*\/?\d{4}\b|\b20\d{2}\b|\batual\b|\bpresent\b/i;
  const headingPattern =
    /^(resumo|summary|experi[eê]ncia|professional experience|forma[cç][aã]o|education|idiomas|languages|compet[eê]ncias|skills|expertise|certifica[cç][oõ]es)/i;
  const anchors: string[] = [];

  for (let index = 1; index < lines.length; index += 1) {
    const line = lines[index];
    const previous = lines[index - 1];
    if (!datePattern.test(line) || headingPattern.test(previous)) continue;
    const candidate = previous.replace(/\s+[–—-]\s+.*$/, "").trim();
    const tokenCount = words(candidate).filter((token) => token.length > 1).length;
    if (candidate.length >= 3 && tokenCount <= 6 && !headingPattern.test(candidate)) {
      anchors.push(candidate);
    }
  }

  return [...new Set(anchors)].slice(0, 12);
}

function anchorAppearsInDocument(anchor: string, document: string) {
  const normalizedDocument = normalizeForSearch(document);
  const tokens = words(anchor).filter((token) => token.length > 1);
  if (!tokens.length) return true;
  const distinctive = tokens.filter((token) => !["brasil", "franca", "frança", "paris", "curitiba"].includes(token));
  const candidates = distinctive.length ? distinctive : tokens;
  return candidates.some((token) => normalizedDocument.includes(token));
}

export function evaluateGeneratedAsset(input: QualityInput): AssetQualityEvaluation {
  const originalTokens = uniqueTokens(input.resume);
  const outputTokens = uniqueTokens(input.document);
  const outputLower = input.document.toLowerCase();
  const outputLines = input.document.split("\n").map((line) => line.trim()).filter(Boolean);
  const bulletLines = outputLines.filter((line) => /^[-•*]\s+/.test(line));
  const recommendations = input.recommendations || [];

  const similarity = overlapRatio(originalTokens, outputTokens);
  const expansion = input.document.length / Math.max(input.resume.length, 1);
  const transformation = clamp((1 - similarity) * 55 + Math.min(expansion, 1.35) * 28 + Math.min(recommendations.length, 5) * 4);

  const jobKeywords = extractJobKeywords(input.jobDescription);
  const matchedJobKeywords = jobKeywords.filter((keyword) => outputTokens.has(keyword));
  const missingJobKeywords = jobKeywords.filter((keyword) => !outputTokens.has(keyword));
  const jobAlignment = jobKeywords.length ? clamp((matchedJobKeywords.length / jobKeywords.length) * 100) : 72;

  const specificitySignals = [
    /\b\d+[%+]?\b/,
    /\b[A-Z][A-Za-z0-9+.#-]{1,}\b/,
    /\b(stakeholders?|clientes?|users?|equipes?|teams?|processos?|pipeline|revenue|cost|performance|automation|cloud|api|data)\b/i,
    /\b(led|built|implemented|improved|reduced|increased|managed|desenvolveu|liderou|implementou|otimizou|reduziu|aumentou)\b/i
  ];
  const specificity = clamp(countMatches(input.document, specificitySignals) * 18 + Math.min(bulletLines.length, 8) * 4);

  const structureSignals = [
    /summary|resumo|profile|perfil/i,
    /skills|compet[eê]ncias|habilidades/i,
    /experience|experi[eê]ncia/i,
    /education|educa[cç][aã]o|forma[cç][aã]o/i
  ];
  const structure = input.type === "ats_resume" || input.type === "translate_resume"
    ? clamp(countMatches(input.document, structureSignals) * 23 + Math.min(bulletLines.length, 6) * 2)
    : clamp(70 + Math.min(outputLines.length, 8) * 3);

  const genericHits = genericAiPhrases.filter((phrase) => outputLower.includes(phrase)).length;
  const negativeDisclosureHits = negativeDisclosurePatterns.filter((pattern) => pattern.test(input.document)).length;
  const repeatedStarts = new Map<string, number>();
  for (const line of bulletLines) {
    const first = words(line).slice(0, 2).join(" ");
    if (first) repeatedStarts.set(first, (repeatedStarts.get(first) || 0) + 1);
  }
  const repetitionPenalty = [...repeatedStarts.values()].filter((count) => count > 2).length * 10;
  const humanTone = clamp(94 - genericHits * 16 - repetitionPenalty - negativeDisclosureHits * 18);

  const experienceAnchors = input.type === "ats_resume" || input.type === "translate_resume"
    ? extractExperienceAnchors(input.resume)
    : [];
  const missingExperienceAnchors = experienceAnchors.filter((anchor) => !anchorAppearsInDocument(anchor, input.document));
  const experienceRetention = experienceAnchors.length
    ? clamp(((experienceAnchors.length - missingExperienceAnchors.length) / experienceAnchors.length) * 100)
    : 86;

  const score = clamp(
    transformation * 0.3 +
      jobAlignment * 0.21 +
      specificity * 0.17 +
      structure * 0.14 +
      humanTone * 0.1 +
      experienceRetention * 0.08
  );

  const issues: string[] = [];
  if (transformation < 58) issues.push("A saída parece pouco transformada em relação ao currículo/base original.");
  if (jobKeywords.length && jobAlignment < 45) issues.push("A saída usa poucas palavras-chave relevantes da descrição da vaga.");
  if (specificity < 45) issues.push("A saída tem pouca evidência concreta, escopo, ferramenta, métrica ou contexto.");
  if (structure < 60) issues.push("A estrutura não está forte o bastante para ATS/leitura rápida.");
  if (humanTone < 72) issues.push("A saída tem sinais de texto genérico ou repetitivo de IA.");
  if (negativeDisclosureHits) issues.push("A saída inclui seção ou frase depreciativa sobre lacunas, como ausência de certificações relevantes.");
  if (missingExperienceAnchors.length) {
    issues.push(`A saída removeu experiências/empresas do currículo original: ${missingExperienceAnchors.join(", ")}.`);
  }
  if (input.document.length < Math.min(1200, input.resume.length * 0.75) && (input.type === "ats_resume" || input.type === "translate_resume")) {
    issues.push("A saída ficou curta demais para um currículo pronto para candidatura.");
  }

  return {
    score,
    shouldRevise: score < 78 || issues.length > 0,
    checks: { transformation, jobAlignment, specificity, structure, humanTone, experienceRetention },
    issues,
    matchedJobKeywords,
    missingJobKeywords,
    missingExperienceAnchors
  };
}

export function buildQualityRevisionPrompt(input: QualityInput & { quality: AssetQualityEvaluation; language: string }) {
  return `
Refaça o asset abaixo porque ele falhou na auditoria automatizada de qualidade.

Idioma obrigatório: ${input.language}
Tipo de entrega: ${input.type}
Score de qualidade atual: ${input.quality.score}/100
Falhas detectadas:
${input.quality.issues.map((issue) => `- ${issue}`).join("\n") || "- Melhorar substancialmente a qualidade geral."}

Palavras-chave da vaga ainda ausentes e compatíveis para avaliar com cuidado:
${input.quality.missingJobKeywords.slice(0, 12).join(", ") || "Nenhuma lista disponível."}

Regras obrigatórias:
- Entregue uma versão materialmente melhor, não uma paráfrase.
- Preserve somente fatos sustentados pelo currículo/base.
- Não remova empresas, cargos ou experiências do currículo/base. Reordene e compacte o que for menos aderente, mas preserve o histórico real.
- Se a versão anterior removeu experiências, recoloque-as com bullets mais curtos e orientados à vaga.
- Incorpore termos da vaga apenas quando forem coerentes com a trajetória real.
- Fortaleça estrutura, densidade, bullets e leitura humana.
- Evite frases genéricas de IA e buzzwords sem prova.
- Nunca inclua frases depreciativas como "nenhum certificado relevante"; se uma seção estiver vazia, omita a seção.
- Use títulos e labels no idioma obrigatório, mantendo apenas termos técnicos consagrados quando necessário.
- Se faltar métrica, não invente; use impacto qualitativo concreto ou placeholder seguro.
- Responda exclusivamente com <DOCUMENT_FINAL> e <APPLIED_IMPROVEMENTS>.

Currículo/base original:
${input.resume}

Descrição da vaga/contexto:
${input.jobDescription || "Não informado."}

Versão anterior reprovada:
${input.document}
`.trim();
}

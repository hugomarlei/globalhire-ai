import { importResumeText } from "@/lib/resumes/import";
import { normalizeResumeData } from "@/lib/resumes/defaults";
import type { ResumeData, ResumeTemplateKey } from "@/lib/resumes/types";

type BuildAtsOptimizedResumeInput = {
  resume: string;
  jobDescription: string;
  language: string;
  found: string[];
  missing: string[];
  recommendations: string[];
  template?: ResumeTemplateKey;
  primaryColor?: string;
};

function cleanLine(value: string) {
  return value.replace(/\s+/g, " ").replace(/\s+([,.;:])/g, "$1").trim();
}

function normalizeForMatch(value: string) {
  return cleanLine(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function unique(items: string[]) {
  return Array.from(new Set(items.map(cleanLine).filter(Boolean)));
}

function cleanKeyword(value: string) {
  return cleanLine(value.replace(/[.,;:]+$/g, ""));
}

function looksLikeUsefulSkill(value: string) {
  const clean = cleanKeyword(value);
  if (clean.length < 4 || clean.length > 56) return false;
  if (clean.includes(":")) return false;
  if (/\s+ou\s+/i.test(clean)) return false;
  if (/\b(de|da|do|das|dos|em|e|and|or)$/i.test(clean)) return false;
  if (/\b(estou|aberto|oportunidades|remotas|globais|vamos|conectar|atualmente|precisa|forma clara|qualquer pessoa)\b/i.test(clean)) return false;
  return true;
}

function isUsefulSingleWordSkill(value: string, found: string[]) {
  if (value.split(/\s+/).length > 1) return true;
  if (found.some((term) => normalizeForMatch(term) === normalizeForMatch(value))) return true;
  return /^(eplan|autocad|solidworks|engeman|manusys|arkmeds|salesforce|brevo|clickup)$/i.test(value);
}

function bulletLines(value: string) {
  return value
    .split(/\n+/)
    .map((line) => cleanLine(line.replace(/^[•\-–]\s*/, "")))
    .filter(Boolean);
}

function supportedTerms(input: { data: ResumeData; sourceResume: string; found: string[]; jobDescription: string }) {
  const source = normalizeForMatch(input.sourceResume);
  const resumeSkills = input.data.skills
    .map(cleanKeyword)
    .filter((skill) => looksLikeUsefulSkill(skill) && isUsefulSingleWordSkill(skill, input.found) && source.includes(normalizeForMatch(skill)));
  const jobTerms = input.found
    .map(cleanKeyword)
    .filter((term) => {
      const normalized = normalizeForMatch(term);
      return normalized.length > 3 && looksLikeUsefulSkill(term) && source.includes(normalized);
    });
  return unique([...jobTerms, ...resumeSkills]).slice(0, 34);
}

function relevanceScore(value: string, terms: string[]) {
  const normalized = normalizeForMatch(value);
  return terms.reduce((score, term) => score + (normalized.includes(normalizeForMatch(term)) ? 1 : 0), 0);
}

function relevantFirstBullets(description: string, terms: string[]) {
  const bullets = bulletLines(description);
  return bullets
    .map((line, index) => ({ line, index, score: relevanceScore(line, terms) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map((item) => item.line);
}

function section(title: string, body: string | string[]) {
  const content = Array.isArray(body) ? body.filter(Boolean).join("\n") : body;
  return content.trim() ? `${title}\n${content.trim()}` : "";
}

function quantifiedEvidence(data: ResumeData, supported: string[]) {
  const scored = data.experience
    .flatMap((item) => bulletLines(item.description))
    .filter((line) => /(?:\d+%|R\$|\b\d+\s*(?:anos?|meses?|clientes?|projetos?|equipamentos?|LINACs?|bombas?|trocadores?))/i.test(line))
    .map((line, index) => ({ line, index, score: relevanceScore(line, supported) }))
    .sort((a, b) => b.score - a.score || a.index - b.index)
  const relevant = scored.filter((item) => item.score > 0);
  return (relevant.length ? relevant : scored).map((item) => item.line).slice(0, 4);
}

function buildSummary(data: ResumeData, supported: string[]) {
  const base = cleanLine(data.summary);
  const emphasis = supported
    .filter((term) => /manuten|predit|prevent|corret|falha|rca|mtbf|kpi|tpm|sap|automação|industrial|fornecedor|contrato|confiabilidade/i.test(term))
    .slice(0, 7);
  const evidence = quantifiedEvidence(data, supported);
  const headline = data.personal.headline || data.targetRole || "Profissional";
  const context = emphasis.length ? `com aderência a ${emphasis.join(", ")}` : "com trajetória técnica documentada no currículo original";
  const proof = evidence.length ? ` Evidências preservadas: ${evidence.slice(0, 3).join(" ")}` : "";
  const usefulBase = base
    .split(/(?<=[.!?])\s+/)
    .map(cleanLine)
    .filter((sentence) => sentence.length > 35 && !sentence.includes(" - ") && !/\b(atualmente|aberto a oportunidades|vamos nos conectar|vamos conectar|se voc[eê]|LinkedIn)\b/i.test(sentence))
    .slice(0, 2)
    .join(" ");
  if (!base) {
    return `${headline} ${context}.${proof}`.trim();
  }
  return `${headline} ${context}. ${usefulBase || base}${proof}`.trim();
}

function inferTargetRole(jobDescription: string, fallback: string) {
  const firstLine = cleanLine(jobDescription.split(/\n+/).find(Boolean) || "");
  const objectiveMatch = firstLine.match(/(?:objetivo do cargo|cargo|fun[cç][aã]o)\s*:?\s*([^.;]{8,90})/i);
  if (objectiveMatch) return cleanLine(objectiveMatch[1]);
  const roleMatch = jobDescription.match(/\b(?:engenheiro|gerente|analista|coordenador|supervisor|t[eé]cnico|vendedor|consultor)[^.;\n]{0,70}/i);
  return cleanLine(roleMatch?.[0] || fallback || "");
}

function buildOptimizedData(input: BuildAtsOptimizedResumeInput, data: ResumeData, supported: string[]) {
  const optimized = normalizeResumeData({
    ...data,
    language: input.language || data.language,
    targetRole: inferTargetRole(input.jobDescription, data.targetRole || data.personal.headline),
    targetJobDescription: input.jobDescription,
    template: input.template || data.template,
    primaryColor: input.primaryColor || data.primaryColor,
    summary: buildSummary(data, supported),
    skills: unique([...supported, ...data.skills])
      .filter((skill) => looksLikeUsefulSkill(skill) && isUsefulSingleWordSkill(skill, input.found))
      .slice(0, 32),
    experience: data.experience.map((item) => ({
      ...item,
      description: relevantFirstBullets(item.description, supported).map((line) => `- ${line}`).join("\n")
    }))
  });

  return optimized;
}

function buildDocumentText(data: ResumeData) {
  const personal = data.personal;
  const contact = [personal.email, personal.phone, personal.location, personal.links].filter(Boolean);
  const experiences = data.experience
    .filter((item) => item.role || item.company || item.description)
    .map((item) => {
      const dates = [item.start, item.current ? "Atual" : item.end].filter(Boolean).join(" - ");
      return [
        [item.role, item.company].filter(Boolean).join(" - ") || "Experiência",
        [item.location, dates].filter(Boolean).join(" | "),
        item.description
      ].filter(Boolean).join("\n");
    });
  const education = data.education
    .filter((item) => item.degree || item.school || item.description)
    .map((item) => {
      const dates = [item.start, item.end].filter(Boolean).join(" - ");
      return [
        item.school,
        item.degree,
        item.description,
        [dates, item.location].filter(Boolean).join(" | ")
      ].filter(Boolean).join("\n");
    });
  const certifications = data.certifications
    .filter((item) => item.name || item.issuer || item.description)
    .map((item) => [[item.name, item.issuer].filter(Boolean).join(" - "), item.date, item.description].filter(Boolean).join("\n"));

  return [
    personal.name,
    personal.headline || data.targetRole,
    contact.join(" | "),
    section("Resumo Profissional", data.summary),
    section("Habilidades-chave alinhadas à vaga", data.skills.join(", ")),
    section("Experiência Profissional", experiences),
    section("Formação", education),
    section("Certificações", certifications),
    section("Idiomas", data.languages.join(", "))
  ].filter(Boolean).join("\n\n").trim();
}

export function buildAtsScoreOptimizedResume(input: BuildAtsOptimizedResumeInput) {
  const data = normalizeResumeData(importResumeText(input.resume));
  const supported = supportedTerms({
    data,
    sourceResume: input.resume,
    found: input.found,
    jobDescription: input.jobDescription
  });
  const unsupportedMissing = input.missing
    .filter((term) => !normalizeForMatch(input.resume).includes(normalizeForMatch(term)))
    .slice(0, 8);

  const optimizedData = buildOptimizedData(input, data, supported);
  const document = buildDocumentText(optimizedData);

  const recommendations = [
    "Currículo reconstruído de forma completa a partir da base factual importada.",
    supported.length
      ? `Termos da vaga priorizados quando sustentados pelo currículo: ${supported.slice(0, 10).join(", ")}.`
      : "Não identifiquei termos da vaga com sustentação suficiente para inserir sem risco de alucinação.",
    unsupportedMissing.length
      ? "Palavras-chave ausentes sem evidência no currículo foram mantidas fora do documento."
      : "Todas as palavras-chave usadas no documento possuem suporte no currículo enviado."
  ];

  return { document, recommendations, resumeData: optimizedData };
}

import { importResumeText } from "@/lib/resumes/import";
import { normalizeResumeData } from "@/lib/resumes/defaults";
import type { ResumeData } from "@/lib/resumes/types";

type BuildAtsOptimizedResumeInput = {
  resume: string;
  jobDescription: string;
  language: string;
  found: string[];
  missing: string[];
  recommendations: string[];
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

function buildSummary(data: ResumeData, supported: string[]) {
  const base = cleanLine(data.summary);
  const emphasis = supported
    .filter((term) => /manuten|predit|prevent|corret|falha|rca|mtbf|kpi|tpm|sap|automação|industrial|fornecedor|contrato|confiabilidade/i.test(term))
    .slice(0, 10);
  if (!base) {
    return emphasis.length
      ? `Profissional com trajetória alinhada a ${emphasis.join(", ")}, preservando experiências e resultados comprovados no currículo original.`
      : "";
  }
  if (!emphasis.length) return base;
  return `${base}\n\nÊnfase para esta vaga: ${emphasis.join(", ")}.`;
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

  const personal = data.personal;
  const contact = [personal.email, personal.phone, personal.location, personal.links].filter(Boolean);

  const experiences = data.experience
    .filter((item) => item.role || item.company || item.description)
    .map((item) => {
      const dates = [item.start, item.current ? "Atual" : item.end].filter(Boolean).join(" - ");
      const bullets = relevantFirstBullets(item.description, supported).map((line) => `- ${line}`);
      return [
        [item.role, item.company].filter(Boolean).join(" - ") || "Experiência",
        [item.location, dates].filter(Boolean).join(" | "),
        bullets.join("\n")
      ].filter(Boolean).join("\n");
    });

  const education = data.education
    .filter((item) => item.degree || item.school || item.description)
    .map((item) => {
      const dates = [item.start, item.end].filter(Boolean).join(" - ");
      return [
        item.school,
        item.degree,
        bulletLines(item.description).join("\n"),
        [dates, item.location].filter(Boolean).join(" | ")
      ].filter(Boolean).join("\n");
    });

  const certifications = data.certifications
    .filter((item) => item.name || item.issuer || item.description)
    .map((item) => [[item.name, item.issuer].filter(Boolean).join(" - "), item.date, item.description].filter(Boolean).join("\n"));

  const document = [
    personal.name,
    personal.headline || data.targetRole,
    contact.join(" | "),
    section("Resumo Profissional", buildSummary(data, supported)),
    section("Habilidades-chave alinhadas à vaga", supported.join(", ")),
    section("Experiência Profissional", experiences),
    section("Formação", education),
    section("Certificações", certifications),
    section("Idiomas", data.languages.join(", "))
  ].filter(Boolean).join("\n\n").trim();

  const recommendations = [
    "Currículo reconstruído de forma completa a partir da base factual importada.",
    supported.length
      ? `Termos da vaga priorizados quando sustentados pelo currículo: ${supported.slice(0, 10).join(", ")}.`
      : "Não identifiquei termos da vaga com sustentação suficiente para inserir sem risco de alucinação.",
    unsupportedMissing.length
      ? "Palavras-chave ausentes sem evidência no currículo foram mantidas fora do documento."
      : "Todas as palavras-chave usadas no documento possuem suporte no currículo enviado."
  ];

  return { document, recommendations };
}

import { NextResponse } from "next/server";
import type { GenerationType } from "@/lib/types";
import { importResumeText } from "@/lib/resumes/import";
import { normalizeResumeData } from "@/lib/resumes/defaults";
import type { ResumeData } from "@/lib/resumes/types";

type BudgetInput = {
  type: GenerationType;
  resume: string;
  jobDescription?: string;
};

export type BudgetedGenerationInput = {
  resume: string;
  jobDescription: string;
  compacted: boolean;
  estimatedResumeTokens: number;
  estimatedJobTokens: number;
  notes: string[];
};

const LONG_DOCUMENT_TYPES: GenerationType[] = ["ats_resume", "translate_resume"];
const DEFAULT_GROQ_REQUEST_TOKEN_BUDGET = 11_000;

export function estimateTokens(value: string) {
  return Math.ceil(value.length / 4);
}

function normalizeText(value: string) {
  return value
    .replace(/\r/g, "\n")
    .replace(/\u00a0/g, " ")
    .replace(
      /\s+(?=(?:LINKS?|PERFIL|RESUMO(?:\s+PROFISSIONAL)?|EXPERI[EÊ]NCIA(?:\s+PROFISSIONAL)?|FORMA[CÇ][AÃ]O|EDUCA[CÇ][AÃ]O|CERTIFICA[CÇ][OÕ]ES|HABILIDADES|COMPET[EÊ]NCIAS|IDIOMAS|LANGUAGES|SKILLS|PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EDUCATION|CERTIFICATIONS)\b)/gi,
      "\n"
    )
    .replace(/\s+(?=•\s*)/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function truncateText(value: string, maxChars: number) {
  const clean = normalizeText(value);
  if (clean.length <= maxChars) return clean;

  const lines = clean.split("\n").map((line) => line.trim()).filter(Boolean);
  const selected: string[] = [];
  let size = 0;

  for (const line of lines) {
    const next = line.length > 280 ? `${line.slice(0, 277).trim()}...` : line;
    if (size + next.length + 1 > maxChars) break;
    selected.push(next);
    size += next.length + 1;
  }

  return selected.join("\n").trim();
}

function section(title: string, body: string | string[]) {
  const content = Array.isArray(body) ? body.filter(Boolean).join("\n") : body;
  return content.trim() ? `${title}\n${content.trim()}` : "";
}

function compactDescription(value: string, maxChars: number) {
  const clean = normalizeText(value)
    .split("\n")
    .map((line) => line.replace(/^[•\-–]\s*/, "").trim())
    .filter(Boolean)
    .join("\n");

  if (clean.length <= maxChars) return clean;
  return `${clean.slice(0, Math.max(0, maxChars - 3)).trim()}...`;
}

function structuredResumeText(data: ResumeData, type: GenerationType) {
  const normalized = normalizeResumeData(data);
  const isLong = LONG_DOCUMENT_TYPES.includes(type);
  const experienceCount = Math.max(normalized.experience.filter((item) => item.company || item.role || item.description).length, 1);
  const perExperienceBudget = isLong
    ? Math.max(360, Math.min(900, Math.floor(7_200 / experienceCount)))
    : Math.max(260, Math.min(620, Math.floor(4_200 / experienceCount)));

  const personal = [
    normalized.personal.name,
    normalized.personal.headline,
    normalized.personal.email,
    normalized.personal.phone,
    normalized.personal.location,
    normalized.personal.links
  ].filter(Boolean);

  const experiences = normalized.experience
    .filter((item) => item.company || item.role || item.description)
    .map((item, index) => {
      const dates = [item.start, item.end].filter(Boolean).join(" - ");
      const header = [
        `${index + 1}. ${item.role || "Cargo não informado"}`,
        item.company ? `Empresa: ${item.company}` : "",
        item.location ? `Local: ${item.location}` : "",
        dates ? `Período: ${dates}` : ""
      ].filter(Boolean);
      return [...header, compactDescription(item.description, perExperienceBudget)].filter(Boolean).join("\n");
    });

  const education = normalized.education
    .filter((item) => item.degree || item.school || item.description)
    .map((item) => [item.degree, item.school, item.location, item.start || item.end, compactDescription(item.description, 260)].filter(Boolean).join(" | "));

  const certifications = normalized.certifications
    .filter((item) => item.name || item.issuer)
    .map((item) => [item.name, item.issuer, item.date].filter(Boolean).join(" | "));

  return [
    "BASE FACTUAL ESTRUTURADA DO CURRICULO",
    "Use esta base como fonte de verdade. Preserve todos os cargos/empresas listados em Experiência.",
    section("CONTATO", personal),
    section("RESUMO ORIGINAL", compactDescription(normalized.summary, isLong ? 1_100 : 700)),
    section("EXPERIENCIA", experiences),
    section("FORMACAO", education),
    section("CERTIFICACOES", certifications),
    section("HABILIDADES", normalized.skills.slice(0, 45).join(", ")),
    section("IDIOMAS", normalized.languages.slice(0, 20).join(", "))
  ].filter(Boolean).join("\n\n").trim();
}

function bulletize(value: string) {
  return normalizeText(value)
    .split("\n")
    .map((line) => line.replace(/^[•\-–]\s*/, "").trim())
    .filter(Boolean)
    .map((line) => `• ${line}`)
    .join("\n");
}

export function buildCompleteResumeFallback(resume: string, language: string, type: GenerationType) {
  const rawFallback = normalizeText(resume);
  const data = normalizeResumeData(importResumeText(resume));
  const personal = data.personal;
  const contact = [personal.email, personal.phone, personal.location, personal.links].filter(Boolean).join(" | ");
  const experience = data.experience
    .filter((item) => item.company || item.role || item.description)
    .map((item) => {
      const dates = [item.start, item.current ? "Atual" : item.end].filter(Boolean).join(" - ");
      return [
        [item.role, item.company].filter(Boolean).join(" - ") || "Experiência",
        [item.location, dates].filter(Boolean).join(" | "),
        bulletize(item.description)
      ].filter(Boolean).join("\n");
    })
    .join("\n\n");
  const education = data.education
    .filter((item) => item.degree || item.school || item.description)
    .map((item) => [
      [item.degree, item.school].filter(Boolean).join(" - ") || "Formação",
      [item.location, item.start, item.end].filter(Boolean).join(" | "),
      item.description
    ].filter(Boolean).join("\n"))
    .join("\n\n");
  const certifications = data.certifications
    .filter((item) => item.name || item.issuer || item.description)
    .map((item) => [[item.name, item.issuer].filter(Boolean).join(" - "), item.date, item.description].filter(Boolean).join("\n"))
    .join("\n\n");
  const isEnglish = /english|ingl[eê]s/i.test(language);
  const labels = isEnglish
    ? {
        summary: "Professional Summary",
        skills: "Core Skills",
        experience: "Professional Experience",
        education: "Education",
        certifications: "Certifications",
        languages: "Languages"
      }
    : {
        summary: type === "translate_resume" ? "Resumo profissional" : "Resumo Profissional",
        skills: "Habilidades",
        experience: "Experiência Profissional",
        education: "Formação",
        certifications: "Certificações",
        languages: "Idiomas"
      };

  const structuredFallback = [
    personal.name,
    personal.headline,
    contact,
    section(labels.summary, data.summary),
    section(labels.skills, data.skills.join(", ")),
    section(labels.experience, experience),
    section(labels.education, education),
    section(labels.certifications, certifications),
    section(labels.languages, data.languages.join(", "))
  ].filter(Boolean).join("\n\n").trim();

  if (
    rawFallback.length >= 600 &&
    (structuredFallback.length < 600 || structuredFallback.length < rawFallback.length * 0.35)
  ) {
    return rawFallback;
  }

  return structuredFallback || rawFallback;
}

function normalizeForContainment(value: string) {
  return normalizeText(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function longDocumentLooksIncomplete(type: GenerationType, sourceResume: string, document: string) {
  if (!LONG_DOCUMENT_TYPES.includes(type)) return false;
  const cleanDocument = normalizeText(document);
  if (cleanDocument.length < 600) return true;
  if (cleanDocument.length < normalizeText(sourceResume).length * 0.42) return true;

  const data = normalizeResumeData(importResumeText(sourceResume));
  const normalizedOutput = normalizeForContainment(cleanDocument);
  const anchors = data.experience
    .filter((item) => item.company || item.role)
    .flatMap((item) => [item.company, item.role])
    .filter((item): item is string => Boolean(item && item.length >= 3))
    .slice(0, 30);

  if (!anchors.length) return false;
  const missing = anchors.filter((anchor) => {
    const key = normalizeForContainment(anchor).split(/\s+/).filter((part) => part.length > 2);
    return key.length > 0 && !key.some((part) => normalizedOutput.includes(part));
  });
  return missing.length > Math.max(2, Math.floor(anchors.length * 0.35));
}

function compactResume(resume: string, type: GenerationType) {
  const clean = normalizeText(resume);
  const hardCap = LONG_DOCUMENT_TYPES.includes(type) ? 12_000 : 8_500;
  const notes: string[] = [];

  let structured = "";
  try {
    structured = structuredResumeText(importResumeText(clean), type);
  } catch {
    structured = "";
  }

  const structuredIsUseful = structured.length >= Math.min(clean.length * 0.28, 1_000);
  const candidate = structuredIsUseful ? structured : clean;
  if (!structuredIsUseful && clean.length > hardCap) {
    notes.push("Parser local nao conseguiu estruturar bem o curriculo; usei compactacao conservadora do texto original.");
  }

  const compacted = candidate.length > hardCap || candidate !== clean;
  return {
    value: truncateText(candidate, hardCap),
    compacted,
    notes
  };
}

function compactJobDescription(jobDescription: string, type: GenerationType) {
  if (type === "translate_resume") return "";
  const cap = type === "ats_resume" ? 6_000 : 3_800;
  return truncateText(jobDescription, cap);
}

export function prepareBudgetedGenerationInput(input: BudgetInput): BudgetedGenerationInput {
  const resume = compactResume(input.resume, input.type);
  const jobDescription = compactJobDescription(input.jobDescription || "", input.type);
  const jobWasCompacted = Boolean(input.jobDescription && normalizeText(input.jobDescription).length > jobDescription.length);

  return {
    resume: resume.value,
    jobDescription,
    compacted: resume.compacted || jobWasCompacted,
    estimatedResumeTokens: estimateTokens(resume.value),
    estimatedJobTokens: estimateTokens(jobDescription),
    notes: resume.notes
  };
}

export function desiredCompletionTokens(type: GenerationType, outputLength?: string) {
  if (type === "ats_resume" || type === "translate_resume") return 5_200;
  if (type === "interview_prep") return 4_200;
  if (outputLength === "detailed") return 3_600;
  if (outputLength === "short") return 1_500;
  return 2_600;
}

export function budgetedMaxCompletionTokens(prompt: string, desired: number) {
  const budget = Number(process.env.GROQ_REQUEST_TOKEN_BUDGET || DEFAULT_GROQ_REQUEST_TOKEN_BUDGET);
  const inputTokens = estimateTokens(prompt);
  const headroom = budget - inputTokens - 450;
  const safeDesired = Math.min(desired, Math.max(1_200, headroom));
  return Math.max(1_200, Math.min(desired, safeDesired));
}

export function shouldAutoReviseWithAi(type: GenerationType, prepared: BudgetedGenerationInput) {
  if (LONG_DOCUMENT_TYPES.includes(type)) return false;
  return !prepared.compacted && prepared.estimatedResumeTokens + prepared.estimatedJobTokens < 3_500;
}

export function isGroqRateLimitError(error: unknown) {
  const candidate = error as { status?: number; code?: string; error?: { code?: string; message?: string }; message?: string };
  const status = candidate?.status;
  const code = candidate?.code || candidate?.error?.code;
  const message = `${candidate?.message || ""} ${candidate?.error?.message || ""}`.toLowerCase();
  return status === 413 || status === 429 || code === "rate_limit_exceeded" || message.includes("rate_limit");
}

export function groqRateLimitResponse() {
  return NextResponse.json(
    {
      error:
        "A IA atingiu o limite temporário do provedor. Aguarde alguns minutos e tente novamente. Nenhum documento truncado foi salvo.",
      code: "AI_RATE_LIMIT"
    },
    { status: 429 }
  );
}

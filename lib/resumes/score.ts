import { resumeToPlainText } from "@/lib/resumes/defaults";
import type { ResumeData } from "@/lib/resumes/types";

function words(value: string) {
  return Array.from(new Set(value.toLowerCase().match(/[\p{L}\p{N}+#.-]{3,}/gu) || []));
}

export function calculateResumeScore(data: ResumeData) {
  const text = resumeToPlainText(data);
  if (!text.trim()) {
    return {
      score: 0,
      matched: [],
      missing: [],
      recommendations: ["Comece preenchendo contato, resumo, experiência e habilidades para calcular a prontidão ATS."]
    };
  }
  const jdWords = words(data.targetJobDescription).filter((word) => !["para", "com", "and", "the", "uma", "por", "das", "dos"].includes(word));
  const resumeWords = new Set(words(text));
  const matched = jdWords.filter((word) => resumeWords.has(word));
  const missing = jdWords.filter((word) => !resumeWords.has(word)).slice(0, 18);

  const checks = [
    Boolean(data.personal.name && data.personal.email),
    Boolean(data.personal.phone || data.personal.location),
    data.summary.trim().length >= 180,
    data.experience.some((item) => item.role && item.company && item.description.length >= 120),
    data.education.some((item) => item.degree && item.school),
    data.skills.length >= 6,
    data.certifications.length > 0 || text.length > 2200
  ];
  const completeness = checks.filter(Boolean).length / checks.length;
  const keywordMatch = jdWords.length ? matched.length / Math.min(jdWords.length, 45) : 0.25;
  const score = Math.min(98, Math.round(completeness * 62 + keywordMatch * 28 + Math.min(text.length / 6000, 1) * 10));

  const recommendations = [
    !checks[0] ? "Complete nome e e-mail no cabeçalho." : "",
    !checks[2] ? "Adicione um resumo profissional com 3 a 5 linhas específicas." : "",
    !checks[3] ? "Inclua bullets de experiência com ação, contexto e impacto." : "",
    data.skills.length < 6 ? "Liste pelo menos 6 habilidades relevantes e verdadeiras." : "",
    missing.length ? `Termos da vaga ainda ausentes: ${missing.slice(0, 8).join(", ")}.` : "As principais palavras da vaga já aparecem no currículo."
  ].filter(Boolean);

  return { score, matched: matched.slice(0, 18), missing, recommendations };
}

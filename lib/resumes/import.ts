import { emptyCertification, emptyEducation, emptyExperience, normalizeResumeData } from "@/lib/resumes/defaults";
import type { ResumeData } from "@/lib/resumes/types";

const headingPattern = /^(experience|experiência|experiencia|professional experience|work experience|education|educação|educacion|formation|skills|habilidades|competências|competencias|certifications|certificações|certificacoes|certificados|summary|resumo|profile|perfil)\b/i;

function unique(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function findEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function findPhone(text: string) {
  return text.match(/(?:\+\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}/)?.[0] || "";
}

function splitSections(text: string) {
  const buckets: Record<string, string[]> = { header: [] };
  let current = "header";
  for (const raw of text.split(/\n+/)) {
    const line = raw.trim();
    if (!line) continue;
    if (headingPattern.test(line) && line.length < 60) {
      current = line.toLowerCase();
      buckets[current] = buckets[current] || [];
      continue;
    }
    buckets[current] = buckets[current] || [];
    buckets[current].push(line);
  }
  return buckets;
}

function linesFor(sections: Record<string, string[]>, names: string[]) {
  return Object.entries(sections)
    .filter(([key]) => names.some((name) => key.includes(name)))
    .flatMap(([, value]) => value);
}

function parseSkills(lines: string[]) {
  return unique(lines.flatMap((line) => line.split(/[,;|•]/))).filter((item) => item.length <= 80).slice(0, 30);
}

function parseEntries(lines: string[], kind: "experience" | "education" | "certification") {
  const entries: string[][] = [];
  let current: string[] = [];
  for (const line of lines) {
    const startsEntry = !line.startsWith("-") && !line.startsWith("•") && line.length < 150 && current.length > 1;
    if (startsEntry) {
      entries.push(current);
      current = [];
    }
    current.push(line);
  }
  if (current.length) entries.push(current);

  return entries.slice(0, kind === "certification" ? 30 : 20).map((entry) => {
    const [first = "", second = "", ...rest] = entry;
    if (kind === "education") {
      return { ...emptyEducation(), degree: first, school: second, description: rest.join("\n") };
    }
    if (kind === "certification") {
      return { ...emptyCertification(), name: first, issuer: second, description: rest.join("\n") };
    }
    return { ...emptyExperience(), role: first, company: second, description: rest.join("\n") };
  });
}

export function importResumeText(text: string, current?: ResumeData): ResumeData {
  const base = normalizeResumeData(current || {});
  const clean = text.replace(/\r/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
  const sections = splitSections(clean);
  const header = sections.header || [];
  const firstUsefulLine = header.find((line) => !findEmail(line) && !findPhone(line) && line.length < 120) || "";

  const experienceLines = linesFor(sections, ["experience", "experiência", "experiencia", "work"]);
  const educationLines = linesFor(sections, ["education", "educação", "educacion", "formation"]);
  const certificationLines = linesFor(sections, ["certification", "certific", "certificado"]);
  const skillLines = linesFor(sections, ["skills", "habilidades", "compet"]);
  const summaryLines = linesFor(sections, ["summary", "resumo", "profile", "perfil"]);

  return normalizeResumeData({
    ...base,
    personal: {
      ...base.personal,
      name: base.personal.name || firstUsefulLine,
      email: base.personal.email || findEmail(clean),
      phone: base.personal.phone || findPhone(clean),
      links: base.personal.links || unique(clean.match(/https?:\/\/\S+|linkedin\.com\/\S+/gi) || []).join(" | ")
    },
    summary: base.summary || summaryLines.slice(0, 5).join(" "),
    experience: experienceLines.length ? parseEntries(experienceLines, "experience") : base.experience,
    education: educationLines.length ? parseEntries(educationLines, "education") : base.education,
    certifications: certificationLines.length ? parseEntries(certificationLines, "certification") : base.certifications,
    skills: skillLines.length ? parseSkills(skillLines) : base.skills
  });
}

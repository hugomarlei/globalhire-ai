import { emptyCertification, emptyEducation, emptyExperience, normalizeResumeData } from "@/lib/resumes/defaults";
import type { ResumeData, ResumeExperience } from "@/lib/resumes/types";

type SectionKey = "header" | "contact" | "summary" | "experience" | "education" | "skills" | "certifications" | "languages" | "technical" | "job_description";

const sectionHeadings: Array<{ key: SectionKey; pattern: RegExp }> = [
  { key: "contact", pattern: /^(contact|contato|contacts?|informa[cç][oõ]es pessoais|informations personnelles)$/i },
  { key: "summary", pattern: /^(resumo(?:\s+profissional)?|summary|professional summary|profile|profil|perfil)$/i },
  { key: "experience", pattern: /^(experi[eê]ncia(?:\s+profissional)?|experience|professional experience|work experience|hist[oó]rico profissional|exp[eé]rience professionnelle)$/i },
  { key: "education", pattern: /^(forma[cç][aã]o|education|educa[cç][aã]o|educacion|formation|academic background)$/i },
  { key: "skills", pattern: /^(compet[eê]ncias(?:-chave)?|skills|top skills|habilidades|core skills|core competencies|competencias t[eé]cnicas)$/i },
  { key: "certifications", pattern: /^(certifica[cç][oõ]es|certificacoes|certificados|certifications|certificates)$/i },
  { key: "languages", pattern: /^(idiomas|languages|langues|l[ií]nguas)$/i },
  { key: "technical", pattern: /^(expertise t[eé]cnica|technical expertise|ferramentas|tecnologias|tools|stack)$/i },
  { key: "job_description", pattern: /^(descri[cç][aã]o da vaga|vaga|job description|responsabilidades|principais responsabilidades|requisitos|qualifica[cç][oõ]es|soft skills|compet[eê]ncias comportamentais)$/i }
];

const headingPattern = new RegExp(sectionHeadings.map(({ pattern }) => pattern.source).join("|"), "i");
const bulletPattern = /^[•\-–]\s*/;
const monthPattern =
  "(?:janv?|janeiro|janvier|fev|fev\\.|fevereiro|fevr|févr|février|feb|february|mar|março|mars|march|abr|abril|apr|april|mai|maio|may|jun|junho|juin|june|jul|julho|juil|juillet|july|ago|agosto|aug|august|set|setembro|sep|sept|septembre|september|out|outubro|oct|october|nov|novembro|november|dez|dezembro|dec|december)";
const dateTokenSource = `(?:(?:de\\s+)?${monthPattern}\\.?\\s*(?:de\\s*)?(?:19|20)\\d{2}|(?:19|20)\\d{2}|atual|present|actuel)`;
const dateRangePattern = new RegExp(`${dateTokenSource}(?:\\s*(?:-|–|—|a|to|à)\\s*${dateTokenSource})?`, "i");
const durationPattern = /\s*\((?:\d+\s*(?:months?|mois|meses?|ans?|years?)|current|atual|present)[^)]*\)\s*/gi;
const languageLinePattern = /\b(portugu[eê]s|ingl[eê]s|franc[eê]s|espanhol|alem[aã]o|italiano|english|french|spanish|german|native|nativo|bilingual|avancado|avançado|fluente|intermedi[aá]rio|b[aá]sico|professional working|full professional)\b/i;
const jobDescriptionLinePattern =
  /\b(responsabilidades|requisitos|qualifica[cç][oõ]es|compet[eê]ncias comportamentais|market share|descri[cç][aã]o da vaga|profissional focado|principais responsabilidades)\b/i;
const profileNoisePattern = /^(page \d+ of \d+|p[aá]gina \d+|informations personnelles|nom|adresse e-mail|num[eé]ro de t[eé]l[eé]phone|adresse|date de naissance)$/i;

function unique(items: string[]) {
  return Array.from(new Set(items.map((item) => item.trim()).filter(Boolean)));
}

function cleanLine(line: string) {
  return line
    .replace(/\u00a0/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

function cleanText(text: string) {
  return text
    .replace(/\r/g, "\n")
    .replace(/([A-Za-zÀ-ú])-\n([A-Za-zÀ-ú])/g, "$1-$2")
    .replace(/\u00a0/g, " ")
    .replace(
      /\s+(?=(?:LINKS?|PERFIL|RESUMO(?:\s+PROFISSIONAL)?|EXPERI[EÊ]NCIA(?:\s+PROFISSIONAL)?|FORMA[CÇ][AÃ]O|EDUCA[CÇ][AÃ]O|CERTIFICA[CÇ][OÕ]ES|HABILIDADES|COMPET[EÊ]NCIAS|IDIOMAS|LANGUAGES|SKILLS|PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EDUCATION|CERTIFICATIONS)\b)/gi,
      "\n"
    )
    .replace(/\s+(?=•\s*)/g, "\n")
    .replace(new RegExp(`\\s+(?=${dateTokenSource}\\s+(?:[—–-]|[A-ZÀ-Ú]))`, "gi"), "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function findEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] || "";
}

function findPhone(text: string) {
  return text.match(/(?:\+\s?\d{1,3}[\s.-]?)?(?:\(?\d{2,4}\)?[\s.-]?)?\d{4,5}[\s.-]?\d{4}/)?.[0]?.replace(/\s{2,}/g, " ") || "";
}

function isHeading(line: string) {
  return line.length < 120 && sectionHeadings.some(({ pattern }) => pattern.test(line));
}

function splitSections(text: string) {
  const buckets: Record<SectionKey, string[]> = {
    header: [],
    contact: [],
    summary: [],
    experience: [],
    education: [],
    skills: [],
    certifications: [],
    languages: [],
    technical: [],
    job_description: []
  };
  let current: SectionKey = "header";

  for (const raw of text.split(/\n+/)) {
    const line = cleanLine(raw);
    if (!line || profileNoisePattern.test(line)) continue;
    const heading = sectionHeadings.find(({ pattern }) => pattern.test(line));
    if (heading && line.length < 120) {
      current = heading.key;
      continue;
    }
    if (current === "languages" && !languageLinePattern.test(line) && !isHeading(line)) current = "header";
    buckets[current].push(line);
  }
  return buckets;
}

function parseSkills(lines: string[]) {
  return unique(
    lines.flatMap((line) =>
      line
        .replace(bulletPattern, "")
        .split(/[,;|•]/)
        .map(cleanLine)
    )
    )
    .filter((item) => item.length >= 2 && item.length <= 80 && !jobDescriptionLinePattern.test(item) && !dateRangePattern.test(item))
    .slice(0, 40);
}

function parseLanguages(lines: string[]) {
  return unique(
    lines.flatMap((line) =>
      line
        .replace(bulletPattern, "")
        .split(/[,;|•]/)
        .map(cleanLine)
    )
  )
    .filter((item) => item.length >= 2 && item.length <= 120 && !jobDescriptionLinePattern.test(item) && !dateRangePattern.test(item))
    .slice(0, 20);
}

function looksLikeLocation(line: string) {
  return /(?:\bbrasil\b|\bbrazil\b|\bbr[eé]sil\b|\bfran[cç]a\b|\bfrance\b|\bparis\b|\bcuritiba\b|\bportugal\b|\bremote\b|\bremoto\b|\bsp\b|\bpr\b|\brj\b|\busa\b|\bcanada\b)/i.test(line) && line.length < 140;
}

function looksLikeDescription(line: string) {
  return bulletPattern.test(line) || line.length > 150 || /[.!?]$/.test(line) || /\b(respons[aá]vel|responsable|managed|founded|conducted|atuação|experi[eê]ncia|consultant commercial)\b/i.test(line);
}

function cleanDateValue(value: string) {
  return cleanLine(value.replace(durationPattern, "").replace(/[()]/g, "").replace(/\s*,\s*$/, ""));
}

function compactDescription(lines: string[]) {
  return lines
    .map((line) => cleanLine(line.replace(bulletPattern, "")))
    .filter((line) => line && !headingPattern.test(line) && !jobDescriptionLinePattern.test(line))
    .map((line) => (line.startsWith("- ") ? line : `- ${line}`))
    .join("\n");
}

function splitCompanyLocation(value: string) {
  const clean = cleanLine(value.replace(bulletPattern, ""));
  const dashParts = clean.split(/\s+[–—-]\s+/).map(cleanLine).filter(Boolean);
  if (dashParts.length >= 2 && looksLikeLocation(dashParts[dashParts.length - 1])) {
    return {
      company: dashParts.slice(0, -1).join(" - "),
      location: dashParts[dashParts.length - 1]
    };
  }

  const commaParts = clean.split(/\s*,\s*/).map(cleanLine).filter(Boolean);
  if (commaParts.length >= 2 && looksLikeLocation(commaParts.slice(1).join(", "))) {
    return {
      company: commaParts[0],
      location: commaParts.slice(1).join(", ")
    };
  }
  return { company: clean, location: "" };
}

function splitTitleDate(value: string) {
  const clean = cleanLine(value.replace(bulletPattern, ""));
  const pipeParts = clean.split(/\s+\|\s+/);
  if (pipeParts.length > 1) {
    return {
      title: pipeParts[0].trim(),
      dates: cleanDateValue(pipeParts.slice(1).join(" | "))
    };
  }

  const match = clean.match(dateRangePattern);
  if (!match?.index && match?.index !== 0) return { title: clean, dates: "" };
  const title = clean.slice(0, match.index).replace(/\s+[|–—-]\s*$/, "").trim();
  const dates = cleanDateValue(match[0]);
  return {
    title: title || clean.replace(match[0], "").trim(),
    dates
  };
}

function assignDates<T extends { start: string; end: string; current?: boolean }>(item: T, value: string): T {
  const clean = cleanDateValue(value);
  if (!clean) return item;
  const parts = clean.split(/\s+(?:-|–|—|a|to|à)\s+/i).map(cleanLine).filter(Boolean);
  const start = parts[0] || item.start;
  const end = parts[1] || (/atual|present|actuel/i.test(clean) ? "Atual" : item.end);
  return {
    ...item,
    start,
    end,
    current: item.current || /atual|present|actuel/i.test(clean)
  };
}

function splitEntryBlocks(lines: string[], kind: "experience" | "education" | "certification") {
  const cleanLines = lines
    .map(cleanLine)
    .filter((line) => line && !headingPattern.test(line) && !jobDescriptionLinePattern.test(line) && !profileNoisePattern.test(line));

  const entries: string[][] = [];
  let current: string[] = [];

  cleanLines.forEach((line, index) => {
    const next = cleanLines[index + 1] || "";
    const nextNext = cleanLines[index + 2] || "";
    const isBullet = bulletPattern.test(line);
    const hasDate = dateRangePattern.test(line);
    const nextHasDate = dateRangePattern.test(next);
    const shortHeader = line.length < 170 && !looksLikeDescription(line);
    const currentHasBody = current.some((item) => bulletPattern.test(item) || looksLikeDescription(item)) || current.length >= 4;
    const previous = current[current.length - 1] || "";
    const previousLooksLikeCompany = previous && !bulletPattern.test(previous) && !dateRangePattern.test(previous) && previous.length < 170 && !looksLikeDescription(previous);
    const startsExperience =
      kind === "experience" &&
      currentHasBody &&
      !previousLooksLikeCompany &&
      !isBullet &&
      shortHeader &&
      (hasDate || nextHasDate || (!looksLikeDescription(next) && dateRangePattern.test(nextNext)));
    const startsOtherEntry = kind !== "experience" && current.length > 0 && !isBullet && shortHeader && (hasDate || nextHasDate || index > 0);

    if (current.length > 0 && (startsExperience || startsOtherEntry)) {
      entries.push(current);
      current = [];
    }
    current.push(line);
  });

  if (current.length) entries.push(current);
  return entries;
}

function splitSingleLineExperience(line: string): ResumeExperience | null {
  const match = cleanLine(line).match(/^(.+?)\s+[–—-]\s+(.+?)\s*\((.+?)\)\s*$/);
  if (!match) return null;
  const [, companyRaw, roleRaw, metaRaw] = match;
  const metaParts = metaRaw.split(/\s*,\s*/).map(cleanLine).filter(Boolean);
  const datePart = metaParts.find((part) => dateRangePattern.test(part)) || "";
  const location = metaParts.filter((part) => part !== datePart).join(", ");
  return assignDates(
    {
      ...emptyExperience(),
      company: cleanLine(companyRaw),
      role: cleanLine(roleRaw),
      location,
      description: ""
    },
    datePart
  );
}

function parseExperienceEntry(entry: string[]) {
  const bulletIndex = entry.findIndex((line) => bulletPattern.test(line));
  const beforeBullets = bulletIndex >= 0 ? entry.slice(0, bulletIndex) : entry;
  const header: string[] = [];
  const descriptionSeed: string[] = [];

  beforeBullets.forEach((line, index) => {
    const structuralLine = dateRangePattern.test(line) || looksLikeLocation(line) || Boolean(splitSingleLineExperience(line));
    if (index < 4 && !looksLikeDescription(line) && (header.length < 2 || structuralLine)) header.push(line);
    else descriptionSeed.push(line);
  });
  const descriptionLines = [...descriptionSeed, ...(bulletIndex >= 0 ? entry.slice(bulletIndex) : [])];

  const singleLine = header.length === 1 ? splitSingleLineExperience(header[0]) : null;
  if (singleLine) {
    return {
      ...singleLine,
      description: compactDescription(descriptionLines)
    };
  }

  const [first = "", second = "", third = "", fourth = ""] = header;
  const firstDate = splitTitleDate(first);
  const secondDate = splitTitleDate(second);
  const thirdDate = splitTitleDate(third);
  const firstHasDate = Boolean(firstDate.dates);
  const secondHasDate = Boolean(secondDate.dates);
  const thirdHasDate = Boolean(thirdDate.dates);

  let companyLine = first;
  let roleLine = second;
  let dateLine = "";
  let locationLine = "";

  if (firstHasDate && second && !secondHasDate) {
    roleLine = firstDate.title;
    companyLine = second;
    dateLine = firstDate.dates;
    locationLine = looksLikeLocation(third) ? third : "";
  } else {
    dateLine = secondDate.dates || (thirdHasDate ? thirdDate.dates : "");
    roleLine = secondDate.title || second || firstDate.title;
    if (!second && firstHasDate) roleLine = firstDate.title;
    if (third && !thirdHasDate && looksLikeLocation(third)) locationLine = third;
    if (fourth && looksLikeLocation(fourth)) locationLine = fourth;
  }

  const companyParsed = splitCompanyLocation(companyLine);
  const item = {
    ...emptyExperience(),
    company: companyParsed.company,
    role: cleanLine(roleLine.replace(dateRangePattern, "")),
    location: locationLine || companyParsed.location,
    description: compactDescription(descriptionLines)
  };
  return assignDates(item, dateLine || second || third);
}

function parseEducationLine(line: string) {
  const clean = cleanLine(line.replace(bulletPattern, ""));
  const date = clean.match(dateRangePattern)?.[0] || "";
  const withoutDate = date ? clean.replace(date, "").replace(/\s+[–—-]\s*$/, "").trim() : clean;
  const [degree = withoutDate, school = ""] = withoutDate.split(/\s+-\s+|\s+[–—]\s+|\s+,\s+(?=[A-ZÀ-Ú])/);
  return { degree: cleanLine(degree), school: cleanLine(school), date: cleanDateValue(date) };
}

function parseEntries(lines: string[], kind: "experience" | "education" | "certification") {
  const entries = splitEntryBlocks(lines, kind);

  return entries.slice(0, kind === "certification" ? 30 : 20).map((entry) => {
    const [first = "", second = "", ...rest] = entry;
    if (kind === "experience") return parseExperienceEntry(entry);
    if (kind === "education") {
      const parsed = parseEducationLine(first);
      const secondParsed = second && !looksLikeDescription(second) ? parseEducationLine(second) : null;
      return assignDates(
        {
          ...emptyEducation(),
          degree: parsed.degree,
          school: parsed.school || secondParsed?.degree || "",
          description: compactDescription(secondParsed ? rest : [second, ...rest].filter(Boolean))
        },
        parsed.date || secondParsed?.date || ""
      );
    }
    return { ...emptyCertification(), name: first.replace(bulletPattern, ""), issuer: second.replace(bulletPattern, ""), description: compactDescription(rest) };
  });
}

function headerLinesForIdentity(sections: Record<SectionKey, string[]>, clean: string) {
  const usableLine = (line: string) =>
    cleanLine(line)
      .split(/\s+\|\s+/)
      .map(cleanLine)
      .find((part) => part && !findEmail(part) && !findPhone(part) && !/https?:\/\/|linkedin\.com/i.test(part) && !languageLinePattern.test(part) && !profileNoisePattern.test(part)) || "";

  const combined = unique([...sections.header, ...sections.contact])
    .map(cleanLine)
    .map(usableLine)
    .filter(Boolean);

  const allLines = clean.split(/\n+/).map(cleanLine).filter(Boolean);
  const fallbackNameIndex = allLines.findIndex((line) => /^[A-ZÀ-Ú][A-Za-zÀ-ú]+(?:\s+[A-ZÀ-Ú][A-Za-zÀ-ú]+){1,4}$/.test(line) && !profileNoisePattern.test(line));
  if (fallbackNameIndex >= 0) {
    return unique([...allLines.slice(fallbackNameIndex, fallbackNameIndex + 3).map(usableLine), ...combined].filter(Boolean));
  }
  return combined;
}

export function importResumeText(text: string, current?: ResumeData): ResumeData {
  const base = normalizeResumeData(current || {});
  const clean = cleanText(text);
  const sections = splitSections(clean);
  const headerUseful = headerLinesForIdentity(sections, clean);
  const firstUsefulLine = headerUseful.find((line) => line.length < 120 && !looksLikeLocation(line)) || "";
  const headlineLine = headerUseful.find((line) => line !== firstUsefulLine && line.length < 180 && !looksLikeLocation(line)) || "";
  const locationLine = headerUseful.find(looksLikeLocation) || "";

  const experienceLines = sections.experience || [];
  const educationLines = (sections.education || []).filter((line) => !languageLinePattern.test(line));
  const certificationLines = sections.certifications || [];
  const skillLines = [...(sections.skills || []), ...(sections.technical || [])].filter((line) => !languageLinePattern.test(line));
  const languageLines = sections.languages || [];
  const summaryLines = sections.summary || [];

  return normalizeResumeData({
    ...base,
    personal: {
      ...base.personal,
      name: firstUsefulLine || base.personal.name,
      headline: headlineLine || base.personal.headline,
      email: findEmail(clean) || base.personal.email,
      phone: findPhone(clean) || base.personal.phone,
      location: locationLine || base.personal.location,
      links: unique(clean.match(/https?:\/\/\S+|(?:www\.)?linkedin\.com\/\S+/gi) || []).join(" | ") || base.personal.links
    },
    summary: summaryLines.filter((line) => !jobDescriptionLinePattern.test(line)).slice(0, 8).join(" ") || base.summary,
    experience: experienceLines.length ? parseEntries(experienceLines, "experience") : base.experience,
    education: educationLines.length ? parseEntries(educationLines, "education") : base.education,
    certifications: certificationLines.length ? parseEntries(certificationLines, "certification") : base.certifications,
    skills: skillLines.length ? parseSkills(skillLines) : base.skills,
    languages: languageLines.length ? parseLanguages(languageLines) : base.languages
  });
}

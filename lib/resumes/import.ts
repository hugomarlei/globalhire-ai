import { emptyCertification, emptyEducation, emptyExperience, normalizeResumeData } from "@/lib/resumes/defaults";
import type { ResumeData, ResumeExperience } from "@/lib/resumes/types";

type SectionKey = "header" | "contact" | "summary" | "experience" | "education" | "skills" | "certifications" | "languages" | "technical" | "job_description";

const sectionHeadings: Array<{ key: SectionKey; pattern: RegExp }> = [
  { key: "contact", pattern: /^(contact|contato|contacts?|informa[cç][oõ]es pessoais|informations?|personnelles|informations personnelles|dados pessoais)$/i },
  { key: "summary", pattern: /^(resumo(?:\s+profissional)?|summary|professional summary|profile|profil|perfil)$/i },
  { key: "experience", pattern: /^(experi[eê]ncia(?:\s+profissional)?|experience|professional experience|work experience|hist[oó]rico profissional|exp[eé]rience professionnelle)$/i },
  { key: "education", pattern: /^(forma[cç][aã]o(?:\s+acad[eê]mica)?|education|educa[cç][aã]o|educacion|formation(?:\s+acad[eé]mique)?|academic background)$/i },
  { key: "skills", pattern: /^(compet[eê]ncias(?:-chave)?|principais compet[eê]ncias|skills|top skills|habilidades|core skills|core competencies|competencias t[eé]cnicas)$/i },
  { key: "certifications", pattern: /^(certifica[cç][oõ]es|certificacoes|certificados|certifications|certificates)$/i },
  { key: "languages", pattern: /^(idiomas|languages|langues|l[ií]nguas)$/i },
  { key: "technical", pattern: /^(expertise t[eé]cnica|technical expertise|ferramentas(?:\s+e\s+tecnologias)?|tecnologias|tools|stack)$/i },
  { key: "job_description", pattern: /^(descri[cç][aã]o da vaga|vaga|job description|responsabilidades|principais responsabilidades|requisitos|qualifica[cç][oõ]es|soft skills|compet[eê]ncias comportamentais)$/i }
];

const headingPattern = new RegExp(sectionHeadings.map(({ pattern }) => pattern.source).join("|"), "i");
const bulletPattern = /^[•\-–]\s*/;
const monthPattern =
  "(?:janv?|janeiro|janvier|fev|fev\\.|fevereiro|fevr|févr|février|feb|february|mar|março|mars|march|abr|abril|apr|april|mai|maio|may|jun|junho|juin|june|jul|julho|juil|juillet|july|ago|agosto|ao[uû]t|aug|august|set|set\\.|setembro|sep|sept|septembre|september|out|out\\.|outubro|oct|oct\\.|october|nov|nov\\.|novembro|november|dez|dez\\.|dezembro|d[eé]c|d[eé]c\\.|dec|dec\\.|december)";
const dateTokenSource = `(?:(?:de\\s+)?${monthPattern}\\.?\\s*(?:de\\s*)?(?:19|20)\\d{2}|${monthPattern}\\.?\\s*[/.-]\\s*(?:19|20)\\d{2}|(?:19|20)\\d{2}|atual|present|actuel)`;
const dateRangePattern = new RegExp(`${dateTokenSource}(?:\\s*(?:-|–|—|a|to|à)\\s*${dateTokenSource})?`, "i");
const strictDateTokenSource = `(?:(?:de\\s+)?${monthPattern}\\.?\\s*(?:de\\s*)?(?:19|20)\\d{2}|${monthPattern}\\.?\\s*[/.-]\\s*(?:19|20)\\d{2}|atual|present|actuel)`;
const strictDateRangePattern = new RegExp(`${strictDateTokenSource}(?:\\s*(?:-|–|—|a|to|à)\\s*${dateTokenSource})?`, "i");
const durationPattern = /\s*\((?:\d+\s*(?:months?|mois|meses?|ans?|years?)|current|atual|present)[^)]*\)\s*/gi;
const languageLinePattern = /\b(portugu[eê]s|ingl[eê]s|franc[eê]s|espanhol|alem[aã]o|italiano|english|french|spanish|german|native|nativo|bilingual|avancado|avançado|fluente|intermedi[aá]rio|b[aá]sico|professional working|full professional)\b/i;
const jobDescriptionLinePattern =
  /\b(responsabilidades|requisitos|qualifica[cç][oõ]es|compet[eê]ncias comportamentais|market share|descri[cç][aã]o da vaga|profissional focado|principais responsabilidades)\b/i;
const profileNoisePattern = /^(page \d+ of \d+|p[aá]gina \d+|informations personnelles|nom|adresse e-mail|num[eé]ro de t[eé]l[eé]phone|adresse|date de naissance|\d{5},?\s+[A-Za-zÀ-ú\s-]+|\d+\s+(?:passage|rue|avenue|street|road|boulevard)\b.*)$/i;

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
    .replace(new RegExp(`([A-Za-zÀ-ú])de\\s+(${monthPattern}\\.?\\s*(?:19|20)\\d{2})`, "gi"), "$1\nde $2")
    .replace(new RegExp(`([A-Za-zÀ-ú])(${monthPattern}\\.?\\s*(?:de\\s*)?(?:19|20)\\d{2})`, "gi"), "$1\n$2")
    .replace(new RegExp(`([A-Za-zÀ-ú])(${monthPattern}\\.?\\s*[/.-]\\s*(?:19|20)\\d{2})`, "gi"), "$1\n$2")
    .replace(
      /[ \t]{2,}(?=(?:LINKS?|PERFIL|RESUMO(?:\s+PROFISSIONAL)?|EXPERI[EÊ]NCIA(?:\s+PROFISSIONAL)?|FORMA[CÇ][AÃ]O(?:\s+ACAD[EÊ]MICA)?|EDUCA[CÇ][AÃ]O|CERTIFICA[CÇ][OÕ]ES|HABILIDADES|COMPET[EÊ]NCIAS|PRINCIPAIS COMPET[EÊ]NCIAS|IDIOMAS|LANGUAGES|LANGUES|SKILLS|PROFESSIONAL EXPERIENCE|WORK EXPERIENCE|EDUCATION|CERTIFICATIONS|FERRAMENTAS E TECNOLOGIAS)\b)/gi,
      "\n"
    )
    .replace(/\s+(?=•\s*)/g, "\n")
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
    const looksLikeWrappedProfileWord = current === "experience" && heading?.key === "summary" && /^(perfil|profile|profil)$/i.test(line);
    if (heading && line.length < 120) {
      if (looksLikeWrappedProfileWord) {
        buckets[current].push(line);
        continue;
      }
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
    lines.flatMap((line) => splitListLine(line.replace(bulletPattern, "")))
    )
    .filter((item) => item.length >= 2 && item.length <= 80 && !jobDescriptionLinePattern.test(item) && !dateRangePattern.test(item))
    .slice(0, 40);
}

function parseLanguages(lines: string[]) {
  return unique(
    lines.flatMap((line) => splitListLine(line.replace(bulletPattern, "")))
  )
    .filter((item) => item.length >= 2 && item.length <= 120 && !jobDescriptionLinePattern.test(item) && !dateRangePattern.test(item))
    .slice(0, 20);
}

function splitListLine(line: string) {
  const items: string[] = [];
  let current = "";
  let depth = 0;
  for (const char of line) {
    if (char === "(") depth += 1;
    if (char === ")") depth = Math.max(0, depth - 1);
    if ((char === "," || char === ";" || char === "|" || char === "•") && depth === 0) {
      const value = cleanLine(current);
      if (value) items.push(value);
      current = "";
    } else {
      current += char;
    }
  }
  const value = cleanLine(current);
  if (value) items.push(value);
  return items;
}

function looksLikeLocation(line: string) {
  const knownPlace = /(?:\bbrasil\b|\bbrazil\b|\bbr[eé]sil\b|\bfran[cç]a\b|\bfrance\b|\bparis\b|\bcuritiba\b|\bs[aã]o paulo\b|\bs[aã]o jos[eé]\b|\bportugal\b|\bremote\b|\bremoto\b|\busa\b|\bcanada\b)/i.test(line);
  const stateCode = /(?:^|[\s,])(?:SP|PR|RJ|MG|RS|SC|BA|PE|CE|DF)(?:$|[\s,])/u.test(line);
  return (knownPlace || stateCode) && line.length < 140;
}

function looksLikeStandaloneLocation(line: string) {
  const prose = /\b(sur|pour|avec|dans|via|des|du|de la|industries?|fabricants?|clientes?|clients?|sistemas?|solutions?)\b/i.test(line);
  const compactPlace = line.length <= 80 || line.includes(",");
  return looksLikeLocation(line) && compactPlace && !prose && !/(ltda|inc\.?|corp\.?|solutions|hospital|medical|automação|equipamentos|electronics|eletronics|universit|col[eé]gio|school)/i.test(line);
}

function looksLikeDescription(line: string) {
  const corporateSuffix = /\b(ltda|ltda\.|inc\.?|corp\.?|s\.?a\.?|llc|gmbh|sas|solutions|medical|hospital)\b/i.test(line);
  return bulletPattern.test(line) || line.length > 150 || (!corporateSuffix && /[.!?]$/.test(line)) || /\b(respons[aá]vel|responsable|managed|founded|conducted|atuação|experi[eê]ncia|consultant commercial)\b/i.test(line);
}

function looksLikeContactLine(line: string) {
  return Boolean(findEmail(line) || findPhone(line) || /https?:\/\/|linkedin\.com|date de naissance|adresse e-mail|num[eé]ro de t[eé]l[eé]phone|^adresse$/i.test(line));
}

function looksLikeSchool(line: string) {
  return /universit|unibrasil|college|col[eé]gio|school|institut|centro universit|faculdade|formation|technical college/i.test(line);
}

function looksLikeCandidateName(line: string) {
  const clean = cleanLine(line);
  const words = clean.split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 5 || clean.length > 80) return false;
  if (words.every((word) => /^[A-Z0-9]{2,}$/.test(word))) return false;
  if (words.some((word) => word.length <= 2 && !/^(de|da|do|dos|das)$/i.test(word))) return false;
  if (isHeading(clean) || looksLikeContactLine(clean) || looksLikeLocation(clean) || dateRangePattern.test(clean) || languageLinePattern.test(clean)) return false;
  if (/\b(industrial|automation|automa[cç][aã]o|engenharia|engineer|engineering|manuten[cç][aã]o|maintenance|preditiva|predictive|biom[eé]dicos?|equipamentos?|equipment|vendas?|sales|consultiv[ao]s?|gest[aã]o|contas?|accounts?|t[eé]cnico|profissional|professional|experi[eê]ncia|forma[cç][aã]o|compet[eê]ncias|skills|linkedin|github)\b/i.test(clean)) return false;
  return words.every((word) => /^[A-ZÀ-Ú][A-Za-zÀ-ú.'-]+$/.test(word) || /^[A-ZÀ-Ú]{2,}$/.test(word));
}

function isDateOnlyLine(line: string) {
  const withoutDuration = cleanDateValue(line);
  if (!withoutDuration || withoutDuration.length > 95) return false;
  const match = withoutDuration.match(strictDateRangePattern) || withoutDuration.match(dateRangePattern);
  if (!match) return false;
  return cleanLine(withoutDuration.replace(match[0], "")).length <= 4;
}

function cleanDateValue(value: string) {
  return cleanLine(value.replace(durationPattern, "").replace(/[()]/g, "").replace(/\s*,\s*$/, ""));
}

function compactDescription(lines: string[]) {
  const bullets: string[] = [];
  let current = "";

  const flush = () => {
    const value = cleanLine(current);
    if (value) bullets.push(value);
    current = "";
  };

  const append = (value: string) => {
    current = cleanLine(current ? `${current} ${value}` : value);
  };

  lines.forEach((rawLine) => {
    const hadBullet = bulletPattern.test(rawLine);
    const line = cleanLine(rawLine.replace(bulletPattern, ""));
    if (!line || jobDescriptionLinePattern.test(line)) return;

    const headingLike = headingPattern.test(line);
    const wrappedHeadingWord = /^(perfil|profile|profil)$/i.test(line) && current && !/[.!?;:]$/.test(current);
    if (headingLike && !wrappedHeadingWord) return;

    if (hadBullet) {
      flush();
      append(line);
      return;
    }

    if (!current) {
      append(line);
      return;
    }

    const previousLooksComplete = /[.!?;:]$/.test(current);
    const startsLikeSentence = /^[A-ZÀ-Ú0-9]/.test(line);
    if (previousLooksComplete && startsLikeSentence) {
      flush();
      append(line);
      return;
    }

    append(line);
  });

  flush();

  return bullets.map((line) => `- ${line}`).join("\n");
}

function splitCompanyLocation(value: string) {
  const clean = cleanLine(value.replace(bulletPattern, ""));
  if (!clean || looksLikeContactLine(clean) || isDateOnlyLine(clean)) return { company: "", location: "" };
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

  const match = clean.match(strictDateRangePattern) || clean.match(dateRangePattern);
  if (!match?.index && match?.index !== 0) return { title: clean, dates: "" };
  const title = clean.slice(0, match.index).replace(/\s+[|–—-]\s*$/, "").trim();
  const dates = cleanDateValue(match[0]);
  return {
    title: title || clean.replace(match[0], "").trim(),
    dates
  };
}

function splitRoleCompany(value: string) {
  const clean = cleanLine(value.replace(bulletPattern, ""));
  const commaParts = clean.split(/\s*,\s*/).map(cleanLine).filter(Boolean);
  if (commaParts.length >= 2 && !looksLikeStandaloneLocation(commaParts[commaParts.length - 1])) {
    return {
      role: commaParts[0],
      company: commaParts.slice(1).join(", ")
    };
  }

  const atMatch = clean.match(/^(.+?)\s+(?:at|chez|na|no|em)\s+(.+)$/i);
  if (atMatch) {
    return {
      role: cleanLine(atMatch[1]),
      company: cleanLine(atMatch[2])
    };
  }

  return { role: clean, company: "" };
}

function splitLocationRoleCompany(value: string) {
  const clean = cleanLine(value.replace(bulletPattern, ""));
  const dashParts = clean.split(/\s+[–—-]\s+/).map(cleanLine).filter(Boolean);
  if (dashParts.length >= 2 && looksLikeStandaloneLocation(dashParts[0])) {
    const parsed = splitRoleCompany(dashParts.slice(1).join(" - "));
    return {
      location: dashParts[0],
      role: parsed.role,
      company: parsed.company
    };
  }
  return { location: "", role: "", company: "" };
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

  if (kind === "experience") return splitExperienceBlocks(cleanLines);
  if (kind === "education") return splitEducationBlocks(cleanLines);

  const entries: string[][] = [];
  let current: string[] = [];

  cleanLines.forEach((line, index) => {
    const next = cleanLines[index + 1] || "";
    const isBullet = bulletPattern.test(line);
    const hasDate = dateRangePattern.test(line);
    const nextHasDate = dateRangePattern.test(next);
    const shortHeader = line.length < 170 && !looksLikeDescription(line);
    const startsEntry = current.length > 0 && !isBullet && shortHeader && (hasDate || nextHasDate || index > 0);

    if (startsEntry) {
      entries.push(current);
      current = [];
    }
    current.push(line);
  });

  if (current.length) entries.push(current);
  return entries;
}

function looksLikeExperienceHeader(line: string) {
  return line.length < 180 && !bulletPattern.test(line) && !looksLikeDescription(line) && !looksLikeContactLine(line) && !isDateOnlyLine(line);
}

function startsExperienceEntry(line: string, next = "", nextNext = "") {
  if (isDateOnlyLine(line) && next && looksLikeExperienceHeader(next)) return true;
  if (!looksLikeExperienceHeader(line)) return false;
  if (splitSingleLineExperience(line)) return true;
  const currentHasDate = strictDateRangePattern.test(line) || dateRangePattern.test(line);
  const nextHasDate = strictDateRangePattern.test(next) || dateRangePattern.test(next);
  const nextNextHasDate = strictDateRangePattern.test(nextNext) || dateRangePattern.test(nextNext);
  if (currentHasDate && next && !bulletPattern.test(next) && !looksLikeDescription(next)) return true;
  if (!currentHasDate && next && nextNext && looksLikeExperienceHeader(next) && nextNextHasDate) return true;
  if (!currentHasDate && nextHasDate) return true;
  return false;
}

function splitExperienceBlocks(lines: string[]) {
  const entries: string[][] = [];
  let current: string[] = [];

  lines.forEach((line, index) => {
    const starts = startsExperienceEntry(line, lines[index + 1], lines[index + 2]);
    const currentLooksComplete = current.some((item) => dateRangePattern.test(item) || bulletPattern.test(item) || looksLikeDescription(item));
    if (starts && current.length && currentLooksComplete) {
      entries.push(current);
      current = [];
    }
    current.push(line);
  });

  if (current.length) entries.push(current);
  return entries.filter((entry) => entry.some((line) => dateRangePattern.test(line) || bulletPattern.test(line) || looksLikeDescription(line)));
}

function splitEducationBlocks(lines: string[]) {
  const entries: string[][] = [];
  let current: string[] = [];

  lines.forEach((line) => {
    const previous = current[current.length - 1] || "";
    const currentLooksComplete = current.some((item) => dateRangePattern.test(item)) || current.length >= 3;
    const startsAtSchool = looksLikeSchool(line) && currentLooksComplete;
    const startsAfterSchool = currentLooksComplete && looksLikeSchool(previous) && !isDateOnlyLine(line) && !bulletPattern.test(line) && !looksLikeDescription(line);
    const starts =
      current.length > 0 &&
      !looksLikeContactLine(line) &&
      (startsAtSchool || startsAfterSchool);

    if (starts) {
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
  const lines = entry.map(cleanLine).filter(Boolean);
  const singleLine = lines.length ? splitSingleLineExperience(lines[0]) : null;
  const bulletIndex = lines.findIndex((line) => bulletPattern.test(line));
  const searchWindow = lines.slice(0, Math.min(lines.length, bulletIndex >= 0 ? Math.max(5, bulletIndex) : 7));
  const dateIndex = searchWindow.findIndex((line) => strictDateRangePattern.test(line) || dateRangePattern.test(line));
  const locationIndex = searchWindow.findIndex((line, index) =>
    index !== dateIndex &&
    (dateIndex < 0 || index > dateIndex) &&
    !bulletPattern.test(line) &&
    !looksLikeDescription(line) &&
    looksLikeStandaloneLocation(line) &&
    !dateRangePattern.test(line)
  );

  if (singleLine) {
    return {
      ...singleLine,
      description: compactDescription(lines.slice(1))
    };
  }

  let companyLine = "";
  let roleLine = "";
  let dateLine = "";
  let locationLine = "";
  let headerEnd = 0;
  let companyIndex = 0;

  if (dateIndex === 0) {
    const parsed = splitTitleDate(lines[0]);
    const roleCompany = splitRoleCompany(lines[1] || "");
    roleLine = parsed.title || roleCompany.role;
    dateLine = parsed.dates || lines[0];
    companyLine = roleCompany.company || lines[2] || "";
    companyIndex = roleCompany.company ? 1 : 2;
    headerEnd = 2;
  } else if (dateIndex === 1) {
    const parsed = splitTitleDate(lines[1]);
    if (isDateOnlyLine(lines[1])) {
      const locationRoleCompany = splitLocationRoleCompany(lines[0] || "");
      const roleCompany = splitRoleCompany(lines[0] || "");
      roleLine = locationRoleCompany.role || roleCompany.role;
      companyLine = locationRoleCompany.company || roleCompany.company || lines[2] || "";
      locationLine = locationRoleCompany.location;
      companyIndex = locationRoleCompany.company || roleCompany.company ? 0 : 2;
      headerEnd = locationRoleCompany.location || roleCompany.company ? 2 : 3;
    } else {
      companyLine = lines[0] || "";
      roleLine = parsed.title || lines[1];
      companyIndex = 0;
      headerEnd = 2;
    }
    dateLine = parsed.dates;
  } else if (dateIndex >= 2) {
    const parsed = splitTitleDate(lines[dateIndex]);
    companyLine = lines[0] || "";
    roleLine = lines[1] || parsed.title;
    dateLine = parsed.dates || lines[dateIndex];
    companyIndex = 0;
    headerEnd = dateIndex + 1;
  } else if (lines[0] && dateRangePattern.test(lines[0])) {
    const parsed = splitTitleDate(lines[0]);
    roleLine = parsed.title;
    dateLine = parsed.dates;
    companyLine = lines[1] || "";
    companyIndex = 1;
    headerEnd = 2;
  } else {
    companyLine = lines[0] || "";
    roleLine = lines[1] || "";
    companyIndex = 0;
    headerEnd = Math.min(lines.length, 2);
  }

  if (locationIndex >= 0 && locationIndex !== companyIndex) {
    locationLine = lines[locationIndex];
    headerEnd = Math.max(headerEnd, locationIndex + 1);
  }
  const descriptionLines = lines.filter((_, index) => index >= headerEnd && index !== locationIndex);
  const companyParsed = splitCompanyLocation(companyLine);
  const item = {
    ...emptyExperience(),
    company: companyParsed.company,
    role: cleanLine(roleLine.replace(dateRangePattern, "")),
    location: locationLine || companyParsed.location,
    description: compactDescription(descriptionLines)
  };
  return assignDates(item, dateLine);
}

function parseEducationLine(line: string) {
  const clean = cleanLine(line.replace(bulletPattern, ""));
  const date = clean.match(dateRangePattern)?.[0] || "";
  const withoutDate = date ? clean.replace(date, "").replace(/\s+[–—-]\s*$/, "").trim() : clean;
  const [degree = withoutDate, school = ""] = withoutDate.split(/\s+-\s+|\s+[–—]\s+|\s+,\s+(?=[A-ZÀ-Ú])/);
  return { degree: cleanLine(degree), school: cleanLine(school), date: cleanDateValue(date) };
}

function cleanEducationText(value: string) {
  return cleanLine(
    value
      .replace(bulletPattern, "")
      .replace(/[()·]/g, " ")
      .replace(new RegExp(`(?:de\\s+)?${monthPattern}\\.?\\s*$`, "i"), "")
      .replace(/\s+[–—-]\s*$/, "")
  );
}

function parseEducationEntry(entry: string[]) {
  const lines = entry.map(cleanLine).filter((line) => line && !looksLikeContactLine(line) && !profileNoisePattern.test(line));
  const combined = lines.join(" ");
  const date = combined.match(dateRangePattern)?.[0] || "";
  const useful = lines
    .filter((line) => !isDateOnlyLine(line) && !profileNoisePattern.test(line))
    .map((line) => cleanEducationText(line.replace(dateRangePattern, "")))
    .filter(Boolean);
  if (useful.length === 1) {
    const parsed = parseEducationLine(useful[0]);
    return assignDates({ ...emptyEducation(), degree: cleanEducationText(parsed.degree), school: cleanEducationText(parsed.school), description: "" }, parsed.date || date);
  }
  const schoolIndex = useful.findIndex(looksLikeSchool);
  if (schoolIndex >= 0) {
    const school = useful[schoolIndex];
    const degree = useful.find((line, index) => index !== schoolIndex && !looksLikeSchool(line)) || "";
    const description = useful.filter((_, index) => index !== schoolIndex && useful[index] !== degree);
    return assignDates({ ...emptyEducation(), school, degree, description: compactDescription(description) }, date);
  }

  const [first = "", second = "", ...rest] = useful;
  const parsed = parseEducationLine(first);
  const secondParsed = second && !looksLikeDescription(second) ? parseEducationLine(second) : null;
  return assignDates(
    {
      ...emptyEducation(),
      degree: parsed.degree,
      school: parsed.school || secondParsed?.degree || "",
      description: compactDescription(secondParsed ? rest : [second, ...rest].filter(Boolean))
    },
    parsed.date || secondParsed?.date || date
  );
}

function parseEntries(lines: string[], kind: "experience" | "education" | "certification") {
  const entries = splitEntryBlocks(lines, kind);

  const parsed = entries.slice(0, kind === "certification" ? 30 : 20).map((entry) => {
    const [first = "", second = "", ...rest] = entry;
    if (kind === "experience") return parseExperienceEntry(entry);
    if (kind === "education") {
      return parseEducationEntry(entry);
    }
    return { ...emptyCertification(), name: first.replace(bulletPattern, ""), issuer: second.replace(bulletPattern, ""), description: compactDescription(rest) };
  });

  if (kind !== "experience") return parsed;
  return parsed.filter((item) => {
    if (!("role" in item)) return true;
    const identity = [item.role, item.company, item.location].filter(Boolean).join(" ");
    const hasWorkContent = Boolean(item.description || item.role || item.company);
    return hasWorkContent && !(looksLikeContactLine(identity) && !item.description);
  });
}

function headerLinesForIdentity(sections: Record<SectionKey, string[]>, clean: string) {
  const usableLine = (line: string) =>
    cleanLine(line)
      .split(/\s+\|\s+/)
      .map(cleanLine)
      .find((part) => part && !findEmail(part) && !findPhone(part) && !/https?:\/\/|linkedin\.com/i.test(part) && !languageLinePattern.test(part) && !profileNoisePattern.test(part)) || "";

  const combined = unique([...sections.header.slice(0, 12), ...sections.contact.slice(0, 8)])
    .map(cleanLine)
    .map(usableLine)
    .filter(Boolean);

  const allLines = clean.split(/\n+/).map(cleanLine).filter(Boolean);
  const fallbackNameIndex = allLines.slice(0, 16).findIndex((line) => looksLikeCandidateName(line) && !profileNoisePattern.test(line));
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
  const firstUsefulLine = headerUseful.find(looksLikeCandidateName) || "";
  const headlineLine = firstUsefulLine ? headerUseful.find((line) => line !== firstUsefulLine && line.length < 180 && !looksLikeLocation(line)) || "" : "";
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

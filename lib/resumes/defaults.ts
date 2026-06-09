import type { ResumeCertification, ResumeData, ResumeEducation, ResumeExperience, ResumeTemplateKey } from "@/lib/resumes/types";

export const resumeTemplates: Array<{ key: ResumeTemplateKey; label: string }> = [
  { key: "classic", label: "Classic" },
  { key: "professional", label: "Professional" },
  { key: "modern", label: "Modern" }
];

export const resumeColors = ["#0f766e", "#2563eb", "#7c3aed", "#be123c", "#334155", "#ca8a04"];

export function makeId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return Math.random().toString(36).slice(2);
}

export function emptyExperience(): ResumeExperience {
  return {
    id: makeId(),
    role: "",
    company: "",
    location: "",
    start: "",
    end: "",
    current: false,
    description: ""
  };
}

export function emptyEducation(): ResumeEducation {
  return {
    id: makeId(),
    degree: "",
    school: "",
    location: "",
    start: "",
    end: "",
    description: ""
  };
}

export function emptyCertification(): ResumeCertification {
  return {
    id: makeId(),
    name: "",
    issuer: "",
    date: "",
    credentialUrl: "",
    description: ""
  };
}

export function defaultResumeData(): ResumeData {
  return {
    language: "pt-BR",
    targetRole: "",
    targetJobDescription: "",
    template: "professional",
    primaryColor: resumeColors[0],
    personal: {
      name: "",
      headline: "",
      email: "",
      phone: "",
      location: "",
      links: ""
    },
    summary: "",
    experience: [emptyExperience()],
    education: [emptyEducation()],
    certifications: [],
    skills: [],
    languages: []
  };
}

export function normalizeResumeData(input: unknown): ResumeData {
  const base = defaultResumeData();
  if (!input || typeof input !== "object") return base;

  const data = input as Partial<ResumeData>;
  const template = resumeTemplates.some((item) => item.key === data.template) ? data.template! : base.template;
  const toList = (value: unknown, limit: number) => {
    if (Array.isArray(value)) {
      return value.map((item) => String(item).trim()).filter(Boolean).slice(0, limit);
    }
    if (typeof value === "string") {
      return value
        .split(/[,;\n|•]/)
        .map((item) => String(item).trim())
        .filter(Boolean)
        .slice(0, limit);
    }
    return [];
  };
  const skills = toList((data as { skills?: unknown }).skills, 80);
  const languages = toList((data as { languages?: unknown }).languages, 20);

  return {
    ...base,
    ...data,
    language: String(data.language || base.language).slice(0, 40),
    targetRole: String(data.targetRole || "").slice(0, 160),
    targetJobDescription: String(data.targetJobDescription || "").slice(0, 20000),
    template,
    primaryColor: /^#[0-9a-fA-F]{6}$/.test(String(data.primaryColor || "")) ? String(data.primaryColor) : base.primaryColor,
    personal: {
      ...base.personal,
      ...(data.personal && typeof data.personal === "object" ? data.personal : {})
    },
    summary: String(data.summary || "").slice(0, 4000),
    experience: Array.isArray(data.experience) && data.experience.length
      ? data.experience.map((item) => ({ ...emptyExperience(), ...item, id: item.id || makeId() })).slice(0, 20)
      : base.experience,
    education: Array.isArray(data.education) && data.education.length
      ? data.education.map((item) => ({ ...emptyEducation(), ...item, id: item.id || makeId() })).slice(0, 20)
      : base.education,
    certifications: Array.isArray(data.certifications)
      ? data.certifications.map((item) => ({ ...emptyCertification(), ...item, id: item.id || makeId() })).slice(0, 30)
      : base.certifications,
    skills,
    languages
  };
}

function hasValue(value: unknown) {
  if (Array.isArray(value)) return value.length > 0;
  return typeof value === "string" ? value.trim().length > 0 : Boolean(value);
}

function meaningfulExperience(item: ResumeExperience) {
  return hasValue(item.role) || hasValue(item.company) || hasValue(item.description);
}

function meaningfulEducation(item: ResumeEducation) {
  return hasValue(item.degree) || hasValue(item.school) || hasValue(item.description);
}

function meaningfulCertification(item: ResumeCertification) {
  return hasValue(item.name) || hasValue(item.issuer) || hasValue(item.description);
}

function mergeIndexedItems<T extends { id: string }>(
  baseItems: T[],
  patchItems: T[],
  emptyFactory: () => T,
  mergeItem: (baseItem: T, patchItem: T) => T,
  isMeaningful: (item: T) => boolean
) {
  const meaningfulPatch = patchItems.filter(isMeaningful);
  if (!meaningfulPatch.length) return baseItems;

  const merged: T[] = [];
  const length = Math.max(baseItems.length, meaningfulPatch.length);
  for (let index = 0; index < length; index += 1) {
    const baseItem = baseItems[index] || emptyFactory();
    const patchItem = meaningfulPatch[index];
    merged.push(patchItem ? mergeItem(baseItem, patchItem) : baseItem);
  }
  return merged;
}

export function mergeResumeData(baseInput: ResumeData, patchInput: unknown): ResumeData {
  const base = normalizeResumeData(baseInput);
  const patch = normalizeResumeData(patchInput);
  const mergeText = (next: string, current: string) => (next.trim() ? next : current);

  return normalizeResumeData({
    ...base,
    language: mergeText(patch.language, base.language),
    targetRole: mergeText(patch.targetRole, base.targetRole),
    targetJobDescription: mergeText(patch.targetJobDescription, base.targetJobDescription),
    template: patch.template || base.template,
    primaryColor: patch.primaryColor || base.primaryColor,
    personal: {
      name: mergeText(patch.personal.name, base.personal.name),
      headline: mergeText(patch.personal.headline, base.personal.headline),
      email: mergeText(patch.personal.email, base.personal.email),
      phone: mergeText(patch.personal.phone, base.personal.phone),
      location: mergeText(patch.personal.location, base.personal.location),
      links: mergeText(patch.personal.links, base.personal.links)
    },
    summary: mergeText(patch.summary, base.summary),
    experience: mergeIndexedItems(
      base.experience,
      patch.experience,
      emptyExperience,
      (baseItem, patchItem) => ({
        ...baseItem,
        ...patchItem,
        id: patchItem.id || baseItem.id || makeId(),
        role: mergeText(patchItem.role, baseItem.role),
        company: mergeText(patchItem.company, baseItem.company),
        location: mergeText(patchItem.location, baseItem.location),
        start: mergeText(patchItem.start, baseItem.start),
        end: mergeText(patchItem.end, baseItem.end),
        description: mergeText(patchItem.description, baseItem.description)
      }),
      meaningfulExperience
    ),
    education: mergeIndexedItems(
      base.education,
      patch.education,
      emptyEducation,
      (baseItem, patchItem) => ({
        ...baseItem,
        ...patchItem,
        id: patchItem.id || baseItem.id || makeId(),
        degree: mergeText(patchItem.degree, baseItem.degree),
        school: mergeText(patchItem.school, baseItem.school),
        location: mergeText(patchItem.location, baseItem.location),
        start: mergeText(patchItem.start, baseItem.start),
        end: mergeText(patchItem.end, baseItem.end),
        description: mergeText(patchItem.description, baseItem.description)
      }),
      meaningfulEducation
    ),
    certifications: mergeIndexedItems(
      base.certifications,
      patch.certifications,
      emptyCertification,
      (baseItem, patchItem) => ({
        ...baseItem,
        ...patchItem,
        id: patchItem.id || baseItem.id || makeId(),
        name: mergeText(patchItem.name, baseItem.name),
        issuer: mergeText(patchItem.issuer, baseItem.issuer),
        date: mergeText(patchItem.date, baseItem.date),
        credentialUrl: mergeText(patchItem.credentialUrl, baseItem.credentialUrl),
        description: mergeText(patchItem.description, baseItem.description)
      }),
      meaningfulCertification
    ),
    skills: patch.skills.length ? patch.skills : base.skills,
    languages: patch.languages.length ? patch.languages : base.languages
  });
}

export function resumeToPlainText(data: ResumeData) {
  const parts = [
    data.personal.name,
    data.personal.headline,
    data.personal.email,
    data.personal.phone,
    data.personal.location,
    data.personal.links,
    data.summary,
    ...data.experience.flatMap((item) => [item.role, item.company, item.location, item.description]),
    ...data.education.flatMap((item) => [item.degree, item.school, item.location, item.description]),
    ...data.certifications.flatMap((item) => [item.name, item.issuer, item.date, item.description]),
    data.skills.join(", "),
    data.languages.join(", ")
  ];

  return parts.filter(Boolean).join("\n");
}

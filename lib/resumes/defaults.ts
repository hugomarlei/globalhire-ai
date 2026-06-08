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
    skills: []
  };
}

export function normalizeResumeData(input: unknown): ResumeData {
  const base = defaultResumeData();
  if (!input || typeof input !== "object") return base;

  const data = input as Partial<ResumeData>;
  const template = resumeTemplates.some((item) => item.key === data.template) ? data.template! : base.template;
  const skills = Array.isArray(data.skills)
    ? data.skills.map((item) => String(item).trim()).filter(Boolean).slice(0, 80)
    : [];

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
    skills
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
    experience: patch.experience.some(meaningfulExperience)
      ? patch.experience.filter(meaningfulExperience).map((item, index) => ({
          ...(base.experience[index] || emptyExperience()),
          ...item,
          role: mergeText(item.role, base.experience[index]?.role || ""),
          company: mergeText(item.company, base.experience[index]?.company || ""),
          location: mergeText(item.location, base.experience[index]?.location || ""),
          start: mergeText(item.start, base.experience[index]?.start || ""),
          end: mergeText(item.end, base.experience[index]?.end || ""),
          description: mergeText(item.description, base.experience[index]?.description || "")
        }))
      : base.experience,
    education: patch.education.some(meaningfulEducation)
      ? patch.education.filter(meaningfulEducation).map((item, index) => ({
          ...(base.education[index] || emptyEducation()),
          ...item,
          degree: mergeText(item.degree, base.education[index]?.degree || ""),
          school: mergeText(item.school, base.education[index]?.school || ""),
          location: mergeText(item.location, base.education[index]?.location || ""),
          start: mergeText(item.start, base.education[index]?.start || ""),
          end: mergeText(item.end, base.education[index]?.end || ""),
          description: mergeText(item.description, base.education[index]?.description || "")
        }))
      : base.education,
    certifications: patch.certifications.some(meaningfulCertification)
      ? patch.certifications.filter(meaningfulCertification).map((item, index) => ({
          ...(base.certifications[index] || emptyCertification()),
          ...item,
          name: mergeText(item.name, base.certifications[index]?.name || ""),
          issuer: mergeText(item.issuer, base.certifications[index]?.issuer || ""),
          date: mergeText(item.date, base.certifications[index]?.date || ""),
          credentialUrl: mergeText(item.credentialUrl, base.certifications[index]?.credentialUrl || ""),
          description: mergeText(item.description, base.certifications[index]?.description || "")
        }))
      : base.certifications,
    skills: patch.skills.length ? patch.skills : base.skills
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
    data.skills.join(", ")
  ];

  return parts.filter(Boolean).join("\n");
}

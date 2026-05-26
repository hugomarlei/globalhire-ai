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

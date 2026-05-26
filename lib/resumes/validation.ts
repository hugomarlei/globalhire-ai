import { z } from "zod";

export const resumeDataSchema = z.object({
  language: z.string().min(2).max(40).default("pt-BR"),
  targetRole: z.string().max(160).default(""),
  targetJobDescription: z.string().max(20000).default(""),
  template: z.enum(["classic", "professional", "modern"]).default("professional"),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/).default("#0f766e"),
  personal: z.object({
    name: z.string().max(160).default(""),
    headline: z.string().max(180).default(""),
    email: z.string().max(180).default(""),
    phone: z.string().max(80).default(""),
    location: z.string().max(160).default(""),
    links: z.string().max(400).default("")
  }),
  summary: z.string().max(4000).default(""),
  experience: z.array(z.object({
    id: z.string().min(1),
    role: z.string().max(160).default(""),
    company: z.string().max(160).default(""),
    location: z.string().max(160).default(""),
    start: z.string().max(40).default(""),
    end: z.string().max(40).default(""),
    current: z.boolean().default(false),
    description: z.string().max(6000).default("")
  })).max(20).default([]),
  education: z.array(z.object({
    id: z.string().min(1),
    degree: z.string().max(180).default(""),
    school: z.string().max(180).default(""),
    location: z.string().max(160).default(""),
    start: z.string().max(40).default(""),
    end: z.string().max(40).default(""),
    description: z.string().max(3000).default("")
  })).max(20).default([]),
  skills: z.array(z.string().max(80)).max(80).default([])
});

export const resumeCreateSchema = z.object({
  title: z.string().min(1).max(140).default("Novo currículo"),
  data: resumeDataSchema.optional()
});

export const resumeUpdateSchema = z.object({
  title: z.string().min(1).max(140).optional(),
  data: resumeDataSchema.optional()
});

export const suggestDescriptionSchema = z.object({
  section: z.enum(["summary", "experience", "education"]),
  role: z.string().max(160).default(""),
  company: z.string().max(160).default(""),
  currentDescription: z.string().max(6000).default(""),
  jobDescription: z.string().max(20000).default(""),
  language: z.string().min(2).max(40).default("pt-BR")
});

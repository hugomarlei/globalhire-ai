import { z } from "zod";
import { generationTypes } from "@/lib/types";

export const generateSchema = z.object({
  resume: z.string().min(100, "Cole pelo menos 100 caracteres do currículo.").max(20000),
  jobDescription: z.string().max(20000).optional().default(""),
  language: z.string().min(2).max(40),
  targetCountry: z.string().min(2).max(60),
  type: z.enum(generationTypes)
});

export const checkoutSchema = z.object({
  plan: z.enum(["starter", "pro", "elite"])
});

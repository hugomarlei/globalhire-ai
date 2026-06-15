import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";
import { rejectInvalidOrigin } from "@/lib/security";
import { encodeStructuredResumeGeneration } from "@/lib/generation-output";
import { normalizeResumeData } from "@/lib/resumes/defaults";
import { generationTypes } from "@/lib/types";

const saveHistorySchema = z.object({
  type: z.enum(generationTypes).default("ats_resume"),
  language: z.string().min(2).max(80),
  targetCountry: z.string().min(2).max(80),
  inputResume: z.string().min(1).max(30000),
  jobDescription: z.string().max(30000).optional().default(""),
  output: z.string().min(1).max(40000),
  resumeData: z.unknown().optional()
});

export async function POST(request: NextRequest) {
  try {
    const originError = rejectInvalidOrigin(request);
    if (originError) return originError;

    const supabase = await createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ error: "Faça login para salvar no histórico." }, { status: 401 });

    const parsed = saveHistorySchema.safeParse(await request.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.errors[0]?.message || "Dados inválidos." }, { status: 400 });
    }

    const structuredData = parsed.data.resumeData ? normalizeResumeData(parsed.data.resumeData) : null;
    const output = structuredData
      ? encodeStructuredResumeGeneration(structuredData, parsed.data.output)
      : parsed.data.output;

    const { data, error } = await supabase
      .from("generations")
      .insert({
        user_id: user.id,
        type: parsed.data.type,
        language: parsed.data.language,
        target_country: parsed.data.targetCountry,
        input_resume: parsed.data.inputResume,
        job_description: parsed.data.jobDescription || null,
        output
      })
      .select("id,created_at")
      .single();

    if (error) {
      console.error("history_save_error", error);
      return NextResponse.json({ error: "Não foi possível salvar no histórico." }, { status: 500 });
    }

    return NextResponse.json({ generation: data, saved: true });
  } catch (error) {
    console.error("history_save_unhandled_error", error);
    return NextResponse.json({ error: "Erro interno ao salvar no histórico." }, { status: 500 });
  }
}

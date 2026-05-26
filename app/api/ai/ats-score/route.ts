import { NextResponse } from "next/server";
import { normalizeResumeData } from "@/lib/resumes/defaults";
import { calculateResumeScore } from "@/lib/resumes/score";
import { resumeDataSchema } from "@/lib/resumes/validation";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = resumeDataSchema.safeParse(body?.data || body);
  if (!parsed.success) return NextResponse.json({ error: "Dados invalidos." }, { status: 400 });

  return NextResponse.json(calculateResumeScore(normalizeResumeData(parsed.data)));
}

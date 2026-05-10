import { NextRequest, NextResponse } from "next/server";
import { verifyTurnstileToken } from "@/lib/turnstile";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const result = await verifyTurnstileToken(
    typeof body.token === "string" ? body.token : null,
    request.headers.get("cf-connecting-ip") || request.headers.get("x-forwarded-for")
  );

  if (!result.ok) {
    return NextResponse.json({ error: result.error || "Captcha inválido." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, skipped: result.skipped || false });
}

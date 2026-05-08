import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase-server";

const schema = z.object({
  title: z.string().min(1).max(120),
  content: z.string().min(1).max(50000)
});

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Faca login." }, { status: 401 });

  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: "Conteudo invalido." }, { status: 400 });

  return NextResponse.json({
    html: `<h1>${parsed.data.title}</h1><pre>${parsed.data.content}</pre>`,
    note: "O MVP exporta PDF pelo navegador usando window.print(). Esta rota fica pronta para evoluir para geração server-side."
  });
}

import { HistoryList } from "@/components/history-list";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";
import { normalizeResumeData, resumeToPlainText } from "@/lib/resumes/defaults";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  const { user } = await requireUser();
  const supabase = await createClient();
  const [generationsResult, resumesResult] = await Promise.all([
    supabase
      .from("generations")
      .select("id,type,language,target_country,output,created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30),
    supabase
      .from("resumes")
      .select("id,title,data,created_at,updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false })
      .limit(30)
  ]);

  const generationItems = generationsResult.data || [];
  const resumeItems = (resumesResult.data || []).map((item) => {
    const data = normalizeResumeData(item.data);
    return {
      id: item.id,
      kind: "resume" as const,
      type: "resume" as const,
      language: data.language || "pt-BR",
      target_country: data.targetRole || data.personal.location || "Brasil",
      output: resumeToPlainText(data),
      created_at: item.updated_at || item.created_at,
      title: item.title || data.personal.name || "Currículo"
    };
  });

  const items = [...generationItems.map((item) => ({ ...item, kind: "generation" as const })), ...resumeItems].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return <HistoryList items={items} />;
}

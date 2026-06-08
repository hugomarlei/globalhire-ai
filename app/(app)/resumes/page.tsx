import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Trash2 } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { ResumeEditor } from "@/components/resumes/resume-editor";
import { createClient } from "@/lib/supabase-server";
import { defaultResumeData, normalizeResumeData } from "@/lib/resumes/defaults";
import { calculateResumeScore } from "@/lib/resumes/score";

async function deleteResume(formData: FormData) {
  "use server";
  const id = String(formData.get("id") || "");
  if (!id) return;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  await supabase.from("resumes").delete().eq("id", id).eq("user_id", user.id);
  redirect("/resumes");
}

export default async function ResumesPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resumes } = await supabase
    .from("resumes")
    .select("id,title,data,updated_at,created_at")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  return (
    <div className="space-y-6">
      <ResumeEditor initialTitle="Novo currículo" initialData={defaultResumeData()} isDraft />

      <Card className="rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Currículos salvos</h2>
            <p className="text-sm text-muted-foreground">Abra versões anteriores ou exclua rascunhos que não devem continuar.</p>
          </div>
          <span className="rounded-md bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground">{resumes?.length || 0} salvos</span>
        </div>

        {resumes?.length ? (
          <div className="mt-4 grid gap-2">
            {resumes.map((resume) => {
              const data = normalizeResumeData(resume.data);
              const score = calculateResumeScore(data).score;
              return (
                <div key={resume.id} className="grid gap-3 rounded-md border border-border bg-background p-3 sm:grid-cols-[1fr_auto] sm:items-center">
                  <Link href={`/resumes/${resume.id}`} className="min-w-0 group">
                    <p className="truncate text-sm font-semibold text-foreground">{resume.title || data.personal.name || "Currículo sem título"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Score {score} · {data.targetRole || "sem cargo-alvo"} · atualizado em {new Date(resume.updated_at || resume.created_at).toLocaleDateString("pt-BR")}
                    </p>
                  </Link>
                  <div className="flex gap-2">
                    <Button href={`/resumes/${resume.id}`} className="h-9 rounded-md px-3">
                      Abrir <ArrowRight size={14} />
                    </Button>
                    <form action={deleteResume}>
                      <input type="hidden" name="id" value={resume.id} />
                      <button type="submit" className="focus-ring inline-flex h-9 items-center gap-2 rounded-md border border-red-400/30 px-3 text-sm text-red-700 hover:bg-red-500/10 dark:border-red-400/20 dark:text-red-100">
                        <Trash2 size={14} /> Excluir
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="mt-4 rounded-md border border-dashed border-border p-4 text-sm text-muted-foreground">
            Nenhum currículo salvo ainda. Complete o rascunho acima e clique em Salvar quando estiver pronto.
          </p>
        )}
      </Card>
    </div>
  );
}

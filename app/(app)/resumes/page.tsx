import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui";
import { createClient } from "@/lib/supabase-server";
import { defaultResumeData, normalizeResumeData } from "@/lib/resumes/defaults";
import { calculateResumeScore } from "@/lib/resumes/score";

async function createResume() {
  "use server";
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("resumes")
    .insert({ user_id: user.id, title: "Novo currículo", data: defaultResumeData() })
    .select("id")
    .single();

  if (error || !data) redirect("/resumes?erro=create");
  redirect(`/resumes/${data.id}`);
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
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Meus currículos</h1>
          <p className="text-sm text-muted-foreground">Crie, personalize, pontue e exporte currículos por vaga.</p>
        </div>
        <form action={createResume}>
          <Button type="submit" className="h-10 rounded-md px-3">
            <Plus size={16} /> Criar currículo
          </Button>
        </form>
      </div>

      {resumes?.length ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {resumes.map((resume) => {
            const data = normalizeResumeData(resume.data);
            const score = calculateResumeScore(data).score;
            return (
              <Link key={resume.id} href={`/resumes/${resume.id}`} className="rounded-md border border-border bg-card p-4 text-card-foreground transition hover:bg-muted/60">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="truncate font-semibold">{resume.title}</h2>
                    <p className="truncate text-sm text-muted-foreground">{data.targetRole || data.personal.headline || "Sem cargo-alvo"}</p>
                  </div>
                  <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{score}</span>
                </div>
                <p className="text-xs text-muted-foreground">Atualizado em {new Date(resume.updated_at || resume.created_at).toLocaleDateString("pt-BR")}</p>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-border bg-card p-8 text-center">
          <h2 className="font-semibold text-card-foreground">Nenhum currículo ainda</h2>
          <p className="mt-1 text-sm text-muted-foreground">Comece com um currículo vazio e ajuste para cada vaga.</p>
        </div>
      )}
    </div>
  );
}

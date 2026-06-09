import { redirect } from "next/navigation";
import { ResumeEditor } from "@/components/resumes/resume-editor";
import { createClient } from "@/lib/supabase-server";
import { defaultResumeData } from "@/lib/resumes/defaults";

export const dynamic = "force-dynamic";

export default async function ResumesPage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return (
    <div className="space-y-6">
      <ResumeEditor initialTitle="Novo currículo" initialData={defaultResumeData()} />
      <p className="text-sm text-muted-foreground">Os currículos salvos aparecem no Histórico.</p>
    </div>
  );
}

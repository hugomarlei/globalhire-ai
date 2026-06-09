import { redirect } from "next/navigation";
import { ResumeEditor } from "@/components/resumes/resume-editor";
import { createClient } from "@/lib/supabase-server";
import { defaultResumeData } from "@/lib/resumes/defaults";

export default async function NewResumePage() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  return <ResumeEditor initialTitle="Novo currículo" initialData={defaultResumeData()} />;
}

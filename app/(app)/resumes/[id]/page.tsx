import { notFound, redirect } from "next/navigation";
import { ResumeEditor } from "@/components/resumes/resume-editor";
import { createClient } from "@/lib/supabase-server";
import { normalizeResumeData } from "@/lib/resumes/defaults";

export default async function ResumeEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("resumes")
    .select("id,title,data")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) notFound();

  return <ResumeEditor id={data.id} initialTitle={data.title} initialData={normalizeResumeData(data.data)} />;
}

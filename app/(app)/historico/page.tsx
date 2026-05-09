import { HistoryList } from "@/components/history-list";
import { requireUser } from "@/lib/auth";
import { createClient } from "@/lib/supabase-server";

export default async function HistoryPage() {
  const { user } = await requireUser();
  const supabase = await createClient();
  const { data } = await supabase
    .from("generations")
    .select("id,type,language,target_country,output,created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(30);

  return <HistoryList items={data || []} />;
}

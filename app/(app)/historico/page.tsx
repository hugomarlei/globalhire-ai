import { Card } from "@/components/ui";
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

  return (
    <div>
      <h1 className="text-3xl font-semibold">Histórico</h1>
      <div className="mt-6 grid gap-4">
        {(data || []).map((item) => (
          <Card key={item.id}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="font-semibold">{item.type}</h2>
              <span className="text-sm text-white/50">{new Date(item.created_at).toLocaleString("pt-BR")}</span>
            </div>
            <p className="mt-1 text-sm text-white/50">{item.language} - {item.target_country}</p>
            <details className="mt-4">
              <summary className="focus-ring inline-flex cursor-pointer rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
                Abrir documento
              </summary>
              <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-black/25 p-4 text-sm leading-6 text-white/78">{item.output}</pre>
            </details>
          </Card>
        ))}
        {!data?.length ? <Card>Nenhuma geração ainda. Crie a primeira no dashboard.</Card> : null}
      </div>
    </div>
  );
}

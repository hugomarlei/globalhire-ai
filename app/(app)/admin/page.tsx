import { AdminBlockButton } from "@/components/admin-block-button";
import { Card } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";

export default async function AdminPage() {
  await requireAdmin();
  const supabase = createAdminClient();
  const [{ data: users }, { data: generations }, { data: subscriptions }] = await Promise.all([
    supabase.from("profiles").select("id,email,full_name,plan,is_blocked,created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("generations").select("id,user_id,type,created_at").order("created_at", { ascending: false }).limit(100),
    supabase.from("subscriptions").select("plan,status")
  ]);

  const active = (subscriptions || []).filter((item) => item.status === "active");
  const revenue = active.reduce((sum, item) => {
    if (item.plan === "starter") return sum + 29;
    if (item.plan === "pro") return sum + 79;
    if (item.plan === "elite") return sum + 149;
    return sum;
  }, 0);

  return (
    <div className="grid gap-6">
      <h1 className="text-3xl font-semibold">Admin</h1>
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-white/50">Usuarios</p><p className="text-3xl font-semibold">{users?.length || 0}</p></Card>
        <Card><p className="text-sm text-white/50">Geracoes</p><p className="text-3xl font-semibold">{generations?.length || 0}</p></Card>
        <Card><p className="text-sm text-white/50">Assinaturas ativas</p><p className="text-3xl font-semibold">{active.length}</p></Card>
        <Card><p className="text-sm text-white/50">Receita estimada</p><p className="text-3xl font-semibold">R${revenue}/mes</p></Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold">Usuarios</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="text-white/50">
              <tr>
                <th className="py-3">Nome</th>
                <th>E-mail</th>
                <th>Plano</th>
                <th>Status</th>
                <th>Acao</th>
              </tr>
            </thead>
            <tbody>
              {(users || []).map((user) => (
                <tr key={user.id} className="border-t border-white/10">
                  <td className="py-3">{user.full_name || "-"}</td>
                  <td>{user.email || "-"}</td>
                  <td>{user.plan}</td>
                  <td>{user.is_blocked ? "Bloqueado" : "Ativo"}</td>
                  <td><AdminBlockButton userId={user.id} blocked={user.is_blocked} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold">Geracoes recentes</h2>
        <div className="mt-4 grid gap-2 text-sm text-white/75">
          {(generations || []).slice(0, 20).map((item) => (
            <div key={item.id} className="flex justify-between rounded-md bg-white/5 p-3">
              <span>{item.type}</span>
              <span>{new Date(item.created_at).toLocaleString("pt-BR")}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

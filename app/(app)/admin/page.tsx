import { AdminBlockButton } from "@/components/admin-block-button";
import { Card } from "@/components/ui";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase-server";
import { adminDashboardCopy } from "@/lib/i18n-admin";
import { getServerLocale } from "@/lib/server-locale";
import { intlLocaleForUi } from "@/lib/i18n-history-ats";

function maskEmail(email?: string | null) {
  if (!email || !email.includes("@")) return "-";
  const [name, domain] = email.split("@");
  return `${name.slice(0, 2)}***@${domain}`;
}

function dateDaysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

export default async function AdminPage() {
  await requireAdmin();
  const locale = await getServerLocale();
  const d = adminDashboardCopy[locale];
  const dateLocale = intlLocaleForUi(locale);
  const supabase = createAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [{ data: users }, { data: generations }, { data: subscriptions }] = await Promise.all([
    supabase.from("profiles").select("id,email,full_name,plan,is_blocked,created_at").order("created_at", { ascending: false }).limit(250),
    supabase.from("generations").select("id,user_id,type,created_at").order("created_at", { ascending: false }).limit(500),
    supabase.from("subscriptions").select("plan,status")
  ]);

  const safeUsers = users || [];
  const safeGenerations = generations || [];
  const active = (subscriptions || []).filter((item) => item.status === "active");
  const recentUsers = safeUsers.filter((item) => item.created_at && item.created_at >= dateDaysAgo(7));
  const analysesToday = safeGenerations.filter((item) => item.created_at && item.created_at >= today.toISOString());
  const atsAnalyses = safeGenerations.filter((item) => item.type === "ats_resume");
  const planCounts = safeUsers.reduce<Record<string, number>>((acc, item) => {
    acc[item.plan || "free"] = (acc[item.plan || "free"] || 0) + 1;
    return acc;
  }, {});
  const userGenerationCounts = safeGenerations.reduce<Record<string, number>>((acc, item) => {
    acc[item.user_id] = (acc[item.user_id] || 0) + 1;
    return acc;
  }, {});
  const revenue = active.reduce((sum, item) => {
    if (item.plan === "starter") return sum + 29;
    if (item.plan === "pro") return sum + 79;
    if (item.plan === "elite") return sum + 149;
    return sum;
  }, 0);

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-3xl font-semibold text-foreground">{d.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{d.lead}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">{d.cardUsers}</p>
          <p className="text-3xl font-semibold">{safeUsers.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">{d.cardNew7d}</p>
          <p className="text-3xl font-semibold">{recentUsers.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">{d.cardActiveSubs}</p>
          <p className="text-3xl font-semibold">{active.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">{d.cardRevenue}</p>
          <p className="text-3xl font-semibold">{d.revenuePerMonth(revenue)}</p>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <p className="text-sm text-muted-foreground">{d.cardAtsTotal}</p>
          <p className="text-3xl font-semibold">{atsAnalyses.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">{d.cardAnalysesToday}</p>
          <p className="text-3xl font-semibold">{analysesToday.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">{d.cardErrors}</p>
          <p className="text-3xl font-semibold">{d.pending}</p>
        </Card>
        <Card>
          <p className="text-sm text-muted-foreground">{d.cardUpgrades}</p>
          <p className="text-3xl font-semibold">{d.posthog}</p>
        </Card>
      </div>

      <Card>
        <h2 className="text-xl font-semibold text-foreground">{d.usersByPlan}</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {["free", "starter", "pro", "elite"].map((plan) => (
            <div key={plan} className="rounded-md border border-border bg-card p-3">
              <p className="text-sm capitalize text-muted-foreground">{plan}</p>
              <p className="text-2xl font-semibold">{planCounts[plan] || 0}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-foreground">{d.recentUsers}</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[860px] text-left text-sm">
            <thead className="text-muted-foreground">
              <tr>
                <th className="py-3">{d.thName}</th>
                <th>{d.thEmail}</th>
                <th>{d.thPlan}</th>
                <th>{d.thCreated}</th>
                <th>{d.thLastAccess}</th>
                <th>{d.thAnalyses}</th>
                <th>{d.thStatus}</th>
                <th>{d.thAction}</th>
              </tr>
            </thead>
            <tbody>
              {safeUsers.slice(0, 50).map((user) => (
                <tr key={user.id} className="border-t border-border">
                  <td className="py-3">{user.full_name || "-"}</td>
                  <td>{maskEmail(user.email)}</td>
                  <td>{user.plan}</td>
                  <td>{user.created_at ? new Date(user.created_at).toLocaleDateString(dateLocale) : "-"}</td>
                  <td className="text-muted-foreground">{d.pending}</td>
                  <td>{userGenerationCounts[user.id] || 0}</td>
                  <td>{user.is_blocked ? d.statusBlocked : d.statusActive}</td>
                  <td>
                    <AdminBlockButton userId={user.id} blocked={user.is_blocked} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card>
        <h2 className="text-xl font-semibold text-foreground">{d.recentGenerations}</h2>
        <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
          {safeGenerations.slice(0, 20).map((item) => (
            <div key={item.id} className="flex justify-between rounded-md bg-muted p-3">
              <span>{item.type}</span>
              <span>{new Date(item.created_at).toLocaleString(dateLocale)}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

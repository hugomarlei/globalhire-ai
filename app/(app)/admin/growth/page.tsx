import { GrowthCockpit } from "@/components/growth-cockpit";
import { requireAdmin } from "@/lib/auth";
import { getAppUrl } from "@/lib/app-url";
import { getServerLocale } from "@/lib/server-locale";

export default async function AdminGrowthPage() {
  await requireAdmin();
  const locale = await getServerLocale();
  const appUrl = getAppUrl();

  return <GrowthCockpit key={locale} locale={locale} appUrl={appUrl} />;
}

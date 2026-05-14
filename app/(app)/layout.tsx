import { AppNav } from "@/components/nav";
import { AutoSiteFooter } from "@/components/site-footer";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireUser();

  return (
    <main className="min-h-screen bg-paper text-ink transition-colors dark:bg-[linear-gradient(180deg,#050806_0%,#07120E_100%)] dark:text-white">
      <AppNav isAdmin={Boolean(profile?.is_admin)} email={user.email || ""} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
      <AutoSiteFooter />
    </main>
  );
}

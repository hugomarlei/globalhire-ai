import { AppNav } from "@/components/nav";
import { AutoSiteFooter } from "@/components/site-footer";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireUser();

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors dark:bg-[linear-gradient(180deg,rgb(var(--background))_0%,rgb(var(--surface-elevated))_100%)]">
      <AppNav isAdmin={Boolean(profile?.is_admin)} email={user.email || ""} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
      <AutoSiteFooter />
    </main>
  );
}

import { AppNav } from "@/components/nav";
import { OAuthSessionTracker } from "@/components/oauth-session-tracker";
import { AutoSiteFooter } from "@/components/site-footer";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, profile } = await requireUser();

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(45,212,191,0.07),transparent_55%),linear-gradient(180deg,rgb(var(--background))_0%,rgb(var(--surface-muted))_100%)]">
      <OAuthSessionTracker />
      <AppNav isAdmin={Boolean(profile?.is_admin)} email={user.email || ""} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{children}</div>
      <AutoSiteFooter />
    </main>
  );
}

import { AppNav } from "@/components/nav";
import { OAuthSessionTracker } from "@/components/oauth-session-tracker";
import { AutoSiteFooter } from "@/components/site-footer";
import { isAllowedAdminEmail } from "@/lib/admin-access";
import { requireUser } from "@/lib/auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireUser();

  return (
    <main className="min-h-screen bg-background text-foreground transition-colors duration-300 dark:bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(45,212,191,0.07),transparent_55%),linear-gradient(180deg,rgb(var(--background))_0%,rgb(var(--surface-muted))_100%)] lg:pl-72">
      <OAuthSessionTracker />
      <AppNav isAdmin={isAllowedAdminEmail(user.email)} email={user.email || ""} />
      <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      <AutoSiteFooter />
    </main>
  );
}

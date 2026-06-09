import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-background text-foreground transition-colors duration-300 dark:bg-[linear-gradient(180deg,rgb(var(--background))_0%,rgb(var(--surface-muted))_100%)]">
      <PublicNav />
      <div className="flex flex-1 flex-col">{children}</div>
      <AutoSiteFooter />
    </div>
  );
}

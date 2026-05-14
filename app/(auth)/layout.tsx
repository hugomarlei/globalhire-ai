import { AutoSiteFooter } from "@/components/site-footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300 dark:bg-[radial-gradient(ellipse_100%_60%_at_50%_-15%,rgba(45,212,191,0.06),transparent_50%),linear-gradient(180deg,rgb(var(--background))_0%,rgb(var(--surface-muted))_100%)]">
      <div className="flex flex-1 flex-col">{children}</div>
      <AutoSiteFooter />
    </div>
  );
}

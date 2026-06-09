"use client";

import { cn } from "@/components/ui";

export function PublicPageShell({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        "min-h-screen overflow-x-hidden bg-background text-foreground",
        "bg-[linear-gradient(180deg,rgb(var(--background))_0%,rgb(var(--muted))_46%,rgb(var(--background))_100%)]",
        className
      )}
    >
      {children}
    </main>
  );
}

export function PublicBand({
  children,
  tone = "light",
  id,
  className
}: {
  children: React.ReactNode;
  tone?: "light" | "dark";
  id?: string;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={cn(
        "border-y border-border/70",
        tone === "dark"
          ? "bg-zinc-950 text-zinc-50 dark:bg-zinc-950"
          : "bg-background/76 text-foreground backdrop-blur-sm",
        className
      )}
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">{children}</div>
    </section>
  );
}

export function PublicSection({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <section className={cn("mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24", className)}>{children}</section>;
}

export function PublicKicker({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p className={cn("text-sm font-semibold text-primary", dark && "text-teal-300")}>
      {children}
    </p>
  );
}

export function PublicCard({
  children,
  dark = false,
  className
}: {
  children: React.ReactNode;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 shadow-sm transition duration-200",
        dark
          ? "border-white/10 bg-white/[0.045] text-zinc-50 shadow-none"
          : "border-border/80 bg-card/86 text-card-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

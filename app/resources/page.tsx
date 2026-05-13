import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-paper text-ink dark:bg-ink dark:text-white">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold text-ink dark:text-white">Resources</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-graphite/75 dark:text-white/65">
          Espaço reservado para guias de currículo ATS, candidatura internacional, LinkedIn e entrevistas.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Guia de currículo ATS", "Checklist de LinkedIn", "Preparação para entrevista internacional"].map((title) => (
            <Card key={title}>
              <h2 className="font-semibold text-ink dark:text-white">{title}</h2>
              <p className="mt-2 text-sm text-graphite/70 dark:text-white/60">Conteúdo editorial em preparação.</p>
            </Card>
          ))}
        </div>
      </section>
      <AutoSiteFooter />
    </main>
  );
}

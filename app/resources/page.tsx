import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";

export default function ResourcesPage() {
  return (
    <main className="min-h-screen bg-ink text-white">
      <PublicNav />
      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <h1 className="text-4xl font-semibold">Resources</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">
          Espaço reservado para guias de currículo ATS, candidatura internacional, LinkedIn e entrevistas.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {["Guia de currículo ATS", "Checklist de LinkedIn", "Preparação para entrevista internacional"].map((title) => (
            <Card key={title}>
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-white/60">Conteúdo editorial em preparação.</p>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}

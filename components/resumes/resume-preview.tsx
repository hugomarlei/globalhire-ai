"use client";

import type { ResumeData } from "@/lib/resumes/types";
import { cn } from "@/components/ui";

function lines(value: string) {
  return value
    .split(/\n+/)
    .map((item) => item.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function Section({ title, children, color }: { title: string; children: React.ReactNode; color: string }) {
  return (
    <section className="break-inside-avoid space-y-2">
      <h2 className="border-b pb-1 text-[11px] font-bold uppercase tracking-[0.14em]" style={{ borderColor: color, color }}>
        {title}
      </h2>
      {children}
    </section>
  );
}

export function ResumePreview({ data, printable = false }: { data: ResumeData; printable?: boolean }) {
  const color = data.primaryColor || "#0f766e";
  const compact = data.template === "classic";
  const sidebar = data.template === "modern";

  return (
    <article
      className={cn(
        "resume-print min-h-[980px] bg-white text-slate-950 shadow-sm print:min-h-0 print:shadow-none",
        printable ? "w-full" : "mx-auto w-full max-w-[820px]",
        sidebar ? "grid grid-cols-[0.72fr_1.28fr]" : "p-8 sm:p-10",
        data.template === "professional" && "border-t-[10px]",
        compact && "font-serif"
      )}
      style={{ borderColor: data.template === "professional" ? color : undefined }}
    >
      <div className={cn(sidebar ? "space-y-5 p-7 text-white" : "contents")} style={sidebar ? { backgroundColor: color } : undefined}>
        <header className={cn("space-y-2", !sidebar && "mb-6 border-b pb-5")} style={!sidebar ? { borderColor: color } : undefined}>
          <h1 className={cn("font-bold leading-tight", compact ? "text-3xl" : "text-4xl")}>{data.personal.name || "Seu Nome"}</h1>
          <p className={cn("text-sm font-semibold", sidebar ? "text-white/90" : "text-slate-700")}>{data.personal.headline || data.targetRole || "Cargo-alvo"}</p>
          <p className={cn("text-xs leading-5", sidebar ? "text-white/85" : "text-slate-600")}>
            {[data.personal.email, data.personal.phone, data.personal.location, data.personal.links].filter(Boolean).join(" | ")}
          </p>
        </header>

        {sidebar ? (
          <div className="space-y-5 text-sm">
            <div>
              <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">Skills</h2>
              <p className="leading-6">{data.skills.join(" | ") || "Adicione habilidades relevantes"}</p>
            </div>
            <div>
              <h2 className="mb-2 text-[11px] font-bold uppercase tracking-[0.14em] text-white/70">Education</h2>
              {data.education.filter((item) => item.degree || item.school).map((item) => (
                <div key={item.id} className="mb-3">
                  <p className="font-semibold">{item.degree || "Formação"}</p>
                  <p className="text-white/85">{item.school}</p>
                  <p className="text-xs text-white/70">{[item.start, item.end].filter(Boolean).join(" - ")}</p>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className={cn("space-y-6", sidebar && "p-8")}>
        {data.summary ? (
          <Section title="Resumo" color={color}>
            <p className="text-sm leading-6 text-slate-700">{data.summary}</p>
          </Section>
        ) : null}

        <Section title="Experiência" color={color}>
          <div className="space-y-4">
            {data.experience.filter((item) => item.role || item.company || item.description).map((item) => (
              <div key={item.id} className="space-y-1">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-bold">{[item.role, item.company].filter(Boolean).join(" - ") || "Experiência"}</h3>
                  <p className="text-xs text-slate-500">{[item.start, item.current ? "Atual" : item.end].filter(Boolean).join(" - ")}</p>
                </div>
                {item.location ? <p className="text-xs text-slate-500">{item.location}</p> : null}
                <ul className="ml-4 list-disc space-y-1 text-sm leading-6 text-slate-700">
                  {lines(item.description).map((line, index) => <li key={index}>{line}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </Section>

        {!sidebar ? (
          <Section title="Educação" color={color}>
            <div className="space-y-3">
              {data.education.filter((item) => item.degree || item.school || item.description).map((item) => (
                <div key={item.id}>
                  <h3 className="text-sm font-bold">{[item.degree, item.school].filter(Boolean).join(" - ") || "Formação"}</h3>
                  <p className="text-xs text-slate-500">{[item.location, item.start, item.end].filter(Boolean).join(" | ")}</p>
                  {item.description ? <p className="mt-1 text-sm leading-6 text-slate-700">{item.description}</p> : null}
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {!sidebar ? (
          <Section title="Habilidades" color={color}>
            <p className="text-sm leading-6 text-slate-700">{data.skills.join(" | ") || "Adicione habilidades relevantes"}</p>
          </Section>
        ) : null}
      </div>
    </article>
  );
}

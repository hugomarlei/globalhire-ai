"use client";

export type InterviewGuideOutputProps = {
  text: string;
  loading: boolean;
  skeletonLabel: string;
  emptyLabel: string;
};

function parseInterviewSections(raw: string): { title: string; body: string }[] {
  const text = raw.trim();
  if (!text) return [];

  const triple = text.split(/===\s*([^=]+?)\s*===/);
  if (triple.length >= 3) {
    const out: { title: string; body: string }[] = [];
    for (let i = 1; i < triple.length; i += 2) {
      const title = triple[i]?.trim() || "";
      const body = triple[i + 1]?.trim() || "";
      if (body) out.push({ title, body });
    }
    if (out.length) return out;
  }

  return text
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      const lines = block.split("\n");
      const head = lines[0]?.trim() || "";
      const rest = lines.slice(1).join("\n").trim();
      const looksLikeTitle =
        head.length > 0 &&
        head.length < 90 &&
        (head === head.toUpperCase() || head.endsWith(":")) &&
        rest.length > 0;

      if (looksLikeTitle) {
        return {
          title: head.replace(/:$/, ""),
          body: rest
        };
      }
      return { title: "", body: block };
    });
}

export function InterviewGuideOutput({ text, loading, skeletonLabel, emptyLabel }: InterviewGuideOutputProps) {
  if (loading) {
    return (
      <div className="space-y-3" aria-busy="true" aria-label={skeletonLabel}>
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse rounded-xl border border-border/80 bg-muted/40 p-5">
            <div className="h-4 w-2/5 rounded bg-muted" />
            <div className="mt-3 h-3 w-full rounded bg-muted" />
            <div className="mt-2 h-3 w-11/12 rounded bg-muted" />
            <div className="mt-2 h-3 w-4/5 rounded bg-muted" />
          </div>
        ))}
      </div>
    );
  }

  if (!text.trim()) {
    return (
      <div className="flex min-h-[280px] flex-col items-center justify-center rounded-xl border border-dashed border-border/90 bg-muted/25 px-6 py-10 text-center">
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">{emptyLabel}</p>
      </div>
    );
  }

  const sections = parseInterviewSections(text);

  return (
    <div className="grid gap-3 sm:grid-cols-1">
      {sections.map((section, index) => (
        <article
          key={`${section.title || "block"}-${index}`}
          className="rounded-xl border border-border/80 bg-gradient-to-b from-card/95 to-card/80 p-4 shadow-sm backdrop-blur-sm dark:border-border/60 sm:p-5"
        >
          {section.title ? (
            <h3 className="text-sm font-semibold uppercase tracking-wide text-primary">{section.title}</h3>
          ) : null}
          <div
            className={`whitespace-pre-wrap text-sm leading-relaxed text-foreground ${section.title ? "mt-3" : ""}`}
            data-clarity-mask="true"
          >
            {section.body}
          </div>
        </article>
      ))}
    </div>
  );
}

"use client";

import { Check, ChevronDown, Copy, Download, FileText, Loader2, Save, Sparkles } from "lucide-react";
import { cn } from "@/components/ui";

export function ProgressHeader({
  score,
  completeness,
  status,
  nextStep,
  items,
  action,
  sticky = false
}: {
  score: number;
  completeness: number;
  status: string;
  nextStep: string;
  items: Array<{ label: string; done: boolean }>;
  action?: React.ReactNode;
  sticky?: boolean;
}) {
  return (
    <section className={cn("overflow-hidden rounded-2xl border border-primary/15 bg-card/95 shadow-[0_18px_70px_rgba(0,0,0,0.10)] backdrop-blur-xl transition dark:border-primary/20 dark:bg-card/90 dark:shadow-[0_24px_90px_rgba(0,0,0,0.38)]", sticky && "sticky top-[72px] z-30")}>
      <div className="grid gap-4 p-4 md:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto] xl:items-center">
        <div className="flex items-center gap-3">
          <div className="relative grid size-16 place-items-center rounded-full bg-primary/10 text-primary ring-8 ring-primary/10">
            <span className="text-xl font-semibold tabular-nums">{score}</span>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{status}</p>
            <h2 className="mt-1 text-lg font-semibold tracking-tight text-foreground">Próximo passo: {nextStep}</h2>
            <div className="mt-2 h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full rounded-full bg-primary transition-all duration-700" style={{ width: `${Math.max(0, Math.min(100, completeness))}%` }} />
            </div>
          </div>
        </div>
        <div className="flex min-w-0 flex-wrap gap-2">
          {items.map((item) => (
            <span key={item.label} className={cn("inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition", item.done ? "border-primary/25 bg-primary/10 text-primary" : "border-border bg-muted/60 text-muted-foreground")}>
              {item.done ? <Check size={13} /> : <span className="size-1.5 rounded-full bg-current opacity-50" />}
              {item.label}
            </span>
          ))}
        </div>
        {action ? <div className="flex shrink-0 justify-start xl:justify-end">{action}</div> : null}
      </div>
    </section>
  );
}

export function TaskCard({
  eyebrow,
  title,
  body,
  status,
  href,
  children
}: {
  eyebrow: string;
  title: string;
  body: string;
  status: "done" | "active" | "idle";
  href?: string;
  children?: React.ReactNode;
}) {
  const content = (
    <div className={cn("group h-full rounded-2xl border bg-card p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_20px_60px_rgba(0,0,0,0.10)] dark:bg-card/80", status === "active" ? "border-primary/35" : "border-border")}>
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">{eyebrow}</p>
        <span className={cn("rounded-full px-2 py-1 text-[11px] font-semibold", status === "done" ? "bg-primary/10 text-primary" : status === "active" ? "bg-warning/15 text-warning" : "bg-muted text-muted-foreground")}>
          {status === "done" ? "Concluído" : status === "active" ? "Agora" : "Pendente"}
        </span>
      </div>
      <h3 className="mt-3 text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );

  if (!href) return content;
  return <a href={href}>{content}</a>;
}

export function AIInlineButton({ children, loading, onClick }: { children: React.ReactNode; loading?: boolean; onClick?: () => void }) {
  return (
    <button type="button" onClick={(event) => { event.preventDefault(); event.stopPropagation(); onClick?.(); }} disabled={loading} className="focus-ring inline-flex h-9 items-center gap-2 rounded-lg border border-primary/25 bg-primary/10 px-3 text-xs font-semibold text-primary transition hover:bg-primary/15 disabled:opacity-60">
      {loading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
      {children}
    </button>
  );
}

export function SectionAccordion({
  title,
  description,
  done,
  children,
  defaultOpen = true,
  actions
}: {
  title: string;
  description?: string;
  done?: boolean;
  children: React.ReactNode;
  defaultOpen?: boolean;
  actions?: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group rounded-2xl border border-border bg-card shadow-sm transition duration-200 open:shadow-[0_16px_55px_rgba(0,0,0,0.08)] dark:bg-card/85">
      <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-3 rounded-2xl px-5 py-4">
        <span className="min-w-0">
          <span className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <span className={cn("size-2 rounded-full", done ? "bg-primary" : "bg-muted-foreground/50")} />
            {title}
          </span>
          {description ? <span className="mt-1 block text-xs leading-5 text-muted-foreground">{description}</span> : null}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          {actions}
          <ChevronDown className="text-muted-foreground transition group-open:rotate-180" size={17} />
        </span>
      </summary>
      <div className="border-t border-border px-5 py-5">{children}</div>
    </details>
  );
}

export function TemplatePicker({
  value,
  items,
  onChange
}: {
  value: string;
  items: Array<{ key: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          onClick={() => onChange(item.key)}
          className={cn("focus-ring rounded-xl border p-3 text-left transition hover:border-primary/40 hover:bg-muted/50", value === item.key ? "border-primary/50 bg-primary/10" : "border-border bg-card")}
        >
          <span className="block aspect-[3/4] rounded-lg border border-border bg-gradient-to-b from-white to-slate-100 p-2 shadow-inner">
            <span className="block h-2 w-2/3 rounded bg-slate-900" />
            <span className="mt-3 block h-1.5 w-full rounded bg-slate-300" />
            <span className="mt-2 block h-1.5 w-5/6 rounded bg-slate-300" />
            <span className="mt-4 block h-1.5 w-1/2 rounded bg-primary" />
            <span className="mt-2 block h-1.5 w-full rounded bg-slate-300" />
            <span className="mt-2 block h-1.5 w-4/5 rounded bg-slate-300" />
          </span>
          <span className="mt-2 block text-xs font-semibold text-foreground">{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export function DocumentPreviewShell({ title = "Preview do documento", children }: { title?: string; children: React.ReactNode }) {
  return (
    <aside className="min-w-0 rounded-3xl border border-border bg-slate-100 p-3 shadow-[0_24px_80px_rgba(0,0,0,0.12)] dark:bg-surface-muted print:overflow-visible print:border-0 print:bg-white print:p-0 print:shadow-none">
      <div className="mb-3 flex items-center justify-between px-1 print:hidden">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Documento central</p>
          <h2 className="text-sm font-semibold text-foreground">{title}</h2>
        </div>
        <span className="rounded-full border border-border bg-card px-2 py-1 text-[11px] font-semibold text-muted-foreground">Preview real</span>
      </div>
      <div className="max-h-[calc(100vh-150px)] overflow-auto rounded-2xl print:max-h-none print:overflow-visible print:rounded-none">
        {children}
      </div>
    </aside>
  );
}

export function ExportBar({
  onSave,
  onPdf,
  onCopy,
  onTxt,
  saving
}: {
  onSave: () => void;
  onPdf: () => void;
  onCopy: () => void;
  onTxt: () => void;
  saving?: boolean;
}) {
  const action = "focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground shadow-sm transition hover:bg-muted disabled:opacity-50";
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-border bg-card/90 p-2 shadow-sm backdrop-blur">
      <button type="button" onClick={onSave} disabled={saving} className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 disabled:opacity-50">
        {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
        Salvar
      </button>
      <button type="button" onClick={onPdf} className={action}><Download size={16} /> PDF</button>
      <button type="button" onClick={onCopy} className={action}><Copy size={16} /> Copiar</button>
      <button type="button" onClick={onTxt} className={action}><FileText size={16} /> TXT</button>
    </div>
  );
}

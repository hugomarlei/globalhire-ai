"use client";

import Link from "next/link";
import { Clock, Copy, Download, FilePlus2, RefreshCw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, inputClass } from "@/components/ui";
import { useLanguage } from "@/components/language-provider";
import { dashboardCopy } from "@/lib/i18n";
import { historyListCopy, historyTypeShortLabel, intlLocaleForUi } from "@/lib/i18n-history-ats";
import { trackEvent } from "@/lib/analytics";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { buildResumePdfPrintDocument } from "@/lib/resume-pdf-templates";

type HistoryItem = {
  id: string;
  type: string;
  language: string;
  target_country: string;
  output: string;
  created_at: string;
};

export function HistoryList({ items, mode = "history" }: { items: HistoryItem[]; mode?: "history" | "documents" }) {
  const { locale } = useLanguage();
  const h = historyListCopy[locale];
  const copy = dashboardCopy[locale];
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const [regenerating, setRegenerating] = useState("");
  const [notice, setNotice] = useState("");
  const [deletedIds, setDeletedIds] = useState<string[]>([]);
  const [deleting, setDeleting] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const visibleItems = useMemo(() => items.filter((item) => !deletedIds.includes(item.id)), [deletedIds, items]);
  const types = useMemo(() => Array.from(new Set(visibleItems.map((item) => item.type))), [visibleItems]);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return visibleItems.filter((item) => {
      const matchesFilter = filter === "all" || item.type === filter;
      const searchable = `${item.type} ${item.language} ${item.target_country} ${item.output}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, query, visibleItems]);

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1800);
  }

  async function regenerate(id: string) {
    setRegenerating(id);
    setNotice("");
    const response = await fetch("/api/ai/regenerate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generationId: id, turnstileToken })
    });
    const data = await response.json().catch(() => ({}));
    setRegenerating("");
    setCaptchaReset((current) => current + 1);

    if (!response.ok) {
      setNotice(data.error || h.regenerateFail);
      return;
    }

    trackEvent("document_regenerated");
    setNotice(h.regenerateSuccess);
  }

  async function deleteItem(id: string) {
    const confirmed = window.confirm(h.deleteConfirm);
    if (!confirmed) return;

    setDeleting(id);
    setNotice("");

    const response = await fetch("/api/documents/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ generationId: id })
    });
    const data = await response.json().catch(() => ({}));
    setDeleting("");

    if (!response.ok) {
      setNotice(data.error || h.deleteFail);
      return;
    }

    setDeletedIds((current) => [...current, id]);
    setNotice(h.deleteSuccess);
  }

  function exportPdf(item: HistoryItem) {
    const text = (item.output || "").trim();
    if (!text) return;
    const html = buildResumePdfPrintDocument({
      template: "executive",
      title: historyTypeShortLabel(locale, item.type),
      body: text
    });
    const iframe = document.createElement("iframe");
    iframe.setAttribute("aria-hidden", "true");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    document.body.appendChild(iframe);

    const doc = iframe.contentDocument;
    const win = iframe.contentWindow;
    if (!doc || !win) {
      iframe.remove();
      return;
    }
    doc.open();
    doc.write(html);
    doc.close();
    const cleanup = () => iframe.remove();
    win.addEventListener("afterprint", cleanup, { once: true });
    window.setTimeout(cleanup, 120_000);
    requestAnimationFrame(() => {
      win.focus();
      win.print();
    });
  }

  const dateLocale = intlLocaleForUi(locale);

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-card p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">{mode === "history" ? h.titleHistory : h.titleDocuments}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{mode === "history" ? h.leadHistory : h.leadDocuments}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/historico"
            className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${mode === "history" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Clock size={16} />
            {h.tabHistory}
          </Link>
          {mode === "history" ? (
            <Button href="/gerador" className="bg-primary text-primary-foreground hover:brightness-105">
              <FilePlus2 size={17} />
              {h.createNew}
            </Button>
          ) : null}
        </div>
      </div>

      <Card className="rounded-xl p-3 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
            <input data-clarity-mask="true" className={`${inputClass} h-10 min-h-10 pl-10`} value={query} onChange={(event) => setQuery(event.target.value)} placeholder={h.searchPlaceholder} />
          </label>
          <div className="flex max-w-full gap-2 overflow-x-auto">
            <button
              type="button"
              onClick={() => setFilter("all")}
              className={`focus-ring shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold ${filter === "all" ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {h.filterAll}
            </button>
            {types.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setFilter(type)}
                className={`focus-ring shrink-0 rounded-md px-3 py-1.5 text-xs font-semibold ${filter === type ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}
              >
                {historyTypeShortLabel(locale, type)}
              </button>
            ))}
          </div>
        </div>
        {mode === "documents" ? <div className="mt-3">
          <TurnstileWidget action="regenerate" onVerify={setTurnstileToken} resetSignal={captchaReset} />
        </div> : null}
      </Card>
      {notice ? <p className="rounded-md border border-border bg-card p-3 text-sm text-card-foreground">{notice}</p> : null}

      <div className={mode === "documents" ? "grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3" : "relative grid gap-0 border-l border-border pl-4"}>
        {filtered.map((item) => (
          <Card key={item.id} className={mode === "history" ? "relative mb-3 h-fit min-h-0 w-full min-w-0 self-start rounded-xl p-0 shadow-sm before:absolute before:-left-[23px] before:top-5 before:size-3 before:rounded-full before:border-2 before:border-background before:bg-primary" : "h-fit min-h-0 w-full min-w-0 self-start p-0"}>
            <div className={mode === "history" ? "grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-start" : "grid gap-4 p-4"}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-foreground">{historyTypeShortLabel(locale, item.type)}</h2>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{item.language}</span>
                  <span className="rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">{item.target_country}</span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(item.created_at).toLocaleString(dateLocale)}</p>
                <p data-clarity-mask="true" className={`${mode === "documents" ? "line-clamp-4" : "line-clamp-2"} mt-3 text-sm leading-6 text-muted-foreground`}>
                  {item.output}
                </p>
              </div>
              <div className={mode === "history" ? "flex flex-wrap gap-1.5 lg:justify-end" : "flex flex-wrap gap-2"}>
                <button type="button" onClick={() => copyText(item.id, item.output)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted">
                  <Copy size={16} />
                  {copied === item.id ? h.copied : h.copy}
                </button>
                {!(item.output || "").trim() ? (
                  <button
                    type="button"
                    disabled
                    title={copy.historyExportUnavailable}
                    className="focus-ring inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-muted-foreground opacity-50"
                  >
                    <Download size={16} />
                    {copy.historyDownloadText}
                  </button>
                ) : (
                  <button type="button" onClick={() => exportPdf(item)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted">
                    <Download size={16} />
                    {copy.historyDownloadText}
                  </button>
                )}
                {mode === "documents" ? (
                  <button type="button" onClick={() => regenerate(item.id)} disabled={regenerating === item.id} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-50">
                  <RefreshCw className={regenerating === item.id ? "animate-spin" : ""} size={16} />
                  {regenerating === item.id ? h.regenerating : h.regenerate}
                  </button>
                ) : null}
                <button type="button" onClick={() => deleteItem(item.id)} disabled={deleting === item.id} className="focus-ring inline-flex items-center gap-2 rounded-md border border-red-400/30 px-3 py-2 text-sm text-red-700 hover:bg-red-500/10 disabled:opacity-50 dark:border-red-400/20 dark:text-red-100 dark:hover:bg-red-500/10">
                  <Trash2 size={16} />
                  {deleting === item.id ? h.deleting : h.delete}
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
      {!filtered.length ? (
        <Card>
          <div className="grid place-items-center gap-3 py-8 text-center">
            <FilePlus2 className="text-brand-500" size={34} />
            <h2 className="text-xl font-semibold text-foreground">{h.emptyTitle}</h2>
            <p className="max-w-md text-sm text-muted-foreground">{h.emptyBody}</p>
            <Button href="/gerador" className="bg-primary text-primary-foreground hover:brightness-105">
              {h.emptyCta}
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

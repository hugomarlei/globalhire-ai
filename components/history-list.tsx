"use client";

import Link from "next/link";
import { Clock, Copy, Download, Eye, FilePlus2, FolderOpen, RefreshCw, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, inputClass } from "@/components/ui";
import { useLanguage } from "@/components/language-provider";
import { dashboardCopy } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import { TurnstileWidget } from "@/components/turnstile-widget";

type HistoryItem = {
  id: string;
  type: string;
  language: string;
  target_country: string;
  output: string;
  created_at: string;
};

const typeLabels: Record<string, string> = {
  ats_resume: "Currículos",
  cover_letter: "Cartas",
  linkedin_summary: "LinkedIn",
  recruiter_message: "Recrutadores",
  interview_prep: "Entrevista",
  translate_resume: "Tradução"
};

export function HistoryList({ items, mode = "history" }: { items: HistoryItem[]; mode?: "history" | "documents" }) {
  const { locale } = useLanguage();
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
  /** Per-item expansion (avoids native <details name> mutual-exclusion quirks in grids). */
  const [docOpenById, setDocOpenById] = useState<Record<string, boolean>>({});
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
      setNotice(data.error || "Não consegui regenerar este documento agora.");
      return;
    }

    trackEvent("document_regenerated");
    setNotice("Nova versão gerada e salva no histórico. Atualize a página para vê-la na lista.");
  }

  async function deleteItem(id: string) {
    const confirmed = window.confirm("Excluir este documento do histórico? Esta ação remove a geração salva e não pode ser desfeita.");
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
      setNotice(data.error || "Não consegui excluir este documento agora.");
      return;
    }

    setDeletedIds((current) => [...current, id]);
    setNotice("Documento excluído do seu histórico.");
  }

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-lg border border-graphite/15 bg-graphite/[0.05] p-4 dark:border-white/10 dark:bg-graphite/35 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-ink dark:text-white">{mode === "history" ? "Histórico" : "Meus documentos"}</h1>
          <p className="mt-1 text-sm text-graphite/60 dark:text-white/55">
            {mode === "history"
              ? "Linha do tempo de todas as gerações realizadas, com data, idioma, país e ações rápidas."
              : "Biblioteca organizada dos documentos finais, com busca, filtros e ações de arquivo."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/historico" className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${mode === "history" ? "bg-brand-500 text-ink" : "border border-graphite/20 text-graphite/75 hover:bg-graphite/10 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8"}`}>
            <Clock size={16} />
            Histórico
          </Link>
          <Link href="/historico?tab=documentos" className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${mode === "documents" ? "bg-brand-500 text-ink" : "border border-graphite/20 text-graphite/75 hover:bg-graphite/10 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8"}`}>
            <FolderOpen size={16} />
            Meus documentos
          </Link>
          <Button href="/gerador" className="bg-brand-500 text-ink hover:bg-brand-600">
            <FilePlus2 size={17} />
            Criar novo
          </Button>
        </div>
      </div>

      <Card>
        <div className="grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/40 dark:text-white/35" size={17} />
            <input
              data-clarity-mask="true"
              className={`${inputClass} pl-10`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por tipo, idioma, país ou conteúdo"
            />
          </label>
          <div className="flex max-w-full gap-2 overflow-x-auto">
            <button onClick={() => setFilter("all")} className={`focus-ring shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${filter === "all" ? "bg-brand-500 text-ink" : "border border-graphite/20 text-graphite/75 hover:bg-graphite/10 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8"}`}>
              Todos
            </button>
            {types.map((type) => (
              <button key={type} onClick={() => setFilter(type)} className={`focus-ring shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${filter === type ? "bg-brand-500 text-ink" : "border border-graphite/20 text-graphite/75 hover:bg-graphite/10 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/8"}`}>
                {typeLabels[type] || type}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <TurnstileWidget action="regenerate" onVerify={setTurnstileToken} resetSignal={captchaReset} />
        </div>
      </Card>
      {notice ? <p className="rounded-md border border-graphite/15 bg-graphite/[0.06] p-3 text-sm text-graphite/80 dark:border-white/10 dark:bg-graphite/30 dark:text-white/75">{notice}</p> : null}

      <div className={mode === "documents" ? "grid items-start gap-3 md:grid-cols-2 xl:grid-cols-3" : "grid gap-3"}>
        {filtered.map((item) => (
          <Card key={item.id} className={`h-fit min-h-0 w-full min-w-0 self-start p-0`}>
            <div className={mode === "history" ? "grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-start" : "grid gap-4 p-4"}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold text-ink dark:text-white">{typeLabels[item.type] || item.type}</h2>
                  <span className="rounded-full bg-graphite/10 px-2 py-1 text-xs text-graphite/65 dark:bg-white/8 dark:text-white/55">{item.language}</span>
                  <span className="rounded-full bg-graphite/10 px-2 py-1 text-xs text-graphite/65 dark:bg-white/8 dark:text-white/55">{item.target_country}</span>
                </div>
                <p className="mt-1 text-xs text-graphite/50 dark:text-white/40">{new Date(item.created_at).toLocaleString("pt-BR")}</p>
                <p data-clarity-mask="true" className={`${mode === "documents" ? "line-clamp-4" : "line-clamp-2"} mt-3 text-sm leading-6 text-graphite/65 dark:text-white/55`}>{item.output}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copyText(item.id, item.output)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-graphite/20 px-3 py-2 text-sm text-graphite/80 hover:bg-graphite/10 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10">
                  <Copy size={16} />
                  {copied === item.id ? "Copiado" : "Copiar"}
                </button>
                {!(item.output || "").trim() ? (
                  <button
                    type="button"
                    disabled
                    title={copy.historyExportUnavailable}
                    className="focus-ring inline-flex cursor-not-allowed items-center gap-2 rounded-md border border-graphite/15 px-3 py-2 text-sm text-graphite/40 dark:border-white/10 dark:text-white/40"
                  >
                    <Download size={16} />
                    {copy.historyDownloadText}
                  </button>
                ) : (
                  <a
                    href={`/api/history/${item.id}/export`}
                    download
                    rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-2 rounded-md border border-graphite/20 px-3 py-2 text-sm text-graphite/80 hover:bg-graphite/10 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10"
                  >
                    <Download size={16} />
                    {copy.historyDownloadText}
                  </a>
                )}
                <button onClick={() => regenerate(item.id)} disabled={regenerating === item.id} className="focus-ring inline-flex items-center gap-2 rounded-md border border-graphite/20 px-3 py-2 text-sm text-graphite/80 hover:bg-graphite/10 disabled:opacity-50 dark:border-white/10 dark:text-white/80 dark:hover:bg-white/10">
                  <RefreshCw className={regenerating === item.id ? "animate-spin" : ""} size={16} />
                  {regenerating === item.id ? "Regenerando..." : "Regenerar"}
                </button>
                <button onClick={() => deleteItem(item.id)} disabled={deleting === item.id} className="focus-ring inline-flex items-center gap-2 rounded-md border border-red-400/30 px-3 py-2 text-sm text-red-700 hover:bg-red-500/10 disabled:opacity-50 dark:border-red-400/20 dark:text-red-100 dark:hover:bg-red-500/10">
                  <Trash2 size={16} />
                  {deleting === item.id ? "Excluindo..." : "Excluir"}
                </button>
              </div>
            </div>
            <div className="min-h-0 border-t border-graphite/15 px-4 py-3 dark:border-white/10">
              <button
                type="button"
                className="focus-ring inline-flex w-full cursor-pointer items-center gap-2 rounded-md px-1 py-2 text-left text-sm font-semibold text-graphite/80 hover:bg-graphite/10 hover:text-ink dark:text-white/80 dark:hover:bg-white/[0.06] dark:hover:text-white"
                aria-expanded={Boolean(docOpenById[item.id])}
                onClick={() =>
                  setDocOpenById((prev) => ({
                    ...prev,
                    [item.id]: !prev[item.id]
                  }))
                }
              >
                <Eye size={16} className="shrink-0 opacity-90" aria-hidden />
                Abrir documento
              </button>
              {docOpenById[item.id] ? (
                <pre
                  data-clarity-mask="true"
                  className="mt-3 max-h-72 min-h-0 overflow-y-auto overflow-x-auto whitespace-pre-wrap rounded-md border border-graphite/20 bg-[#eef2ef] p-4 text-sm leading-6 text-ink dark:border-white/10 dark:bg-[#0b100e] dark:text-white/90"
                >
                  {item.output}
                </pre>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
      {!filtered.length ? (
        <Card>
          <div className="grid place-items-center gap-3 py-8 text-center">
            <FilePlus2 className="text-brand-500" size={34} />
            <h2 className="text-xl font-semibold text-ink dark:text-white">Nenhum documento encontrado</h2>
            <p className="max-w-md text-sm text-graphite/60 dark:text-white/55">Crie uma versão otimizada ou ajuste os filtros para encontrar documentos anteriores.</p>
            <Button href="/gerador" className="bg-brand-500 text-ink hover:bg-brand-600">Criar documento</Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { Clock, Copy, Download, Eye, FilePlus2, FolderOpen, RefreshCw, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, inputClass } from "@/components/ui";
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

function downloadText(item: HistoryItem) {
  const blob = new Blob([item.output], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `globalhire-${item.type}-${item.id}.txt`;
  link.click();
  URL.revokeObjectURL(url);
}

export function HistoryList({ items, mode = "history" }: { items: HistoryItem[]; mode?: "history" | "documents" }) {
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState("");
  const [regenerating, setRegenerating] = useState("");
  const [notice, setNotice] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const types = useMemo(() => Array.from(new Set(items.map((item) => item.type))), [items]);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesFilter = filter === "all" || item.type === filter;
      const searchable = `${item.type} ${item.language} ${item.target_country} ${item.output}`.toLowerCase();
      return matchesFilter && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [filter, items, query]);

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

  return (
    <div className="grid gap-5">
      <div className="flex flex-col gap-4 rounded-lg border border-white/10 bg-white/5 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">{mode === "history" ? "Histórico" : "Meus documentos"}</h1>
          <p className="mt-1 text-sm text-white/55">
            {mode === "history"
              ? "Linha do tempo de todas as gerações realizadas, com data, idioma, país e ações rápidas."
              : "Biblioteca organizada dos documentos finais, com busca, filtros e ações de arquivo."}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/historico" className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${mode === "history" ? "bg-brand-500 text-ink" : "border border-white/10 text-white/70 hover:bg-white/8"}`}>
            <Clock size={16} />
            Histórico
          </Link>
          <Link href="/historico?tab=documentos" className={`focus-ring inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold ${mode === "documents" ? "bg-brand-500 text-ink" : "border border-white/10 text-white/70 hover:bg-white/8"}`}>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35" size={17} />
            <input
              data-clarity-mask="true"
              className={`${inputClass} pl-10`}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar por tipo, idioma, país ou conteúdo"
            />
          </label>
          <div className="flex max-w-full gap-2 overflow-x-auto">
            <button onClick={() => setFilter("all")} className={`focus-ring shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${filter === "all" ? "bg-brand-500 text-ink" : "border border-white/10 text-white/70 hover:bg-white/8"}`}>
              Todos
            </button>
            {types.map((type) => (
              <button key={type} onClick={() => setFilter(type)} className={`focus-ring shrink-0 rounded-md px-3 py-2 text-sm font-semibold ${filter === type ? "bg-brand-500 text-ink" : "border border-white/10 text-white/70 hover:bg-white/8"}`}>
                {typeLabels[type] || type}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4">
          <TurnstileWidget action="regenerate" onVerify={setTurnstileToken} resetSignal={captchaReset} />
        </div>
      </Card>
      {notice ? <p className="rounded-md border border-white/10 bg-white/5 p-3 text-sm text-white/70">{notice}</p> : null}

      <div className={mode === "documents" ? "grid gap-3 md:grid-cols-2 xl:grid-cols-3" : "grid gap-3"}>
        {filtered.map((item) => (
          <Card key={item.id} className={`p-0 ${mode === "history" ? "" : "flex flex-col"}`}>
            <div className={mode === "history" ? "grid gap-4 p-4 lg:grid-cols-[1fr_auto] lg:items-start" : "grid flex-1 gap-4 p-4"}>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-semibold">{typeLabels[item.type] || item.type}</h2>
                  <span className="rounded-full bg-white/8 px-2 py-1 text-xs text-white/55">{item.language}</span>
                  <span className="rounded-full bg-white/8 px-2 py-1 text-xs text-white/55">{item.target_country}</span>
                </div>
                <p className="mt-1 text-xs text-white/40">{new Date(item.created_at).toLocaleString("pt-BR")}</p>
                <p data-clarity-mask="true" className={`${mode === "documents" ? "line-clamp-4" : "line-clamp-2"} mt-3 text-sm leading-6 text-white/55`}>{item.output}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => copyText(item.id, item.output)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">
                  <Copy size={16} />
                  {copied === item.id ? "Copiado" : "Copiar"}
                </button>
                <button onClick={() => downloadText(item)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">
                  <Download size={16} />
                  Baixar
                </button>
                <button onClick={() => regenerate(item.id)} disabled={regenerating === item.id} className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10 disabled:opacity-50">
                  <RefreshCw className={regenerating === item.id ? "animate-spin" : ""} size={16} />
                  {regenerating === item.id ? "Regenerando..." : "Regenerar"}
                </button>
              </div>
            </div>
            <details className="border-t border-white/10 px-4 py-3">
              <summary className="focus-ring inline-flex cursor-pointer list-none items-center gap-2 rounded-md px-1 py-1 text-sm font-semibold text-white/75 hover:text-white">
                <Eye size={16} />
                Abrir documento
              </summary>
              <pre data-clarity-mask="true" className="mt-3 max-h-80 overflow-auto whitespace-pre-wrap rounded-md bg-black/25 p-4 text-sm leading-6 text-white/78">{item.output}</pre>
            </details>
          </Card>
        ))}
      </div>
      {!filtered.length ? (
        <Card>
          <div className="grid place-items-center gap-3 py-8 text-center">
            <FilePlus2 className="text-brand-500" size={34} />
            <h2 className="text-xl font-semibold">Nenhum documento encontrado</h2>
            <p className="max-w-md text-sm text-white/55">Crie uma versão otimizada ou ajuste os filtros para encontrar documentos anteriores.</p>
            <Button href="/gerador" className="bg-brand-500 text-ink hover:bg-brand-600">Criar documento</Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

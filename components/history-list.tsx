"use client";

import Link from "next/link";
import { Copy, RefreshCw } from "lucide-react";
import { useMemo, useState } from "react";
import { Card, inputClass } from "@/components/ui";

type HistoryItem = {
  id: string;
  type: string;
  language: string;
  target_country: string;
  output: string;
  created_at: string;
};

export function HistoryList({ items }: { items: HistoryItem[] }) {
  const [filter, setFilter] = useState("all");
  const [copied, setCopied] = useState("");
  const types = useMemo(() => Array.from(new Set(items.map((item) => item.type))), [items]);
  const filtered = filter === "all" ? items : items.filter((item) => item.type === filter);

  async function copyText(id: string, text: string) {
    await navigator.clipboard.writeText(text);
    setCopied(id);
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Histórico</h1>
          <p className="mt-1 text-sm text-white/55">Revise documentos gerados, copie resultados e gere novas versões.</p>
        </div>
        <select className={`${inputClass} max-w-xs`} value={filter} onChange={(event) => setFilter(event.target.value)}>
          <option value="all">Todos os tipos</option>
          {types.map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
      </div>

      {filtered.map((item) => (
        <Card key={item.id}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{item.type}</h2>
              <p className="mt-1 text-sm text-white/50">{item.language} - {item.target_country}</p>
              <p className="mt-1 text-xs text-white/40">{new Date(item.created_at).toLocaleString("pt-BR")}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => copyText(item.id, item.output)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">
                <Copy size={16} />
                {copied === item.id ? "Copiado" : "Copiar"}
              </button>
              <Link href="/dashboard" className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">
                <RefreshCw size={16} />
                Regenerar
              </Link>
            </div>
          </div>
          <p className="mt-4 line-clamp-2 text-sm leading-6 text-white/55">{item.output}</p>
          <details className="mt-4">
            <summary className="focus-ring inline-flex cursor-pointer rounded-md border border-white/10 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10">
              Abrir documento
            </summary>
            <pre className="mt-4 max-h-72 overflow-auto whitespace-pre-wrap rounded-md bg-black/25 p-4 text-sm leading-6 text-white/78">{item.output}</pre>
          </details>
        </Card>
      ))}
      {!filtered.length ? <Card>Nenhum documento encontrado para este filtro.</Card> : null}
    </div>
  );
}

"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, Copy, FileClock, FileUp, Loader2, RefreshCw, SearchCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, Field, textareaClass } from "@/components/ui";

const stopWords = new Set([
  "and", "or", "the", "with", "for", "para", "com", "uma", "um", "que", "de", "da", "do", "em", "a", "o",
  "remote", "job", "role", "experience", "years", "work", "team", "teams", "vaga", "cargo", "empresa"
]);

function extractKeywords(value: string) {
  const matches = value
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s.+#-]/gu, " ")
    .split(/\s+/)
    .map((item) => item.trim())
    .filter((item) => item.length > 3 && !stopWords.has(item));

  const counts = new Map<string, number>();
  matches.forEach((item) => counts.set(item, (counts.get(item) || 0) + 1));

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([keyword]) => keyword);
}

export function AtsAnalyzer({ mode = "score" }: { mode?: "score" | "keywords" }) {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedOutput, setOptimizedOutput] = useState("");
  const [optimizationError, setOptimizationError] = useState("");
  const [copied, setCopied] = useState(false);
  const isKeywordMode = mode === "keywords";

  const analysis = useMemo(() => {
    const keywords = extractKeywords(jobDescription);
    const resumeLower = resume.toLowerCase();
    const found = keywords.filter((keyword) => resumeLower.includes(keyword));
    const missing = keywords.filter((keyword) => !resumeLower.includes(keyword));
    const match = keywords.length ? Math.round((found.length / keywords.length) * 100) : 0;
    const structureScore = ["experience", "skills", "education", "summary", "certifications", "experiência", "habilidades", "formação"].filter((term) =>
      resumeLower.includes(term)
    ).length;
    const score = Math.min(98, Math.round(match * 0.72 + structureScore * 5 + (resume.length > 1800 ? 8 : 0)));

    return {
      score,
      match,
      found,
      missing,
      recommendations: [
        missing.length ? `Inclua palavras-chave reais da vaga como ${missing.slice(0, 5).join(", ")} quando forem verdadeiras para sua experiência.` : "As principais palavras-chave da vaga já aparecem no currículo.",
        resume.length < 1800 ? "O currículo parece curto. Adicione mais contexto, escopo, ferramentas e impacto nas experiências relevantes." : "A densidade do currículo está boa para análise ATS.",
        score < 80 ? "Gere uma versão otimizada para elevar clareza, senioridade e alinhamento com a vaga." : "Seu currículo está competitivo. Faça ajustes finos por vaga antes de aplicar."
      ]
    };
  }, [resume, jobDescription]);

  async function upload(file: File | null) {
    if (!file) return;
    setLoadingUpload(true);
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload/parse", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setUploadMessage(data.error || "Não consegui ler o arquivo. Se for PDF escaneado, cole o texto manualmente.");
        return;
      }

      setResume(data.text);
      setUploadMessage(`Currículo importado com sucesso: ${Math.round(data.text.length / 100) / 10} mil caracteres extraídos.`);
    } catch {
      setUploadMessage("Não consegui concluir o upload. Tente novamente ou cole o currículo manualmente.");
    } finally {
      setLoadingUpload(false);
    }
  }

  async function optimizeFromScore() {
    setOptimizing(true);
    setOptimizationError("");
    setOptimizedOutput("");

    const response = await fetch("/api/ai/optimize-from-score", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume,
        jobDescription,
        score: analysis.score,
        match: analysis.match,
        found: analysis.found,
        missing: analysis.missing,
        recommendations: analysis.recommendations,
        language: "Português do Brasil",
        targetCountry: "Estados Unidos"
      })
    });

    const data = await response.json().catch(() => ({}));
    setOptimizing(false);

    if (!response.ok) {
      setOptimizationError(data.error || "Não consegui gerar a versão otimizada agora.");
      return;
    }

    setOptimizedOutput(data.output);
  }

  async function copyOutput() {
    if (!optimizedOutput) return;
    await navigator.clipboard.writeText(optimizedOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-white/10 bg-white/5 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">{isKeywordMode ? "Análise de Palavras-chave" : "ATS Score"}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
              {isKeywordMode
                ? "Veja quais termos da vaga já aparecem no currículo e quais lacunas podem reduzir sua compatibilidade."
                : "Compare seu currículo com uma vaga, veja compatibilidade, palavras-chave e gere uma versão otimizada na própria tela."}
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/ats-score" className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold ${!isKeywordMode ? "bg-brand-500 text-ink" : "border border-white/10 text-white/70"}`}>ATS Score</Link>
            <Link href="/ats-score?modo=keywords#keywords" className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold ${isKeywordMode ? "bg-brand-500 text-ink" : "border border-white/10 text-white/70"}`}>Palavras-chave</Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <div className="flex items-center gap-2">
            <SearchCheck className="text-brand-500" size={22} />
            <h2 className="text-2xl font-semibold">{isKeywordMode ? "Comparador de keywords" : "Analisador ATS"}</h2>
          </div>
          <p className="mt-3 rounded-md border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/50">
            O ATS Score é uma estimativa para orientar melhorias. Ele não garante aprovação, entrevista ou resposta de recrutadores.
          </p>
          <div className="mt-6 grid gap-4">
            <Field label="Upload PDF ou DOCX">
              <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-brand-500/40 bg-brand-500/10 p-4 text-sm text-brand-50 hover:bg-brand-500/15">
                {loadingUpload ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
                {loadingUpload ? "Lendo arquivo..." : "Selecionar currículo"}
                <input className="hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => upload(event.target.files?.[0] || null)} />
              </label>
            </Field>
            {uploadMessage ? <p className="text-sm text-white/60">{uploadMessage}</p> : null}
            <Field label="Ou cole o currículo">
              <textarea className={textareaClass} value={resume} onChange={(event) => setResume(event.target.value)} placeholder="Cole seu currículo completo aqui." />
            </Field>
            <Field label="Descrição da vaga">
              <textarea className={textareaClass} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder="Cole a descrição da vaga para comparar score e palavras-chave." />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <div className="grid place-items-center rounded-lg border border-white/10 bg-black/25 p-6">
              <div className="grid size-40 place-items-center rounded-full border-[10px] border-brand-500/25 bg-brand-500/10">
                <div className="text-center">
                  <p className="text-5xl font-semibold text-brand-500">{analysis.score}</p>
                  <p className="text-sm text-white/55">ATS Score</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Match com a vaga</span>
                  <span className="font-semibold text-brand-500">{analysis.match}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-brand-500" style={{ width: `${analysis.match}%` }} />
                </div>
              </div>
              <div id="keywords" className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/5 p-4">
                  <h2 className="font-semibold">Keywords encontradas</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.found.slice(0, 12).map((keyword) => <span key={keyword} className="rounded-md bg-brand-500/15 px-2 py-1 text-xs text-brand-50">{keyword}</span>)}
                    {!analysis.found.length ? <p className="text-sm text-white/50">Cole uma vaga para analisar.</p> : null}
                  </div>
                </div>
                <div className="rounded-md border border-white/10 bg-white/5 p-4">
                  <h2 className="font-semibold">Keywords ausentes</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.missing.slice(0, 12).map((keyword) => <span key={keyword} className="rounded-md bg-coral/15 px-2 py-1 text-xs text-coral">{keyword}</span>)}
                    {!analysis.missing.length ? <p className="text-sm text-white/50">Nenhuma lacuna crítica detectada.</p> : null}
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-white/10 bg-white/5 p-4">
                <h2 className="flex items-center gap-2 font-semibold"><Sparkles className="text-brand-500" size={18} /> Recomendações</h2>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/70">
                  {analysis.recommendations.map((item) => <li key={item} className="flex gap-2"><CheckCircle2 className="mt-1 shrink-0 text-brand-500" size={15} /> {item}</li>)}
                </ul>
              </div>
              {optimizationError ? (
                <div className="rounded-md bg-coral/15 p-3 text-sm text-coral">
                  <p className="flex items-center gap-2"><AlertTriangle size={16} /> {optimizationError}</p>
                  {optimizationError.toLowerCase().includes("limite") ? <Button href="/assinatura#planos" className="mt-3 bg-brand-500 text-ink hover:bg-brand-600">Ver planos</Button> : null}
                </div>
              ) : null}
              <Button onClick={optimizeFromScore} disabled={optimizing || resume.length < 100 || jobDescription.length < 40} className="bg-brand-500 text-ink hover:bg-brand-600">
                {optimizing ? <Loader2 className="animate-spin" size={17} /> : <Sparkles size={17} />}
                {optimizing ? "Otimizando currículo..." : "Criar versão otimizada"}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold">Currículo otimizado pelo ATS Score</h2>
            <p className="mt-1 text-sm text-white/55">A versão gerada aqui é salva automaticamente no histórico.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={copyOutput} disabled={!optimizedOutput} className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 disabled:opacity-40">
              <Copy size={16} />
              {copied ? "Copiado" : "Copiar"}
            </button>
            <button onClick={optimizeFromScore} disabled={optimizing || resume.length < 100 || jobDescription.length < 40} className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 disabled:opacity-40">
              <RefreshCw size={16} />
              Gerar novamente
            </button>
            <Link href="/historico" className="focus-ring inline-flex items-center gap-2 rounded-md border border-white/10 px-3 py-2 text-sm text-white/80 hover:bg-white/10">
              <FileClock size={16} />
              Salvo no histórico
            </Link>
          </div>
        </div>
        <pre className="mt-5 min-h-72 whitespace-pre-wrap rounded-md border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/82">
          {optimizing ? "Gerando uma versão otimizada com base no score, keywords e recomendações..." : optimizedOutput || "Depois da análise, clique em Criar versão otimizada para ver o currículo reescrito aqui."}
        </pre>
      </Card>
    </div>
  );
}

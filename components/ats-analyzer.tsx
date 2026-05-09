"use client";

import { FileUp, Loader2, SearchCheck, Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { Button, Card, Field, inputClass, textareaClass } from "@/components/ui";

const stopWords = new Set([
  "and", "or", "the", "with", "for", "para", "com", "uma", "um", "que", "de", "da", "do", "em", "a", "o",
  "remote", "job", "role", "experience", "years", "work", "team", "teams"
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

export function AtsAnalyzer() {
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const analysis = useMemo(() => {
    const keywords = extractKeywords(jobDescription);
    const resumeLower = resume.toLowerCase();
    const found = keywords.filter((keyword) => resumeLower.includes(keyword));
    const missing = keywords.filter((keyword) => !resumeLower.includes(keyword));
    const match = keywords.length ? Math.round((found.length / keywords.length) * 100) : 0;
    const structureScore = ["experience", "skills", "education", "summary", "certifications"].filter((term) =>
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

    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/upload/parse", { method: "POST", body: formData });
    const data = await response.json();
    setLoadingUpload(false);

    if (!response.ok) {
      setUploadMessage(data.error || "Não consegui ler o arquivo.");
      return;
    }

    setResume(data.text);
    setUploadMessage("Currículo importado com sucesso.");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
      <Card>
        <div className="flex items-center gap-2">
          <SearchCheck className="text-brand-500" size={22} />
          <h1 className="text-2xl font-semibold">ATS Score</h1>
        </div>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Compare seu currículo com uma vaga e veja palavras-chave, match e recomendações antes de aplicar.
        </p>
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
            <textarea className={textareaClass} value={resume} onChange={(event) => setResume(event.target.value)} />
          </Field>
          <Field label="Descrição da vaga">
            <textarea className={textareaClass} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} />
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
                {analysis.recommendations.map((item) => <li key={item}>• {item}</li>)}
              </ul>
            </div>
            <Button href="/dashboard" className="bg-brand-500 text-white hover:bg-brand-600">Gerar versão otimizada</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

"use client";

import { AlertTriangle, CheckCircle2, Download, FileUp, Loader2, Save, SearchCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Field, cn, textareaClass } from "@/components/ui";
import { DocumentPreviewShell } from "@/components/application-workspace";
import { ResumePreview } from "@/components/resumes/resume-preview";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/components/language-provider";
import { locales } from "@/lib/i18n";
import { atsAnalyzerCopy, buildAtsRecommendations, outputLanguageLabelForApi } from "@/lib/i18n-history-ats";
import { targetCountryCanonicalSet } from "@/lib/target-countries";
import { defaultResumeData, normalizeResumeData, resumeColors, resumeTemplates } from "@/lib/resumes/defaults";
import { importResumeText } from "@/lib/resumes/import";
import type { ResumeData } from "@/lib/resumes/types";
import { buildStructuredResumePdfPrintDocument } from "@/lib/resume-pdf-templates";

const stopWords = new Set([
  "and",
  "or",
  "the",
  "with",
  "for",
  "para",
  "com",
  "uma",
  "um",
  "que",
  "de",
  "da",
  "do",
  "em",
  "a",
  "o",
  "remote",
  "job",
  "role",
  "experience",
  "years",
  "work",
  "team",
  "teams",
  "vaga",
  "cargo",
  "empresa"
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
  const { locale } = useLanguage();
  const a = atsAnalyzerCopy[locale];
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedOutput, setOptimizedOutput] = useState("");
  const [optimizedResumeData, setOptimizedResumeData] = useState<ResumeData | null>(null);
  const [optimizationError, setOptimizationError] = useState("");
  const [savingHistory, setSavingHistory] = useState(false);
  const [savedHistory, setSavedHistory] = useState(false);
  const [historyError, setHistoryError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const [apiLanguage, setApiLanguage] = useState(() => outputLanguageLabelForApi("pt-BR"));
  const [apiTargetCountry, setApiTargetCountry] = useState("Estados Unidos");
  const [template, setTemplate] = useState<ResumeData["template"]>("professional");
  const [primaryColor, setPrimaryColor] = useState(resumeColors[0]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("globalhire-preferences");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const lang = parsed.language;
      if (typeof lang === "string" && locales.some((l) => l.outputLabel === lang)) {
        setApiLanguage(lang);
      }
      const tc = parsed.targetCountry;
      if (typeof tc === "string" && targetCountryCanonicalSet.has(tc)) {
        setApiTargetCountry(tc);
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    setApiLanguage(outputLanguageLabelForApi(locale));
  }, [locale]);

  const isKeywordMode = mode === "keywords";
  const previewData = useMemo(() => {
    const base = {
      ...defaultResumeData(),
      language: apiLanguage,
      targetJobDescription: jobDescription,
      template,
      primaryColor
    };
    const data = optimizedResumeData || importResumeText(optimizedOutput || resume, base);
    return normalizeResumeData({
      ...data,
      language: apiLanguage,
      targetJobDescription: jobDescription,
      template,
      primaryColor
    });
  }, [apiLanguage, jobDescription, optimizedOutput, optimizedResumeData, primaryColor, resume, template]);

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
      recommendations: buildAtsRecommendations(locale, { missing, resumeLen: resume.length, score })
    };
  }, [resume, jobDescription, locale]);

  async function upload(file: File | null) {
    if (!file) return;
    setLoadingUpload(true);
    setUploadMessage("");
    setOptimizedOutput("");
    setOptimizedResumeData(null);
    setSavedHistory(false);
    setHistoryError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/upload/parse", { method: "POST", body: formData });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setUploadMessage(data.error || a.uploadErrorGeneric);
        return;
      }

      setResume(data.text);
      const tenths = `${Math.round(data.text.length / 100) / 10}`;
      setUploadMessage(a.uploadSuccess(tenths));
      const uploadProps = {
        source: "ats_score",
        file_type: file.type || file.name.split(".").pop(),
        file_size_kb: Math.round(file.size / 1024),
        extracted_chars: data.text.length
      };
      trackEvent("resume_upload_completed", uploadProps);
      trackEvent("resume_uploaded", uploadProps);
    } catch {
      setUploadMessage(a.uploadErrorNetwork);
    } finally {
      setLoadingUpload(false);
      setOptimizedResumeData(null);
    }
  }

  async function optimizeFromScore() {
    setOptimizing(true);
    setOptimizationError("");
    setOptimizedOutput("");
    setOptimizedResumeData(null);
    setSavedHistory(false);
    setHistoryError("");
    trackEvent("ats_analysis_started", { score: analysis.score, match: analysis.match, mode });

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
        language: apiLanguage,
        targetCountry: apiTargetCountry,
        template,
        primaryColor,
        turnstileToken
      })
    });

    const data = await response.json().catch(() => ({}));
    setOptimizing(false);
    setCaptchaReset((current) => current + 1);

    if (!response.ok) {
      setOptimizationError(data.error || a.optimizeError);
      trackEvent(response.status === 402 ? "plan_limit_reached" : "ats_analysis_failed", { status: response.status, mode });
      return;
    }

    setOptimizedOutput(data.output);
    setOptimizedResumeData(data.resumeData ? normalizeResumeData(data.resumeData) : importResumeText(data.output || resume, previewData));
    trackEvent("ats_score_generated", { score: analysis.score, match: analysis.match, mode });
  }

  function exportOptimizedPdf() {
    if (!optimizedOutput) return;
    const pdfTemplate = previewData.template === "modern" ? "modern" : previewData.template === "classic" ? "compact" : "executive";
    const html = buildStructuredResumePdfPrintDocument({
      template: pdfTemplate,
      title: "Currículo otimizado",
      data: previewData
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

  async function saveOptimizedToHistory() {
    if (!optimizedOutput) return;
    setSavingHistory(true);
    setHistoryError("");
    const response = await fetch("/api/history/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ats_resume",
        language: apiLanguage,
        targetCountry: apiTargetCountry,
        inputResume: resume,
        jobDescription,
        output: optimizedOutput,
        resumeData: previewData
      })
    });
    const data = await response.json().catch(() => ({}));
    setSavingHistory(false);

    if (!response.ok) {
      setHistoryError(data.error || "Não foi possível salvar no histórico.");
      return;
    }

    setSavedHistory(true);
    trackEvent("ats_score_saved_to_history", { score: analysis.score, match: analysis.match, mode });
  }

  const showUpgradeOnError = optimizationError.toLowerCase().includes(a.limitKeyword);

  return (
    <div className="grid gap-5">
      <section className="rounded-3xl border border-border bg-card p-5 shadow-sm dark:bg-card/85">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">Workspace ATS</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">{isKeywordMode ? a.analyzerTitleKeywords : a.analyzerTitleScore}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Compare currículo e vaga, veja lacunas reais e gere uma versão otimizada quando houver contexto suficiente.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Currículo", "Vaga-alvo", "Score", "Otimização"].map((item, index) => (
              <span key={item} className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs font-semibold text-muted-foreground">
                {index + 1}. {item}
              </span>
            ))}
          </div>
        </div>
      </section>
      <div className="grid gap-5 xl:grid-cols-[minmax(0,480px)_minmax(0,1fr)]">
        <div className="grid content-start gap-4">
        <Card className="rounded-2xl p-4 shadow-sm">
          <div className="flex items-center gap-2">
            <SearchCheck className="text-brand-500" size={22} />
            <h2 className="text-xl font-semibold text-foreground">{isKeywordMode ? a.analyzerTitleKeywords : a.analyzerTitleScore}</h2>
          </div>
          <p className="mt-3 rounded-md border border-border bg-muted/30 p-3 text-xs leading-5 text-muted-foreground">{a.disclaimer}</p>
          <div className="mt-4 grid gap-3">
            <Field label={a.uploadLabel}>
              <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 p-3 text-sm text-foreground hover:bg-muted/70 dark:border-border">
                {loadingUpload ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
                {loadingUpload ? a.uploadLoading : a.uploadIdle}
                <input data-clarity-mask="true" className="hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => upload(event.target.files?.[0] || null)} />
              </label>
            </Field>
            {uploadMessage ? <p className="text-sm text-muted-foreground">{uploadMessage}</p> : null}
            <Field label={a.pasteResumeLabel}>
              <textarea
                data-clarity-mask="true"
                className={cn(textareaClass, "min-h-32")}
                value={resume}
                onChange={(event) => {
                  setResume(event.target.value);
                  setOptimizedOutput("");
                  setOptimizedResumeData(null);
                  setSavedHistory(false);
                  setHistoryError("");
                }}
                placeholder={a.pasteResumePlaceholder}
              />
            </Field>
            <Field label={a.jobLabel}>
              <textarea
                data-clarity-mask="true"
                className={cn(textareaClass, "min-h-32")}
                value={jobDescription}
                onChange={(event) => {
                  setJobDescription(event.target.value);
                  setOptimizedOutput("");
                  setOptimizedResumeData(null);
                  setSavedHistory(false);
                  setHistoryError("");
                }}
                placeholder={a.jobPlaceholder}
              />
            </Field>
          </div>
        </Card>

        <Card className="rounded-2xl p-4 shadow-sm">
          <div className="grid gap-4">
            <div className="grid gap-3 sm:grid-cols-[104px_minmax(0,1fr)] sm:items-center">
              <div className="grid place-items-center rounded-xl border border-border bg-muted/25 p-3">
                <div className="grid size-20 place-items-center rounded-full border-[7px] border-primary/25 bg-muted">
                  <div className="text-center">
                    <p className="text-3xl font-semibold text-primary">{analysis.score}</p>
                    <p className="text-[11px] text-muted-foreground">{a.scoreGaugeLabel}</p>
                  </div>
                </div>
              </div>
              <div className="min-w-0 rounded-xl border border-border bg-muted/20 p-3">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="truncate text-muted-foreground">{a.matchLabel}</span>
                  <span className="shrink-0 font-semibold text-primary">{analysis.match}%</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary transition-all duration-500" style={{ width: `${analysis.match}%` }} />
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">Use a prévia ao lado para conferir a versão que será salva no histórico.</p>
              </div>
            </div>

            <div id="keywords" className="grid gap-3">
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <h2 className="text-sm font-semibold text-foreground">{a.foundTitle}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.found.slice(0, 12).map((keyword) => (
                    <span key={keyword} className="rounded-md bg-primary/15 px-2 py-1 text-xs text-foreground">
                      {keyword}
                    </span>
                  ))}
                  {!analysis.found.length ? <p className="text-sm leading-6 text-muted-foreground">{a.pasteJobHint}</p> : null}
                </div>
              </div>
              <div className="rounded-xl border border-border bg-muted/20 p-3">
                <h2 className="text-sm font-semibold text-foreground">{a.missingTitle}</h2>
                <div className="mt-3 flex flex-wrap gap-2">
                  {analysis.missing.slice(0, 12).map((keyword) => (
                    <span key={keyword} className="rounded-md bg-coral/15 px-2 py-1 text-xs text-coral">
                      {keyword}
                    </span>
                  ))}
                  {!analysis.missing.length ? <p className="text-sm leading-6 text-muted-foreground">{a.noGap}</p> : null}
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/20 p-3">
              <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="text-primary" size={18} /> {a.recommendationsTitle}
              </h2>
              <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
                {analysis.recommendations.map((item) => (
                  <li key={item} className="flex gap-2">
                    <CheckCircle2 className="mt-1 shrink-0 text-primary" size={15} /> <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {optimizationError ? (
              <div className="rounded-xl bg-coral/15 p-3 text-sm text-coral">
                <p className="flex items-center gap-2">
                  <AlertTriangle size={16} /> {optimizationError}
                </p>
                {showUpgradeOnError ? (
                  <Button href="/assinatura#planos" className="mt-3 bg-primary text-primary-foreground hover:brightness-105">
                    {a.viewPlans}
                  </Button>
                ) : null}
              </div>
            ) : null}

            <div className="grid gap-3 rounded-xl border border-border bg-muted/20 p-3 pb-5">
              <TurnstileWidget action="ats_score" onVerify={setTurnstileToken} resetSignal={captchaReset} />
              <Button onClick={optimizeFromScore} disabled={optimizing || resume.length < 100 || jobDescription.length < 40} className="w-full bg-primary text-primary-foreground hover:brightness-105">
                {optimizing ? <Loader2 className="animate-spin" size={17} /> : <Sparkles size={17} />}
                {optimizing ? a.optimizing : a.optimizeCta}
              </Button>
            </div>

            {optimizedOutput ? (
              <div className="rounded-xl border border-primary/20 bg-primary/5 p-3">
                <p className="text-xs font-semibold uppercase text-primary">Currículo otimizado pronto</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">Baixe o PDF ou salve esta versão no histórico quando estiver satisfeito com o preview.</p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  <button onClick={exportOptimizedPdf} className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-sm font-semibold text-foreground hover:bg-muted">
                    <Download size={16} />
                    Baixar PDF
                  </button>
                  <button onClick={saveOptimizedToHistory} disabled={savingHistory || savedHistory} className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-3 text-sm font-semibold text-primary-foreground hover:brightness-105 disabled:opacity-60">
                    {savingHistory ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                    {savedHistory ? "Salvo no histórico" : "Salvar no histórico"}
                  </button>
                </div>
                {historyError ? <p className="mt-2 text-xs text-coral">{historyError}</p> : null}
              </div>
            ) : null}
          </div>
        </Card>

        <Card className="rounded-2xl p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-semibold text-foreground">Template</h2>
              <p className="mt-1 text-xs text-muted-foreground">Prévia e histórico usam esta seleção.</p>
            </div>
            <div className="inline-flex rounded-xl border border-border bg-muted/30 p-1">
              {resumeTemplates.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => {
                    setTemplate(item.key);
                    setSavedHistory(false);
                    setHistoryError("");
                  }}
                  className={cn(
                    "focus-ring h-8 rounded-lg px-2.5 text-xs font-semibold transition",
                    template === item.key ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-card hover:text-foreground"
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {resumeColors.map((color) => (
              <button
                key={color}
                type="button"
                aria-label={`Cor ${color}`}
                onClick={() => {
                  setPrimaryColor(color);
                  setSavedHistory(false);
                  setHistoryError("");
                }}
                className={`focus-ring size-9 rounded-full border-2 ${primaryColor === color ? "border-foreground" : "border-border"}`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </Card>
        </div>

        <DocumentPreviewShell title={optimizedOutput ? "Currículo otimizado" : "Preview do currículo"}>
          <ResumePreview data={previewData} />
        </DocumentPreviewShell>
      </div>
    </div>
  );
}

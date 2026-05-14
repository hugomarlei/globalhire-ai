"use client";

import Link from "next/link";
import { AlertTriangle, CheckCircle2, Copy, FileClock, FileUp, Loader2, RefreshCw, SearchCheck, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Field, textareaClass } from "@/components/ui";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/components/language-provider";
import { locales } from "@/lib/i18n";
import { atsAnalyzerCopy, buildAtsRecommendations, outputLanguageLabelForApi } from "@/lib/i18n-history-ats";
import { targetCountryCanonicalSet } from "@/lib/target-countries";

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
  const [optimizationError, setOptimizationError] = useState("");
  const [copied, setCopied] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const [apiLanguage, setApiLanguage] = useState(() => outputLanguageLabelForApi("pt-BR"));
  const [apiTargetCountry, setApiTargetCountry] = useState("Estados Unidos");

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
      trackEvent("resume_uploaded", {
        source: "ats_score",
        file_type: file.type || file.name.split(".").pop(),
        file_size_kb: Math.round(file.size / 1024),
        extracted_chars: data.text.length
      });
    } catch {
      setUploadMessage(a.uploadErrorNetwork);
    } finally {
      setLoadingUpload(false);
    }
  }

  async function optimizeFromScore() {
    setOptimizing(true);
    setOptimizationError("");
    setOptimizedOutput("");
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
    trackEvent("ats_score_generated", { score: analysis.score, match: analysis.match, mode });
  }

  async function copyOutput() {
    if (!optimizedOutput) return;
    await navigator.clipboard.writeText(optimizedOutput);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  const showUpgradeOnError = optimizationError.toLowerCase().includes(a.limitKeyword);

  return (
    <div className="grid gap-6">
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">{isKeywordMode ? a.titleKeywords : a.titleScore}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{isKeywordMode ? a.leadKeywords : a.leadScore}</p>
          </div>
          <div className="flex gap-2">
            <Link
              href="/ats-score"
              className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold ${!isKeywordMode ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {a.tabScore}
            </Link>
            <Link
              href="/ats-score?modo=keywords#keywords"
              className={`focus-ring rounded-md px-3 py-2 text-sm font-semibold ${isKeywordMode ? "bg-primary text-primary-foreground" : "border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground"}`}
            >
              {a.tabKeywords}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
        <Card>
          <div className="flex items-center gap-2">
            <SearchCheck className="text-brand-500" size={22} />
            <h2 className="text-2xl font-semibold text-foreground">{isKeywordMode ? a.analyzerTitleKeywords : a.analyzerTitleScore}</h2>
          </div>
          <p className="mt-3 rounded-md border border-border bg-card p-3 text-xs leading-5 text-muted-foreground">{a.disclaimer}</p>
          <div className="mt-6 grid gap-4">
            <Field label={a.uploadLabel}>
              <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 p-4 text-sm text-foreground hover:bg-muted/70 dark:border-border">
                {loadingUpload ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
                {loadingUpload ? a.uploadLoading : a.uploadIdle}
                <input data-clarity-mask="true" className="hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => upload(event.target.files?.[0] || null)} />
              </label>
            </Field>
            {uploadMessage ? <p className="text-sm text-muted-foreground">{uploadMessage}</p> : null}
            <Field label={a.pasteResumeLabel}>
              <textarea data-clarity-mask="true" className={textareaClass} value={resume} onChange={(event) => setResume(event.target.value)} placeholder={a.pasteResumePlaceholder} />
            </Field>
            <Field label={a.jobLabel}>
              <textarea data-clarity-mask="true" className={textareaClass} value={jobDescription} onChange={(event) => setJobDescription(event.target.value)} placeholder={a.jobPlaceholder} />
            </Field>
          </div>
        </Card>

        <Card>
          <div className="grid gap-5 md:grid-cols-[220px_1fr]">
            <div className="grid place-items-center rounded-lg border border-border bg-card p-6">
              <div className="grid size-40 place-items-center rounded-full border-[10px] border-primary/25 bg-muted">
                <div className="text-center">
                  <p className="text-5xl font-semibold text-primary">{analysis.score}</p>
                  <p className="text-sm text-muted-foreground">{a.scoreGaugeLabel}</p>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{a.matchLabel}</span>
                  <span className="font-semibold text-primary">{analysis.match}%</span>
                </div>
                <div className="mt-2 h-2 rounded-full bg-muted">
                  <div className="h-2 rounded-full bg-primary" style={{ width: `${analysis.match}%` }} />
                </div>
              </div>
              <div id="keywords" className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-md border border-border bg-card p-4">
                  <h2 className="font-semibold text-foreground">{a.foundTitle}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.found.slice(0, 12).map((keyword) => (
                      <span key={keyword} className="rounded-md bg-primary/15 px-2 py-1 text-xs text-foreground">
                        {keyword}
                      </span>
                    ))}
                    {!analysis.found.length ? <p className="text-sm text-muted-foreground">{a.pasteJobHint}</p> : null}
                  </div>
                </div>
                <div className="rounded-md border border-border bg-card p-4">
                  <h2 className="font-semibold text-foreground">{a.missingTitle}</h2>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.missing.slice(0, 12).map((keyword) => (
                      <span key={keyword} className="rounded-md bg-coral/15 px-2 py-1 text-xs text-coral">
                        {keyword}
                      </span>
                    ))}
                    {!analysis.missing.length ? <p className="text-sm text-muted-foreground">{a.noGap}</p> : null}
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-border bg-card p-4">
                <h2 className="flex items-center gap-2 font-semibold text-foreground">
                  <Sparkles className="text-primary" size={18} /> {a.recommendationsTitle}
                </h2>
                <ul className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
                  {analysis.recommendations.map((item) => (
                    <li key={item} className="flex gap-2">
                      <CheckCircle2 className="mt-1 shrink-0 text-primary" size={15} /> {item}
                    </li>
                  ))}
                </ul>
              </div>
              {optimizationError ? (
                <div className="rounded-md bg-coral/15 p-3 text-sm text-coral">
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
              <TurnstileWidget action="ats_score" onVerify={setTurnstileToken} resetSignal={captchaReset} />
              <Button onClick={optimizeFromScore} disabled={optimizing || resume.length < 100 || jobDescription.length < 40} className="bg-primary text-primary-foreground hover:brightness-105">
                {optimizing ? <Loader2 className="animate-spin" size={17} /> : <Sparkles size={17} />}
                {optimizing ? a.optimizing : a.optimizeCta}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">{a.outputCardTitle}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{a.outputCardLead}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={copyOutput} disabled={!optimizedOutput} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-40">
              <Copy size={16} />
              {copied ? a.copied : a.copy}
            </button>
            <button onClick={optimizeFromScore} disabled={optimizing || resume.length < 100 || jobDescription.length < 40} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted disabled:opacity-40">
              <RefreshCw size={16} />
              {a.generateAgain}
            </button>
            <Link href="/historico" className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-sm text-foreground hover:bg-muted">
              <FileClock size={16} />
              {a.savedHistory}
            </Link>
          </div>
        </div>
        <pre data-clarity-mask="true" className="mt-5 min-h-72 whitespace-pre-wrap rounded-md border border-border bg-muted p-4 text-sm leading-6 text-foreground">
          {optimizing ? a.preOutput : optimizedOutput || a.emptyPreOutput}
        </pre>
      </Card>
    </div>
  );
}

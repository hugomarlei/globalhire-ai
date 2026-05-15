"use client";

import { AlertTriangle, Copy, Download, FileText, FileUp, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Field, inputClass, textareaClass } from "@/components/ui";
import { normalizeDocumentText } from "@/lib/document-format";
import { useLanguage } from "@/components/language-provider";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { getGeneratorUi } from "@/lib/i18n-generator";
import { legacyTemplateToKey } from "@/lib/i18n-app-wide";
import { getTargetCountrySelectOptions, targetCountryCanonicalSet } from "@/lib/target-countries";
import { dashboardCopy, locales } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import type { GenerationType } from "@/lib/types";

type AppliedImprovement = {
  text: string;
  score: number;
};

const ALL_GENERATION_TYPES: GenerationType[] = [
  "ats_resume",
  "cover_letter",
  "linkedin_summary",
  "recruiter_message",
  "interview_prep",
  "translate_resume"
];

type PdfTemplate = "executive" | "modern" | "compact";

const generatedEventByType: Record<GenerationType, string> = {
  ats_resume: "resume_generated",
  cover_letter: "cover_letter_generated",
  linkedin_summary: "linkedin_summary_generated",
  recruiter_message: "recruiter_message_generated",
  interview_prep: "interview_prep_generated",
  translate_resume: "translation_generated"
};

function escapeHtml(value: string) {
  const entities: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;" };
  return value.replace(/[<>&]/g, (char) => entities[char] || char);
}

function templateStyles(template: PdfTemplate) {
  const base = `
    @page { margin: 18mm; }
    body { color: #111827; line-height: 1.5; }
    pre { white-space: pre-wrap; font: inherit; margin: 0; }
    .watermark {
      position: fixed;
      inset: auto 24px 24px auto;
      color: rgba(17, 24, 39, 0.28);
      border: 1px solid rgba(17, 24, 39, 0.16);
      padding: 8px 10px;
      font-size: 11px;
      letter-spacing: 0;
    }
  `;

  const variants: Record<PdfTemplate, string> = {
    executive: `
      body { font-family: Arial, Helvetica, sans-serif; padding: 34px; }
      .sheet { max-width: 760px; margin: 0 auto; }
      pre { font-size: 12.5px; }
    `,
    modern: `
      body { font-family: Inter, Arial, Helvetica, sans-serif; padding: 32px; background: #f8fafc; }
      .sheet { max-width: 780px; margin: 0 auto; background: #ffffff; border-left: 7px solid #32E875; padding: 30px; }
      pre { font-size: 13px; }
    `,
    compact: `
      body { font-family: Georgia, "Times New Roman", serif; padding: 28px; }
      .sheet { max-width: 720px; margin: 0 auto; }
      pre { font-size: 11.5px; line-height: 1.42; }
    `
  };

  return `${base}\n${variants[template]}`;
}

export function DashboardGenerator({
  hasPaidPlan,
  initialType,
  allowedTypes
}: {
  hasPaidPlan: boolean;
  initialType?: GenerationType;
  allowedTypes?: GenerationType[];
}) {
  const { locale } = useLanguage();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [targetCountry, setTargetCountry] = useState("Estados Unidos");
  const [type, setType] = useState<GenerationType>(initialType || "ats_resume");
  const [pdfTemplate, setPdfTemplate] = useState<PdfTemplate>("executive");
  const [output, setOutput] = useState("");
  const [appliedImprovements, setAppliedImprovements] = useState<AppliedImprovement[]>([]);
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingUpload, setLoadingUpload] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");
  const [generationStep, setGenerationStep] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const copy = dashboardCopy[locale];
  const genUi = useMemo(() => getGeneratorUi(locale), [locale]);
  const steps = genUi.steps;
  const context = genUi.byType[type];
  const visibleTypes = allowedTypes?.length ? ALL_GENERATION_TYPES.filter((t) => allowedTypes.includes(t)) : ALL_GENERATION_TYPES;

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("globalhire-preferences");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      const lang = parsed.language;
      if (typeof lang === "string" && locales.some((l) => l.outputLabel === lang)) {
        setLanguage(lang);
      }
      const tc = parsed.targetCountry;
      if (typeof tc === "string" && targetCountryCanonicalSet.has(tc)) {
        setTargetCountry(tc);
      }
      const tpl = parsed.template;
      if (typeof tpl === "string") {
        if (tpl === "executive" || tpl === "modern" || tpl === "compact") {
          setPdfTemplate(tpl);
        } else if (legacyTemplateToKey[tpl]) {
          setPdfTemplate(legacyTemplateToKey[tpl] as PdfTemplate);
        }
      }
    } catch {
      /* ignore corrupt prefs */
    }
  }, []);

  useEffect(() => {
    if (!loading) {
      setGenerationStep(0);
      return;
    }

    const timer = window.setInterval(() => {
      setGenerationStep((current) => Math.min(current + 1, steps.length - 1));
    }, 1100);

    return () => window.clearInterval(timer);
  }, [loading, steps.length]);

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
        setUploadMessage(data.error || genUi.uploadErrorGeneric);
        return;
      }

      setResume(data.text);
      setUploadMessage(`${genUi.uploadSuccessIntro} ${Math.round(data.text.length / 100) / 10}k chars.`);
      const uploadProps = {
        source: "generator",
        file_type: file.type || file.name.split(".").pop(),
        file_size_kb: Math.round(file.size / 1024),
        extracted_chars: data.text.length
      };
      trackEvent("resume_upload_completed", uploadProps);
      trackEvent("resume_uploaded", uploadProps);
    } catch {
      setUploadMessage(genUi.uploadErrorNetwork);
    } finally {
      setLoadingUpload(false);
    }
  }

  async function generate() {
    setLoading(true);
    setError("");
    setLimitReached(false);
    setOutput("");
    setAppliedImprovements([]);
    trackEvent("generation_started", { type, language, target_country: targetCountry });
    if (jobDescription.trim().length > 0) {
      trackEvent("job_description_added", { type, chars_bucket: jobDescription.length > 2000 ? "2000+" : "under_2000" });
    }

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription, language, targetCountry, type, turnstileToken })
    });

    const data = await response.json();
    setLoading(false);
    setCaptchaReset((current) => current + 1);

    if (!response.ok) {
      setError(data.error || copy.errorFallback);
      setLimitReached(response.status === 402);
      trackEvent(response.status === 402 ? "plan_limit_reached" : "generation_failed", { type, status: response.status });
      return;
    }

    setOutput(data.output);
    trackEvent(generatedEventByType[type], { type, language, target_country: targetCountry });
    const rawImprovements = Array.isArray(data.appliedImprovements)
      ? data.appliedImprovements
      : Array.isArray(data.recommendations)
        ? data.recommendations
        : [];

    setAppliedImprovements(
      rawImprovements.map((item: AppliedImprovement | string, index: number) =>
        typeof item === "string"
          ? { text: item, score: Math.max(6, 18 - index * 2) }
          : item
      )
    );
  }

  async function copyOutput() {
    if (!output) return;
    await navigator.clipboard.writeText(normalizeDocumentText(output));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function exportPdf() {
    const printable = window.open("", "_blank");
    if (!printable || !output) return;
    trackEvent("export_pdf_clicked", { type, template: pdfTemplate, paid: hasPaidPlan });
    const cleanOutput = normalizeDocumentText(output);
    const watermark = hasPaidPlan ? "" : `<div class="watermark">${escapeHtml(genUi.pdfFreeWatermark)}</div>`;
    printable.document.write(`
      <html>
        <head>
          <title>GlobalHire AI</title>
          <style>
            ${templateStyles(pdfTemplate)}
          </style>
        </head>
        <body>
          <main class="sheet">
            <pre>${escapeHtml(cleanOutput)}</pre>
          </main>
          ${watermark}
          <script>window.print();</script>
        </body>
      </html>
    `);
    printable.document.close();
  }

  return (
    <div className="grid gap-5 lg:grid-cols-[0.95fr_1.05fr]">
      <Card>
        <div className="flex items-center gap-2">
          <Sparkles className="text-brand-500" size={22} />
          <div>
            <h1 className="text-2xl font-semibold text-foreground">{context.title}</h1>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{context.subtitle}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <Field label={genUi.uploadPdfDocx}>
            <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-brand-500/40 bg-brand-500/10 p-3 text-sm text-brand-800 hover:bg-brand-500/15 dark:text-brand-50">
              {loadingUpload ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
              {loadingUpload ? genUi.readingFile : genUi.importResume}
              <input data-clarity-mask="true" className="hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => upload(event.target.files?.[0] || null)} />
            </label>
          </Field>
          {uploadMessage ? <p className="text-sm text-muted-foreground">{uploadMessage}</p> : null}
          <p className="rounded-md border border-border bg-card p-3 text-xs leading-5 text-muted-foreground">{genUi.uploadHelp}</p>
          <Field label={context.resumeLabel}>
            <textarea data-clarity-mask="true" className={textareaClass} value={resume} onChange={(e) => setResume(e.target.value)} placeholder={context.resumePlaceholder} />
          </Field>
          <Field label={copy.jobDescription}>
            <textarea data-clarity-mask="true" className={textareaClass} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder={context.jobPlaceholder} />
          </Field>
          <div className="grid min-w-0 gap-4 sm:grid-cols-3">
            <Field label={copy.outputLanguage}>
              <select className={inputClass} value={language} onChange={(e) => setLanguage(e.target.value)}>
                {locales.map((locale) => (
                  <option key={locale.value} value={locale.outputLabel}>{locale.label}</option>
                ))}
              </select>
            </Field>
            <Field label={copy.targetCountry}>
              <select className={inputClass} value={targetCountry} onChange={(e) => setTargetCountry(e.target.value)}>
                {getTargetCountrySelectOptions(locale).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label={copy.deliveryType}>
              <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as GenerationType)}>
                {visibleTypes.map((item) => (
                  <option key={item} value={item}>
                    {copy.deliveryTypes[item]}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          {error ? (
            <div className="rounded-md bg-coral/15 p-3 text-sm text-coral">
              <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} /> {error}</p>
              {limitReached ? (
                <div className="mt-3 grid gap-2">
                  <p className="text-sm text-coral/85">{genUi.limitRenewNotice}</p>
                  <Button href="/assinatura#planos" className="bg-primary text-primary-foreground hover:brightness-105">
                    {genUi.upgradeCta}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
          <TurnstileWidget action="generation" onVerify={setTurnstileToken} resetSignal={captchaReset} />
          <Button type="button" className="bg-primary text-primary-foreground hover:brightness-105" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? copy.generating : context.cta}
          </Button>
          {loading ? (
            <div className="rounded-md border border-brand-500/20 bg-brand-500/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-800 dark:text-brand-50">
                <Loader2 className="animate-spin" size={17} />
                {steps[generationStep]}
              </div>
              <div className="mt-3 h-2 rounded-full bg-muted">
                <div className="h-2 rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${((generationStep + 1) / steps.length) * 100}%` }} />
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="min-h-[620px]">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <h2 className="text-xl font-semibold text-foreground">{copy.finalDocument}</h2>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end">
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm text-foreground hover:bg-muted disabled:opacity-40"
            >
              <Copy size={17} />
              {copied ? genUi.copyDone : genUi.copyLabel}
            </button>
            <button
              type="button"
              onClick={generate}
              disabled={loading || !resume}
              className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm text-foreground hover:bg-muted disabled:opacity-40"
            >
              <RefreshCw size={17} />
              {genUi.regenerate}
            </button>
            <Field label={copy.pdfTemplate}>
              <select className={`${inputClass} h-10 min-h-10`} value={pdfTemplate} onChange={(event) => setPdfTemplate(event.target.value as PdfTemplate)}>
                {(Object.keys(genUi.pdfTemplates) as PdfTemplate[]).map((template) => (
                  <option key={template} value={template}>
                    {genUi.pdfTemplates[template]}
                  </option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              onClick={exportPdf}
              disabled={!output}
              className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border px-3 text-sm text-foreground hover:bg-muted disabled:opacity-40"
            >
              <Download size={17} />
              {copy.pdf}
            </button>
          </div>
        </div>
        <pre data-clarity-mask="true" className="mt-5 min-h-[520px] whitespace-pre-wrap rounded-md border border-border bg-muted p-4 text-sm leading-6 text-foreground">
          {loading ? genUi.preparingOutput : output || context.empty}
        </pre>
        <div className="mt-4 rounded-md border border-border bg-card p-4">
          <div className="flex items-center gap-2">
            <FileText className="text-mint" size={18} />
            <h3 className="font-semibold text-foreground">{copy.appliedImprovements}</h3>
          </div>
          {appliedImprovements.length ? (
            <ul data-clarity-mask="true" className="mt-3 grid gap-2 text-sm leading-6 text-muted-foreground">
              {appliedImprovements.map((improvement) => (
                <li key={`${improvement.score}-${improvement.text}`} className="flex gap-3 rounded-md bg-muted p-3">
                  <span className="grid h-8 min-w-14 place-items-center rounded-md bg-brand-500/15 text-sm font-semibold text-brand-500">
                    +{improvement.score}%
                  </span>
                  <span>{improvement.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">{copy.emptyImprovements}</p>
          )}
        </div>
        {!hasPaidPlan ? (
          <p className="mt-3 text-sm text-muted-foreground">{copy.watermarkNotice}</p>
        ) : null}
      </Card>
    </div>
  );
}

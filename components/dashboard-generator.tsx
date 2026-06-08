"use client";

import { AlertTriangle, Copy, Download, FileText, FileUp, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, Field, cn, inputClass, textareaClass } from "@/components/ui";
import { normalizeDocumentText } from "@/lib/document-format";
import { useLanguage } from "@/components/language-provider";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { getGeneratorUi } from "@/lib/i18n-generator";
import type { PdfTemplateKey } from "@/lib/i18n-generator";
import { legacyTemplateToKey } from "@/lib/i18n-app-wide";
import { getTargetCountrySelectOptions, targetCountryCanonicalSet } from "@/lib/target-countries";
import { dashboardCopy, locales } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
import type { GenerationType } from "@/lib/types";
import { buildResumePdfPrintDocument } from "@/lib/resume-pdf-templates";
import { VOICE_CONTROLLED_GENERATION_TYPES, type OutputLength, type OutputTone } from "@/prompts/ai-prompts";
import { InterviewGuideOutput } from "@/components/interview-guide-output";
import { DocumentPreviewShell } from "@/components/application-workspace";
import { ResumePreview } from "@/components/resumes/resume-preview";
import { defaultResumeData } from "@/lib/resumes/defaults";
import { importResumeText } from "@/lib/resumes/import";
import type { ResumeData } from "@/lib/resumes/types";

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

const generatedEventByType: Record<GenerationType, string> = {
  ats_resume: "resume_generated",
  cover_letter: "cover_letter_generated",
  linkedin_summary: "linkedin_summary_generated",
  recruiter_message: "recruiter_message_generated",
  interview_prep: "interview_prep_generated",
  translate_resume: "translation_generated"
};

const PREFS = "globalhire-preferences";

function generatorTemplateToResumeTemplate(template: PdfTemplateKey): ResumeData["template"] {
  if (template === "modern") return "modern";
  if (template === "compact") return "classic";
  return "professional";
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
  const [pdfTemplate, setPdfTemplate] = useState<PdfTemplateKey>("executive");
  const [outputLength, setOutputLength] = useState<OutputLength>("medium");
  const [outputTone, setOutputTone] = useState<OutputTone>("professional");
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
  const showVoiceControls = VOICE_CONTROLLED_GENERATION_TYPES.includes(type);
  const usesJobDescription = type !== "translate_resume";
  const showDocumentPreview = type === "ats_resume" || type === "translate_resume";
  const previewResumeData = useMemo(() => {
    const base = {
      ...defaultResumeData(),
      language,
      targetJobDescription: usesJobDescription ? jobDescription : "",
      template: generatorTemplateToResumeTemplate(pdfTemplate)
    };
    return importResumeText(output || resume, base);
  }, [jobDescription, language, output, pdfTemplate, resume, usesJobDescription]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFS);
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
          setPdfTemplate(legacyTemplateToKey[tpl] as PdfTemplateKey);
        }
      }
      const ol = parsed.outputLength;
      if (ol === "short" || ol === "medium" || ol === "detailed") setOutputLength(ol);
      const ot = parsed.outputTone;
      if (ot === "natural" || ot === "professional" || ot === "confident" || ot === "direct") setOutputTone(ot);
    } catch {
      /* ignore corrupt prefs */
    }
  }, []);

  function persistPreferencePatch(patch: Record<string, string>) {
    try {
      const raw = window.localStorage.getItem(PREFS);
      const base = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      window.localStorage.setItem(PREFS, JSON.stringify({ ...base, ...patch }));
    } catch {
      /* ignore */
    }
  }

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
    if (usesJobDescription && jobDescription.trim().length > 0) {
      trackEvent("job_description_added", { type, chars_bucket: jobDescription.length > 2000 ? "2000+" : "under_2000" });
    }

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resume,
        jobDescription: usesJobDescription ? jobDescription : "",
        language,
        targetCountry,
        type,
        turnstileToken,
        outputLength,
        outputTone
      })
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
        typeof item === "string" ? { text: item, score: Math.max(6, 18 - index * 2) } : item
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
    if (!output) return;
    trackEvent("export_pdf_clicked", { type, template: pdfTemplate, paid: hasPaidPlan });
    const cleanOutput = normalizeDocumentText(output);
    const html = buildResumePdfPrintDocument({
      template: pdfTemplate,
      title: "GlobalHire AI",
      body: cleanOutput,
      watermarkText: hasPaidPlan ? undefined : genUi.pdfFreeWatermark
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
      document.body.removeChild(iframe);
      return;
    }

    doc.open();
    doc.write(html);
    doc.close();

    const cleanup = () => {
      try {
        iframe.remove();
      } catch {
        /* ignore */
      }
    };

    win.addEventListener("afterprint", cleanup, { once: true });
    window.setTimeout(cleanup, 120_000);

    requestAnimationFrame(() => {
      try {
        win.focus();
        win.print();
      } catch {
        cleanup();
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12 lg:items-start">
      <section className="lg:col-span-12">
        <div className="rounded-3xl border border-border bg-card p-5 text-card-foreground shadow-sm dark:border-white/10 dark:bg-card/85">
          <div className="grid gap-5 lg:grid-cols-[0.76fr_1.24fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-primary">Workspace de entregas</p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Central de candidatura</h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">Escolha a entrega, insira a base profissional e acompanhe o documento final com o template selecionado.</p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {visibleTypes.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setType(item)}
                  className={cn(
                    "focus-ring rounded-xl border px-3 py-2.5 text-left transition hover:-translate-y-0.5",
                    type === item
                      ? "border-primary bg-primary text-primary-foreground shadow-glow dark:shadow-glow-dark"
                      : "border-border bg-background text-foreground hover:bg-muted dark:border-white/10 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
                  )}
                >
                  <span className="block text-sm font-semibold">{copy.deliveryTypes[item]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
      <div className="space-y-5 lg:col-span-5">
        <Card className="border-border/90 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{genUi.formColumnTitle}</p>
          <div className="mt-4 grid gap-5">
            <div className="rounded-xl border border-border/70 bg-muted/25 p-4">
              <Field label={genUi.uploadPdfDocx}>
                <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-primary/35 bg-card/80 p-4 text-sm text-foreground transition hover:bg-muted/40">
                  {loadingUpload ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
                  {loadingUpload ? genUi.readingFile : genUi.importResume}
                  <input
                    data-clarity-mask="true"
                    className="hidden"
                    type="file"
                    accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(event) => upload(event.target.files?.[0] || null)}
                  />
                </label>
              </Field>
              {uploadMessage ? <p className="mt-2 text-sm text-muted-foreground">{uploadMessage}</p> : null}
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{genUi.uploadHelp}</p>
            </div>

            <Field label={context.resumeLabel}>
              <textarea data-clarity-mask="true" className={cn(textareaClass, "min-h-[140px]")} value={resume} onChange={(e) => setResume(e.target.value)} placeholder={context.resumePlaceholder} />
            </Field>
            {usesJobDescription ? (
              <Field label={copy.jobDescription}>
                <textarea data-clarity-mask="true" className={textareaClass} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder={context.jobPlaceholder} />
              </Field>
            ) : null}

            <div className="grid min-w-0 gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              <Field label={copy.outputLanguage}>
                <select
                  className={inputClass}
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value);
                    persistPreferencePatch({ language: e.target.value });
                  }}
                >
                  {locales.map((loc) => (
                    <option key={loc.value} value={loc.outputLabel}>
                      {loc.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label={copy.targetCountry}>
                <select
                  className={inputClass}
                  value={targetCountry}
                  onChange={(e) => {
                    setTargetCountry(e.target.value);
                    persistPreferencePatch({ targetCountry: e.target.value });
                  }}
                >
                  {getTargetCountrySelectOptions(locale).map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {showVoiceControls ? (
              <div className="grid gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4 sm:grid-cols-2">
                <Field label={genUi.outputLengthLabel}>
                  <select
                    className={inputClass}
                    value={outputLength}
                    onChange={(e) => {
                      const v = e.target.value as OutputLength;
                      setOutputLength(v);
                      persistPreferencePatch({ outputLength: v });
                    }}
                  >
                    <option value="short">{genUi.lengthShort}</option>
                    <option value="medium">{genUi.lengthMedium}</option>
                    <option value="detailed">{genUi.lengthDetailed}</option>
                  </select>
                </Field>
                <Field label={genUi.toneLabel}>
                  <select
                    className={inputClass}
                    value={outputTone}
                    onChange={(e) => {
                      const v = e.target.value as OutputTone;
                      setOutputTone(v);
                      persistPreferencePatch({ outputTone: v });
                    }}
                  >
                    <option value="natural">{genUi.toneNatural}</option>
                    <option value="professional">{genUi.toneProfessional}</option>
                    <option value="confident">{genUi.toneConfident}</option>
                    <option value="direct">{genUi.toneDirect}</option>
                  </select>
                </Field>
                <p className="sm:col-span-2 text-xs leading-relaxed text-muted-foreground">{genUi.voiceControlsHint}</p>
              </div>
            ) : null}

            {error ? (
              <div className="rounded-xl bg-coral/15 p-4 text-sm text-coral">
                <p className="flex items-center gap-2 font-semibold">
                  <AlertTriangle size={16} /> {error}
                </p>
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
              <div className="rounded-xl border border-brand-500/25 bg-brand-500/10 p-4">
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
      </div>

      <div className="space-y-5 lg:col-span-7 lg:sticky lg:top-24">
        <Card className="min-h-[480px] border-border/90 shadow-md">
          <div className="flex flex-col gap-4 border-b border-border/70 pb-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{genUi.previewColumnTitle}</p>
              <h2 className="mt-1 text-xl font-semibold text-foreground">{copy.finalDocument}</h2>
            </div>
            <div className="flex min-w-0 flex-wrap items-end gap-2">
              <button
                type="button"
                onClick={copyOutput}
                disabled={!output}
                className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm transition hover:bg-muted disabled:opacity-40"
              >
                <Copy size={17} />
                {copied ? genUi.copyDone : genUi.copyLabel}
              </button>
              <button
                type="button"
                onClick={generate}
                disabled={loading || !resume}
                className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-border bg-card px-3 text-sm text-foreground shadow-sm transition hover:bg-muted disabled:opacity-40"
              >
                <RefreshCw size={17} />
                {genUi.regenerate}
              </button>
              <Field label={copy.pdfTemplate}>
                <select
                  className={`${inputClass} h-10 min-h-10 min-w-[10rem]`}
                  value={pdfTemplate}
                  onChange={(event) => {
                    const v = event.target.value as PdfTemplateKey;
                    setPdfTemplate(v);
                    persistPreferencePatch({ template: v });
                  }}
                >
                  {(Object.keys(genUi.pdfTemplates) as PdfTemplateKey[]).map((template) => (
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
                className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground shadow-glow transition hover:brightness-105 disabled:opacity-40 dark:shadow-glow-dark"
              >
                <Download size={17} />
                {copy.pdf}
              </button>
            </div>
          </div>

          <div
            className={cn(
              "mt-5 min-h-[420px] rounded-2xl border border-border/80 bg-gradient-to-b from-card via-card to-muted/15 p-4 shadow-inner sm:p-5",
              type === "ats_resume" && "ring-1 ring-primary/10"
            )}
          >
            {type === "interview_prep" ? (
              <InterviewGuideOutput text={output} loading={loading} skeletonLabel={genUi.preparingOutput} emptyLabel={context.empty} />
            ) : showDocumentPreview ? (
              <div data-clarity-mask="true" className="relative">
                {loading ? (
                  <div className="absolute inset-x-4 top-4 z-10 rounded-xl border border-border bg-card/95 p-3 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur">
                    {genUi.preparingOutput}
                  </div>
                ) : null}
                <DocumentPreviewShell>
                  <ResumePreview data={previewResumeData} />
                </DocumentPreviewShell>
                {!output && !resume && !loading ? <p className="mt-3 text-sm text-muted-foreground">{context.empty}</p> : null}
              </div>
            ) : (
              <pre
                data-clarity-mask="true"
                className={cn(
                  "whitespace-pre-wrap font-sans text-sm leading-relaxed tracking-tight text-foreground antialiased",
                  !output && !loading && "text-muted-foreground"
                )}
              >
                {loading ? genUi.preparingOutput : output || context.empty}
              </pre>
            )}
          </div>

          <div className="mt-5 rounded-xl border border-border/80 bg-card/90 p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <FileText className="text-mint" size={18} />
              <h3 className="font-semibold text-foreground">{copy.appliedImprovements}</h3>
            </div>
            {appliedImprovements.length ? (
              <ul data-clarity-mask="true" className="mt-3 grid gap-2 text-sm leading-relaxed text-muted-foreground">
                {appliedImprovements.map((improvement) => (
                  <li key={`${improvement.score}-${improvement.text}`} className="flex gap-3 rounded-xl border border-border/60 bg-muted/30 p-3">
                    <span className="grid h-8 min-w-14 place-items-center rounded-lg bg-brand-500/15 text-sm font-semibold text-brand-500">
                      +{improvement.score}%
                    </span>
                    <span>{improvement.text}</span>
                  </li>
                ))}
              </ul>
            ) : loading ? (
              <div className="mt-3 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-muted" />
                <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">{copy.emptyImprovements}</p>
            )}
          </div>
          {!hasPaidPlan ? <p className="mt-3 text-xs text-muted-foreground">{copy.watermarkNotice}</p> : null}
        </Card>
      </div>
    </div>
  );
}

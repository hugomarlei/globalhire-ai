"use client";

import { Download, FileText, Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Button, Card, Field, inputClass, textareaClass } from "@/components/ui";
import { normalizeDocumentText } from "@/lib/document-format";
import { useLanguage } from "@/components/language-provider";
import { dashboardCopy, locales } from "@/lib/i18n";
import type { GenerationType } from "@/lib/types";

type AppliedImprovement = {
  text: string;
  score: number;
};

const types: Array<{ value: GenerationType; label: string }> = [
  { value: "ats_resume", label: "Otimizar currículo ATS" },
  { value: "cover_letter", label: "Gerar carta de apresentação" },
  { value: "linkedin_summary", label: "Gerar resumo de LinkedIn" },
  { value: "recruiter_message", label: "Mensagem para recrutador" },
  { value: "interview_prep", label: "Simular entrevista" },
  { value: "translate_resume", label: "Traduzir/adaptar currículo" }
];

type PdfTemplate = "executive" | "modern" | "compact";

const pdfTemplates: Array<{ value: PdfTemplate; label: string }> = [
  { value: "executive", label: "Executivo ATS" },
  { value: "modern", label: "Moderno internacional" },
  { value: "compact", label: "Compacto premium" }
];

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

export function DashboardGenerator({ hasPaidPlan }: { hasPaidPlan: boolean }) {
  const { locale } = useLanguage();
  const [resume, setResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [targetCountry, setTargetCountry] = useState("Estados Unidos");
  const [type, setType] = useState<GenerationType>("ats_resume");
  const [pdfTemplate, setPdfTemplate] = useState<PdfTemplate>("executive");
  const [output, setOutput] = useState("");
  const [appliedImprovements, setAppliedImprovements] = useState<AppliedImprovement[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const copy = dashboardCopy[locale];

  async function generate() {
    setLoading(true);
    setError("");
    setOutput("");
    setAppliedImprovements([]);

    const response = await fetch("/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resume, jobDescription, language, targetCountry, type })
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error || copy.errorFallback);
      return;
    }

    setOutput(data.output);
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

  function exportPdf() {
    const printable = window.open("", "_blank");
    if (!printable || !output) return;
    const cleanOutput = normalizeDocumentText(output);
    const watermark = hasPaidPlan ? "" : `<div class="watermark">Criado com GlobalHire AI - plano grátis</div>`;
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
          <h1 className="text-2xl font-semibold">{copy.generatorTitle}</h1>
        </div>
        <div className="mt-6 grid gap-4">
          <Field label={copy.resume}>
            <textarea className={textareaClass} value={resume} onChange={(e) => setResume(e.target.value)} placeholder={copy.resumePlaceholder} />
          </Field>
          <Field label={copy.jobDescription}>
            <textarea className={textareaClass} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder={copy.jobDescriptionPlaceholder} />
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
                <option>Estados Unidos</option>
                <option>Canadá</option>
                <option>Reino Unido</option>
                <option>Portugal</option>
                <option>Alemanha</option>
                <option>Europa</option>
              </select>
            </Field>
            <Field label={copy.deliveryType}>
              <select className={inputClass} value={type} onChange={(e) => setType(e.target.value as GenerationType)}>
                {types.map((item) => <option key={item.value} value={item.value}>{copy.deliveryTypes[item.value]}</option>)}
              </select>
            </Field>
          </div>
          {error ? <p className="rounded-md bg-coral/15 p-3 text-sm text-coral">{error}</p> : null}
          <Button type="button" className="bg-brand-500 text-white hover:bg-brand-600" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? copy.generating : copy.generate}
          </Button>
        </div>
      </Card>

      <Card className="min-h-[620px]">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <h2 className="text-xl font-semibold">{copy.finalDocument}</h2>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end">
            <Field label={copy.pdfTemplate}>
              <select className={`${inputClass} h-10 min-h-10`} value={pdfTemplate} onChange={(event) => setPdfTemplate(event.target.value as PdfTemplate)}>
                {pdfTemplates.map((template) => (
                  <option key={template.value} value={template.value}>{template.label}</option>
                ))}
              </select>
            </Field>
            <button
              type="button"
              onClick={exportPdf}
              disabled={!output}
              className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm text-white/80 disabled:opacity-40"
            >
              <Download size={17} />
              {copy.pdf}
            </button>
          </div>
        </div>
        <pre className="mt-5 min-h-[520px] whitespace-pre-wrap rounded-md border border-white/10 bg-black/25 p-4 text-sm leading-6 text-white/82">
          {output || copy.emptyOutput}
        </pre>
        <div className="mt-4 rounded-md border border-white/10 bg-white/5 p-4">
          <div className="flex items-center gap-2">
            <FileText className="text-mint" size={18} />
            <h3 className="font-semibold">{copy.appliedImprovements}</h3>
          </div>
          {appliedImprovements.length ? (
            <ul className="mt-3 grid gap-2 text-sm leading-6 text-white/72">
              {appliedImprovements.map((improvement) => (
                <li key={`${improvement.score}-${improvement.text}`} className="flex gap-3 rounded-md bg-black/20 p-3">
                  <span className="grid h-8 min-w-14 place-items-center rounded-md bg-brand-500/15 text-sm font-semibold text-brand-500">
                    +{improvement.score}%
                  </span>
                  <span>{improvement.text}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-white/50">{copy.emptyImprovements}</p>
          )}
        </div>
        {!hasPaidPlan ? (
          <p className="mt-3 text-sm text-white/50">{copy.watermarkNotice}</p>
        ) : null}
      </Card>
    </div>
  );
}

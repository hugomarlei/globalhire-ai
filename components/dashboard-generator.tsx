"use client";

import { AlertTriangle, Copy, Download, FileText, FileUp, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, Card, Field, inputClass, textareaClass } from "@/components/ui";
import { normalizeDocumentText } from "@/lib/document-format";
import { useLanguage } from "@/components/language-provider";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { dashboardCopy, locales } from "@/lib/i18n";
import { trackEvent } from "@/lib/analytics";
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

const generatorContext: Record<GenerationType, {
  title: string;
  subtitle: string;
  resumeLabel: string;
  resumePlaceholder: string;
  jobPlaceholder: string;
  cta: string;
  empty: string;
}> = {
  ats_resume: {
    title: "Gerador de Currículo ATS",
    subtitle: "Transforme seu currículo em uma versão internacional, clara e alinhada à descrição da vaga.",
    resumeLabel: "Currículo atual",
    resumePlaceholder: "Cole aqui seu currículo completo. Inclua experiências, formação, ferramentas, idiomas e certificações.",
    jobPlaceholder: "Cole a descrição da vaga para a IA adaptar o currículo ao cargo, país e palavras-chave.",
    cta: "Gerar currículo ATS",
    empty: "Seu currículo otimizado aparecerá aqui, limpo e pronto para exportar."
  },
  cover_letter: {
    title: "Gerador de Carta de Apresentação",
    subtitle: "Crie uma carta objetiva, persuasiva e conectada à vaga escolhida.",
    resumeLabel: "Currículo ou base profissional",
    resumePlaceholder: "Cole seu currículo ou um resumo da sua experiência para sustentar a carta.",
    jobPlaceholder: "Cole a vaga ou contexto da empresa para personalizar a carta.",
    cta: "Gerar carta de apresentação",
    empty: "Sua carta de apresentação aparecerá aqui com tom profissional e pronta para envio."
  },
  linkedin_summary: {
    title: "Gerador de Resumo LinkedIn",
    subtitle: "Posicione seu perfil para recrutadores internacionais com um resumo forte e humano.",
    resumeLabel: "Base profissional",
    resumePlaceholder: "Cole seu currículo ou descreva sua trajetória, especialidade, ferramentas e objetivo profissional.",
    jobPlaceholder: "Opcional: cole uma vaga ou área-alvo para direcionar o posicionamento do LinkedIn.",
    cta: "Gerar resumo LinkedIn",
    empty: "Seu resumo de LinkedIn aparecerá aqui, pronto para colar no perfil."
  },
  recruiter_message: {
    title: "Mensagem para Recrutador",
    subtitle: "Escreva uma abordagem curta, natural e relevante para iniciar conversa.",
    resumeLabel: "Base profissional",
    resumePlaceholder: "Cole seu currículo ou pontos principais da sua experiência.",
    jobPlaceholder: "Cole a vaga, nome do cargo ou contexto do recrutador.",
    cta: "Gerar mensagem",
    empty: "Sua mensagem para recrutador aparecerá aqui."
  },
  interview_prep: {
    title: "Preparação para Entrevista",
    subtitle: "Prepare respostas, riscos e argumentos com base na vaga e no seu histórico.",
    resumeLabel: "Currículo ou experiência",
    resumePlaceholder: "Cole seu currículo ou descreva sua experiência principal.",
    jobPlaceholder: "Cole a descrição da vaga para gerar perguntas e respostas direcionadas.",
    cta: "Preparar entrevista",
    empty: "Seu roteiro de preparação para entrevista aparecerá aqui."
  },
  translate_resume: {
    title: "Tradução e Adaptação Internacional",
    subtitle: "Adapte o currículo para o idioma, país e convenções do mercado-alvo.",
    resumeLabel: "Currículo original",
    resumePlaceholder: "Cole o currículo que deseja traduzir e adaptar.",
    jobPlaceholder: "Opcional: cole uma vaga para adaptar termos, senioridade e palavras-chave.",
    cta: "Traduzir e adaptar",
    empty: "Seu currículo traduzido e adaptado aparecerá aqui."
  }
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
  const steps = ["Analisando currículo", "Lendo descrição da vaga", "Comparando ATS", "Gerando documento", "Finalizando resultado"];
  const context = generatorContext[type];
  const visibleTypes = allowedTypes?.length ? types.filter((item) => allowedTypes.includes(item.value)) : types;

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
        setUploadMessage(data.error || "Não consegui extrair o texto deste arquivo. Use PDF ou DOCX com texto selecionável; se for escaneado ou imagem, cole o conteúdo manualmente no campo abaixo.");
        return;
      }

      setResume(data.text);
      setUploadMessage(`Currículo importado com sucesso: ${Math.round(data.text.length / 100) / 10} mil caracteres extraídos.`);
    } catch {
      setUploadMessage("Não consegui concluir o upload. Tente novamente ou cole o texto manualmente.");
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
      return;
    }

    setOutput(data.output);
    trackEvent("generation", { type });
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
          <div>
            <h1 className="text-2xl font-semibold">{context.title}</h1>
            <p className="mt-1 text-sm leading-6 text-white/60">{context.subtitle}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4">
          <Field label="Upload PDF/DOCX">
            <label className="focus-ring flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-brand-500/40 bg-brand-500/10 p-3 text-sm text-brand-50 hover:bg-brand-500/15">
              {loadingUpload ? <Loader2 className="animate-spin" size={18} /> : <FileUp size={18} />}
              {loadingUpload ? "Lendo arquivo..." : "Importar currículo"}
              <input className="hidden" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => upload(event.target.files?.[0] || null)} />
            </label>
          </Field>
          {uploadMessage ? <p className="text-sm text-white/60">{uploadMessage}</p> : null}
          <p className="rounded-md border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/50">
            Aceitamos PDF e DOCX com texto real, até 5 MB. Se o arquivo for uma imagem ou PDF escaneado, a leitura automática pode não funcionar; nesse caso, cole o texto manualmente abaixo.
          </p>
          <Field label={context.resumeLabel}>
            <textarea className={textareaClass} value={resume} onChange={(e) => setResume(e.target.value)} placeholder={context.resumePlaceholder} />
          </Field>
          <Field label={copy.jobDescription}>
            <textarea className={textareaClass} value={jobDescription} onChange={(e) => setJobDescription(e.target.value)} placeholder={context.jobPlaceholder} />
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
                {visibleTypes.map((item) => <option key={item.value} value={item.value}>{copy.deliveryTypes[item.value]}</option>)}
              </select>
            </Field>
          </div>
          {error ? (
            <div className="rounded-md bg-coral/15 p-3 text-sm text-coral">
              <p className="flex items-center gap-2 font-semibold"><AlertTriangle size={16} /> {error}</p>
              {limitReached ? (
                <div className="mt-3 grid gap-2">
                  <p className="text-sm text-coral/85">Seu limite mensal renova no início do próximo mês. Para continuar hoje, faça upgrade.</p>
                  <Button href="/assinatura#planos" className="bg-brand-500 text-ink hover:bg-brand-600">Fazer upgrade para continuar</Button>
                </div>
              ) : null}
            </div>
          ) : null}
          <TurnstileWidget action="generation" onVerify={setTurnstileToken} resetSignal={captchaReset} />
          <Button type="button" className="bg-brand-500 text-white hover:bg-brand-600" onClick={generate} disabled={loading}>
            {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            {loading ? copy.generating : context.cta}
          </Button>
          {loading ? (
            <div className="rounded-md border border-brand-500/20 bg-brand-500/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-brand-50">
                <Loader2 className="animate-spin" size={17} />
                {steps[generationStep]}
              </div>
              <div className="mt-3 h-2 rounded-full bg-white/10">
                <div className="h-2 rounded-full bg-brand-500 transition-all duration-500" style={{ width: `${((generationStep + 1) / steps.length) * 100}%` }} />
              </div>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="min-h-[620px]">
        <div className="flex min-w-0 flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
          <h2 className="text-xl font-semibold">{copy.finalDocument}</h2>
          <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-end">
            <button
              type="button"
              onClick={copyOutput}
              disabled={!output}
              className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm text-white/80 disabled:opacity-40"
            >
              <Copy size={17} />
              {copied ? "Copiado" : "Copiar"}
            </button>
            <button
              type="button"
              onClick={generate}
              disabled={loading || !resume}
              className="focus-ring inline-flex h-10 items-center justify-center gap-2 rounded-md border border-white/10 px-3 text-sm text-white/80 disabled:opacity-40"
            >
              <RefreshCw size={17} />
              Gerar novamente
            </button>
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
          {loading ? "Preparando resultado premium..." : output || context.empty}
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

"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2, Upload, X } from "lucide-react";
import { DocumentPreviewShell, ExportBar, ProgressHeader, SectionAccordion, TemplatePicker } from "@/components/application-workspace";
import { cn, inputClass, textareaClass } from "@/components/ui";
import { emptyCertification, emptyEducation, emptyExperience, resumeTemplates, resumeToPlainText } from "@/lib/resumes/defaults";
import { importResumeText } from "@/lib/resumes/import";
import { calculateResumeScore } from "@/lib/resumes/score";
import type { ResumeData } from "@/lib/resumes/types";
import { ResumePreview } from "@/components/resumes/resume-preview";

type Props = {
  id?: string;
  initialTitle: string;
  initialData: ResumeData;
};

type ListName = "experience" | "education" | "certifications";

const personalLabels: Record<keyof ResumeData["personal"], string> = {
  name: "Nome completo",
  headline: "Título profissional",
  email: "E-mail",
  phone: "Telefone",
  location: "Localização",
  links: "Links profissionais"
};

function splitSkills(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium text-foreground/90">
      <span>{label}</span>
      {children}
    </label>
  );
}

function RichTextBox({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  function addBullet() {
    onChange(`${value}${value.endsWith("\n") || !value ? "" : "\n"}- `);
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium text-foreground/90">{label}</span>
        <button type="button" onClick={addBullet} className="focus-ring rounded-md border border-border px-2 py-1 text-xs text-foreground hover:bg-muted">
          + bullet
        </button>
      </div>
      <textarea className={textareaClass} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} />
    </div>
  );
}

function FloatingCard({
  title,
  subtitle,
  collapsed,
  onToggle,
  onDelete,
  onDragStart,
  onDrop,
  children
}: {
  title: string;
  subtitle?: string;
  collapsed: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onDragStart: () => void;
  onDrop: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={(event) => event.preventDefault()}
      onDrop={onDrop}
      className="rounded-xl border border-border bg-background/70 p-3 shadow-sm transition hover:border-primary/25 hover:bg-muted/35"
    >
      <div className="flex items-start justify-between gap-2">
        <button type="button" onClick={onToggle} className="focus-ring flex min-w-0 flex-1 items-start gap-2 text-left">
          <GripVertical size={17} className="mt-0.5 shrink-0 text-muted-foreground" />
          <span className="min-w-0">
            <span className="block truncate text-sm font-semibold text-foreground">{title}</span>
            {subtitle ? <span className="block truncate text-xs text-muted-foreground">{subtitle}</span> : null}
          </span>
        </button>
        <div className="flex shrink-0 gap-1">
          <button type="button" onClick={onToggle} className="focus-ring rounded-lg border border-border p-2 hover:bg-muted" aria-label={collapsed ? "Expandir" : "Contrair"}>
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
          <button type="button" onClick={onDelete} className="focus-ring rounded-lg border border-border p-2 hover:bg-muted" aria-label="Excluir">
            <Trash2 size={15} />
          </button>
        </div>
      </div>
      {!collapsed ? <div className="mt-3 space-y-3">{children}</div> : null}
    </div>
  );
}

function reorder<T>(items: T[], from: number, to: number) {
  const copy = [...items];
  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

export function ResumeEditor({ id, initialTitle, initialData }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [data, setData] = useState<ResumeData>(initialData);
  const [notice, setNotice] = useState("");
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [dragging, setDragging] = useState<{ list: ListName; index: number } | null>(null);
  const [importing, setImporting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const analysis = useMemo(() => calculateResumeScore(data), [data]);
  const readinessItems = [
    { label: "Contato", done: Boolean(data.personal.name && data.personal.email) },
    { label: "Cargo-alvo", done: Boolean(data.targetRole) },
    { label: "Resumo", done: Boolean(data.summary) },
    { label: "Experiência", done: data.experience.some((item) => Boolean(item.role || item.company || item.description)) },
    { label: "Habilidades", done: data.skills.length >= 6 }
  ];
  const nextAction = readinessItems.find((item) => !item.done)?.label || "Salvar e exportar";
  const readyToCreate = readinessItems.every((item) => item.done);

  function patch(next: Partial<ResumeData>) {
    setData((current) => ({ ...current, ...next }));
  }

  function toggle(idToToggle: string) {
    setCollapsed((current) => ({ ...current, [idToToggle]: !current[idToToggle] }));
  }

  function moveItem(list: ListName, from: number, to: number) {
    if (from === to || to < 0 || to >= data[list].length) return;
    if (list === "experience") patch({ experience: reorder(data.experience, from, to) });
    if (list === "education") patch({ education: reorder(data.education, from, to) });
    if (list === "certifications") patch({ certifications: reorder(data.certifications, from, to) });
  }

  async function save() {
    setNotice("");
    const response = await fetch(id ? `/api/resumes/${id}` : "/api/resumes", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, data })
    });
    const body = await response.json();
    setNotice(response.ok ? "Currículo salvo." : body.error || "Não foi possível salvar.");
    if (response.ok && !id && body.resume?.id) {
      router.replace(`/resumes/${body.resume.id}`);
      return;
    }
    if (response.ok) router.refresh();
  }

  async function importFile(file?: File) {
    if (!file) return;
    setImporting(true);
    setNotice("");
    const form = new FormData();
    form.append("file", file);
    const response = await fetch("/api/upload/parse", { method: "POST", body: form });
    const body = await response.json();
    setImporting(false);
    if (!response.ok) {
      setNotice(body.error || "Não consegui importar o arquivo.");
      return;
    }
    setData(importResumeText(body.text, data));
    setNotice("Arquivo importado. Revise os campos preenchidos antes de salvar.");
  }

  function dropOn(list: ListName, index: number) {
    if (dragging?.list !== list) return;
    moveItem(list, dragging.index, index);
    setDragging(null);
  }

  async function copyResume() {
    await navigator.clipboard.writeText(resumeToPlainText(data));
    setNotice("Currículo copiado em texto simples.");
  }

  function downloadTxt() {
    const blob = new Blob([resumeToPlainText(data)], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(title || "curriculo").replace(/[^\w-]+/g, "-").toLowerCase()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const completeness = Math.round((readinessItems.filter((item) => item.done).length / readinessItems.length) * 100);

  return (
    <div className="space-y-5">
      <div className="rounded-3xl border border-border bg-card p-5 shadow-sm">
        <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">Workspace de currículo</p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-foreground">Construtor de currículo</h1>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
              Importe, edite e acompanhe a versão final em tempo real antes de salvar ou exportar.
            </p>
          </div>
          <div className="min-w-[150px] rounded-2xl border border-primary/25 bg-primary/5 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-primary">Pontuação ATS</p>
            <p className="mt-1 text-4xl font-bold leading-none text-primary">{analysis.score}</p>
          </div>
        </div>
      </div>

      {notice ? (
        <div className="fixed bottom-5 right-5 z-50 max-w-sm rounded-2xl border border-border bg-card p-4 text-sm text-card-foreground shadow-2xl print:hidden">
          <div className="flex items-start justify-between gap-3">
            <p>{notice}</p>
            <button type="button" onClick={() => setNotice("")} className="focus-ring rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Fechar aviso">
              <X size={15} />
            </button>
          </div>
        </div>
      ) : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.92fr)_minmax(620px,1.08fr)]">
        <div className="space-y-4 print:hidden">
          <>
              <SectionAccordion title="Configuração do currículo" description="Defina idioma e cargo-alvo para organizar o documento." done={Boolean(data.targetRole)}>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Título interno"><input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
                  <Field label="Idioma final"><input className={inputClass} value={data.language} onChange={(event) => patch({ language: event.target.value })} /></Field>
                  <Field label="Cargo-alvo"><input className={inputClass} value={data.targetRole} onChange={(event) => patch({ targetRole: event.target.value })} /></Field>
                </div>
              </SectionAccordion>

              <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-semibold">Importar currículo existente</h2>
                    <p className="text-xs text-muted-foreground">PDF ou DOCX preenchera automaticamente campos possíveis.</p>
                  </div>
                  <label className="focus-ring inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-muted">
                    <Upload size={16} /> {importing ? "Importando..." : "Selecionar arquivo"}
                    <input type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" className="sr-only" onChange={(event) => importFile(event.target.files?.[0])} />
                  </label>
                </div>
              </section>

              <SectionAccordion title="Template do documento" description="Escolha visualmente a estrutura antes de exportar." done={Boolean(data.template)}>
                <TemplatePicker value={data.template} items={resumeTemplates} onChange={(template) => patch({ template: template as ResumeData["template"] })} />
              </SectionAccordion>

              <SectionAccordion title="Contato" description="Dados básicos usados no cabeçalho do currículo." done={Boolean(data.personal.name && data.personal.email)}>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(personalLabels) as Array<keyof ResumeData["personal"]>).map((field) => (
                    <Field key={field} label={personalLabels[field]}>
                      <input className={inputClass} value={data.personal[field]} onChange={(event) => patch({ personal: { ...data.personal, [field]: event.target.value } })} />
                    </Field>
                  ))}
                </div>
              </SectionAccordion>

              <SectionAccordion
                title="Resumo profissional"
                description="Síntese de posicionamento para recrutador e ATS."
                done={Boolean(data.summary)}
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">Resumo</h2>
                </div>
                <RichTextBox label="Resumo profissional" value={data.summary} onChange={(summary) => patch({ summary })} placeholder="Resumo profissional" />
              </SectionAccordion>

              <SectionAccordion title="Experiência" description="Cargos, empresas, datas e bullets de impacto." done={data.experience.some((item) => Boolean(item.role || item.company || item.description))}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">Experiência</h2>
                  <button type="button" onClick={() => patch({ experience: [...data.experience, emptyExperience()] })} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Plus size={14} /> Adicionar experiência</button>
                </div>
                {data.experience.map((item, index) => (
                  <FloatingCard key={item.id} title={item.role || `Experiência ${index + 1}`} subtitle={item.company} collapsed={Boolean(collapsed[item.id])} onToggle={() => toggle(item.id)} onDelete={() => patch({ experience: data.experience.filter((_, expIndex) => expIndex !== index) })} onDragStart={() => setDragging({ list: "experience", index })} onDrop={() => dropOn("experience", index)}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(["role", "company", "location", "start", "end"] as const).map((field) => <Field key={field} label={{ role: "Cargo", company: "Empresa", location: "Local", start: "Início", end: "Fim" }[field]}><input className={inputClass} value={item[field] as string} onChange={(event) => patch({ experience: data.experience.map((exp, expIndex) => expIndex === index ? { ...exp, [field]: event.target.value } : exp) })} /></Field>)}
                    </div>
                    <RichTextBox label="Descrição / bullets" value={item.description} onChange={(description) => patch({ experience: data.experience.map((exp, expIndex) => expIndex === index ? { ...exp, description } : exp) })} placeholder="Bullets ou descrição" />
                  </FloatingCard>
                ))}
              </SectionAccordion>

              <SectionAccordion title="Formação" description="Formação acadêmica e técnica." done={data.education.some((item) => Boolean(item.degree || item.school))}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">Formação</h2>
                  <button type="button" onClick={() => patch({ education: [...data.education, emptyEducation()] })} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Plus size={14} /> Adicionar formação</button>
                </div>
                {data.education.map((item, index) => (
                  <FloatingCard key={item.id} title={item.degree || `Formação ${index + 1}`} subtitle={item.school} collapsed={Boolean(collapsed[item.id])} onToggle={() => toggle(item.id)} onDelete={() => patch({ education: data.education.filter((_, eduIndex) => eduIndex !== index) })} onDragStart={() => setDragging({ list: "education", index })} onDrop={() => dropOn("education", index)}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(["degree", "school", "location", "start", "end"] as const).map((field) => <Field key={field} label={{ degree: "Curso / grau", school: "Instituição", location: "Local", start: "Início", end: "Fim" }[field]}><input className={inputClass} value={item[field]} onChange={(event) => patch({ education: data.education.map((edu, eduIndex) => eduIndex === index ? { ...edu, [field]: event.target.value } : edu) })} /></Field>)}
                    </div>
                    <RichTextBox label="Descrição" value={item.description} onChange={(description) => patch({ education: data.education.map((edu, eduIndex) => eduIndex === index ? { ...edu, description } : edu) })} placeholder="Honras, cursos ou detalhes relevantes" />
                  </FloatingCard>
                ))}
              </SectionAccordion>

              <SectionAccordion title="Certificações" description="Credenciais, cursos e evidências adicionais." done={data.certifications.some((item) => Boolean(item.name || item.issuer))} defaultOpen={false}>
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">Certificações</h2>
                  <button type="button" onClick={() => patch({ certifications: [...data.certifications, emptyCertification()] })} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Plus size={14} /> Adicionar certificação</button>
                </div>
                {data.certifications.map((item, index) => (
                  <FloatingCard key={item.id} title={item.name || `Certificação ${index + 1}`} subtitle={item.issuer} collapsed={Boolean(collapsed[item.id])} onToggle={() => toggle(item.id)} onDelete={() => patch({ certifications: data.certifications.filter((_, certIndex) => certIndex !== index) })} onDragStart={() => setDragging({ list: "certifications", index })} onDrop={() => dropOn("certifications", index)}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(["name", "issuer", "date", "credentialUrl"] as const).map((field) => <Field key={field} label={{ name: "Certificação", issuer: "Emissor", date: "Data", credentialUrl: "URL da credencial" }[field]}><input className={inputClass} value={item[field]} onChange={(event) => patch({ certifications: data.certifications.map((cert, certIndex) => certIndex === index ? { ...cert, [field]: event.target.value } : cert) })} /></Field>)}
                    </div>
                    <RichTextBox label="Descrição" value={item.description} onChange={(description) => patch({ certifications: data.certifications.map((cert, certIndex) => certIndex === index ? { ...cert, description } : cert) })} placeholder="Detalhes relevantes da certificação" />
                  </FloatingCard>
                ))}
              </SectionAccordion>

              <SectionAccordion title="Habilidades" description="Competências separadas por vírgula." done={data.skills.length >= 6}>
                <Field label="Habilidades separadas por vírgula"><textarea className={cn(textareaClass, "min-h-24")} value={data.skills.join(", ")} onChange={(event) => patch({ skills: splitSkills(event.target.value) })} placeholder="React, Tailwind, Liderança..." /></Field>
              </SectionAccordion>

              <SectionAccordion title="Idiomas" description="Idiomas separados por vírgula." done={data.languages.length > 0}>
                <Field label="Idiomas separados por vírgula"><textarea className={cn(textareaClass, "min-h-24")} value={data.languages.join(", ")} onChange={(event) => patch({ languages: splitSkills(event.target.value) })} placeholder="Português nativo, Inglês avançado, Francês intermediário..." /></Field>
              </SectionAccordion>

              <SectionAccordion
                title="Revisar e exportar"
                description="Etapa final: validar prontidão ATS, salvar e gerar a entrega."
                done={readyToCreate}
              >
                <div className="space-y-4">
                  <ProgressHeader
                    score={analysis.score}
                    completeness={completeness}
                    status="Prontidão ATS"
                    nextStep={nextAction}
                    items={readinessItems}
                  />
                  <div className="rounded-2xl border border-border bg-muted/25 p-3">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Entrega</p>
                    <ExportBar onSave={() => startTransition(save)} onPdf={() => window.print()} onCopy={copyResume} onTxt={downloadTxt} saving={isPending} />
                  </div>
                </div>
              </SectionAccordion>
            </>
        </div>

        <DocumentPreviewShell>
          <ResumePreview data={data} />
        </DocumentPreviewShell>
      </div>

    </div>
  );
}

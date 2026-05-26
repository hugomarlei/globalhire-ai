"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronDown, ChevronUp, Download, FileText, GripVertical, MessageCircle, Plus, Save, Sparkles, Trash2, Upload, X } from "lucide-react";
import { Button, cn, inputClass, textareaClass } from "@/components/ui";
import { emptyCertification, emptyEducation, emptyExperience, resumeColors, resumeTemplates } from "@/lib/resumes/defaults";
import { importResumeText } from "@/lib/resumes/import";
import { calculateResumeScore } from "@/lib/resumes/score";
import type { ResumeData } from "@/lib/resumes/types";
import { ResumePreview } from "@/components/resumes/resume-preview";

type Props = {
  id: string;
  initialTitle: string;
  initialData: ResumeData;
};

type ReviewResult = {
  categories: Array<{ key: string; title: string; score?: number; suggestions: string[] }>;
  improvedData: ResumeData;
};

type ChatMessage = { role: "user" | "assistant"; content: string };
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
      className="rounded-md border border-border bg-background p-3 shadow-sm"
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
          <button type="button" onClick={onToggle} className="focus-ring rounded-md border border-border p-2 hover:bg-muted" aria-label={collapsed ? "Expandir" : "Contrair"}>
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
          <button type="button" onClick={onDelete} className="focus-ring rounded-md border border-border p-2 hover:bg-muted" aria-label="Excluir">
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
  const [suggesting, setSuggesting] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [dragging, setDragging] = useState<{ list: ListName; index: number } | null>(null);
  const [activeTab, setActiveTab] = useState<"editor" | "review">("editor");
  const [review, setReview] = useState<ReviewResult | null>(null);
  const [reviewing, setReviewing] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const analysis = useMemo(() => calculateResumeScore(data), [data]);

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
    const response = await fetch(`/api/resumes/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, data })
    });
    const body = await response.json();
    setNotice(response.ok ? "Currículo salvo." : body.error || "Não foi possível salvar.");
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

  async function suggest(section: "summary" | "experience" | "education" | "certification", index = 0) {
    setSuggesting(`${section}-${index}`);
    setNotice("");
    const item = section === "experience" ? data.experience[index] : section === "education" ? data.education[index] : section === "certification" ? data.certifications[index] : null;
    const response = await fetch("/api/ai/suggest-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section,
        role: item && "role" in item ? item.role : item && "name" in item ? item.name : data.targetRole,
        company: item && "company" in item ? item.company : item && "issuer" in item ? item.issuer : "",
        currentDescription: section === "summary" ? data.summary : item?.description || "",
        jobDescription: data.targetJobDescription,
        language: data.language
      })
    });
    const body = await response.json();
    setSuggesting(null);
    if (!response.ok) {
      setNotice(body.error || "Não consegui gerar sugestões.");
      return;
    }
    const text = Array.isArray(body.bullets) ? body.bullets.map((bullet: string) => `- ${bullet}`).join("\n") : "";
    if (section === "summary") patch({ summary: body.bullets?.join(" ") || data.summary });
    if (section === "experience") patch({ experience: data.experience.map((exp, expIndex) => expIndex === index ? { ...exp, description: text } : exp) });
    if (section === "education") patch({ education: data.education.map((edu, eduIndex) => eduIndex === index ? { ...edu, description: text } : edu) });
    if (section === "certification") patch({ certifications: data.certifications.map((cert, certIndex) => certIndex === index ? { ...cert, description: text } : cert) });
  }

  async function reviewWithAi() {
    setReviewing(true);
    setNotice("");
    const response = await fetch("/api/ai/review-resume", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, language: data.language })
    });
    const body = await response.json();
    setReviewing(false);
    if (!response.ok) {
      setNotice(body.error || "Não consegui revisar o currículo.");
      return;
    }
    setReview(body);
    setActiveTab("review");
  }

  async function sendChat() {
    if (!chatInput.trim()) return;
    const question = chatInput.trim();
    const nextHistory: ChatMessage[] = [...chatHistory, { role: "user", content: question }];
    setChatHistory(nextHistory);
    setChatInput("");
    setChatLoading(true);
    const response = await fetch("/api/ai/resume-chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data, language: data.language, question, history: chatHistory.slice(-8) })
    });
    const body = await response.json();
    setChatLoading(false);
    setChatHistory([...nextHistory, { role: "assistant", content: response.ok ? body.answer : body.error || "Não consegui responder agora." }]);
  }

  function dropOn(list: ListName, index: number) {
    if (dragging?.list !== list) return;
    moveItem(list, dragging.index, index);
    setDragging(null);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Construtor de currículo</h1>
          <p className="text-sm text-muted-foreground">Importe, edite, revise com IA e acompanhe a versão final em tempo real.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => setChatOpen(true)} className="h-10 rounded-md bg-card px-3 text-card-foreground ring-1 ring-border hover:bg-muted">
            <MessageCircle size={16} /> Falar com a IA
          </Button>
          <Button onClick={reviewWithAi} disabled={reviewing} className="h-10 rounded-md bg-card px-3 text-card-foreground ring-1 ring-border hover:bg-muted">
            <Sparkles size={16} /> Revisão de IA
          </Button>
          <Button onClick={() => startTransition(save)} disabled={isPending} className="h-10 rounded-md px-3">
            <Save size={16} /> Salvar
          </Button>
          <Button onClick={() => window.print()} className="h-10 rounded-md bg-foreground px-3 text-background hover:bg-foreground/90">
            <Download size={16} /> PDF
          </Button>
        </div>
      </div>

      <div className="flex gap-2 print:hidden">
        <button type="button" onClick={() => setActiveTab("editor")} className={cn("focus-ring rounded-md px-3 py-2 text-sm", activeTab === "editor" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-card-foreground")}>Editor</button>
        <button type="button" onClick={() => setActiveTab("review")} className={cn("focus-ring rounded-md px-3 py-2 text-sm", activeTab === "review" ? "bg-primary text-primary-foreground" : "border border-border bg-card text-card-foreground")}>Revisão de IA</button>
      </div>

      {notice ? <p className="rounded-md border border-border bg-card p-3 text-sm text-card-foreground print:hidden">{notice}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(620px,1.05fr)]">
        <div className="space-y-4 print:hidden">
          {activeTab === "review" ? (
            <section className="rounded-md border border-border bg-card p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold">Relatório de revisão</h2>
                  <p className="text-xs text-muted-foreground">Aceite para aplicar as melhorias conservadoras sugeridas pela IA.</p>
                </div>
                <Button onClick={reviewWithAi} disabled={reviewing} className="h-10 rounded-md px-3">
                  <Sparkles size={16} /> Revisar
                </Button>
              </div>
              {review ? (
                <div className="space-y-3">
                  {review.categories.map((category) => (
                    <div key={category.key} className="rounded-md border border-border p-3">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold">{category.title}</h3>
                        {typeof category.score === "number" ? <span className="rounded-md bg-primary/10 px-2 py-1 text-xs font-bold text-primary">{category.score}</span> : null}
                      </div>
                      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                        {category.suggestions.map((item, index) => <li key={index}>{item}</li>)}
                      </ul>
                    </div>
                  ))}
                  <div className="flex flex-wrap gap-2">
                    <Button onClick={() => { setData(review.improvedData); setNotice("Sugestões aplicadas. Revise e salve o currículo."); }} className="h-10 rounded-md px-3">
                      <Check size={16} /> Aceitar sugestões
                    </Button>
                    <button type="button" onClick={() => setReview(null)} className="focus-ring inline-flex h-10 items-center gap-2 rounded-md border border-border px-3 text-sm hover:bg-muted">
                      <X size={16} /> Rejeitar
                    </button>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">Clique em Revisar para gerar um relatório estruturado.</p>
              )}
            </section>
          ) : (
            <>
              <section className="rounded-md border border-border bg-card p-4">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><FileText size={16} /> Configuração</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Título interno"><input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} /></Field>
                  <Field label="Idioma final"><input className={inputClass} value={data.language} onChange={(event) => patch({ language: event.target.value })} /></Field>
                  <Field label="Cargo-alvo"><input className={inputClass} value={data.targetRole} onChange={(event) => patch({ targetRole: event.target.value })} /></Field>
                  <Field label="Template"><select className={inputClass} value={data.template} onChange={(event) => patch({ template: event.target.value as ResumeData["template"] })}>{resumeTemplates.map((template) => <option key={template.key} value={template.key}>{template.label}</option>)}</select></Field>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {resumeColors.map((color) => <button key={color} type="button" aria-label={`Cor ${color}`} onClick={() => patch({ primaryColor: color })} className={cn("size-8 rounded-full border-2", data.primaryColor === color ? "border-foreground" : "border-transparent")} style={{ backgroundColor: color }} />)}
                </div>
                <Field label="Descrição da vaga para orientar IA e ATS score"><textarea className={cn(textareaClass, "mt-3 min-h-28")} value={data.targetJobDescription} onChange={(event) => patch({ targetJobDescription: event.target.value })} /></Field>
              </section>

              <section className="rounded-md border border-border bg-card p-4">
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

              <section className="rounded-md border border-border bg-card p-4">
                <h2 className="mb-3 text-sm font-semibold">Pontuação ATS</h2>
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-primary">{analysis.score}</div>
                  <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary" style={{ width: `${analysis.score}%` }} /></div>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{analysis.recommendations[0]}</p>
              </section>

              <section className="rounded-md border border-border bg-card p-4">
                <h2 className="mb-3 text-sm font-semibold">Informações pessoais</h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {(Object.keys(personalLabels) as Array<keyof ResumeData["personal"]>).map((field) => (
                    <Field key={field} label={personalLabels[field]}>
                      <input className={inputClass} value={data.personal[field]} onChange={(event) => patch({ personal: { ...data.personal, [field]: event.target.value } })} />
                    </Field>
                  ))}
                </div>
              </section>

              <section className="rounded-md border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">Resumo</h2>
                  <button type="button" onClick={() => suggest("summary")} disabled={suggesting === "summary-0"} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted disabled:opacity-60"><Sparkles size={14} /> Obter ajuda de escrita</button>
                </div>
                <RichTextBox label="Resumo profissional" value={data.summary} onChange={(summary) => patch({ summary })} placeholder="Resumo profissional" />
              </section>

              <section className="space-y-3 rounded-md border border-border bg-card p-4">
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
                    <button type="button" onClick={() => suggest("experience", index)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Sparkles size={14} /> Obter ajuda de escrita</button>
                  </FloatingCard>
                ))}
              </section>

              <section className="space-y-3 rounded-md border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-sm font-semibold">Educação</h2>
                  <button type="button" onClick={() => patch({ education: [...data.education, emptyEducation()] })} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Plus size={14} /> Adicionar educação</button>
                </div>
                {data.education.map((item, index) => (
                  <FloatingCard key={item.id} title={item.degree || `Educação ${index + 1}`} subtitle={item.school} collapsed={Boolean(collapsed[item.id])} onToggle={() => toggle(item.id)} onDelete={() => patch({ education: data.education.filter((_, eduIndex) => eduIndex !== index) })} onDragStart={() => setDragging({ list: "education", index })} onDrop={() => dropOn("education", index)}>
                    <div className="grid gap-3 sm:grid-cols-2">
                      {(["degree", "school", "location", "start", "end"] as const).map((field) => <Field key={field} label={{ degree: "Curso / grau", school: "Instituição", location: "Local", start: "Início", end: "Fim" }[field]}><input className={inputClass} value={item[field]} onChange={(event) => patch({ education: data.education.map((edu, eduIndex) => eduIndex === index ? { ...edu, [field]: event.target.value } : edu) })} /></Field>)}
                    </div>
                    <RichTextBox label="Descrição" value={item.description} onChange={(description) => patch({ education: data.education.map((edu, eduIndex) => eduIndex === index ? { ...edu, description } : edu) })} placeholder="Honras, cursos ou detalhes relevantes" />
                    <button type="button" onClick={() => suggest("education", index)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Sparkles size={14} /> Obter ajuda de escrita</button>
                  </FloatingCard>
                ))}
              </section>

              <section className="space-y-3 rounded-md border border-border bg-card p-4">
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
                    <button type="button" onClick={() => suggest("certification", index)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Sparkles size={14} /> Obter ajuda de escrita</button>
                  </FloatingCard>
                ))}
              </section>

              <section className="rounded-md border border-border bg-card p-4">
                <h2 className="mb-3 text-sm font-semibold">Habilidades</h2>
                <Field label="Habilidades separadas por vírgula"><textarea className={cn(textareaClass, "min-h-24")} value={data.skills.join(", ")} onChange={(event) => patch({ skills: splitSkills(event.target.value) })} placeholder="React, Tailwind, Liderança..." /></Field>
              </section>
            </>
          )}
        </div>

        <div className="min-w-0 overflow-auto rounded-md border border-border bg-slate-100 p-3 print:overflow-visible print:border-0 print:bg-white print:p-0">
          <ResumePreview data={data} />
        </div>
      </div>

      {chatOpen ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 print:hidden">
          <div className="flex max-h-[82vh] w-full max-w-2xl flex-col rounded-md border border-border bg-card text-card-foreground shadow-xl">
            <div className="flex items-center justify-between gap-3 border-b border-border p-4">
              <div>
                <h2 className="font-semibold">Falar com a IA</h2>
                <p className="text-xs text-muted-foreground">A resposta respeita o idioma do currículo: {data.language}.</p>
              </div>
              <button type="button" onClick={() => setChatOpen(false)} className="focus-ring rounded-md border border-border p-2 hover:bg-muted"><X size={16} /></button>
            </div>
            <div className="min-h-0 flex-1 space-y-3 overflow-auto p-4">
              {chatHistory.length ? chatHistory.map((message, index) => (
                <div key={index} className={cn("rounded-md p-3 text-sm", message.role === "user" ? "ml-8 bg-primary text-primary-foreground" : "mr-8 bg-muted text-foreground")}>{message.content}</div>
              )) : <p className="text-sm text-muted-foreground">Pergunte sobre posicionamento, bullets, resumo ou adaptação para a vaga.</p>}
              {chatLoading ? <p className="text-sm text-muted-foreground">A IA está pensando...</p> : null}
            </div>
            <div className="border-t border-border p-4">
              <textarea className={cn(textareaClass, "min-h-24")} value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Escreva sua pergunta..." />
              <div className="mt-3 flex justify-end">
                <Button onClick={sendChat} disabled={chatLoading || !chatInput.trim()} className="h-10 rounded-md px-3">Enviar</Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

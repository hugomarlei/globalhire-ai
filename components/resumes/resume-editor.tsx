"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Download, FileText, Plus, Save, Sparkles, Trash2 } from "lucide-react";
import { Button, cn, inputClass, textareaClass } from "@/components/ui";
import { emptyEducation, emptyExperience, resumeColors, resumeTemplates } from "@/lib/resumes/defaults";
import { calculateResumeScore } from "@/lib/resumes/score";
import type { ResumeData } from "@/lib/resumes/types";
import { ResumePreview } from "@/components/resumes/resume-preview";

type Props = {
  id: string;
  initialTitle: string;
  initialData: ResumeData;
};

function splitSkills(value: string) {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function ResumeEditor({ id, initialTitle, initialData }: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [data, setData] = useState<ResumeData>(initialData);
  const [notice, setNotice] = useState("");
  const [suggesting, setSuggesting] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const analysis = useMemo(() => calculateResumeScore(data), [data]);

  function patch(next: Partial<ResumeData>) {
    setData((current) => ({ ...current, ...next }));
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

  async function suggest(section: "summary" | "experience" | "education", index = 0) {
    setSuggesting(`${section}-${index}`);
    setNotice("");
    const item = section === "experience" ? data.experience[index] : section === "education" ? data.education[index] : null;
    const response = await fetch("/api/ai/suggest-description", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        section,
        role: item && "role" in item ? item.role : data.targetRole,
        company: item && "company" in item ? item.company : "",
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
    if (section === "experience") {
      const experience = data.experience.map((exp, expIndex) => expIndex === index ? { ...exp, description: text } : exp);
      patch({ experience });
    }
    if (section === "education") {
      const education = data.education.map((edu, eduIndex) => eduIndex === index ? { ...edu, description: text } : edu);
      patch({ education });
    }
  }

  function printPdf() {
    window.print();
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold text-foreground">Construtor de currículo</h1>
          <p className="text-sm text-muted-foreground">Edite à esquerda e acompanhe a versão final em tempo real.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => startTransition(save)} disabled={isPending} className="h-10 rounded-md px-3">
            <Save size={16} /> Salvar
          </Button>
          <Button onClick={printPdf} className="h-10 rounded-md bg-foreground px-3 text-background hover:bg-foreground/90">
            <Download size={16} /> PDF
          </Button>
        </div>
      </div>

      {notice ? <p className="rounded-md border border-border bg-card p-3 text-sm text-card-foreground">{notice}</p> : null}

      <div className="grid gap-5 xl:grid-cols-[minmax(0,0.95fr)_minmax(620px,1.05fr)]">
        <div className="space-y-4 print:hidden">
          <section className="rounded-md border border-border bg-card p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><FileText size={16} /> Configuração</div>
            <div className="grid gap-3 sm:grid-cols-2">
              <input className={inputClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Título interno" />
              <input className={inputClass} value={data.language} onChange={(event) => patch({ language: event.target.value })} placeholder="Idioma final" />
              <input className={inputClass} value={data.targetRole} onChange={(event) => patch({ targetRole: event.target.value })} placeholder="Cargo-alvo" />
              <select className={inputClass} value={data.template} onChange={(event) => patch({ template: event.target.value as ResumeData["template"] })}>
                {resumeTemplates.map((template) => <option key={template.key} value={template.key}>{template.label}</option>)}
              </select>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {resumeColors.map((color) => (
                <button key={color} type="button" aria-label={color} onClick={() => patch({ primaryColor: color })} className={cn("size-8 rounded-full border-2", data.primaryColor === color ? "border-foreground" : "border-transparent")} style={{ backgroundColor: color }} />
              ))}
            </div>
            <textarea className={cn(textareaClass, "mt-3 min-h-28")} value={data.targetJobDescription} onChange={(event) => patch({ targetJobDescription: event.target.value })} placeholder="Descrição da vaga para orientar IA e ATS score" />
          </section>

          <section className="rounded-md border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Pontuação ATS</h2>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold text-primary">{analysis.score}</div>
              <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-primary" style={{ width: `${analysis.score}%` }} />
              </div>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">{analysis.recommendations[0]}</p>
          </section>

          <section className="rounded-md border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Informações pessoais</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["name", "headline", "email", "phone", "location", "links"] as const).map((field) => (
                <input key={field} className={inputClass} value={data.personal[field]} onChange={(event) => patch({ personal: { ...data.personal, [field]: event.target.value } })} placeholder={field} />
              ))}
            </div>
          </section>

          <section className="rounded-md border border-border bg-card p-4">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Resumo</h2>
              <button type="button" onClick={() => suggest("summary")} disabled={suggesting === "summary-0"} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted disabled:opacity-60"><Sparkles size={14} /> IA</button>
            </div>
            <textarea className={textareaClass} value={data.summary} onChange={(event) => patch({ summary: event.target.value })} placeholder="Resumo profissional" />
          </section>

          <section className="space-y-3 rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Experiência</h2>
              <button type="button" onClick={() => patch({ experience: [...data.experience, emptyExperience()] })} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Plus size={14} /> Adicionar</button>
            </div>
            {data.experience.map((item, index) => (
              <div key={item.id} className="space-y-3 rounded-md border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["role", "company", "location", "start", "end"] as const).map((field) => (
                    <input key={field} className={inputClass} value={item[field] as string} onChange={(event) => patch({ experience: data.experience.map((exp, expIndex) => expIndex === index ? { ...exp, [field]: event.target.value } : exp) })} placeholder={field} />
                  ))}
                </div>
                <textarea className={textareaClass} value={item.description} onChange={(event) => patch({ experience: data.experience.map((exp, expIndex) => expIndex === index ? { ...exp, description: event.target.value } : exp) })} placeholder="Bullets ou descrição" />
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => suggest("experience", index)} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Sparkles size={14} /> Obter ajuda de escrita</button>
                  <button type="button" onClick={() => patch({ experience: data.experience.filter((_, expIndex) => expIndex !== index) })} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Trash2 size={14} /> Remover</button>
                </div>
              </div>
            ))}
          </section>

          <section className="space-y-3 rounded-md border border-border bg-card p-4">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold">Educação</h2>
              <button type="button" onClick={() => patch({ education: [...data.education, emptyEducation()] })} className="focus-ring inline-flex items-center gap-2 rounded-md border border-border px-3 py-2 text-xs hover:bg-muted"><Plus size={14} /> Adicionar</button>
            </div>
            {data.education.map((item, index) => (
              <div key={item.id} className="space-y-3 rounded-md border border-border p-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  {(["degree", "school", "location", "start", "end"] as const).map((field) => (
                    <input key={field} className={inputClass} value={item[field]} onChange={(event) => patch({ education: data.education.map((edu, eduIndex) => eduIndex === index ? { ...edu, [field]: event.target.value } : edu) })} placeholder={field} />
                  ))}
                </div>
                <textarea className={textareaClass} value={item.description} onChange={(event) => patch({ education: data.education.map((edu, eduIndex) => eduIndex === index ? { ...edu, description: event.target.value } : edu) })} placeholder="Descrição, honras ou cursos relevantes" />
              </div>
            ))}
          </section>

          <section className="rounded-md border border-border bg-card p-4">
            <h2 className="mb-3 text-sm font-semibold">Habilidades</h2>
            <textarea className={cn(textareaClass, "min-h-24")} value={data.skills.join(", ")} onChange={(event) => patch({ skills: splitSkills(event.target.value) })} placeholder="React, Tailwind, Liderança..." />
          </section>
        </div>

        <div className="min-w-0 overflow-auto rounded-md border border-border bg-slate-100 p-3 print:overflow-visible print:border-0 print:bg-white print:p-0">
          <ResumePreview data={data} />
        </div>
      </div>
    </div>
  );
}

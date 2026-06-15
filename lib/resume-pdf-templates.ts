import type { PdfTemplateKey } from "@/lib/i18n-generator";
import type { ResumeData } from "@/lib/resumes/types";

/** Extensible grouping for UI hints (ATS-first vs modern accents). */
export type ResumePdfTemplateCategory = "ats" | "modern" | "compact";

export const resumePdfTemplateMeta: Record<PdfTemplateKey, { category: ResumePdfTemplateCategory }> = {
  executive: { category: "ats" },
  modern: { category: "modern" },
  compact: { category: "compact" }
};

function escapeHtml(value: string) {
  const entities: Record<string, string> = { "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;" };
  return value.replace(/[<>&"]/g, (char) => entities[char] || char);
}

function bulletLines(value: string) {
  return value
    .split(/\n+/)
    .map((item) => item.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean);
}

function renderSection(title: string, body: string, color: string) {
  if (!body.trim()) return "";
  return `
    <section class="section">
      <h2 style="border-color:${color};color:${color}">${escapeHtml(title)}</h2>
      ${body}
    </section>
  `;
}

function renderExperience(data: ResumeData) {
  const items = data.experience.filter((item) => item.role || item.company || item.description);
  if (!items.length) return "";
  return renderSection(
    "Experiência",
    `<div class="entries">${items.map((item) => `
      <article class="entry">
        <div class="entry-head">
          <h3>${escapeHtml([item.role, item.company].filter(Boolean).join(" - ") || "Experiência")}</h3>
          <span>${escapeHtml([item.start, item.current ? "Atual" : item.end].filter(Boolean).join(" - "))}</span>
        </div>
        ${item.location ? `<p class="meta">${escapeHtml(item.location)}</p>` : ""}
        <ul>${bulletLines(item.description).map((line) => `<li>${escapeHtml(line)}</li>`).join("")}</ul>
      </article>
    `).join("")}</div>`,
    data.primaryColor || "#0f766e"
  );
}

function renderEducation(data: ResumeData) {
  const items = data.education.filter((item) => item.degree || item.school || item.description);
  if (!items.length) return "";
  return renderSection(
    "Formação",
    `<div class="entries compact">${items.map((item) => `
      <article class="entry">
        <h3>${escapeHtml([item.degree, item.school].filter(Boolean).join(" - ") || "Formação")}</h3>
        <p class="meta">${escapeHtml([item.location, item.start, item.end].filter(Boolean).join(" | "))}</p>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      </article>
    `).join("")}</div>`,
    data.primaryColor || "#0f766e"
  );
}

function renderCertifications(data: ResumeData) {
  const items = data.certifications.filter((item) => item.name || item.issuer || item.description);
  if (!items.length) return "";
  return renderSection(
    "Certificações",
    `<div class="entries compact">${items.map((item) => `
      <article class="entry">
        <h3>${escapeHtml([item.name, item.issuer].filter(Boolean).join(" - ") || "Certificação")}</h3>
        <p class="meta">${escapeHtml([item.date, item.credentialUrl].filter(Boolean).join(" | "))}</p>
        ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ""}
      </article>
    `).join("")}</div>`,
    data.primaryColor || "#0f766e"
  );
}

function renderLanguages(data: ResumeData) {
  const items = data.languages.filter(Boolean);
  if (!items.length) return "";
  return renderSection("Idiomas", `<p>${escapeHtml(items.join(" | "))}</p>`, data.primaryColor || "#0f766e");
}

/**
 * Print-optimized CSS for browser PDF export. Keeps logic out of the UI component
 * so new templates can be registered here without touching React.
 */
export function buildResumePdfPrintStyles(template: PdfTemplateKey): string {
  const base = `
    @page { margin: 14mm 16mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 0;
      color: #0f172a;
      line-height: 1.52;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .sheet { max-width: 780px; margin: 0 auto; }
    .doc {
      margin: 0;
      white-space: pre-wrap;
      font-family: ui-sans-serif, system-ui, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      font-size: 11.5pt;
      letter-spacing: 0.01em;
    }
    .watermark {
      position: fixed;
      inset: auto 12mm 10mm auto;
      color: rgba(15, 23, 42, 0.32);
      border: 1px solid rgba(15, 23, 42, 0.14);
      padding: 6px 10px;
      font-size: 9pt;
      border-radius: 4px;
    }
  `;

  const variants: Record<PdfTemplateKey, string> = {
    executive: `
      body { background: #ffffff; }
      .sheet { padding: 8mm 2mm 0 2mm; }
      .doc {
        font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
        font-size: 11pt;
        line-height: 1.48;
      }
    `,
    modern: `
      body { background: #f1f5f9; }
      .sheet {
        padding: 10mm 12mm 12mm 14mm;
        background: #ffffff;
        border-left: 6px solid #10b981;
        border-radius: 2px;
        box-shadow: 0 1px 0 rgba(15, 23, 42, 0.06);
      }
      .doc { font-size: 11.5pt; }
    `,
    compact: `
      body { background: #ffffff; }
      .sheet { padding: 6mm 1mm 0 1mm; max-width: 720px; }
      .doc {
        font-family: Georgia, "Times New Roman", serif;
        font-size: 10.5pt;
        line-height: 1.42;
      }
    `
  };

  return `${base}\n${variants[template]}`;
}

export function buildResumePdfPrintDocument(opts: {
  template: PdfTemplateKey;
  title: string;
  body: string;
  /** Plain text; escaped for HTML. */
  watermarkText?: string;
}): string {
  const styles = buildResumePdfPrintStyles(opts.template);
  const safeTitle = escapeHtml(opts.title);
  const safeBody = escapeHtml(opts.body);
  const wm =
    opts.watermarkText && opts.watermarkText.trim()
      ? `<div class="watermark">${escapeHtml(opts.watermarkText)}</div>`
      : "";
  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>${safeTitle}</title><style>${styles}</style></head><body><main class="sheet"><pre class="doc">${safeBody}</pre></main>${wm}</body></html>`;
}

export function buildStructuredResumePdfPrintDocument(opts: {
  template: PdfTemplateKey;
  title: string;
  data: ResumeData;
  watermarkText?: string;
}): string {
  const color = opts.data.primaryColor || "#0f766e";
  const safeTitle = escapeHtml(opts.title);
  const isModern = opts.template === "modern";
  const isCompact = opts.template === "compact";
  const wm =
    opts.watermarkText && opts.watermarkText.trim()
      ? `<div class="watermark">${escapeHtml(opts.watermarkText)}</div>`
      : "";
  const skills = opts.data.skills.filter(Boolean).join(" | ");
  const contact = [
    opts.data.personal.email,
    opts.data.personal.phone,
    opts.data.personal.location,
    opts.data.personal.links
  ].filter(Boolean).join(" | ");
  const sidebar = isModern
    ? `<aside class="sidebar" style="background:${color}">
        <header>
          <h1>${escapeHtml(opts.data.personal.name || "Seu Nome")}</h1>
          <p>${escapeHtml(opts.data.personal.headline || opts.data.targetRole || "Cargo-alvo")}</p>
          <small>${escapeHtml(contact)}</small>
        </header>
        ${skills ? `<section><h2>Skills</h2><p>${escapeHtml(skills)}</p></section>` : ""}
        ${opts.data.languages.length ? `<section><h2>Idiomas</h2><p>${escapeHtml(opts.data.languages.join(" | "))}</p></section>` : ""}
        ${opts.data.education.some((item) => item.degree || item.school)
          ? `<section><h2>Formação</h2>${opts.data.education.filter((item) => item.degree || item.school).map((item) => `
              <div class="side-item"><strong>${escapeHtml(item.degree || "Formação")}</strong><span>${escapeHtml(item.school)}</span><small>${escapeHtml([item.start, item.end].filter(Boolean).join(" - "))}</small></div>
            `).join("")}</section>`
          : ""}
      </aside>`
    : "";

  const header = isModern
    ? ""
    : `<header class="header" style="border-color:${color}">
        <h1>${escapeHtml(opts.data.personal.name || "Seu Nome")}</h1>
        <p>${escapeHtml(opts.data.personal.headline || opts.data.targetRole || "Cargo-alvo")}</p>
        <small>${escapeHtml(contact)}</small>
      </header>`;

  const content = `
    ${header}
    ${opts.data.summary ? renderSection("Resumo", `<p>${escapeHtml(opts.data.summary)}</p>`, color) : ""}
    ${renderExperience(opts.data)}
    ${isModern ? "" : renderEducation(opts.data)}
    ${isModern || !skills ? "" : renderSection("Habilidades", `<p>${escapeHtml(skills)}</p>`, color)}
    ${isModern || !opts.data.languages.length ? "" : renderLanguages(opts.data)}
    ${isModern ? "" : renderCertifications(opts.data)}
  `;

  const styles = `
    @page { margin: 11mm 13mm; }
    * { box-sizing: border-box; }
    body { margin:0; color:#0f172a; background:#fff; font-family:${isCompact ? "Georgia, 'Times New Roman', serif" : "Arial, Helvetica, sans-serif"}; line-height:${isCompact ? "1.34" : "1.4"}; -webkit-print-color-adjust:exact; print-color-adjust:exact; }
    .sheet { max-width:${isCompact ? "720px" : "820px"}; margin:0 auto; background:#fff; ${isModern ? "display:grid;grid-template-columns:0.72fr 1.28fr;min-height:100vh;" : "padding:0 2mm;"} }
    .content { padding:${isModern ? "9mm" : "0"}; }
    .header { border-bottom:1.5px solid; padding-bottom:11px; margin-bottom:14px; ${opts.template === "executive" ? `border-top:6px solid ${color}; padding-top:10px;` : ""} }
    h1 { margin:0; font-size:${isCompact ? "22pt" : "25pt"}; line-height:1.05; letter-spacing:0; }
    .header p, .sidebar header p { margin:6px 0 4px; font-size:10.5pt; font-weight:700; }
    small, .meta { color:#64748b; font-size:8.5pt; }
    .section { margin:0 0 12px; }
    .section h2 { margin:0 0 6px; border-bottom:1.5px solid; padding-bottom:3px; font-size:8.4pt; text-transform:uppercase; letter-spacing:.1em; }
    .section p { margin:0; font-size:9.5pt; }
    .entries { display:grid; gap:9px; }
    .entries.compact { gap:6px; }
    .entry { break-inside:avoid; }
    .entry-head { display:flex; justify-content:space-between; gap:12px; align-items:baseline; }
    h3 { margin:0; font-size:10pt; line-height:1.3; }
    .entry-head span { color:#64748b; font-size:8.5pt; white-space:nowrap; }
    ul { margin:5px 0 0 16px; padding:0; }
    li { margin:0 0 2px; font-size:9.2pt; }
    .sidebar { color:#fff; padding:9mm 6mm; }
    .sidebar h1 { font-size:21pt; }
    .sidebar small, .sidebar span { color:rgba(255,255,255,.75); }
    .sidebar section { margin-top:18px; }
    .sidebar h2 { margin:0 0 8px; color:rgba(255,255,255,.72); font-size:8.5pt; text-transform:uppercase; letter-spacing:.13em; }
    .side-item { display:grid; gap:2px; margin-bottom:10px; font-size:9pt; }
    .watermark { position:fixed; inset:auto 12mm 10mm auto; color:rgba(15,23,42,.32); border:1px solid rgba(15,23,42,.14); padding:6px 10px; font-size:9pt; border-radius:4px; }
  `;

  return `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"/><title>${safeTitle}</title><style>${styles}</style></head><body><main class="sheet">${sidebar}<div class="content">${content}</div></main>${wm}</body></html>`;
}

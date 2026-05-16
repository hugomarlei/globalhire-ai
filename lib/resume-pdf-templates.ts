import type { PdfTemplateKey } from "@/lib/i18n-generator";

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

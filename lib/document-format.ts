export type ParsedAiOutput = {
  document: string;
  recommendations: string[];
};

function stripCodeFence(value: string) {
  return value
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
}

function extractTaggedSection(value: string, tag: "DOCUMENT_FINAL" | "RECOMMENDATIONS") {
  const match = value.match(new RegExp(`<${tag}>\\s*([\\s\\S]*?)\\s*</${tag}>`, "i"));
  return match?.[1]?.trim() || "";
}

function extractImprovementSection(value: string) {
  return (
    value.match(/<APPLIED_IMPROVEMENTS>\s*([\s\S]*?)\s*<\/APPLIED_IMPROVEMENTS>/i)?.[1]?.trim() ||
    extractTaggedSection(value, "RECOMMENDATIONS")
  );
}

function unescapeJsonLikeString(value: string) {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\")
    .trim();
}

function extractMalformedJsonField(value: string, field: string) {
  const fieldStart = value.search(new RegExp(`["']?${field}["']?\\s*:`, "i"));
  if (fieldStart < 0) return "";

  const afterField = value.slice(fieldStart).replace(new RegExp(`^["']?${field}["']?\\s*:\\s*`, "i"), "");
  const nextRecommendations = afterField.search(/,\s*["']?(?:recommendations|melhorias_recomendadas)["']?\s*:/i);
  const raw = nextRecommendations >= 0 ? afterField.slice(0, nextRecommendations) : afterField;

  return unescapeJsonLikeString(
    raw
      .replace(/^\s*["']/, "")
      .replace(/["']?\s*[,}]\s*$/, "")
      .replace(/^\s*{\s*/, "")
      .trim()
  );
}

export function normalizeDocumentText(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/^\s*```(?:text|markdown)?\s*/i, "")
    .replace(/\s*```\s*$/i, "")
    .split("\n")
    .map((line) =>
      line
        .replace(/^\s*{\s*$/, "")
        .replace(/^\s*["']?(?:final_document|document)["']?\s*:\s*["']?/i, "")
        .replace(/^\s*["']?(?:recommendations|melhorias_recomendadas)["']?\s*:\s*\[?/i, "")
        .replace(/^\s*<\/?(?:DOCUMENT_FINAL|RECOMMENDATIONS)>\s*$/i, "")
        .replace(/^\s*\+\s?/, "")
        .replace(/^\s*[-*]\s+/, "• ")
        .replace(/^#{1,6}\s+/, "")
        .replace(/\*\*/g, "")
        .replace(/__/g, "")
        .trimEnd()
    )
    .join("\n")
    .replace(
      /^((?:Location|Localização|Localização profissional|Ubicación|Localisation|Standort)\s*:[^\n]+)\n(?=(?:Professional Summary|Resumo profissional|Resumo Profissional|Resumen profesional|Profil professionnel|Berufliches Profil))/gim,
      "$1\n\n"
    )
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function normalizeRecommendations(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => normalizeDocumentText(String(item)))
      .filter(Boolean)
      .slice(0, 8);
  }

  if (typeof value === "string") {
    return value
      .split("\n")
      .map((line) => normalizeDocumentText(line).replace(/^•\s*/, ""))
      .filter(Boolean)
      .slice(0, 8);
  }

  return [];
}

export function parseAiOutput(raw: string): ParsedAiOutput {
  const cleanRaw = stripCodeFence(raw);
  const taggedDocument = extractTaggedSection(cleanRaw, "DOCUMENT_FINAL");

  if (taggedDocument) {
    return {
      document: normalizeDocumentText(taggedDocument),
      recommendations: normalizeRecommendations(extractImprovementSection(cleanRaw))
    };
  }

  try {
    const parsed = JSON.parse(cleanRaw) as {
      final_document?: unknown;
      document?: unknown;
      applied_improvements?: unknown;
      recommendations?: unknown;
      melhorias_recomendadas?: unknown;
    };

    const document = normalizeDocumentText(String(parsed.final_document || parsed.document || ""));
    const recommendations = normalizeRecommendations(
      parsed.applied_improvements || parsed.recommendations || parsed.melhorias_recomendadas
    );

    if (document) {
      return { document, recommendations };
    }
  } catch {
    // Some models may still answer in prose. The fallback below keeps the PDF clean.
  }

  const malformedJsonDocument =
    extractMalformedJsonField(cleanRaw, "final_document") || extractMalformedJsonField(cleanRaw, "document");

  if (malformedJsonDocument) {
    return {
      document: normalizeDocumentText(malformedJsonDocument),
      recommendations: normalizeRecommendations(
        extractMalformedJsonField(cleanRaw, "applied_improvements") || extractMalformedJsonField(cleanRaw, "recommendations")
      )
    };
  }

  const split = cleanRaw.split(/\n\s*(?:#{1,6}\s*)?(?:\*\*)?(?:Melhorias aplicadas|Melhorias recomendadas|Recomendacoes|Recomendações|Recommendations|Applied Improvements)(?:\*\*)?\s*:?\s*\n/i);
  const document = normalizeDocumentText(split[0] || cleanRaw);
  const recommendations = normalizeRecommendations(split[1] || "");

  return { document, recommendations };
}

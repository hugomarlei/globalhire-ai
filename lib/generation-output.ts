import { normalizeResumeData, resumeToPlainText } from "@/lib/resumes/defaults";
import type { ResumeData } from "@/lib/resumes/types";

const STRUCTURED_PREFIX = "__GLOBALHIRE_STRUCTURED_RESUME__:";

type StructuredResumePayload = {
  kind: "structured_resume";
  version: 1;
  text: string;
  data: ResumeData;
};

function encodeBase64Url(value: string) {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf8").toString("base64url");
  }
  return btoa(unescape(encodeURIComponent(value))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function decodeBase64Url(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  if (typeof Buffer !== "undefined") {
    return Buffer.from(normalized, "base64").toString("utf8");
  }
  return decodeURIComponent(escape(atob(normalized)));
}

export function encodeStructuredResumeGeneration(data: ResumeData, text = resumeToPlainText(data)) {
  const payload: StructuredResumePayload = {
    kind: "structured_resume",
    version: 1,
    text,
    data: normalizeResumeData(data)
  };
  return `${STRUCTURED_PREFIX}${encodeBase64Url(JSON.stringify(payload))}`;
}

export function parseGenerationOutput(output: string) {
  const raw = String(output || "");
  if (!raw.startsWith(STRUCTURED_PREFIX)) {
    return {
      text: raw,
      data: null as ResumeData | null,
      structured: false
    };
  }

  try {
    const payload = JSON.parse(decodeBase64Url(raw.slice(STRUCTURED_PREFIX.length))) as Partial<StructuredResumePayload>;
    const data = payload.kind === "structured_resume" ? normalizeResumeData(payload.data) : null;
    return {
      text: String(payload.text || (data ? resumeToPlainText(data) : "")),
      data,
      structured: Boolean(data)
    };
  } catch {
    return {
      text: raw,
      data: null as ResumeData | null,
      structured: false
    };
  }
}

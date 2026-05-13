import { NextResponse } from "next/server";
import { getAppUrl, listVercelPreviewPublicOrigins } from "@/lib/app-url";

const ROOT_PRODUCTION_ORIGIN = "https://globalhireai.com.br";
const WWW_PRODUCTION_ORIGIN = "https://www.globalhireai.com.br";
const LOCAL_ORIGINS = ["http://localhost:3000", "http://127.0.0.1:3000"];

function originFrom(value: string | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

/**
 * Optional: same Vercel team project previews when hostname differs from VERCEL_URL
 * (set to full host suffix, e.g. `acme-123.vercel.app` — never use bare `vercel.app`).
 */
function isTrustedPreviewProjectHost(hostname: string) {
  if (process.env.VERCEL_ENV !== "preview") return false;
  const suffix = process.env.VERCEL_PREVIEW_PROJECT_HOST_SUFFIX?.trim().replace(/^\./, "");
  if (!suffix) return false;
  return hostname === suffix || hostname.endsWith(`.${suffix}`);
}

export function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function getAllowedOrigins() {
  const origins = new Set<string>(
    [originFrom(getAppUrl()), ROOT_PRODUCTION_ORIGIN, WWW_PRODUCTION_ORIGIN].filter(Boolean) as string[]
  );

  for (const preview of listVercelPreviewPublicOrigins()) {
    origins.add(preview);
  }

  if (process.env.NODE_ENV !== "production") {
    LOCAL_ORIGINS.forEach((origin) => origins.add(origin));
  }

  const configured = originFrom(process.env.NEXT_PUBLIC_APP_URL?.trim() || null);
  if (configured) origins.add(configured);

  return origins;
}

export function isSameOriginRequest(request: Request) {
  const origin = originFrom(request.headers.get("origin"));
  const refererOrigin = originFrom(request.headers.get("referer"));
  const requestOrigin = origin || refererOrigin;

  if (!requestOrigin) {
    return process.env.NODE_ENV !== "production";
  }

  if (getAllowedOrigins().has(requestOrigin)) {
    return true;
  }

  try {
    const { hostname } = new URL(requestOrigin);
    if (isTrustedPreviewProjectHost(hostname)) {
      return true;
    }
  } catch {
    /* ignore */
  }

  return false;
}

function shouldLogOriginDetails() {
  return process.env.NODE_ENV !== "production" || process.env.VERCEL_ENV === "preview" || process.env.VERCEL_ENV === "development";
}

export function rejectInvalidOrigin(request: Request) {
  if (isSameOriginRequest(request)) return null;

  if (shouldLogOriginDetails()) {
    console.warn("csrf_origin_rejected", {
      origin: request.headers.get("origin"),
      refererPrefix: request.headers.get("referer")?.slice(0, 96) ?? null,
      allowedOrigins: [...getAllowedOrigins()]
    });
  } else {
    console.warn("csrf_origin_rejected", {
      hasOrigin: Boolean(request.headers.get("origin")),
      hasReferer: Boolean(request.headers.get("referer"))
    });
  }

  return NextResponse.json(
    { error: "Não foi possível validar a origem da requisição. Recarregue a página e tente novamente." },
    { status: 403 }
  );
}

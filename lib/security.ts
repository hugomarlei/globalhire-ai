import { NextResponse } from "next/server";
import { getAppUrl } from "@/lib/app-url";

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

export function getClientIp(request: Request) {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-real-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

export function getAllowedOrigins() {
  const origins = new Set<string>([originFrom(getAppUrl()), ROOT_PRODUCTION_ORIGIN, WWW_PRODUCTION_ORIGIN].filter(Boolean) as string[]);

  if (process.env.NODE_ENV !== "production") {
    LOCAL_ORIGINS.forEach((origin) => origins.add(origin));
  }

  return origins;
}

export function isSameOriginRequest(request: Request) {
  const origin = originFrom(request.headers.get("origin"));
  const refererOrigin = originFrom(request.headers.get("referer"));
  const requestOrigin = origin || refererOrigin;

  if (!requestOrigin) {
    return process.env.NODE_ENV !== "production";
  }

  return getAllowedOrigins().has(requestOrigin);
}

export function rejectInvalidOrigin(request: Request) {
  if (isSameOriginRequest(request)) return null;

  console.warn("csrf_origin_rejected", {
    hasOrigin: Boolean(request.headers.get("origin")),
    hasReferer: Boolean(request.headers.get("referer"))
  });

  return NextResponse.json(
    { error: "Não foi possível validar a origem da requisição. Recarregue a página e tente novamente." },
    { status: 403 }
  );
}

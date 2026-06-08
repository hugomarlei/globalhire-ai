const CANONICAL_PRODUCTION_URL = "https://www.globalhireai.com.br";
const LOCAL_URL = "http://localhost:3000";
const OLD_VERCEL_HOST = ["globalhire-ai", "vercel", "app"].join(".");

/** Host part only (no path, no protocol). */
export function normalizeVercelHost(raw?: string | null): string | null {
  if (!raw?.trim()) return null;
  const trimmed = raw.trim();
  try {
    if (trimmed.includes("://")) {
      const host = new URL(trimmed).hostname;
      return host || null;
    }
  } catch {
    return null;
  }
  const host = trimmed.replace(/^https?:\/\//i, "").split("/")[0]?.trim();
  return host || null;
}

/**
 * Public https origins for the current Vercel deployment.
 * Vercel production deployments also expose a unique deployment URL, and requests
 * from that URL must pass CSRF when QA uses it directly.
 */
export function listVercelPreviewPublicOrigins(): string[] {
  const hosts = new Set<string>();
  for (const key of ["VERCEL_URL", "VERCEL_BRANCH_URL"] as const) {
    const host = normalizeVercelHost(process.env[key]);
    if (host) hosts.add(host);
  }
  return [...hosts].map((host) => `https://${host}`);
}

function normalizeUrl(value: string) {
  return value.trim().replace(/\/+$/, "");
}

function isOldVercelDomain(value: string) {
  try {
    return new URL(value).hostname === OLD_VERCEL_HOST;
  } catch {
    return value.includes(OLD_VERCEL_HOST);
  }
}

function canonicalizeProductionDomain(value: string) {
  try {
    const url = new URL(value);
    if (url.hostname === "globalhireai.com.br") {
      url.hostname = "www.globalhireai.com.br";
      return normalizeUrl(url.toString());
    }
  } catch {
    return normalizeUrl(value);
  }

  return normalizeUrl(value);
}

export function getAppUrl() {
  // Vercel Preview: canonical base URL for this deployment (CSRF, redirects, metadata).
  if (process.env.VERCEL_ENV === "preview") {
    const previewOrigins = listVercelPreviewPublicOrigins();
    if (previewOrigins[0]) {
      return normalizeUrl(previewOrigins[0]);
    }
  }

  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (configuredUrl && !isOldVercelDomain(configuredUrl)) {
    return canonicalizeProductionDomain(configuredUrl);
  }

  if (process.env.NODE_ENV === "production") {
    return CANONICAL_PRODUCTION_URL;
  }

  return LOCAL_URL;
}

export function getAuthCallbackUrl(next = "/dashboard") {
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  return `${getAppUrl()}/auth/callback?next=${encodeURIComponent(safeNext)}`;
}

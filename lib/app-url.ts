const CANONICAL_PRODUCTION_URL = "https://www.globalhireai.com.br";
const LOCAL_URL = "http://localhost:3000";
const OLD_VERCEL_HOST = ["globalhire-ai", "vercel", "app"].join(".");

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

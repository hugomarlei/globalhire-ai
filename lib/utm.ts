/**
 * First-touch UTM / referrer attribution (localStorage).
 * Does not store PII — only campaign params and paths.
 */

export type UtmAttribution = {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_content: string | null;
  utm_term: string | null;
  referrer: string | null;
  landing_page: string | null;
  captured_at: string;
};

const STORAGE_KEY = "globalhire-attribution";
const UTM_KEYS = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"] as const;

function trimParam(value: string | null, max = 120): string | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.length > max ? trimmed.slice(0, max) : trimmed;
}

function sanitizeReferrer(value: string | null): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return trimParam(`${url.hostname}${url.pathname === "/" ? "" : url.pathname}`, 200);
  } catch {
    return null;
  }
}

function sanitizeLandingPath(pathname: string): string {
  const path = pathname.split("?")[0] || "/";
  return path.length > 200 ? path.slice(0, 200) : path;
}

function hasUtmParams(params: URLSearchParams): boolean {
  return UTM_KEYS.some((key) => Boolean(params.get(key)?.trim()));
}

function parseFromSearchParams(searchParams: URLSearchParams, landingPage: string): Partial<UtmAttribution> {
  return {
    utm_source: trimParam(searchParams.get("utm_source")),
    utm_medium: trimParam(searchParams.get("utm_medium")),
    utm_campaign: trimParam(searchParams.get("utm_campaign")),
    utm_content: trimParam(searchParams.get("utm_content")),
    utm_term: trimParam(searchParams.get("utm_term")),
    landing_page: sanitizeLandingPath(landingPage)
  };
}

export function readStoredAttribution(): UtmAttribution | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as UtmAttribution;
    if (!parsed || typeof parsed !== "object" || !parsed.captured_at) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeAttribution(payload: UtmAttribution) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch {
    /* quota / private mode */
  }
}

/**
 * Captures first-touch attribution from the current URL (and referrer).
 * Existing stored attribution is never overwritten.
 */
export function captureUtmFromLocation(location: Pick<Location, "search" | "pathname">, documentReferrer?: string) {
  if (typeof window === "undefined") return readStoredAttribution();

  const existing = readStoredAttribution();
  if (existing) return existing;

  const params = new URLSearchParams(location.search);
  const fromUrl = parseFromSearchParams(params, location.pathname);
  const hasUtms = hasUtmParams(params);
  const referrer = sanitizeReferrer(documentReferrer || null);

  if (!hasUtms && !referrer) return null;

  const payload: UtmAttribution = {
    utm_source: fromUrl.utm_source ?? (referrer ? "referral" : null),
    utm_medium: fromUrl.utm_medium ?? (referrer ? "referral" : null),
    utm_campaign: fromUrl.utm_campaign ?? null,
    utm_content: fromUrl.utm_content ?? null,
    utm_term: fromUrl.utm_term ?? null,
    referrer,
    landing_page: fromUrl.landing_page ?? sanitizeLandingPath(location.pathname),
    captured_at: new Date().toISOString()
  };

  writeAttribution(payload);
  return payload;
}

/** Flat object for analytics providers (omits nulls). */
export function getAttributionProperties(): Record<string, string> {
  const stored = readStoredAttribution();
  if (!stored) return {};

  const out: Record<string, string> = {};
  const pairs: Array<[keyof UtmAttribution, string | null]> = [
    ["utm_source", stored.utm_source],
    ["utm_medium", stored.utm_medium],
    ["utm_campaign", stored.utm_campaign],
    ["utm_content", stored.utm_content],
    ["utm_term", stored.utm_term],
    ["referrer", stored.referrer],
    ["landing_page", stored.landing_page]
  ];

  for (const [key, value] of pairs) {
    if (value) out[key] = value;
  }
  return out;
}

export function buildCadastroHref(campaign: string, content?: string) {
  const params = new URLSearchParams({
    utm_source: "lp",
    utm_medium: "landing",
    utm_campaign: campaign
  });
  if (content) params.set("utm_content", content);
  return `/cadastro?${params.toString()}`;
}

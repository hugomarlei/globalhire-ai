"use client";

type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    clarity?: (command: string, eventName: string, payload?: AnalyticsPayload) => void;
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    posthog?: {
      capture: (eventName: string, properties?: AnalyticsPayload) => void;
      identify: (userId: string, properties?: AnalyticsPayload) => void;
      reset: () => void;
    };
  }
}

const sensitiveKeyPattern = /resume|curriculo|currículo|cv|jobDescription|description|vaga|email|phone|telefone|address|endereco|endereço|document|content|output|password|token|secret/i;
const analyticsUserKey = "globalhire-anonymous-id";

function getAnonymousId() {
  if (typeof window === "undefined") return undefined;
  try {
    const existing = window.localStorage.getItem(analyticsUserKey);
    if (existing) return existing;
    const generated = `gh_${crypto.randomUUID()}`;
    window.localStorage.setItem(analyticsUserKey, generated);
    return generated;
  } catch {
    return undefined;
  }
}

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    const withoutQuery = value.startsWith("/") ? value.split("?")[0] : value;
    return withoutQuery.length > 100 ? `${withoutQuery.slice(0, 100)}...` : withoutQuery;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.slice(0, 20).map(sanitizeValue);
  if (typeof value === "object") return sanitizeProperties(value as AnalyticsPayload);
  return undefined;
}

export function sanitizeProperties(properties: AnalyticsPayload = {}) {
  return Object.fromEntries(
    Object.entries(properties)
      .filter(([key]) => !sensitiveKeyPattern.test(key))
      .map(([key, value]) => [key, sanitizeValue(value)])
      .filter(([, value]) => value !== undefined)
  );
}

export function trackEvent(eventName: string, properties?: AnalyticsPayload) {
  if (typeof window === "undefined") return;
  const safeProperties = {
    ...sanitizeProperties(properties),
    anonymous_id: getAnonymousId()
  };
  window.gtag?.("event", eventName, safeProperties);
  window.posthog?.capture(eventName, safeProperties);
  window.clarity?.("event", eventName, safeProperties);
}

export function identifyUser(userId: string, properties?: AnalyticsPayload) {
  if (typeof window === "undefined") return;
  const anonymousId = getAnonymousId();
  if (!anonymousId) return;
  window.posthog?.identify(anonymousId, sanitizeProperties({ ...properties, user_reference: userId ? "authenticated" : "anonymous" }));
}

export function resetAnalytics() {
  if (typeof window === "undefined") return;
  window.posthog?.reset();
}

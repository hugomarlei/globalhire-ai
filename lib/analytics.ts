"use client";

type AnalyticsPayload = Record<string, unknown>;

declare global {
  interface Window {
    clarity?: (command: string, eventName: string, payload?: AnalyticsPayload) => void;
    posthog?: {
      capture: (eventName: string, properties?: AnalyticsPayload) => void;
      identify: (userId: string, properties?: AnalyticsPayload) => void;
      reset: () => void;
    };
  }
}

const sensitiveKeyPattern = /resume|curriculo|currículo|cv|jobDescription|description|vaga|email|phone|telefone|address|endereco|endereço|document|content|output|password|token|secret/i;

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;
  if (typeof value === "string") return value.length > 140 ? `${value.slice(0, 140)}...` : value;
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
  const safeProperties = sanitizeProperties(properties);
  window.posthog?.capture(eventName, safeProperties);
  window.clarity?.("event", eventName, safeProperties);
}

export function identifyUser(userId: string, properties?: AnalyticsPayload) {
  if (typeof window === "undefined") return;
  window.posthog?.identify(userId, sanitizeProperties(properties));
}

export function resetAnalytics() {
  if (typeof window === "undefined") return;
  window.posthog?.reset();
}

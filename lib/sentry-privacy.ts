import type { Breadcrumb, ErrorEvent, TransactionEvent } from "@sentry/core";

const SENSITIVE_KEY =
  /resume|jobdescription|job_description|output|password|token|turnstile|email|e-mail|phone|telefone|linkedin|authorization|cookie|access_token|refresh|secret|bearer|formdata|payload|text|address|cidade|city|cpf|cnpj|document|curriculum|cv\b|vaga/i;

function isSensitiveKey(key: string): boolean {
  return SENSITIVE_KEY.test(key);
}

function scrubUnknown(value: unknown, depth = 0): unknown {
  if (depth > 8) return "[REDACTED:depth]";
  if (value === null || value === undefined) return value;
  if (typeof value === "string") {
    if (value.length > 600) return "[REDACTED:long]";
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") return value;
  if (Array.isArray(value)) return value.map((item) => scrubUnknown(item, depth + 1));
  if (typeof value === "object") {
    const o = value as Record<string, unknown>;
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(o)) {
      if (isSensitiveKey(k)) out[k] = "[REDACTED]";
      else out[k] = scrubUnknown(v, depth + 1);
    }
    return out;
  }
  return value;
}

function scrubRequest(event: ErrorEvent | TransactionEvent) {
  const req = event.request;
  if (!req) return;
  delete req.cookies;
  if (req.data !== undefined) req.data = "[REDACTED]";
  if (req.query_string !== undefined) req.query_string = "[REDACTED]";
  if (req.headers && typeof req.headers === "object") {
    const h = { ...(req.headers as Record<string, string>) };
    for (const key of Object.keys(h)) {
      if (/auth|cookie|token|secret/i.test(key)) delete h[key];
    }
    req.headers = h;
  }
  if (req.url) {
    try {
      const u = new URL(req.url);
      if (u.search) u.search = "";
      req.url = u.toString();
    } catch {
      req.url = "[REDACTED:url]";
    }
  }
}

function scrubUser(event: ErrorEvent | TransactionEvent) {
  if (!event.user) return;
  delete event.user.email;
  delete event.user.username;
  delete event.user.ip_address;
  delete event.user.name;
  delete event.user.segment;
  delete event.user.geo;
}

export function scrubSentryEvent<T extends ErrorEvent | TransactionEvent>(event: T): T {
  scrubUser(event);
  scrubRequest(event);
  if (event.extra && typeof event.extra === "object") {
    event.extra = scrubUnknown(event.extra) as ErrorEvent["extra"];
  }
  if (event.contexts && typeof event.contexts === "object") {
    event.contexts = scrubUnknown(event.contexts) as ErrorEvent["contexts"];
  }
  if (event.breadcrumbs?.length) {
    event.breadcrumbs = event.breadcrumbs.map((b: Breadcrumb) => ({
      ...b,
      message: b.message && b.message.length > 500 ? "[REDACTED]" : b.message,
      data: b.data ? (scrubUnknown(b.data) as Breadcrumb["data"]) : undefined
    }));
  }
  return event;
}

export function sentryBeforeSend(event: ErrorEvent): ErrorEvent | null {
  return scrubSentryEvent(event);
}

export function sentryBeforeSendTransaction(event: TransactionEvent): TransactionEvent | null {
  return scrubSentryEvent(event);
}

const denyUrls = [/extensions\//i, /^chrome:\/\//i, /^chrome-extension:\/\//i, /^moz-extension:\/\//i];

const ignoreErrors = [
  /^Non-Error promise rejection captured with value: Object$/i,
  /^ResizeObserver loop limit exceeded$/i,
  /^AbortError: The user aborted a request\.?$/i
];

export function getSentryInitOptions() {
  const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
  const environment =
    process.env.SENTRY_ENVIRONMENT || process.env.VERCEL_ENV || process.env.NODE_ENV || "development";
  const release =
    process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_SHA || process.env.VERCEL_GIT_COMMIT_REF;

  return {
    dsn,
    enabled: Boolean(dsn),
    environment,
    release,
    sendDefaultPii: false,
    tracesSampleRate: 0,
    denyUrls,
    ignoreErrors,
    beforeSend: sentryBeforeSend,
    beforeSendTransaction: sentryBeforeSendTransaction,
    beforeBreadcrumb(breadcrumb: Breadcrumb): Breadcrumb | null {
      if (breadcrumb.category === "console" && breadcrumb.level === "debug") return null;
      if (breadcrumb.category === "fetch" && typeof breadcrumb.data?.url === "string") {
        if (/api\/(ai|upload|stripe)/i.test(breadcrumb.data.url)) return null;
      }
      return breadcrumb;
    }
  };
}

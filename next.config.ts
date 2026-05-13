import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

function safeOrigin(value: string | undefined) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

const supabaseUrl = safeOrigin(process.env.NEXT_PUBLIC_SUPABASE_URL) || "https://*.supabase.co";

const cspDirectives = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  [
    "script-src",
    "'self'",
    "'unsafe-inline'",
    "https://js.stripe.com",
    "https://checkout.stripe.com",
    "https://challenges.cloudflare.com",
    "https://*.cloudflare.com",
    "https://www.googletagmanager.com",
    "https://www.google-analytics.com",
    "https://www.clarity.ms",
    "https://scripts.clarity.ms",
    "https://*.clarity.ms",
    "https://app.posthog.com",
    "https://us.i.posthog.com",
    "https://eu.i.posthog.com"

  ].join(" "),
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data:",
  [
    "connect-src",
    "'self'",
    supabaseUrl,
    "https://*.supabase.co",
    "wss://*.supabase.co",
    "https://api.groq.com",
    "https://api.stripe.com",
    "https://checkout.stripe.com",
    "https://billing.stripe.com",
    "https://challenges.cloudflare.com",
    "https://*.cloudflare.com",
    "https://www.google-analytics.com",
    "https://region1.google-analytics.com",
    "https://*.google-analytics.com",
    "https://*.analytics.google.com",
    "https://www.clarity.ms",
    "https://*.clarity.ms",
    "https://app.posthog.com",
    "https://us.i.posthog.com",
    "https://eu.i.posthog.com"
  ].join(" "),
  "frame-src 'self' https://js.stripe.com https://checkout.stripe.com https://billing.stripe.com https://challenges.cloudflare.com https://*.cloudflare.com",
  "worker-src 'self' blob:",
  "manifest-src 'self'"
];

if (process.env.NODE_ENV === "production") {
  cspDirectives.push("upgrade-insecure-requests");
}

const csp = cspDirectives.join("; ");

/** Source maps / release upload só quando as três variáveis existem (evita custo e chamadas à API Sentry no build). */
const sentryReleaseUploadReady =
  Boolean(process.env.SENTRY_AUTH_TOKEN?.trim()) &&
  Boolean(process.env.SENTRY_ORG?.trim()) &&
  Boolean(process.env.SENTRY_PROJECT?.trim());

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  experimental: {
    serverActions: {
      bodySizeLimit: "3mb"
    }
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload"
          },
          {
            key: "X-Frame-Options",
            value: "DENY"
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff"
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin"
          },
          {
            key: "Permissions-Policy",
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(self "https://checkout.stripe.com" "https://js.stripe.com")'
          },
          {
            key: "Content-Security-Policy",
            value: csp
          }
        ]
      }
    ];
  }
};

export default withSentryConfig(nextConfig, {
  org: sentryReleaseUploadReady ? process.env.SENTRY_ORG : undefined,
  project: sentryReleaseUploadReady ? process.env.SENTRY_PROJECT : undefined,
  authToken: sentryReleaseUploadReady ? process.env.SENTRY_AUTH_TOKEN : undefined,
  sourcemaps: {
    disable: !sentryReleaseUploadReady
  },
  telemetry: false,
  silent: !process.env.CI,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  widenClientFileUpload: false,
  suppressOnRouterTransitionStartWarning: true,
  errorHandler: (err: Error) => {
    console.warn("[sentry] build step:", err.message);
  }
});

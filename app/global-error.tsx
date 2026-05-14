"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { globalErrorCopy, readLocaleFromDocumentCookie } from "@/lib/i18n-global-error";
import "./globals.css";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  const [locale, setLocale] = useState(() => readLocaleFromDocumentCookie());
  const t = globalErrorCopy[locale];

  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  useEffect(() => {
    setLocale(readLocaleFromDocumentCookie());
  }, []);

  return (
    <html lang={locale}>
      <body className="min-h-screen bg-background px-6 py-10 text-foreground antialiased">
        <h1 className="text-xl font-semibold tracking-tight">{t.title}</h1>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">{t.body}</p>
        <Link className="mt-6 inline-block text-sm font-semibold text-primary hover:underline" href="/">
          {t.home}
        </Link>
      </body>
    </html>
  );
}

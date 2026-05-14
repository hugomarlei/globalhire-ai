"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import { globalErrorCopy, readLocaleFromDocumentCookie } from "@/lib/i18n-global-error";

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
      <body className="min-h-screen bg-ink px-6 py-10 text-white antialiased">
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="mt-3 max-w-md text-sm text-white/70">{t.body}</p>
        <Link className="mt-6 inline-block text-sm font-semibold text-brand-500 hover:text-brand-200" href="/">
          {t.home}
        </Link>
      </body>
    </html>
  );
}

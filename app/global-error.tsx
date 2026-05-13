"use client";

import * as Sentry from "@sentry/nextjs";
import Link from "next/link";
import { useEffect } from "react";

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="pt-BR">
      <body className="min-h-screen bg-ink px-6 py-10 text-white antialiased">
        <h1 className="text-xl font-semibold">Algo saiu errado</h1>
        <p className="mt-3 max-w-md text-sm text-white/70">Tente atualizar a página. Se o problema continuar, volte ao início e entre em contato com o suporte.</p>
        <Link className="mt-6 inline-block text-sm font-semibold text-brand-500 hover:text-brand-200" href="/">
          Ir ao início
        </Link>
      </body>
    </html>
  );
}

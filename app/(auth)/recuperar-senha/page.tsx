"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { getAuthCallbackUrl } from "@/lib/app-url";
import { useLanguage } from "@/components/language-provider";
import { authRecoverCopy } from "@/lib/i18n-auth-pages";

export default function RecoverPasswordPage() {
  const { locale } = useLanguage();
  const t = authRecoverCopy[locale];
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthCallbackUrl("/redefinir-senha")
    });
    setMessage(t.sentMessage);
  }

  return (
    <main className="grid flex-1 place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">{t.title}</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label={t.email}>
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          <Button type="submit" className="bg-primary text-primary-foreground hover:brightness-105">
            {t.submit}
          </Button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
          {t.backLogin}
        </Link>
      </Card>
    </main>
  );
}

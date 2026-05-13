"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { getAuthCallbackUrl } from "@/lib/app-url";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: getAuthCallbackUrl("/redefinir-senha")
    });
    setMessage("Se este e-mail existir, você receberá um link de recuperação.");
  }

  return (
    <main className="grid flex-1 place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-ink dark:text-white">Recuperar senha</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label="E-mail">
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          {message ? <p className="text-sm text-graphite/75 dark:text-white/70">{message}</p> : null}
          <Button type="submit" className="bg-brand-500 text-ink hover:bg-brand-200">
            Enviar link
          </Button>
        </form>
        <Link
          href="/login"
          className="mt-5 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white"
        >
          Voltar ao login
        </Link>
      </Card>
    </main>
  );
}

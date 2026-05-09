"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";

export default function RecoverPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const supabase = createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/redefinir-senha`
    });
    setMessage("Se este e-mail existir, você receberá um link de recuperação.");
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Recuperar senha</h1>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label="E-mail">
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          {message ? <p className="text-sm text-white/70">{message}</p> : null}
          <Button type="submit" className="bg-brand-500 text-white hover:bg-brand-600">Enviar link</Button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm text-white/60 hover:text-white">Voltar ao login</Link>
      </Card>
    </main>
  );
}

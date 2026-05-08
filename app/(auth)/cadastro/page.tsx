"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/dashboard`
      }
    });
    setLoading(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Conta criada. Se o Supabase pedir confirmação, abra seu e-mail; senão você já pode entrar.");
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Criar conta grátis</h1>
        <p className="mt-2 text-sm text-white/60">Comece com uma geração teste.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label="Nome">
            <input className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label="E-mail">
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Senha">
            <input className={inputClass} type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {message ? <p className="text-sm text-white/70">{message}</p> : null}
          <Button type="submit" className="bg-brand-500 text-white hover:bg-brand-600">
            {loading ? "Criando..." : "Criar meu currículo grátis"}
          </Button>
        </form>
        <p className="mt-5 text-sm text-white/60">
          Ja tem conta? <Link href="/login" className="text-white">Entrar</Link>
        </p>
      </Card>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { SocialAuthButtons } from "@/components/social-auth-buttons";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setError("E-mail ou senha incorretos.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Entrar</h1>
        <p className="mt-2 text-sm text-white/60">Acesse seu painel da GlobalHire AI.</p>
        <div className="mt-6">
          <SocialAuthButtons mode="login" />
        </div>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label="E-mail">
            <input className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Senha">
            <input className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <Button type="submit" className="bg-brand-500 text-white hover:bg-brand-600">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-5 flex justify-between text-sm text-white/60">
          <Link href="/cadastro" className="hover:text-white">Criar conta</Link>
          <Link href="/recuperar-senha" className="hover:text-white">Recuperar senha</Link>
        </div>
      </Card>
    </main>
  );
}

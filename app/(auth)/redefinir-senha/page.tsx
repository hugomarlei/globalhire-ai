"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { createClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("Use pelo menos 6 caracteres.");
      return;
    }

    if (password !== confirm) {
      setMessage("As senhas não conferem.");
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage("O link expirou ou é inválido. Solicite uma nova recuperação.");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-4">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold">Criar nova senha</h1>
        <p className="mt-2 text-sm text-white/60">Defina uma senha segura para voltar ao dashboard.</p>
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label="Nova senha">
            <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </Field>
          <Field label="Confirmar senha">
            <input className={inputClass} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
          </Field>
          {message ? <p className="text-sm text-white/65">{message}</p> : null}
          <Button type="submit" className="bg-brand-500 text-white hover:bg-brand-600" disabled={loading}>
            {loading ? "Salvando..." : "Salvar nova senha"}
          </Button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm text-white/60 hover:text-white">Voltar ao login</Link>
      </Card>
    </main>
  );
}

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { trackEvent } from "@/lib/analytics";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordUpdated, setPasswordUpdated] = useState(false);
  const [socialNotConfigured, setSocialNotConfigured] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setPasswordUpdated(params.get("senha") === "atualizada");
    setSocialNotConfigured(params.get("social") === "not_configured");
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    trackEvent("login_started", { method: "password" });
    const captchaResponse = await fetch("/api/security/turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: turnstileToken })
    });
    if (!captchaResponse.ok) {
      const data = await captchaResponse.json().catch(() => ({}));
      setLoading(false);
      setCaptchaReset((current) => current + 1);
      setError(data.error || "Confirme o captcha para entrar.");
      return;
    }
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setCaptchaReset((current) => current + 1);
      setError("E-mail ou senha incorretos.");
      return;
    }

    trackEvent("login_completed", { method: "password" });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid flex-1 place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-ink dark:text-white">Entrar</h1>
        <p className="mt-2 text-sm text-graphite/70 dark:text-white/60">Acesse seu painel da GlobalHire AI.</p>
        {passwordUpdated ? (
          <p className="mt-4 rounded-md bg-brand-500/15 p-3 text-sm text-brand-800 dark:text-brand-50">
            Senha atualizada com sucesso. Entre com sua nova senha.
          </p>
        ) : null}
        {socialNotConfigured ? (
          <p className="mt-4 rounded-md bg-coral/15 p-3 text-sm text-coral">Login social ainda não configurado. Use e-mail e senha por enquanto.</p>
        ) : null}
        <div className="mt-6">
          <SocialAuthButtons mode="login" />
        </div>
        <form onSubmit={submit} className="mt-6 grid gap-4" aria-label="Continuar com e-mail">
          <p className="text-sm font-semibold text-ink dark:text-white">Continuar com e-mail</p>
          <Field label="E-mail">
            <input data-clarity-mask="true" className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Senha">
            <input data-clarity-mask="true" className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <TurnstileWidget action="login" onVerify={setTurnstileToken} resetSignal={captchaReset} />
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <Button type="submit" className="bg-brand-500 text-ink hover:bg-brand-200">
            {loading ? "Entrando..." : "Entrar"}
          </Button>
        </form>
        <div className="mt-5 flex justify-between text-sm text-graphite/70 dark:text-white/60">
          <Link href="/cadastro" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
            Criar conta
          </Link>
          <Link href="/recuperar-senha" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
            Recuperar senha
          </Link>
        </div>
        <p className="mt-5 text-xs leading-5 text-graphite/60 dark:text-white/45">
          Ao entrar, você concorda com os{" "}
          <Link href="/termos" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-200 dark:hover:text-white">
            Termos de Uso
          </Link>{" "}
          e confirma ciência da{" "}
          <Link href="/privacidade" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-200 dark:hover:text-white">
            Política de Privacidade
          </Link>
          .
        </p>
      </Card>
    </main>
  );
}

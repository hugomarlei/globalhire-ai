"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { trackEvent } from "@/lib/analytics";
import { getAppUrl } from "@/lib/app-url";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    trackEvent("signup_started", { method: "password" });
    const captchaResponse = await fetch("/api/security/turnstile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: turnstileToken })
    });
    if (!captchaResponse.ok) {
      const data = await captchaResponse.json().catch(() => ({}));
      setLoading(false);
      setCaptchaReset((current) => current + 1);
      setMessage(data.error || "Confirme o captcha para criar sua conta.");
      return;
    }
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${getAppUrl()}/dashboard`
      }
    });
    setLoading(false);

    if (error) {
      setCaptchaReset((current) => current + 1);
      setMessage(error.message);
      return;
    }

    setMessage("Conta criada. Se o Supabase pedir confirmação, abra seu e-mail; senão você já pode entrar.");
    trackEvent("signup_completed", { method: "password" });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="grid flex-1 place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">Criar conta grátis</h1>
        <p className="mt-2 text-sm text-muted-foreground">Comece com uma geração teste.</p>
        <div className="mt-6">
          <SocialAuthButtons mode="signup" />
        </div>
        <form onSubmit={submit} className="mt-6 grid gap-4" aria-label="Continuar com e-mail">
          <p className="text-sm font-semibold text-foreground">Continuar com e-mail</p>
          <Field label="Nome">
            <input data-clarity-mask="true" className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label="E-mail">
            <input data-clarity-mask="true" className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label="Senha">
            <input data-clarity-mask="true" className={inputClass} type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <TurnstileWidget action="signup" onVerify={setTurnstileToken} resetSignal={captchaReset} />
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          <Button type="submit" className="bg-primary text-primary-foreground hover:brightness-105">
            {loading ? "Criando..." : "Criar meu currículo grátis"}
          </Button>
        </form>
        <p className="mt-5 text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
            Entrar
          </Link>
        </p>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          Ao criar conta, você concorda com os{" "}
          <Link href="/termos" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-200 dark:hover:text-white">
            Termos de Uso
          </Link>
          , a{" "}
          <Link href="/privacidade" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-200 dark:hover:text-white">
            Política de Privacidade
          </Link>{" "}
          e a{" "}
          <Link href="/cookies" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-200 dark:hover:text-white">
            Política de Cookies
          </Link>
          .
        </p>
      </Card>
    </main>
  );
}

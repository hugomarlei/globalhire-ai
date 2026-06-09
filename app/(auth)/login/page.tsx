"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { PublicCard, PublicKicker } from "@/components/public-page-shell";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { useLanguage } from "@/components/language-provider";
import { authLoginCopy } from "@/lib/i18n-app-wide";
import { trackEvent } from "@/lib/analytics";
import { clearOAuthAttempt } from "@/lib/social-oauth";

export default function LoginPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = authLoginCopy[locale];
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
    if (params.get("social") === "not_configured") {
      setSocialNotConfigured(true);
      clearOAuthAttempt();
    }
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
      setError(data.error || t.captchaError);
      return;
    }
    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (authError) {
      setCaptchaReset((current) => current + 1);
      setError(t.wrongCredentials);
      return;
    }

    trackEvent("login_completed", { method: "password" });
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
      <section className="hidden lg:block">
        <PublicKicker>Acesse sua candidatura</PublicKicker>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-foreground">
          Continue ajustando seu currículo com mais critério antes de enviar.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
          Entre para revisar histórico, gerar novas versões, acompanhar score de aderência e exportar materiais para vagas reais.
        </p>
        <div className="mt-8 grid max-w-xl gap-3">
          {["Currículo, vaga e score no mesmo fluxo.", "IA como apoio de reescrita, não como promessa mágica.", "Documentos prontos para revisar, copiar e exportar."].map((item) => (
            <PublicCard key={item}>
              <p className="text-sm text-muted-foreground">{item}</p>
            </PublicCard>
          ))}
        </div>
      </section>

      <Card className="mx-auto w-full max-w-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-foreground">{t.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.lead}</p>
        {passwordUpdated ? (
          <p className="mt-4 rounded-md bg-brand-500/15 p-3 text-sm text-brand-800 dark:text-brand-50">{t.passwordUpdated}</p>
        ) : null}
        {socialNotConfigured ? (
          <p className="mt-4 rounded-md bg-coral/15 p-3 text-sm text-coral">{t.socialNotConfigured}</p>
        ) : null}
        <div className="mt-6">
          <SocialAuthButtons mode="login" />
        </div>
        <form onSubmit={submit} className="mt-6 grid gap-4" aria-label={t.continueEmail}>
          <p className="text-sm font-semibold text-foreground">{t.continueEmail}</p>
          <Field label={t.email}>
            <input data-clarity-mask="true" className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label={t.password}>
            <input data-clarity-mask="true" className={inputClass} type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <TurnstileWidget action="login" onVerify={setTurnstileToken} resetSignal={captchaReset} />
          {error ? <p className="text-sm text-coral">{error}</p> : null}
          <Button type="submit" className="bg-primary text-primary-foreground hover:brightness-105">
            {loading ? t.signingIn : t.signIn}
          </Button>
        </form>
        <div className="mt-5 flex justify-between text-sm text-muted-foreground">
          <Link href="/cadastro" className="font-medium text-primary hover:underline">
            {t.createAccount}
          </Link>
          <Link href="/recuperar-senha" className="font-medium text-primary hover:underline">
            {t.recoverPassword}
          </Link>
        </div>
        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          {t.legalPrefix}{" "}
          <Link href="/termos" className="font-medium text-primary underline-offset-2 hover:underline">
            {t.terms}
          </Link>{" "}
          {t.legalMid}{" "}
          <Link href="/privacidade" className="font-medium text-primary underline-offset-2 hover:underline">
            {t.privacy}
          </Link>
          {t.legalSuffix}
        </p>
      </Card>
    </main>
  );
}

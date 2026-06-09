"use client";

import Link from "next/link";
import { MailCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { PublicCard, PublicKicker } from "@/components/public-page-shell";
import { SocialAuthButtons } from "@/components/social-auth-buttons";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { trackEvent } from "@/lib/analytics";
import { getAppUrl } from "@/lib/app-url";
import { useLanguage } from "@/components/language-provider";
import { authSignupCopy } from "@/lib/i18n-auth-pages";

export default function SignupPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = authSignupCopy[locale];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [captchaReset, setCaptchaReset] = useState(0);
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendNotice, setResendNotice] = useState("");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    setResendNotice("");
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
      setMessage(data.error || t.captchaError);
      return;
    }
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
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

    trackEvent("signup_completed", { method: "password" });

    if (data.session) {
      router.push("/dashboard");
      router.refresh();
      return;
    }

    setAwaitingEmailConfirmation(true);
  }

  async function resendConfirmationEmail() {
    if (!email || resendLoading) return;
    setResendLoading(true);
    setResendNotice("");
    const supabase = createClient();
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: {
        emailRedirectTo: `${getAppUrl()}/dashboard`
      }
    });
    setResendLoading(false);
    setResendNotice(error ? t.resendError : t.resendSuccess);
  }

  if (awaitingEmailConfirmation) {
    return (
      <main className="grid flex-1 place-items-center px-4 py-10 sm:px-6">
        <Card className="w-full max-w-md rounded-lg p-6">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
              <MailCheck size={28} aria-hidden />
            </div>
            <h1 className="mt-5 text-2xl font-semibold text-foreground">{t.confirmEmailTitle}</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">{t.confirmEmailMessage}</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.confirmEmailHint}</p>
            {email ? (
              <p className="mt-4 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm font-medium text-foreground" data-clarity-mask="true">
                {email}
              </p>
            ) : null}
          </div>
          <div className="mt-8 grid gap-3">
            <Button href="/login" className="w-full bg-primary text-primary-foreground hover:brightness-105">
              {t.goToLogin}
            </Button>
            <button
              type="button"
              onClick={resendConfirmationEmail}
              disabled={resendLoading || !email}
              className="text-sm font-medium text-brand-700 underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-60 dark:text-brand-200"
            >
              {resendLoading ? t.resendSending : t.resendEmail}
            </button>
            {resendNotice ? <p className="text-center text-sm text-muted-foreground">{resendNotice}</p> : null}
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="mx-auto grid w-full max-w-7xl flex-1 gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:py-16">
      <section className="hidden lg:block">
        <PublicKicker>Degustação gratuita</PublicKicker>
        <h1 className="mt-4 max-w-xl text-4xl font-semibold leading-tight text-foreground">
          Crie uma candidatura mais forte antes do próximo envio.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-8 text-muted-foreground">
          Comece com as ferramentas principais: currículo, análise de vaga, reescrita, score de aderência e materiais de apoio.
        </p>
        <div className="mt-8 grid max-w-xl gap-3 sm:grid-cols-2">
          {["Analise a vaga", "Reescreva com evidência", "Veja lacunas", "Exporte documentos"].map((item) => (
            <PublicCard key={item}>
              <p className="text-sm font-medium text-foreground">{item}</p>
            </PublicCard>
          ))}
        </div>
      </section>

      <Card className="mx-auto w-full max-w-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-foreground">{t.title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">{t.lead}</p>
        <div className="mt-6">
          <SocialAuthButtons mode="signup" />
        </div>
        <form onSubmit={submit} className="mt-6 grid gap-4" aria-label={t.continueEmail}>
          <p className="text-sm font-semibold text-foreground">{t.continueEmail}</p>
          <Field label={t.name}>
            <input data-clarity-mask="true" className={inputClass} value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          </Field>
          <Field label={t.email}>
            <input data-clarity-mask="true" className={inputClass} type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </Field>
          <Field label={t.password}>
            <input data-clarity-mask="true" className={inputClass} type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required />
          </Field>
          <TurnstileWidget action="signup" onVerify={setTurnstileToken} resetSignal={captchaReset} />
          {message ? <p className="text-sm text-destructive">{message}</p> : null}
          <Button type="submit" className="w-full bg-primary text-primary-foreground hover:brightness-105" disabled={loading}>
            {loading ? t.submitting : t.submit}
          </Button>
        </form>
        <p className="mt-5 text-sm text-muted-foreground">
          {t.hasAccount}{" "}
          <Link href="/login" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
            {t.loginLink}
          </Link>
        </p>
        <p className="mt-4 text-xs leading-5 text-muted-foreground">
          {t.legalPrefix}{" "}
          <Link href="/termos" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-200 dark:hover:text-white">
            {t.terms}
          </Link>
          {t.legalMidPrivacy}{" "}
          <Link href="/privacidade" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-200 dark:hover:text-white">
            {t.privacy}
          </Link>
          {t.legalMidCookies}{" "}
          <Link href="/cookies" className="font-medium text-brand-700 underline-offset-2 hover:underline dark:text-brand-200 dark:hover:text-white">
            {t.cookies}
          </Link>
          {t.legalSuffix}
        </p>
      </Card>
    </main>
  );
}

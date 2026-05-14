"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, Field, inputClass } from "@/components/ui";
import { createClient } from "@/lib/supabase-browser";
import { useLanguage } from "@/components/language-provider";
import { authResetCopy } from "@/lib/i18n-auth-pages";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { locale } = useLanguage();
  const t = authResetCopy[locale];
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [hasRecoverySession, setHasRecoverySession] = useState(false);

  useEffect(() => {
    async function prepareRecoverySession() {
      const supabase = createClient();
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");

      if (accessToken && refreshToken) {
        await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken
        });
        window.history.replaceState(null, "", window.location.pathname);
      }

      const {
        data: { session }
      } = await supabase.auth.getSession();

      setHasRecoverySession(Boolean(session));
      setCheckingSession(false);
    }

    prepareRecoverySession();
  }, []);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage(t.tooShort);
      return;
    }

    if (password !== confirm) {
      setMessage(t.mismatch);
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage(t.linkInvalid);
      return;
    }

    router.push("/login?senha=atualizada");
    router.refresh();
  }

  return (
    <main className="grid flex-1 place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <h1 className="text-2xl font-semibold text-foreground">{t.title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">{t.lead}</p>
        {!checkingSession && !hasRecoverySession ? (
          <div className="mt-5 rounded-md bg-coral/15 p-4 text-sm leading-6 text-coral">
            {t.expiredBanner}
            <Button href="/recuperar-senha" className="mt-3 bg-primary text-primary-foreground hover:brightness-105">
              {t.requestNew}
            </Button>
          </div>
        ) : null}
        <form onSubmit={submit} className="mt-6 grid gap-4">
          <Field label={t.newPassword}>
            <input className={inputClass} type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
          </Field>
          <Field label={t.confirmPassword}>
            <input className={inputClass} type="password" value={confirm} onChange={(event) => setConfirm(event.target.value)} required />
          </Field>
          {message ? <p className="text-sm text-muted-foreground">{message}</p> : null}
          <Button type="submit" className="bg-primary text-primary-foreground hover:brightness-105" disabled={loading || checkingSession || !hasRecoverySession}>
            {checkingSession ? t.checking : loading ? t.saving : t.save}
          </Button>
        </form>
        <Link href="/login" className="mt-5 inline-block text-sm font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
          {t.backLogin}
        </Link>
      </Card>
    </main>
  );
}

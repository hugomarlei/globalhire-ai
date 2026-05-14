"use client";

import { Facebook, Linkedin, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { getAuthCallbackUrl } from "@/lib/app-url";
import { trackEvent } from "@/lib/analytics";
import { useLanguage } from "@/components/language-provider";
import { socialAuthCopy } from "@/lib/i18n-app-wide";

type Provider = "google" | "linkedin_oidc" | "facebook";

export function SocialAuthButtons({ mode }: { mode: "login" | "signup" }) {
  const { locale } = useLanguage();
  const s = socialAuthCopy[locale];
  const providers = useMemo(
    () =>
      [
        {
          id: "google" as const,
          label: s.googleLabel,
          icon: <span className="grid size-5 place-items-center rounded-full bg-muted text-xs font-bold text-foreground">G</span>
        },
        {
          id: "linkedin_oidc" as const,
          label: s.linkedinLabel,
          icon: <Linkedin size={18} className="shrink-0 text-foreground" aria-hidden />
        },
        {
          id: "facebook" as const,
          label: s.facebookLabel,
          icon: <Facebook size={18} className="shrink-0 text-foreground" aria-hidden />
        }
      ] satisfies Array<{ id: Provider; label: string; icon: React.ReactNode }>,
    [s.facebookLabel, s.googleLabel, s.linkedinLabel]
  );

  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  async function signIn(provider: Provider) {
    setLoadingProvider(provider);
    setError("");
    trackEvent(mode === "login" ? "login_started" : "signup_started", {
      method: provider === "google" ? "google_oauth" : "social_oauth",
      provider: provider === "google" ? "google" : provider
    });

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: getAuthCallbackUrl("/dashboard"),
        queryParams: provider === "google" ? { access_type: "offline", prompt: "consent" } : undefined
      }
    });

    if (authError) {
      setLoadingProvider(null);
      setError(s.error);
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="h-px flex-1 bg-muted" />
        {mode === "login" ? s.orLogin : s.orSignup}
        <span className="h-px flex-1 bg-muted" />
      </div>
      <div className="grid gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => signIn(provider.id)}
            disabled={Boolean(loadingProvider)}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-border bg-card px-4 text-sm font-semibold text-card-foreground shadow-sm transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60 dark:shadow-none"
          >
            {loadingProvider === provider.id ? (
              <Loader2 className="animate-spin text-foreground" size={18} aria-hidden />
            ) : (
              provider.icon
            )}
            {provider.label}
          </button>
        ))}
      </div>
      {error ? <p className="rounded-md bg-coral/15 p-3 text-sm text-coral">{error}</p> : null}
    </div>
  );
}

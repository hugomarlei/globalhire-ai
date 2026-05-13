"use client";

import { Facebook, Linkedin, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";
import { getAuthCallbackUrl } from "@/lib/app-url";
import { trackEvent } from "@/lib/analytics";

type Provider = "google" | "linkedin_oidc" | "facebook";

const providers: Array<{ id: Provider; label: string; icon: React.ReactNode }> = [
  {
    id: "google",
    label: "Continuar com Google",
    icon: <span className="grid size-5 place-items-center rounded-full bg-white text-xs font-bold text-ink">G</span>
  },
  {
    id: "linkedin_oidc",
    label: "Continuar com LinkedIn",
    icon: <Linkedin size={18} className="shrink-0 text-ink dark:text-white" aria-hidden />
  },
  {
    id: "facebook",
    label: "Continuar com Facebook",
    icon: <Facebook size={18} className="shrink-0 text-ink dark:text-white" aria-hidden />
  }
];

export function SocialAuthButtons({ mode }: { mode: "login" | "signup" }) {
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
      setError("Login social ainda não configurado. Use e-mail e senha por enquanto.");
    }
  }

  return (
    <div className="grid gap-3">
      <div className="flex items-center gap-3 text-xs text-graphite/50 dark:text-white/40">
        <span className="h-px flex-1 bg-graphite/15 dark:bg-white/10" />
        {mode === "login" ? "ou entre com" : "ou cadastre-se com"}
        <span className="h-px flex-1 bg-graphite/15 dark:bg-white/10" />
      </div>
      <div className="grid gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => signIn(provider.id)}
            disabled={Boolean(loadingProvider)}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-graphite/20 bg-white px-4 text-sm font-semibold text-ink shadow-sm transition hover:bg-graphite/[0.04] disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/12 dark:bg-[#1a222d] dark:text-white dark:shadow-none dark:hover:border-white/22 dark:hover:bg-[#222c38]"
          >
            {loadingProvider === provider.id ? (
              <Loader2 className="animate-spin text-ink dark:text-white" size={18} aria-hidden />
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

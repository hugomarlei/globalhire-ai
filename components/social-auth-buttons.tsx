"use client";

import { Facebook, Linkedin, Loader2 } from "lucide-react";
import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

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
    icon: <Linkedin size={18} />
  },
  {
    id: "facebook",
    label: "Continuar com Facebook",
    icon: <Facebook size={18} />
  }
];

export function SocialAuthButtons({ mode }: { mode: "login" | "signup" }) {
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [error, setError] = useState("");

  async function signIn(provider: Provider) {
    setLoadingProvider(provider);
    setError("");

    const supabase = createClient();
    const origin = window.location.origin;
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback?next=/dashboard`,
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
      <div className="flex items-center gap-3 text-xs text-white/40">
        <span className="h-px flex-1 bg-white/10" />
        {mode === "login" ? "ou entre com" : "ou cadastre-se com"}
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid gap-2">
        {providers.map((provider) => (
          <button
            key={provider.id}
            type="button"
            onClick={() => signIn(provider.id)}
            disabled={Boolean(loadingProvider)}
            className="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-md border border-white/10 bg-white/7 px-4 text-sm font-semibold text-white transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingProvider === provider.id ? <Loader2 className="animate-spin" size={18} /> : provider.icon}
            {provider.label}
          </button>
        ))}
      </div>
      {error ? <p className="rounded-md bg-coral/15 p-3 text-sm text-coral">{error}</p> : null}
    </div>
  );
}

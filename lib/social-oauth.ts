/**
 * Supabase Auth OAuth provider IDs (must match Supabase Dashboard → Authentication → Providers).
 * @see https://supabase.com/docs/guides/auth/social-login
 */
export const SUPABASE_OAUTH_PROVIDERS = {
  google: "google",
  linkedin: "linkedin_oidc",
  facebook: "facebook"
} as const;

export type SupabaseOAuthProvider = (typeof SUPABASE_OAUTH_PROVIDERS)[keyof typeof SUPABASE_OAUTH_PROVIDERS];

export function oauthProviderLabel(provider: SupabaseOAuthProvider): string {
  if (provider === SUPABASE_OAUTH_PROVIDERS.linkedin) return "linkedin";
  return provider;
}

const OAUTH_MODE_KEY = "globalhire-oauth-mode";
const OAUTH_PROVIDER_KEY = "globalhire-oauth-provider";

export function storeOAuthAttempt(mode: "login" | "signup", provider: SupabaseOAuthProvider) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(OAUTH_MODE_KEY, mode);
    sessionStorage.setItem(OAUTH_PROVIDER_KEY, provider);
  } catch {
    /* private mode */
  }
}

export function clearOAuthAttempt() {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(OAUTH_MODE_KEY);
    sessionStorage.removeItem(OAUTH_PROVIDER_KEY);
  } catch {
    /* ignore */
  }
}

export function consumeOAuthAttempt(): { mode: "login" | "signup"; provider: SupabaseOAuthProvider } | null {
  if (typeof window === "undefined") return null;
  try {
    const mode = sessionStorage.getItem(OAUTH_MODE_KEY);
    const provider = sessionStorage.getItem(OAUTH_PROVIDER_KEY) as SupabaseOAuthProvider | null;
    sessionStorage.removeItem(OAUTH_MODE_KEY);
    sessionStorage.removeItem(OAUTH_PROVIDER_KEY);
    if ((mode !== "login" && mode !== "signup") || !provider) return null;
    if (!Object.values(SUPABASE_OAUTH_PROVIDERS).includes(provider)) return null;
    return { mode, provider };
  } catch {
    return null;
  }
}

export function oauthSignInOptions(provider: SupabaseOAuthProvider, redirectTo: string) {
  const options: {
    redirectTo: string;
    queryParams?: Record<string, string>;
    scopes?: string;
  } = { redirectTo };

  if (provider === SUPABASE_OAUTH_PROVIDERS.google) {
    options.queryParams = { access_type: "offline", prompt: "consent" };
  }
  if (provider === SUPABASE_OAUTH_PROVIDERS.linkedin) {
    options.scopes = "openid profile email";
  }
  return options;
}

"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";
import { consumeOAuthAttempt, oauthProviderLabel } from "@/lib/social-oauth";

/** Fires login_completed / signup_completed after a successful OAuth redirect into the app shell. */
export function OAuthSessionTracker() {
  useEffect(() => {
    const attempt = consumeOAuthAttempt();
    if (!attempt) return;

    const provider = oauthProviderLabel(attempt.provider);
    const method = attempt.provider === "google" ? "google_oauth" : "social_oauth";

    if (attempt.mode === "login") {
      trackEvent("login_completed", { method, provider });
    } else {
      trackEvent("signup_completed", { method, provider });
    }
  }, []);

  return null;
}

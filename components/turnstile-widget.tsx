"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLanguage } from "@/components/language-provider";
import { turnstileCopy } from "@/lib/i18n-app-wide";

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
  }
}

const TURNSTILE_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let turnstileScriptPromise: Promise<void> | null = null;

function loadTurnstileScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.turnstile) return Promise.resolve();

  if (turnstileScriptPromise) return turnstileScriptPromise;

  turnstileScriptPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${TURNSTILE_SRC}"]`);
    if (existing) {
      if (window.turnstile) {
        resolve();
        return;
      }
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("turnstile_script_error")), { once: true });
      return;
    }

    const script = document.createElement("script");
    script.src = TURNSTILE_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => {
      turnstileScriptPromise = null;
      reject(new Error("turnstile_script_error"));
    };
    document.head.appendChild(script);
  });

  return turnstileScriptPromise;
}

function removeWidgetSafely(id: string | undefined) {
  if (!id || typeof window === "undefined" || !window.turnstile?.remove) return;
  try {
    window.turnstile.remove(id);
  } catch {
    /* DOM / widget already torn down */
  }
}

export function TurnstileWidget({
  action,
  onVerify,
  resetSignal = 0
}: {
  action: string;
  onVerify: (token: string) => void;
  resetSignal?: number;
}) {
  const { locale } = useLanguage();
  const tc = turnstileCopy[locale];
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const widgetIdRef = useRef<string>("");
  const reactId = useId().replace(/:/g, "");
  const containerId = `turnstile-${action}-${reactId}`;
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);
  const [widgetMounted, setWidgetMounted] = useState(false);
  const onVerifyRef = useRef(onVerify);
  const resetBaselineRef = useRef<number | null>(null);
  onVerifyRef.current = onVerify;

  const mountWidget = useCallback(() => {
    if (!siteKey) return;
    const container = document.getElementById(containerId);
    if (!container || !window.turnstile) return;

    removeWidgetSafely(widgetIdRef.current);
    widgetIdRef.current = "";
    container.innerHTML = "";
    setWidgetMounted(false);

    try {
      widgetIdRef.current = window.turnstile.render(container, {
        sitekey: siteKey,
        action,
        theme: "auto",
        callback: (token: string) => {
          setStatus("ready");
          onVerifyRef.current(token);
        },
        "expired-callback": () => {
          setStatus("loading");
          onVerifyRef.current("");
        },
        "error-callback": () => {
          setStatus("error");
          onVerifyRef.current("");
        },
        "timeout-callback": () => {
          setStatus("error");
          onVerifyRef.current("");
        },
        "unsupported-callback": () => {
          setStatus("error");
          onVerifyRef.current("");
        }
      });
      container.dataset.rendered = "true";
      setStatus("loading");
      setWidgetMounted(true);
    } catch (error) {
      console.warn("turnstile_render_error", error);
      setStatus("error");
      onVerifyRef.current("");
    }
  }, [action, containerId, siteKey]);

  useEffect(() => {
    if (!siteKey) return;

    let cancelled = false;

    const run = async () => {
      try {
        await loadTurnstileScript();
        if (cancelled) return;
        mountWidget();
      } catch {
        if (!cancelled) {
          setStatus("error");
          onVerifyRef.current("");
        }
      }
    };

    void run();

    return () => {
      cancelled = true;
      const container = document.getElementById(containerId);
      removeWidgetSafely(widgetIdRef.current);
      widgetIdRef.current = "";
      setWidgetMounted(false);
      if (container) {
        container.innerHTML = "";
        container.removeAttribute("data-rendered");
      }
    };
  }, [containerId, mountWidget, retry, siteKey]);

  useEffect(() => {
    if (!siteKey) return;

    if (resetBaselineRef.current === null) {
      resetBaselineRef.current = resetSignal;
      return;
    }
    if (resetBaselineRef.current === resetSignal) return;
    resetBaselineRef.current = resetSignal;

    const id = widgetIdRef.current;
    if (!id || !window.turnstile) return;

    try {
      window.turnstile.reset(id);
    } catch {
      const container = document.getElementById(containerId);
      removeWidgetSafely(id);
      widgetIdRef.current = "";
      if (container) {
        container.innerHTML = "";
        container.removeAttribute("data-rendered");
      }
      void loadTurnstileScript().then(() => {
        mountWidget();
      });
    }
    onVerifyRef.current("");
    setStatus("loading");
  }, [containerId, mountWidget, resetSignal, siteKey]);

  function retryWidget() {
    const container = document.getElementById(containerId);
    removeWidgetSafely(widgetIdRef.current);
    widgetIdRef.current = "";
    setWidgetMounted(false);
    if (container) {
      container.innerHTML = "";
      container.removeAttribute("data-rendered");
    }
    onVerifyRef.current("");
    setStatus("loading");
    setRetry((current) => current + 1);
  }

  if (!siteKey) {
    return (
      <p className="rounded-md border border-border bg-card p-3 text-xs leading-5 text-muted-foreground">{tc.disabled}</p>
    );
  }

  return (
    <div className="grid gap-2">
      <div id={containerId} className="min-h-[65px]" />
      {status === "loading" && !widgetMounted ? (
        <p className="text-xs text-muted-foreground">{tc.loading}</p>
      ) : null}
      {status === "error" ? (
        <div className="rounded-md border border-coral/25 bg-coral/10 p-3 text-xs leading-5 text-coral">
          <p>{tc.errorBody}</p>
          <button type="button" onClick={retryWidget} className="focus-ring mt-2 rounded-md border border-border bg-card px-3 py-2 font-semibold text-foreground hover:bg-muted">
            {tc.retry}
          </button>
        </div>
      ) : null}
    </div>
  );
}

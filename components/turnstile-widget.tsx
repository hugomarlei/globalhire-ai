"use client";

import Script from "next/script";
import { useCallback, useEffect, useId, useRef, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
      remove?: (widgetId: string) => void;
    };
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
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const widgetId = useRef<string>("");
  const reactId = useId().replace(/:/g, "");
  const containerId = `turnstile-${action}-${reactId}`;
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      onVerify("");
      setStatus("loading");
    }
  }, [onVerify, resetSignal]);

  const render = useCallback(() => {
    if (!siteKey) return;
    const container = document.getElementById(containerId);
    if (!container || container.dataset.rendered || !window.turnstile) return;

    try {
      widgetId.current = window.turnstile.render(container, {
        sitekey: siteKey,
        action,
        theme: "dark",
        callback: (token: string) => {
          setStatus("ready");
          onVerify(token);
        },
        "expired-callback": () => {
          setStatus("loading");
          onVerify("");
        },
        "error-callback": () => {
          setStatus("error");
          onVerify("");
        },
        "timeout-callback": () => {
          setStatus("error");
          onVerify("");
        },
        "unsupported-callback": () => {
          setStatus("error");
          onVerify("");
        }
      });
      container.dataset.rendered = "true";
      setStatus("loading");
    } catch (error) {
      console.warn("turnstile_render_error", error);
      setStatus("error");
      onVerify("");
    }
  }, [action, containerId, onVerify, siteKey]);

  useEffect(() => {
    if (!siteKey) return;

    setStatus("loading");
    const initialTimer = window.setTimeout(render, 150);
    const fallbackTimer = window.setTimeout(() => {
      if (!widgetId.current) setStatus("error");
    }, 8000);

    return () => {
      window.clearTimeout(initialTimer);
      window.clearTimeout(fallbackTimer);
    };
  }, [render, retry, siteKey]);

  function retryWidget() {
    const container = document.getElementById(containerId);
    if (widgetId.current && window.turnstile?.remove) {
      window.turnstile.remove(widgetId.current);
    }
    widgetId.current = "";
    if (container) {
      container.dataset.rendered = "";
      container.innerHTML = "";
    }
    onVerify("");
    setStatus("loading");
    setRetry((current) => current + 1);
  }

  if (!siteKey) {
    return (
      <p className="rounded-md border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/45">
        Captcha desativado neste ambiente. Em produção, configure Cloudflare Turnstile para proteção anti-bot.
      </p>
    );
  }

  return (
    <>
      <Script
        id="globalhire-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={render}
        onError={() => {
          setStatus("error");
          onVerify("");
        }}
      />
      <div className="grid gap-2">
        <div id={containerId} className="min-h-[65px]" />
        {status === "loading" && !widgetId.current ? (
          <p className="text-xs text-white/45">Carregando verificação de segurança...</p>
        ) : null}
        {status === "error" ? (
          <div className="rounded-md border border-coral/25 bg-coral/10 p-3 text-xs leading-5 text-coral">
            <p>Não consegui carregar o captcha. Verifique a conexão, desative bloqueadores para este site ou tente recarregar apenas a verificação.</p>
            <button type="button" onClick={retryWidget} className="focus-ring mt-2 rounded-md border border-coral/30 px-3 py-2 font-semibold text-white hover:bg-coral/10">
              Recarregar captcha
            </button>
          </div>
        ) : null}
      </div>
    </>
  );
}

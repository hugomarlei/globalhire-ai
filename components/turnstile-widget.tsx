"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (selector: string | HTMLElement, options: Record<string, unknown>) => string;
      reset: (widgetId?: string) => void;
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

  useEffect(() => {
    if (widgetId.current && window.turnstile) {
      window.turnstile.reset(widgetId.current);
      onVerify("");
    }
  }, [onVerify, resetSignal]);

  if (!siteKey) {
    return (
      <p className="rounded-md border border-white/10 bg-white/5 p-3 text-xs leading-5 text-white/45">
        Captcha desativado neste ambiente. Em produção, configure Cloudflare Turnstile para proteção anti-bot.
      </p>
    );
  }

  const containerId = `turnstile-${action}`;

  function render() {
    const container = document.getElementById(containerId);
    if (!container || container.dataset.rendered || !window.turnstile) return;
    widgetId.current = window.turnstile.render(container, {
      sitekey: siteKey,
      action,
      theme: "dark",
      callback: (token: string) => onVerify(token),
      "expired-callback": () => onVerify("")
    });
    container.dataset.rendered = "true";
  }

  return (
    <>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" onLoad={render} />
      <div id={containerId} className="min-h-[65px]" />
    </>
  );
}

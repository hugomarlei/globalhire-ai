"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const consentKey = "globalhire-cookie-consent";

function safeProjectId(value?: string) {
  return value?.replace(/[^a-zA-Z0-9]/g, "") || "";
}

function safeGaMeasurementId(value?: string) {
  return /^G-[A-Z0-9]+$/.test(value || "") ? value || "" : "";
}

function safePostHogHost(value?: string) {
  if (!value) return "https://us.i.posthog.com";
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.origin : "https://us.i.posthog.com";
  } catch {
    return "https://us.i.posthog.com";
  }
}

export function AnalyticsScripts() {
  const pathname = usePathname();
  const gaMeasurementId = safeGaMeasurementId(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
  const clarityId = safeProjectId(process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID);
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY?.replace(/[^a-zA-Z0-9_.-]/g, "") || "";
  const posthogHost = useMemo(() => safePostHogHost(process.env.NEXT_PUBLIC_POSTHOG_HOST), []);
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);
  const isProduction = process.env.NODE_ENV === "production";

  useEffect(() => {
    function syncConsent() {
      try {
        const stored = window.localStorage.getItem(consentKey);
        setAnalyticsAllowed(stored === "all" || stored === "accepted");
      } catch {
        setAnalyticsAllowed(false);
      }
    }

    syncConsent();
    window.addEventListener("globalhire:cookie-consent", syncConsent);
    return () => window.removeEventListener("globalhire:cookie-consent", syncConsent);
  }, []);

  useEffect(() => {
    if (!analyticsAllowed || !isProduction) return;
    const timer = window.setTimeout(() => {
      const searchParams = new URLSearchParams(window.location.search);
      trackEvent("page_view", {
        path: pathname,
        has_query: searchParams.toString().length > 0
      });

      if (pathname === "/dashboard") {
        if (searchParams.get("checkout") === "success") {
          trackEvent("checkout_completed", { source: "stripe" });
        }
        if (searchParams.get("subscription") === "updated") {
          trackEvent("subscription_updated", { source: "stripe_portal" });
        }
        if (searchParams.get("subscription") === "canceled") {
          trackEvent("subscription_canceled", { source: "stripe_portal" });
        }
      }
    }, 500);

    return () => window.clearTimeout(timer);
  }, [analyticsAllowed, isProduction, pathname]);

  useEffect(() => {
    if (!analyticsAllowed || !isProduction || !clarityId) return;
    const selectors = [
      "textarea",
      "input[type='file']",
      "input[type='email']",
      "input[type='password']",
      "input[name*='email' i]",
      "input[name*='phone' i]",
      "input[name*='telefone' i]",
      "input[name*='address' i]",
      "input[name*='token' i]",
      "[data-sensitive]",
      "[data-billing]",
      "[data-profile]",
      "[data-payment]"
    ];

    function maskSensitiveFields() {
      document.querySelectorAll(selectors.join(",")).forEach((element) => {
        element.setAttribute("data-clarity-mask", "true");
      });
    }

    maskSensitiveFields();
    const observer = new MutationObserver(maskSensitiveFields);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [analyticsAllowed, clarityId, isProduction]);

  if (!analyticsAllowed || !isProduction) return null;

  return (
    <>
      {gaMeasurementId ? (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`} strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('config', '${gaMeasurementId}', { send_page_view: false, anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
      {posthogKey ? (
        <Script id="posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once reset".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init("${posthogKey}", { api_host: "${posthogHost}", capture_pageview: false, autocapture: false, disable_session_recording: true, person_profiles: "identified_only" });
          `}
        </Script>
      ) : null}
      {clarityId ? (
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");
          `}
        </Script>
      ) : null}
    </>
  );
}

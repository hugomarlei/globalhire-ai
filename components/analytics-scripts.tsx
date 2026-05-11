"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics";

const consentKey = "globalhire-cookie-consent";

function safeProjectId(value?: string) {
  return value?.replace(/[^a-zA-Z0-9]/g, "") || "";
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
      trackEvent("page_view", {
        path: pathname,
        has_query: window.location.search.length > 0
      });
    }, 500);

    return () => window.clearTimeout(timer);
  }, [analyticsAllowed, isProduction, pathname]);

  if (!analyticsAllowed || !isProduction) return null;

  return (
    <>
      {posthogKey ? (
        <Script id="posthog-init" strategy="afterInteractive">
          {`
            !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture identify alias people.set people.set_once reset".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
            posthog.init("${posthogKey}", { api_host: "${posthogHost}", capture_pageview: false, autocapture: false, disable_session_recording: true });
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

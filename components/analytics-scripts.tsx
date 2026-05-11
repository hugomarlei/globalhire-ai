"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const consentKey = "globalhire-cookie-consent";

export function AnalyticsScripts() {
  const clarityId = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID?.replace(/[^a-zA-Z0-9]/g, "");
  const [analyticsAllowed, setAnalyticsAllowed] = useState(false);

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

  if (!clarityId || !analyticsAllowed) return null;

  return (
    <Script id="clarity-init" strategy="afterInteractive">
      {`
        (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${clarityId}");
      `}
    </Script>
  );
}

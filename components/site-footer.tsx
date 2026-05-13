"use client";

import Link from "next/link";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { footerCopy, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/components/language-provider";
import { getSocialLinks } from "@/lib/social";
import { cn } from "@/components/ui";

function openCookiePreferences() {
  window.dispatchEvent(new Event("globalhire:open-cookie-preferences"));
}

export function AutoSiteFooter({ className }: { className?: string }) {
  const { locale } = useLanguage();
  return <SiteFooter locale={locale} className={className} />;
}

export function SiteFooter({ locale, className }: { locale: Locale; className?: string }) {
  const copy = footerCopy[locale];
  const social = getSocialLinks();
  const linkClass = "hover:text-white";

  return (
    <footer className={cn("border-t border-white/10 px-4 py-8 text-sm text-white/55 sm:px-6", className)}>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p>{copy.copyright}</p>
          <p className="mt-2 text-xs text-white/40">{copy.cnpjLine}</p>
          <a
            href="mailto:contato@globalhireai.com.br"
            className={cn("mt-3 inline-flex items-center gap-2", linkClass)}
            rel="noopener noreferrer"
          >
            <Mail size={15} aria-hidden />
            contato@globalhireai.com.br
          </a>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/45">
            <a href="mailto:support@globalhireai.com.br" className={linkClass} rel="noopener noreferrer">
              support@globalhireai.com.br
            </a>
            <a href="mailto:privacy@globalhireai.com.br" className={linkClass} rel="noopener noreferrer">
              privacy@globalhireai.com.br
            </a>
            <a href="mailto:billing@globalhireai.com.br" className={linkClass} rel="noopener noreferrer">
              billing@globalhireai.com.br
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-4 md:items-end">
          <div className="flex flex-wrap gap-3 text-white/55">
            {social.linkedin ? (
              <a
                href={social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-md border border-white/12 bg-white/6 transition hover:bg-white/12 hover:text-white"
                aria-label="LinkedIn"
              >
                <Linkedin size={18} aria-hidden />
              </a>
            ) : null}
            {social.instagram ? (
              <a
                href={social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex size-10 items-center justify-center rounded-md border border-white/12 bg-white/6 transition hover:bg-white/12 hover:text-white"
                aria-label="Instagram"
              >
                <Instagram size={18} aria-hidden />
              </a>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
            <Link href="/privacidade" className={linkClass}>
              {copy.privacy}
            </Link>
            <Link href="/termos" className={linkClass}>
              {copy.terms}
            </Link>
            <Link href="/cookies" className={linkClass}>
              {copy.cookies}
            </Link>
            <Link href="/refund-policy" className={linkClass}>
              {copy.refund}
            </Link>
            <Link href="/data-processing" className={linkClass}>
              {copy.dataProcessing}
            </Link>
            <Link href="/support" className={linkClass}>
              {copy.support}
            </Link>
            <button type="button" onClick={openCookiePreferences} className={cn("text-left", linkClass)}>
              {copy.cookiePreferences}
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

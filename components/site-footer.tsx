"use client";

import Link from "next/link";
import { Instagram, Linkedin, Mail } from "lucide-react";
import { footerCopy, type Locale } from "@/lib/i18n";
import { useLanguage } from "@/components/language-provider";
import { getSocialLinks } from "@/lib/social";
import { cn } from "@/components/ui";

function TikTokGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={18} height={18} aria-hidden>
      <path
        fill="currentColor"
        d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-8.54a8.16 8.16 0 0 0 4.73 1.54V7.05a4.85 4.85 0 0 1-1-.36z"
      />
    </svg>
  );
}

function openCookiePreferences() {
  window.dispatchEvent(new Event("globalhire:open-cookie-preferences"));
}

export function AutoSiteFooter({ className }: { className?: string }) {
  const { locale } = useLanguage();
  return <SiteFooter locale={locale} className={className} />;
}

const socialBtn =
  "inline-flex size-10 items-center justify-center rounded-md border border-graphite/20 bg-white/90 text-ink transition hover:bg-white hover:text-ink dark:border-white/10 dark:bg-[#121a16] dark:text-white dark:hover:bg-[#1a2520] dark:hover:border-white/16 dark:hover:text-white";

export function SiteFooter({ locale, className }: { locale: Locale; className?: string }) {
  const copy = footerCopy[locale];
  const social = getSocialLinks();
  const linkClass = "text-graphite/75 underline-offset-2 hover:text-ink hover:underline dark:text-white/60 dark:hover:text-white";

  return (
    <footer
      className={cn(
        "border-t border-graphite/15 px-4 py-8 text-sm text-graphite/70 dark:border-white/10 dark:text-white/55 sm:px-6",
        className
      )}
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0">
          <p className="text-graphite dark:text-white/90">{copy.copyright}</p>
          <p className="mt-2 text-xs text-graphite/60 dark:text-white/40">{copy.cnpjLine}</p>
          <a
            href="mailto:contato@globalhireai.com.br"
            className={cn("mt-3 inline-flex items-center gap-2", linkClass)}
            rel="noopener noreferrer"
          >
            <Mail size={15} aria-hidden />
            contato@globalhireai.com.br
          </a>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-graphite/55 dark:text-white/45">
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
          <div className="flex flex-wrap gap-3">
            <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className={socialBtn} aria-label="LinkedIn">
              <Linkedin size={18} aria-hidden />
            </a>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className={socialBtn} aria-label="Instagram">
              <Instagram size={18} aria-hidden />
            </a>
            <a href={social.tiktok} target="_blank" rel="noopener noreferrer" className={socialBtn} aria-label="TikTok">
              <TikTokGlyph className="size-[18px]" />
            </a>
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

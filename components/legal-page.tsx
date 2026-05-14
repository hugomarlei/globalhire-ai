import Link from "next/link";
import { AutoSiteFooter } from "@/components/site-footer";
import { PublicNav } from "@/components/nav";
import { Card } from "@/components/ui";
import type { LegalPageChrome } from "@/lib/i18n-legal-chrome";

export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export function LegalPage({
  chrome,
  eyebrow,
  title,
  updatedAt,
  intro,
  sections,
  bindingNotice
}: {
  chrome: LegalPageChrome;
  eyebrow?: string;
  title: string;
  updatedAt: string;
  intro: string[];
  sections: LegalSection[];
  bindingNotice?: string | null;
}) {
  const eb = eyebrow || chrome.eyebrowDefault;
  return (
    <main className="min-h-screen bg-background text-foreground">
      <PublicNav />
      <article className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <Card className="p-6 sm:p-10">
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-500">{eb}</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-normal text-foreground sm:text-5xl">{title}</h1>
          <p className="mt-4 text-sm font-medium text-muted-foreground">
            {chrome.lastUpdatedPrefix} {updatedAt}
          </p>
          {bindingNotice ? (
            <div className="mt-4 rounded-lg border border-amber-500/35 bg-amber-500/10 p-4 text-sm leading-relaxed text-foreground dark:border-amber-400/30 dark:bg-amber-400/10">
              {bindingNotice}
            </div>
          ) : null}
          <div className="mt-6 grid gap-4 text-sm leading-7 text-muted-foreground">
            {intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 space-y-9">
            {sections.map((section) => (
              <section key={section.title} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-foreground">{section.title}</h2>
                <div className="mt-3 grid gap-3 text-sm leading-7 text-muted-foreground">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                  {section.bullets ? (
                    <ul className="grid gap-2 pl-5">
                      {section.bullets.map((item) => (
                        <li key={item} className="list-disc">
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </div>
              </section>
            ))}
          </div>
          <nav
            className="mt-10 flex flex-wrap gap-4 border-t border-border pt-6 text-sm text-muted-foreground"
            aria-label={chrome.legalNavAria}
          >
            <Link href="/privacidade" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
              {chrome.linkPrivacy}
            </Link>
            <Link href="/termos" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
              {chrome.linkTerms}
            </Link>
            <Link href="/cookies" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
              {chrome.linkCookies}
            </Link>
            <Link href="/refund-policy" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
              {chrome.linkRefund}
            </Link>
            <Link href="/data-processing" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
              {chrome.linkData}
            </Link>
            <Link href="/support" className="font-medium text-brand-700 hover:underline dark:text-brand-200 dark:hover:text-white">
              {chrome.linkSupport}
            </Link>
          </nav>
        </Card>
      </article>
      <AutoSiteFooter />
    </main>
  );
}

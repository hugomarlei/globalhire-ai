import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalDocTitles, legalPageChrome, legalUpdatedAtByLocale } from "@/lib/i18n-legal-chrome";
import { legalIntrosByLocale } from "@/lib/i18n-legal-intros";
import { legalBindingNotice } from "@/lib/i18n-legal-notice";
import { cookiesSections } from "@/lib/legal-content";
import { getServerLocale } from "@/lib/server-locale";

export const metadata: Metadata = {
  title: "Política de Cookies | GlobalHire AI",
  description: "Política de Cookies da GlobalHire AI, incluindo cookies essenciais, analytics, PostHog e Microsoft Clarity.",
  alternates: {
    canonical: `${getAppUrl()}/cookies`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function CookiesPage() {
  const locale = await getServerLocale();
  const chrome = legalPageChrome[locale];
  const titles = legalDocTitles[locale];
  return (
    <LegalPage
      chrome={chrome}
      title={titles.cookies}
      updatedAt={legalUpdatedAtByLocale[locale]}
      intro={legalIntrosByLocale[locale].cookies}
      sections={cookiesSections}
      bindingNotice={legalBindingNotice[locale]}
    />
  );
}

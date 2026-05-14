import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalDocTitles, legalPageChrome, legalUpdatedAtByLocale } from "@/lib/i18n-legal-chrome";
import { legalIntrosByLocale } from "@/lib/i18n-legal-intros";
import { legalBindingNotice } from "@/lib/i18n-legal-notice";
import { privacySections } from "@/lib/legal-content";
import { getServerLocale } from "@/lib/server-locale";

export const metadata: Metadata = {
  title: "Política de Privacidade | GlobalHire AI",
  description: "Política de Privacidade da GlobalHire AI conforme LGPD, SaaS, IA generativa, Stripe, Supabase, Google OAuth e analytics.",
  alternates: {
    canonical: `${getAppUrl()}/privacidade`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function PrivacyPage() {
  const locale = await getServerLocale();
  const chrome = legalPageChrome[locale];
  const titles = legalDocTitles[locale];
  return (
    <LegalPage
      chrome={chrome}
      title={titles.privacy}
      updatedAt={legalUpdatedAtByLocale[locale]}
      intro={legalIntrosByLocale[locale].privacy}
      sections={privacySections}
      bindingNotice={legalBindingNotice[locale]}
    />
  );
}

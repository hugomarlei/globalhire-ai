import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalDocTitles, legalPageChrome, legalUpdatedAtByLocale } from "@/lib/i18n-legal-chrome";
import { legalIntrosByLocale } from "@/lib/i18n-legal-intros";
import { legalBindingNotice } from "@/lib/i18n-legal-notice";
import { termsSections } from "@/lib/legal-content";
import { getServerLocale } from "@/lib/server-locale";

export const metadata: Metadata = {
  title: "Termos de Uso | GlobalHire AI",
  description: "Termos de Uso da GlobalHire AI para SaaS de currículos ATS, IA generativa, assinaturas Stripe e ferramentas profissionais.",
  alternates: {
    canonical: `${getAppUrl()}/termos`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function TermsPage() {
  const locale = await getServerLocale();
  const chrome = legalPageChrome[locale];
  const titles = legalDocTitles[locale];
  return (
    <LegalPage
      chrome={chrome}
      title={titles.terms}
      updatedAt={legalUpdatedAtByLocale[locale]}
      intro={legalIntrosByLocale[locale].terms}
      sections={termsSections}
      bindingNotice={legalBindingNotice[locale]}
    />
  );
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalDocTitles, legalPageChrome, legalUpdatedAtByLocale } from "@/lib/i18n-legal-chrome";
import { legalIntrosByLocale } from "@/lib/i18n-legal-intros";
import { legalBindingNotice } from "@/lib/i18n-legal-notice";
import { supportSections } from "@/lib/legal-content";
import { getServerLocale } from "@/lib/server-locale";

export const metadata: Metadata = {
  title: "Suporte | GlobalHire AI",
  description: "Central de suporte da GlobalHire AI para conta, assinatura, cobrança, privacidade e uso das ferramentas de IA.",
  alternates: {
    canonical: `${getAppUrl()}/support`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function SupportPage() {
  const locale = await getServerLocale();
  const chrome = legalPageChrome[locale];
  const titles = legalDocTitles[locale];
  return (
    <LegalPage
      chrome={chrome}
      title={titles.support}
      updatedAt={legalUpdatedAtByLocale[locale]}
      intro={legalIntrosByLocale[locale].support}
      sections={supportSections}
      bindingNotice={legalBindingNotice[locale]}
    />
  );
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalDocTitles, legalPageChrome, legalUpdatedAtByLocale } from "@/lib/i18n-legal-chrome";
import { legalIntrosByLocale } from "@/lib/i18n-legal-intros";
import { legalBindingNotice } from "@/lib/i18n-legal-notice";
import { dataProcessingSections } from "@/lib/legal-content";
import { getServerLocale } from "@/lib/server-locale";

export const metadata: Metadata = {
  title: "Tratamento de Dados | GlobalHire AI",
  description: "Resumo operacional de tratamento de dados pessoais, provedores, IA generativa e retenção na GlobalHire AI.",
  alternates: {
    canonical: `${getAppUrl()}/data-processing`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function DataProcessingPage() {
  const locale = await getServerLocale();
  const chrome = legalPageChrome[locale];
  const titles = legalDocTitles[locale];
  return (
    <LegalPage
      chrome={chrome}
      title={titles.dataProcessing}
      updatedAt={legalUpdatedAtByLocale[locale]}
      intro={legalIntrosByLocale[locale].dataProcessing}
      sections={dataProcessingSections}
      bindingNotice={legalBindingNotice[locale]}
    />
  );
}

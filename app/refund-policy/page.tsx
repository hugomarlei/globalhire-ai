import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalDocTitles, legalPageChrome, legalUpdatedAtByLocale } from "@/lib/i18n-legal-chrome";
import { legalIntrosByLocale } from "@/lib/i18n-legal-intros";
import { legalBindingNotice } from "@/lib/i18n-legal-notice";
import { refundSections } from "@/lib/legal-content";
import { getServerLocale } from "@/lib/server-locale";

export const metadata: Metadata = {
  title: "Cancelamento e Reembolso | GlobalHire AI",
  description: "Política de cancelamento, assinatura, reembolso e cobrança da GlobalHire AI.",
  alternates: {
    canonical: `${getAppUrl()}/refund-policy`
  },
  robots: {
    index: true,
    follow: true
  }
};

export default async function RefundPolicyPage() {
  const locale = await getServerLocale();
  const chrome = legalPageChrome[locale];
  const titles = legalDocTitles[locale];
  return (
    <LegalPage
      chrome={chrome}
      title={titles.refund}
      updatedAt={legalUpdatedAtByLocale[locale]}
      intro={legalIntrosByLocale[locale].refund}
      sections={refundSections}
      bindingNotice={legalBindingNotice[locale]}
    />
  );
}

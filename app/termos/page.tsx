import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalUpdatedAt, termsIntro, termsSections } from "@/lib/legal-content";

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

export default function TermsPage() {
  return (
    <LegalPage
      title="Termos de Uso"
      updatedAt={legalUpdatedAt}
      intro={termsIntro}
      sections={termsSections}
    />
  );
}

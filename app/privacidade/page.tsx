import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalUpdatedAt, privacyIntro, privacySections } from "@/lib/legal-content";

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

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Política de Privacidade"
      updatedAt={legalUpdatedAt}
      intro={privacyIntro}
      sections={privacySections}
    />
  );
}

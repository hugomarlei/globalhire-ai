import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { cookiesSections, legalUpdatedAt } from "@/lib/legal-content";

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

export default function CookiesPage() {
  return (
    <LegalPage
      title="Política de Cookies"
      updatedAt={legalUpdatedAt}
      intro={[
        "Esta Política de Cookies explica como a GlobalHire AI utiliza cookies e tecnologias similares para segurança, autenticação, funcionamento da conta, analytics e melhoria de produto.",
        "Cookies essenciais não dependem de consentimento para funcionamento do serviço. Cookies analíticos devem respeitar as escolhas do usuário e a configuração do banner de privacidade."
      ]}
      sections={cookiesSections}
    />
  );
}

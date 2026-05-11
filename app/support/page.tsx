import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalUpdatedAt, supportSections } from "@/lib/legal-content";

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

export default function SupportPage() {
  return (
    <LegalPage
      title="Central de Suporte"
      updatedAt={legalUpdatedAt}
      intro={[
        "Esta página reúne os canais oficiais para suporte, cobrança, privacidade e dúvidas operacionais sobre a GlobalHire AI.",
        "Para agilizar atendimento, envie o e-mail da conta, o plano contratado quando aplicável e uma descrição objetiva do problema. Não envie dados sensíveis desnecessários."
      ]}
      sections={supportSections}
    />
  );
}

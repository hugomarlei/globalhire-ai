import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { legalUpdatedAt, refundSections } from "@/lib/legal-content";

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

export default function RefundPolicyPage() {
  return (
    <LegalPage
      title="Cancelamento e Reembolso"
      updatedAt={legalUpdatedAt}
      intro={[
        "Esta política complementa os Termos de Uso e descreve como funcionam cancelamentos, renovações, pedidos de reembolso e suporte de cobrança na GlobalHire AI.",
        "Pagamentos e gestão de assinatura são processados pelo Stripe, com retorno ao painel da GlobalHire AI quando a operação é concluída."
      ]}
      sections={refundSections}
    />
  );
}

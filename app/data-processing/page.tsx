import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";
import { getAppUrl } from "@/lib/app-url";
import { dataProcessingSections, legalUpdatedAt } from "@/lib/legal-content";

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

export default function DataProcessingPage() {
  return (
    <LegalPage
      title="Tratamento de Dados"
      updatedAt={legalUpdatedAt}
      intro={[
        "Este documento resume a arquitetura operacional de tratamento de dados da GlobalHire AI e deve ser lido em conjunto com a Política de Privacidade, Termos de Uso e Política de Cookies.",
        "Ele explica, em linguagem objetiva, como a plataforma trata dados profissionais e dados técnicos para entregar funcionalidades SaaS com IA generativa."
      ]}
      sections={dataProcessingSections}
    />
  );
}

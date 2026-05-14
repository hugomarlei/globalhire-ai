import { brandIcon } from "@/lib/brand-assets";
import { getAppUrl } from "@/lib/app-url";

function JsonLd({ data, id }: { data: Record<string, unknown>; id: string }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export function GlobalStructuredData({ aggregateOfferHighPrice = "149" }: { aggregateOfferHighPrice?: string }) {
  const baseUrl = getAppUrl();
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GlobalHire AI",
    url: baseUrl,
    logo: `${baseUrl}${brandIcon.mark512}`,
    email: "contato@globalhireai.com.br",
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@globalhireai.com.br",
        availableLanguage: ["pt-BR", "en"]
      },
      {
        "@type": "ContactPoint",
        contactType: "privacy",
        email: "privacy@globalhireai.com.br",
        availableLanguage: ["pt-BR", "en"]
      }
    ]
  };
  const website = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GlobalHire AI",
    url: baseUrl
  };
  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "GlobalHire AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: baseUrl,
    description: "SaaS com IA para currículos ATS, candidaturas internacionais, LinkedIn, entrevistas e análise de compatibilidade com vagas.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "BRL",
      lowPrice: "0",
      highPrice: aggregateOfferHighPrice
    }
  };

  return (
    <>
      <JsonLd id="organization-jsonld" data={organization} />
      <JsonLd id="website-jsonld" data={website} />
      <JsonLd id="software-jsonld" data={softwareApplication} />
    </>
  );
}

export function FaqStructuredData({ items }: { items: Array<[string, string]> }) {
  return (
    <JsonLd
      id="faq-jsonld"
      data={{
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: items.map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: {
            "@type": "Answer",
            text: answer
          }
        }))
      }}
    />
  );
}

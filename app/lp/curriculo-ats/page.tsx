import type { Metadata } from "next";
import { MarketingLanding } from "@/components/marketing-landing";
import { getAppUrl } from "@/lib/app-url";
import { lpPages } from "@/lib/lp-content";

const page = lpPages["curriculo-ats"];

export const metadata: Metadata = {
  title: `${page.metaTitle} | GlobalHire AI`,
  description: page.metaDescription,
  alternates: { canonical: `${getAppUrl()}${page.path}` },
  openGraph: {
    title: page.metaTitle,
    description: page.metaDescription,
    url: `${getAppUrl()}${page.path}`
  }
};

export default function CurriculoAtsLandingPage() {
  return <MarketingLanding page={page} />;
}

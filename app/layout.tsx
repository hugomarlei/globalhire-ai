import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { CookieConsent } from "@/components/cookie-consent";
import { LanguageProvider } from "@/components/language-provider";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

const brandDir = join(process.cwd(), "public", "brand");
const hasOgImage = existsSync(join(brandDir, "og-image.png"));
const hasFavicon = existsSync(join(brandDir, "favicon.ico"));

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: "GlobalHire AI — Currículos ATS e candidaturas internacionais com IA",
  description:
    "Crie currículos otimizados para ATS, cartas de apresentação e LinkedIn para vagas internacionais com inteligência artificial.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "GlobalHire AI — Currículos ATS e candidaturas internacionais com IA",
    description:
      "Crie currículos otimizados para ATS, cartas de apresentação e LinkedIn para vagas internacionais com inteligência artificial.",
    type: "website",
    url: "/",
    siteName: "GlobalHire AI",
    images: hasOgImage ? [
      {
        url: "/brand/og-image.png",
        width: 1200,
        height: 630,
        alt: "GlobalHire AI"
      }
    ] : undefined
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalHire AI — Currículos ATS e candidaturas internacionais com IA",
    description:
      "Crie currículos otimizados para ATS, cartas de apresentação e LinkedIn para vagas internacionais com inteligência artificial.",
    images: hasOgImage ? ["/brand/og-image.png"] : undefined
  },
  icons: hasFavicon ? { icon: "/brand/favicon.ico" } : undefined
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="dark">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <CookieConsent />
        <AnalyticsScripts />
      </body>
    </html>
  );
}

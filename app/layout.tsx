import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { Inter } from "next/font/google";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { UtmCapture } from "@/components/utm-capture";
import { CookieConsent } from "@/components/cookie-consent";
import { LanguageProvider } from "@/components/language-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalStructuredData } from "@/components/structured-data";
import { brandIcon } from "@/lib/brand-assets";
import { getAppUrl } from "@/lib/app-url";
import { computeAggregateOfferHighPriceMajorUnits } from "@/lib/plan-price-display";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap"
});

const brandDir = join(process.cwd(), "public", "brand");
const hasOgImage = existsSync(join(brandDir, "og-image.png"));
const hasSvgOgImage = existsSync(join(brandDir, "og-image.svg"));
const hasFaviconPng = existsSync(join(brandDir, "favicon-32.png"));
const hasFavicon = existsSync(join(brandDir, "favicon.ico"));
const hasSvgFavicon = existsSync(join(brandDir, "favicon.svg"));
const ogImagePath = hasOgImage ? "/brand/og-image.png" : hasSvgOgImage ? "/brand/og-image.svg" : undefined;
const faviconDescriptors =
  hasFaviconPng && existsSync(join(brandDir, "favicon-16.png"))
    ? [
        { url: "/brand/favicon-16.png" as const, sizes: "16x16" as const, type: "image/png" as const },
        { url: "/brand/favicon-32.png" as const, sizes: "32x32" as const, type: "image/png" as const }
      ]
    : null;
const faviconPath = hasFavicon ? "/brand/favicon.ico" : hasSvgFavicon ? "/brand/favicon.svg" : undefined;

export const metadata: Metadata = {
  metadataBase: new URL(getAppUrl()),
  title: "GlobalHire AI — IA para currículos, ATS e candidaturas mais estratégicas",
  description:
    "Use IA para analisar vagas, melhorar currículos, gerar cartas, LinkedIn, mensagens e preparar candidaturas com mais clareza e aderência.",
  alternates: {
    canonical: "/"
  },
  openGraph: {
    title: "GlobalHire AI — IA para currículos, ATS e candidaturas mais estratégicas",
    description:
      "Use IA para analisar vagas, melhorar currículos, gerar cartas, LinkedIn, mensagens e preparar candidaturas com mais clareza e aderência.",
    type: "website",
    url: "/",
    siteName: "GlobalHire AI",
    images: ogImagePath ? [
      {
        url: ogImagePath,
        width: 1200,
        height: 630,
        alt: "GlobalHire AI"
      }
    ] : undefined
  },
  twitter: {
    card: "summary_large_image",
    title: "GlobalHire AI — IA para currículos, ATS e candidaturas mais estratégicas",
    description:
      "Use IA para analisar vagas, melhorar currículos, gerar cartas, LinkedIn, mensagens e preparar candidaturas com mais clareza e aderência.",
    images: ogImagePath ? [ogImagePath] : undefined
  },
  icons: faviconDescriptors
    ? {
        icon: faviconDescriptors,
        apple: brandIcon.appleTouch
      }
    : faviconPath
      ? { icon: faviconPath, shortcut: faviconPath }
      : undefined
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const aggregateOfferHighPrice = computeAggregateOfferHighPriceMajorUnits(null);

  return (
    <html lang="pt-BR" className={`${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased transition-colors duration-300">
        <LanguageProvider>
          <ThemeProvider>
            {children}
            <CookieConsent />
          </ThemeProvider>
        </LanguageProvider>
        <GlobalStructuredData aggregateOfferHighPrice={aggregateOfferHighPrice} />
        <UtmCapture />
        <AnalyticsScripts />
      </body>
    </html>
  );
}

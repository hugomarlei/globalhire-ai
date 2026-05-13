import type { Metadata } from "next";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { CookieConsent } from "@/components/cookie-consent";
import { LanguageProvider } from "@/components/language-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { GlobalStructuredData } from "@/components/structured-data";
import { getAppUrl } from "@/lib/app-url";
import "./globals.css";

const brandDir = join(process.cwd(), "public", "brand");
const hasOgImage = existsSync(join(brandDir, "og-image.png"));
const hasSvgOgImage = existsSync(join(brandDir, "og-image.svg"));
const hasFavicon = existsSync(join(brandDir, "favicon.ico"));
const hasSvgFavicon = existsSync(join(brandDir, "favicon.svg"));
const ogImagePath = hasOgImage ? "/brand/og-image.png" : hasSvgOgImage ? "/brand/og-image.svg" : undefined;
const faviconPath = hasFavicon ? "/brand/favicon.ico" : hasSvgFavicon ? "/brand/favicon.svg" : undefined;

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
    title: "GlobalHire AI — Currículos ATS e candidaturas internacionais com IA",
    description:
      "Crie currículos otimizados para ATS, cartas de apresentação e LinkedIn para vagas internacionais com inteligência artificial.",
    images: ogImagePath ? [ogImagePath] : undefined
  },
  icons: faviconPath ? { icon: faviconPath, shortcut: faviconPath } : undefined
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className="min-h-screen bg-paper text-ink antialiased transition-colors dark:bg-ink dark:text-white">
        <LanguageProvider>
          <ThemeProvider>{children}</ThemeProvider>
        </LanguageProvider>
        <GlobalStructuredData />
        <CookieConsent />
        <AnalyticsScripts />
      </body>
    </html>
  );
}

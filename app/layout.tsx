import type { Metadata } from "next";
import { AnalyticsScripts } from "@/components/analytics-scripts";
import { CookieConsent } from "@/components/cookie-consent";
import { LanguageProvider } from "@/components/language-provider";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlobalHire AI",
  description:
    "Currículos ATS, ATS Score, cartas de apresentação e LinkedIn para vagas internacionais com IA.",
  openGraph: {
    title: "GlobalHire AI",
    description: "Otimize currículos internacionais, ATS Score e materiais profissionais com IA.",
    type: "website",
    url: "https://globalhire.ai"
  },
  icons: {
    icon: "/favicon.ico"
  }
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

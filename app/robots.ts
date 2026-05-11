import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://globalhireai.com.br";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/dashboard", "/gerador", "/historico", "/conta", "/assinatura", "/configuracoes"]
    },
    sitemap: `${baseUrl}/sitemap.xml`
  };
}

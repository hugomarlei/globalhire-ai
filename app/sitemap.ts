import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://globalhireai.com.br";
  const routes = ["", "/pricing", "/features", "/faq", "/resources", "/support", "/termos", "/privacidade", "/cookies", "/refund-policy", "/data-processing"];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7
  }));
}

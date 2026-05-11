import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/app-url";

const routes: Array<{
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
}> = [
  { path: "", changeFrequency: "weekly", priority: 1 },
  { path: "/pricing", changeFrequency: "weekly", priority: 0.9 },
  { path: "/cadastro", changeFrequency: "monthly", priority: 0.8 },
  { path: "/login", changeFrequency: "monthly", priority: 0.6 },
  { path: "/privacidade", changeFrequency: "yearly", priority: 0.5 },
  { path: "/termos", changeFrequency: "yearly", priority: 0.5 },
  { path: "/cookies", changeFrequency: "yearly", priority: 0.4 },
  { path: "/support", changeFrequency: "monthly", priority: 0.6 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.4 },
  { path: "/data-processing", changeFrequency: "yearly", priority: 0.4 }
];

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getAppUrl();
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${baseUrl}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority
  }));
}

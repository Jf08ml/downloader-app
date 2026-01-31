// app/sitemap.ts
import type { MetadataRoute } from "next";

const LOCALES = ["es", "en", "pt", "fr", "de"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000";

  const now = new Date();

  return LOCALES.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: locale === "es" ? 1.0 : 0.8,
  }));
}

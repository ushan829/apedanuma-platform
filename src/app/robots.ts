import type { MetadataRoute } from "next";

/**
 * Standard Robots.txt Configuration
 * 
 * Protects premium content from AI crawlers and standardizes search indexing.
 * Includes specific blocks for industry-known AI scraping bots.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://em.apedanuma.lk").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/", "/login", "/register", "/forgot-password"],
      },
      // ── Block AI Crawlers from Training ──
      {
        userAgent: "GPTBot",
        disallow: "/",
      },
      {
        userAgent: "Google-Extended",
        disallow: "/",
      },
      {
        userAgent: "CCBot",
        disallow: "/",
      },
      {
        userAgent: "Anthropic-ai",
        disallow: "/",
      },
      {
        userAgent: "OmgiliBot",
        disallow: "/",
      },
      {
        userAgent: "FacebookBot",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

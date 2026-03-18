import type { MetadataRoute } from "next";

/**
 * Technical SEO: robots.txt Optimization
 * 
 * This configuration protects the platform's crawl budget by allowing only 
 * high-value filtered pages while strictly blocking internal search result 
 * pages and infinite parameter loops.
 */
export default function robots(): MetadataRoute.Robots {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://em.apedanuma.lk").replace(/\/$/, "");

  return {
    rules: [
      {
        userAgent: "*",
        // Allow high-value filtered pages for indexing
        allow: [
          "/",
          "/free-resources",
          "/free-resources?grade=*",
          "/free-resources?subjects=*",
        ],
        // Disallow messy parameter combinations and protected areas
        disallow: [
          "/api/",
          "/admin/",
          "/dashboard/",
          "/login",
          "/register",
          "/forgot-password",
          "/*?q=",      // Block internal search query parameter
          "/*?*q=",     // Block search queries anywhere in the URL
          "/*?*&*&*",   // Block deep parameter combinations (3+ params) to prevent crawl bloat
          "/*?*",       // Catch-all: block any other query parameters not explicitly allowed
        ],
      },
      // ── Block AI Crawlers from Training ──
      // This protects your educational content from being scraped for LLM training
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
        userAgent: "FacebookBot",
        disallow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

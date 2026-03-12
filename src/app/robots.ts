import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/dashboard/"],
      },
    ],
    sitemap: `${(process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://em.apedanuma.lk").replace(/\/$/, "")}/sitemap.xml`,
  };
}

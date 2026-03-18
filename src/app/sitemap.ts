import type { MetadataRoute } from "next";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import BlogPost from "@/models/BlogPost";

const BASE_URL = (process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "https://em.apedanuma.lk").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Core Platform Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL,                          lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/free-resources`,      lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/premium-store`,       lastModified: now, changeFrequency: "daily",   priority: 0.9 },
    { url: `${BASE_URL}/blog`,                lastModified: now, changeFrequency: "daily",   priority: 0.8 },
    { url: `${BASE_URL}/about`,               lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`,             lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/privacy-policy`,      lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/terms-and-conditions`,lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/refund-policy`,       lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${BASE_URL}/disclaimer`,          lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  // 2. Technical SEO: Cornerstone Category Content (Sitemap Deep Linking)
  // These filtered views help Google index specific high-value educational niches
  const cornerstoneRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/free-resources?subjects=Science`,     lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/free-resources?subjects=Mathematics`, lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/free-resources?subjects=English`,     lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/free-resources?subjects=ICT`,         lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/free-resources?grade=11`,             lastModified: now, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/free-resources?grade=10`,             lastModified: now, changeFrequency: "daily", priority: 0.8 },
  ];

  try {
    await connectToDatabase();

    const [resources, blogPosts] = await Promise.all([
      Resource.find({ isPublished: true }).select("_id isPremium updatedAt").lean(),
      BlogPost.find({ isPublished: true }).select("slug publishedAt updatedAt").lean(),
    ]);

    // 3. Dynamic Resource Pages
    const resourceRoutes: MetadataRoute.Sitemap = resources.map((r) => ({
      url: `${BASE_URL}/${r.isPremium ? "premium-store" : "free-resources"}/${String(r._id)}`,
      lastModified: (r.updatedAt as Date) ?? now,
      changeFrequency: "monthly" as const,
      priority: r.isPremium ? 0.8 : 0.7,
    }));

    // 4. Dynamic Blog Posts
    const blogRoutes: MetadataRoute.Sitemap = blogPosts.map((p) => ({
      url: `${BASE_URL}/blog/${p.slug}`,
      lastModified: (p.updatedAt as Date) ?? now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    return [...staticRoutes, ...cornerstoneRoutes, ...resourceRoutes, ...blogRoutes];
  } catch {
    return [...staticRoutes, ...cornerstoneRoutes];
  }
}

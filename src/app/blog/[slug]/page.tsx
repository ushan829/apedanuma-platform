import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import connectToDatabase from "@/lib/mongodb";
import BlogPost from "@/models/BlogPost";
import ReadingProgressBar from "@/components/blog/ReadingProgressBar";

export const revalidate = 300;

const BASE_URL = "https://apedanuma.lk";
const OG_PLACEHOLDER = `${BASE_URL}/og-default.jpg`;

/* ── Block types ── */
interface Block {
  type: "h2" | "h3" | "paragraph" | "quote" | "divider" | "image";
  content: string;
  caption?: string;
}

function parseContent(raw: string): Block[] {
  try {
    const blocks = JSON.parse(raw) as Block[];
    if (Array.isArray(blocks)) return blocks;
  } catch { /* fallback */ }
  return [{ type: "paragraph", content: raw }];
}

/** Extract first image URL from content blocks (for OG fallback). */
function extractFirstImage(raw: string): string | null {
  try {
    const blocks = JSON.parse(raw) as Block[];
    const img = blocks.find((b) => b.type === "image" && b.content);
    return img?.content ?? null;
  } catch { return null; }
}

/* ── Static params (pre-render all published posts at build time) ── */
export async function generateStaticParams() {
  try {
    await connectToDatabase();
    const posts = await BlogPost.find({ isPublished: true })
      .select("slug")
      .lean();
    return posts.map((p) => ({ slug: p.slug as string }));
  } catch {
    return [];
  }
}

/* ── Metadata ── */
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  try {
    await connectToDatabase();
    const post = await BlogPost.findOne({ slug: params.slug, isPublished: true })
      .select("title excerpt coverImage content author publishedAt updatedAt")
      .lean();
    if (!post) return { title: "Post Not Found" };

    const canonical = `${BASE_URL}/blog/${params.slug}`;
    const ogImage =
      post.coverImage ||
      extractFirstImage(post.content) ||
      OG_PLACEHOLDER;
    const description = post.excerpt ?? `An article by ${post.author} on Ape Danuma EM.`;

    return {
      title: post.title,
      description,
      alternates: { canonical },
      openGraph: {
        type: "article",
        url: canonical,
        title: post.title,
        description,
        images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
        siteName: "Ape Danuma EM",
        publishedTime: post.publishedAt ? (post.publishedAt as Date).toISOString() : undefined,
        modifiedTime: (post.updatedAt as Date).toISOString(),
        authors: [post.author],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description,
        images: [ogImage],
      },
    };
  } catch {
    return { title: "Blog" };
  }
}

/* ── Increment view count (fire-and-forget) ── */
async function incrementView(slug: string) {
  try {
    await BlogPost.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } });
  } catch { /* non-critical */ }
}

/* ── Related posts ── */
interface RelatedPost { _id: string; title: string; slug: string; excerpt: string; category: string; readingTimeMinutes: number; }

async function getRelatedPosts(category: string, currentSlug: string): Promise<RelatedPost[]> {
  try {
    const docs = await BlogPost.find({
      isPublished: true,
      category,
      slug: { $ne: currentSlug },
    })
      .select("title slug excerpt category readingTimeMinutes")
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean();
    return docs.map((d) => ({
      _id: String(d._id),
      title: d.title,
      slug: d.slug,
      excerpt: d.excerpt ?? "",
      category: d.category,
      readingTimeMinutes: d.readingTimeMinutes,
    }));
  } catch { return []; }
}

/* ── Block renderer ── */
function RenderBlock({ block }: { block: Block }) {
  switch (block.type) {
    case "h2":
      return (
        <h2 className="font-display font-bold text-xl sm:text-2xl mt-10 mb-4" style={{ color: "var(--foreground)" }}>
          {block.content}
        </h2>
      );
    case "h3":
      return (
        <h3 className="font-display font-semibold text-lg mt-8 mb-3" style={{ color: "var(--foreground)" }}>
          {block.content}
        </h3>
      );
    case "paragraph":
      return (
        <p className="text-[0.9375rem] leading-[1.85] mb-5" style={{ color: "var(--foreground-secondary)" }}>
          {block.content}
        </p>
      );
    case "quote":
      return (
        <blockquote className="my-6 pl-5 py-1" style={{ borderLeft: "3px solid rgba(124,31,255,0.5)" }}>
          <p className="text-base italic leading-relaxed" style={{ color: "#c4a0ff" }}>
            &ldquo;{block.content}&rdquo;
          </p>
        </blockquote>
      );
    case "divider":
      return (
        <div className="my-8 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(124,31,255,0.3) 40%, rgba(255,255,255,0.08) 60%, transparent)" }} />
      );
    case "image":
      if (!block.content) return null;
      return (
        <figure className="my-8">
          <div
            className="relative w-full rounded-2xl overflow-hidden"
            style={{ aspectRatio: "16/9", border: "1px solid rgba(255,255,255,0.08)" }}
          >
            <Image
              src={block.content}
              alt={block.caption ?? ""}
              fill
              sizes="(max-width: 768px) 100vw, 768px"
              className="object-cover"
            />
          </div>
          {block.caption && (
            <figcaption className="mt-2.5 text-center text-xs" style={{ color: "var(--foreground-muted)", fontStyle: "italic" }}>
              {block.caption}
            </figcaption>
          )}
        </figure>
      );
    default:
      return null;
  }
}

/* ── Category colours ── */
const CAT_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  "Study Tips":          { bg: "rgba(124,31,255,0.12)", text: "#c4a0ff", border: "rgba(124,31,255,0.25)" },
  "Exam Strategy":       { bg: "rgba(245,158,11,0.11)", text: "#fbbf24", border: "rgba(245,158,11,0.28)" },
  "Subject Guide":       { bg: "rgba(59,130,246,0.12)", text: "#93c5fd", border: "rgba(59,130,246,0.25)" },
  "Past Paper Analysis": { bg: "rgba(239,68,68,0.11)",  text: "#fca5a5", border: "rgba(239,68,68,0.24)"  },
  "Platform Update":     { bg: "rgba(16,185,129,0.11)", text: "#34d399", border: "rgba(16,185,129,0.24)" },
  "Student Success":     { bg: "rgba(16,185,129,0.11)", text: "#34d399", border: "rgba(16,185,129,0.24)" },
  "Parent Guide":        { bg: "rgba(245,158,11,0.11)", text: "#fbbf24", border: "rgba(245,158,11,0.28)" },
  General:               { bg: "rgba(255,255,255,0.06)", text: "var(--foreground-muted)", border: "rgba(255,255,255,0.1)" },
};

function getCatStyle(cat: string) {
  return CAT_STYLES[cat] ?? CAT_STYLES["General"];
}

/* ── Page ── */
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  await connectToDatabase();
  const raw = await BlogPost.findOne({ slug: params.slug, isPublished: true }).lean();
  if (!raw) notFound();

  void incrementView(params.slug);

  const related = await getRelatedPosts(raw.category, params.slug);

  const post = {
    title: raw.title,
    slug: raw.slug,
    content: raw.content,
    excerpt: raw.excerpt ?? "",
    coverImage: raw.coverImage ?? "",
    author: raw.author,
    authorUrl: raw.authorUrl,
    category: raw.category,
    tags: raw.tags ?? [],
    readingTimeMinutes: raw.readingTimeMinutes,
    publishedAt: raw.publishedAt
      ? (raw.publishedAt as Date).toISOString()
      : (raw.createdAt as Date).toISOString(),
    updatedAt: (raw.updatedAt as Date).toISOString(),
    viewCount: raw.viewCount,
  };

  const blocks = parseContent(post.content);
  const cs = getCatStyle(post.category);

  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });

  const ogImage = post.coverImage || extractFirstImage(post.content) || OG_PLACEHOLDER;

  /* ── Article JSON-LD ── */
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: ogImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: {
      "@type": "Person",
      name: post.author,
      ...(post.authorUrl ? { url: post.authorUrl } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "Ape Danuma EM",
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/blog/${post.slug}`,
    },
  };

  return (
    <main className="relative overflow-hidden">
      {/* Reading progress bar */}
      <ReadingProgressBar />

      {/* Article JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      {/* Ambient glow */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 rounded-full"
          style={{ width: 700, height: 500, background: "radial-gradient(circle, rgba(124,31,255,0.06) 0%, transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="container-xl py-16 sm:py-20">
        <div className="max-w-3xl mx-auto">

          {/* Back link */}
          <a
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors duration-200 hover:text-[#9455ff]"
            style={{ color: "var(--foreground-muted)", textDecoration: "none" }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M10 7H2m4-4L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Blog
          </a>

          {/* Article header */}
          <header className="mb-10">
            <span
              className="inline-flex items-center font-semibold rounded-full text-[0.65rem] px-2.5 py-1 mb-5 uppercase tracking-wide"
              style={{ background: cs.bg, color: cs.text, border: `1px solid ${cs.border}` }}
            >
              {post.category}
            </span>
            <h1
              className="font-display font-bold text-3xl sm:text-4xl lg:text-[2.75rem] leading-tight mb-5 text-balance"
              style={{ color: "var(--foreground)" }}
            >
              {post.title}
            </h1>
            {post.excerpt && (
              <p className="text-lg leading-relaxed mb-7" style={{ color: "var(--foreground-secondary)" }}>
                {post.excerpt}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 pt-5" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center gap-2.5">
                <div
                  className="flex items-center justify-center w-9 h-9 rounded-full text-sm font-bold shrink-0"
                  style={{ background: "linear-gradient(135deg, rgba(124,31,255,0.3), rgba(87,0,190,0.4))", border: "1px solid rgba(124,31,255,0.35)", color: "#c4a0ff" }}
                >
                  {post.author.split(" ").at(-1)![0]}
                </div>
                <div>
                  {post.authorUrl ? (
                    <a href={post.authorUrl} target="_blank" rel="noopener noreferrer"
                      className="text-sm font-semibold hover:text-[#9455ff] transition-colors"
                      style={{ color: "var(--foreground)", textDecoration: "none" }}>
                      {post.author}
                    </a>
                  ) : (
                    <span className="text-sm font-semibold" style={{ color: "var(--foreground)" }}>{post.author}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs" style={{ color: "var(--foreground-muted)" }}>
                <span>{fmtDate(post.publishedAt)}</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{post.readingTimeMinutes} min read</span>
                <span style={{ opacity: 0.4 }}>·</span>
                <span>{post.viewCount} views</span>
              </div>
            </div>
          </header>

          {/* Cover image */}
          {post.coverImage && (
            <div className="mb-10">
              <div
                className="relative w-full rounded-2xl overflow-hidden"
                style={{ aspectRatio: "16/9", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="mb-10 h-px" style={{ background: "linear-gradient(90deg, rgba(124,31,255,0.3), rgba(255,255,255,0.06) 60%, transparent)" }} />

          {/* Content blocks */}
          <article>
            {blocks.map((block, i) => (
              <RenderBlock key={i} block={block} />
            ))}
          </article>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-3 py-1 rounded-full font-medium"
                  style={{ background: "rgba(255,255,255,0.05)", color: "var(--foreground-muted)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* ── Related Posts ── */}
          {related.length > 0 && (
            <section className="mt-16 pt-10" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-display font-bold text-lg" style={{ color: "var(--foreground)" }}>
                  Related Articles
                </h2>
                <Link
                  href="/blog"
                  className="text-xs font-semibold transition-colors hover:text-[#b890ff]"
                  style={{ color: "#9455ff", textDecoration: "none" }}
                >
                  All articles →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {related.map((rp) => {
                  const rcs = getCatStyle(rp.category);
                  return (
                    <Link
                      key={rp._id}
                      href={`/blog/${rp.slug}`}
                      className="group flex flex-col rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                      style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.07)", textDecoration: "none" }}
                    >
                      <div className="h-0.5 w-full shrink-0" style={{ background: `linear-gradient(90deg, ${rcs.text}55, transparent)` }} />
                      <div className="flex flex-col gap-2.5 p-4 flex-1">
                        <span
                          className="inline-flex items-center font-semibold rounded-full text-[0.58rem] px-2 py-0.5 uppercase tracking-wide w-fit"
                          style={{ background: rcs.bg, color: rcs.text, border: `1px solid ${rcs.border}` }}
                        >
                          {rp.category}
                        </span>
                        <p
                          className="font-display font-semibold text-sm leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[#b890ff]"
                          style={{ color: "var(--foreground)" }}
                        >
                          {rp.title}
                        </p>
                        {rp.excerpt && (
                          <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--foreground-muted)" }}>
                            {rp.excerpt}
                          </p>
                        )}
                        <p className="text-xs mt-auto" style={{ color: "var(--foreground-muted)" }}>
                          {rp.readingTimeMinutes} min read
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
          )}

          {/* Back to blog */}
          <div className="mt-14 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <a
              href="/blog"
              className="inline-flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[#9455ff]"
              style={{ color: "#9455ff", textDecoration: "none" }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M10 7H2m4-4L2 7l4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              All Articles
            </a>
          </div>

        </div>
      </div>
    </main>
  );
}

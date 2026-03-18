import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import ResourceLibrary from "@/components/sections/ResourceLibrary";
import connectToDatabase from "@/lib/mongodb";
import Resource from "@/models/Resource";
import type { LiveResource } from "@/lib/resource-constants";

/**
 * Interface for page props to handle dynamic filtering parameters from the URL
 */
interface PageProps {
  searchParams: { 
    grade?: string; 
    subjects?: string; 
    type?: string;
    year?: string;
  };
}

/**
 * #1 Immediate SEO Priority: Dynamic Metadata
 * This function asynchronously constructs optimized titles and descriptions 
 * based on the user's active filters to dominate long-tail educational searches.
 */
export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  // 1. Extract values or fall back to high-value defaults
  const grade = searchParams.grade ? `Grade ${searchParams.grade}` : "O/L English Medium";
  const subject = searchParams.subjects ? searchParams.subjects.split(",")[0] : "";
  const type = searchParams.type ? searchParams.type.replace("-", " ") : "Study Materials";
  
  // 2. Construct optimized Title (Max ~60 chars for search engines)
  const title = `${grade} ${subject} ${type} — Free Download | Ape Danuma EM`
    .replace(/\s+/g, " ") // Clean up double spaces if subject is empty
    .trim();

  // 3. Construct optimized Description (Max ~160 chars for search engines)
  const description = `Download free ${grade} ${subject} ${type} for Sri Lankan students. Comprehensive English Medium past papers, term tests, and short notes tailored for the local syllabus.`;

  return {
    title,
    description,
    alternates: {
      // Consolidate ranking signals to the base URL to prevent duplicate content issues
      canonical: "https://em.apedanuma.lk/free-resources",
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: "https://em.apedanuma.lk/free-resources",
      siteName: "Ape Danuma EM",
      images: [
        {
          url: "/og-image.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

/* Revalidate every 5 minutes so new uploads appear without a full rebuild */
export const revalidate = 300;

/**
 * Server-side helper to fetch resource data from MongoDB
 */
async function getFreeResources(): Promise<LiveResource[]> {
  try {
    await connectToDatabase();
    const docs = await Resource.find({ isPremium: false, isPublished: true })
      .select("title slug description grade subject materialType term year pageCount fileSize downloadCount pdfUrl previewImageUrl")
      .sort({ createdAt: -1 })
      .lean();

    return docs.map((d) => ({
      _id: String(d._id),
      title: d.title,
      slug: d.slug || String(d._id),
      description: d.description,
      grade: d.grade as 10 | 11,
      subject: d.subject,
      materialType: d.materialType,
      term: d.term as 1 | 2 | 3 | undefined,
      year: d.year,
      pageCount: d.pageCount,
      fileSize: d.fileSize,
      downloadCount: d.downloadCount,
      pdfUrl: d.pdfUrl,
      previewImageUrl: d.previewImageUrl,
    }));
  } catch (err) {
    console.error("[free-resources] Failed to fetch from MongoDB:", err);
    return [];
  }
}

/**
 * Simple FAQ Item Component for Server Rendering
 */
function FAQItem({ question, answer }: { question: string; answer: string }) {
  return (
    <div className="group rounded-2xl bg-white/[0.02] border border-white/5 p-6 transition-all hover:bg-white/[0.04] hover:border-white/10">
      <h3 className="text-base font-bold text-white mb-3 flex items-start gap-3">
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-purple-500/20 text-purple-400 text-xs font-black">?</span>
        {question}
      </h3>
      <p className="text-sm leading-relaxed text-slate-400 pl-9">
        {answer}
      </p>
    </div>
  );
}

/**
 * Main Page Component (Server Component)
 */
export default async function FreeResourcesPage({ searchParams }: PageProps) {
  const resources = await getFreeResources();

  // Technical SEO: FAQPage Schema
  const faqs = [
    {
      question: "Are all resources on this page completely free?",
      answer: "Yes, every resource listed in our Free Resources library is available for instant download at no cost to help Sri Lankan English Medium students succeed in their O/Ls."
    },
    {
      question: "How do I download a past paper from Ape Danuma EM?",
      answer: "Simply click on 'View Details' for any resource, and you will be taken to a dedicated page with a secure PDF viewer and a direct download button for offline use."
    },
    {
      question: "Do you provide resources for all Grade 10 and 11 subjects?",
      answer: "We cover all major subjects in the English Medium curriculum, including Science, Mathematics, ICT, History, and more, specifically tailored for the Sri Lankan local syllabus."
    },
    {
      question: "Are these materials updated for the latest syllabus?",
      answer: "Yes, we regularly update our library with the latest term test papers from leading schools and province-level exams to ensure students practice with the most relevant materials."
    },
    {
      question: "Can I access these resources on my mobile phone?",
      answer: "Absolutely. Our platform is fully responsive, and you can view or download any PDF directly on your smartphone, tablet, or computer."
    }
  ];

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <main className="relative overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      
      {/* Ambient background glows */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/3 rounded-full"
          style={{
            width: 700,
            height: 600,
            background: "radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)",
            filter: "blur(90px)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 rounded-full"
          style={{
            width: 600,
            height: 600,
            background: "radial-gradient(circle, rgba(124,31,255,0.05) 0%, transparent 70%)",
            filter: "blur(100px)",
          }}
        />
      </div>

      <Suspense fallback={<div className="container-xl py-20 text-center">Loading Resources...</div>}>
        <ResourceLibrary resources={resources.length > 0 ? resources : undefined} />
      </Suspense>

      {/* Frequently Asked Questions Section */}
      <section className="container-xl py-20 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h2 className="font-display font-bold text-2xl sm:text-3xl mb-4">
              Frequently Asked <span className="text-gradient-luminary">Questions</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base">
              Quick answers to help you make the most of our English Medium resource library.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqs.map((faq, idx) => (
              <FAQItem key={idx} question={faq.question} answer={faq.answer} />
            ))}
          </div>

          <div className="mt-12 p-8 rounded-[2rem] bg-gradient-to-br from-purple-500/5 to-transparent border border-purple-500/10 text-center">
            <p className="text-slate-300 font-medium mb-4">Still looking for something specific?</p>
            <Link href="/contact" className="btn-hero-ghost text-xs py-2 px-6">
              Contact Support
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

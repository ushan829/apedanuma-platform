import Link from "next/link";

export default function CTABanner() {
  return (
    <section className="section z-10 relative">
      <div className="container-xl">
        <div
          className="rounded-3xl p-12 text-center relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, rgba(124,31,255,0.12) 0%, rgba(10,10,10,0.8) 50%, rgba(245,158,11,0.08) 100%)",
            border: "1px solid rgba(124,31,255,0.2)",
            boxShadow:
              "0 0 60px rgba(124,31,255,0.1), inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <div
            className="absolute -top-20 -left-20 rounded-full opacity-30"
            style={{
              width: 300, height: 300,
              background: "radial-gradient(circle, rgba(124,31,255,0.3), transparent 70%)",
              filter: "blur(40px)",
            }}
          />
          <div
            className="absolute -bottom-20 -right-20 rounded-full opacity-20"
            style={{
              width: 280, height: 280,
              background: "radial-gradient(circle, rgba(245,158,11,0.3), transparent 70%)",
              filter: "blur(40px)",
            }}
          />

          <div className="relative z-10 space-y-6">
            <div className="badge-accent mx-auto w-fit">Limited Enrollment Open</div>
            <h2 className="text-balance max-w-2xl mx-auto">
              Your journey to{" "}
              <span className="text-gradient-premium">fluent, powerful English</span>{" "}
              begins today
            </h2>
            <p className="max-w-lg mx-auto" style={{ color: "var(--foreground-secondary)" }}>
              Join thousands of learners who have transformed their communication,
              careers, and confidence with Ape Danuma EM.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link href="/premium-store" className="btn-primary px-10 py-3.5 text-base">Claim Your Spot</Link>
              <Link href="/free-resources" className="btn-outline-accent px-10 py-3.5 text-base">View Curriculum</Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

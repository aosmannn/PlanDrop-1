import type { Metadata } from "next";
import Link from "next/link";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "How it works — PlanDrop",
  description:
    "Drop a pin, browse live plans, claim one for your group, and share a link — no account required.",
};

export default function HowItWorksPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-zinc-100 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
              How it works
            </p>
            <h1 className="font-display mt-4 text-3xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-4xl">
              From &ldquo;what should we do?&rdquo; to a locked plan
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              No accounts, no passwords. Browse what&apos;s live in your city,
              claim a plan before it&apos;s gone, and share one link with your
              group.
            </p>
            <Link
              href="/plans"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand-hover"
            >
              Browse plans
              <span aria-hidden>→</span>
            </Link>
          </div>
        </section>
        <HowItWorksSection />
      </main>
      <SiteFooter />
    </>
  );
}

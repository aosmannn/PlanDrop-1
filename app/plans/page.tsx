import type { Metadata } from "next";
import Link from "next/link";
import { BrowsePlansSection } from "@/components/landing/browse-plans-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "Browse plans — PlanDrop",
  description:
    "See what’s live in your city: vibes, stops, and group size. Claim before it’s gone.",
};

export default function PlansPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-zinc-100 bg-white px-4 pb-8 pt-12 sm:px-6 sm:pb-10 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
              Live plans
            </p>
            <h1 className="font-display mt-4 text-3xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-4xl">
              Browse the drop
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Pick a vibe, check the stops, and claim before someone else does.
              Everything updates in real time — no login required.
            </p>
            <p className="mt-4 text-sm font-medium text-zinc-500">
              New to PlanDrop?{" "}
              <Link
                href="/how-it-works"
                className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
              >
                See how it works
              </Link>
            </p>
          </div>
        </section>
        <BrowsePlansSection />
      </main>
      <SiteFooter />
    </>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "For groups — PlanDrop",
  description:
    "Friend groups, teams, and crews: one claimed plan, one link for everyone — no sign-up.",
};

export default function ForGroupsPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-zinc-100 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
              For groups
            </p>
            <h1 className="font-display mt-4 text-3xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-4xl">
              Built for the group chat, not the spreadsheet
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              PlanDrop is for friend groups, teams, clubs, and anyone stuck in
              the &ldquo;I don&apos;t care, you pick&rdquo; loop. We generate
              ready-made outings for your area; you claim one and send a single
              link so everyone sees the same plan — venues, timing, and vibe.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/plans"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand-hover"
              >
                Find a plan for your crew
                <span aria-hidden>→</span>
              </Link>
              <span className="text-sm font-medium text-zinc-500">
                Anonymous — no sign-up
              </span>
            </div>
          </div>
        </section>

        <section className="bg-zinc-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto grid max-w-5xl gap-10 sm:grid-cols-2">
            {[
              {
                title: "One claim, one truth",
                body: "When your group claims a plan, it’s locked. No more two people booking different nights.",
              },
              {
                title: "Share one link",
                body: "Everyone opens the same itinerary — stops, notes, and timing — without installing anything.",
              },
              {
                title: "Real-time pool",
                body: "Plans disappear from the grid as they’re claimed, so you’re always looking at what’s actually available.",
              },
              {
                title: "Cities, not coupons",
                body: "We’re focused on real nights out in real neighborhoods — starting where we’re live and expanding.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-zinc-100"
              >
                <h2 className="font-display text-xl font-bold text-zinc-900">
                  {item.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-4 py-16 text-center sm:px-6 lg:px-8">
          <p className="text-sm font-medium text-zinc-500">
            Want the full flow?{" "}
            <Link
              href="/how-it-works"
              className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
            >
              How PlanDrop works
            </Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

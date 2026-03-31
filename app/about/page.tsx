import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "About — PlanDrop",
  description:
    "PlanDrop is launching in Atlanta with scarcity-based group outings: claim one plan, share one link, go.",
};

export default function AboutPage() {
  return (
    <>
      <SiteHeader />
      <main>
        <section className="border-b border-zinc-100 bg-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <p className="text-sm font-bold uppercase tracking-widest text-brand">
              Our story
            </p>
            <h1 className="font-display mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-zinc-900 sm:text-5xl">
              A plan your whole crew can commit to.
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-zinc-600">
              Group planning fails the same way every time: vague ideas, empty
              calendars, and a group chat that never lands. PlanDrop makes the
              decision fast by making plans scarce.
            </p>
            <p className="mt-5 text-base leading-relaxed text-zinc-600">
              The goal is simple: fewer messages, faster commitment, and a real plan
              everyone can follow.
            </p>
            <div className="mt-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/drop"
                className="inline-flex items-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand-hover"
              >
                Try PlanDrop
                <span aria-hidden>→</span>
              </Link>
              <Link
                href="/how-it-works"
                className="text-sm font-semibold text-zinc-700 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
              >
                How it works
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  The problem
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900">
                  Too many options. No decision.
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base leading-relaxed text-zinc-600">
                  Most nights don’t fail because people don’t want to hang out — they
                  fail because nobody wants to be the decider. The conversation
                  drifts, momentum dies, and the plan never becomes real.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  The solution
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900">
                  Scarcity that creates commitment.
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base leading-relaxed text-zinc-600">
                  If a plan can be claimed, it’s real. If it’s claimed, it’s gone.
                  That urgency cuts through the “you pick” loop and turns a chat into
                  a decision.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  What we are
                </p>
                <h2 className="font-display mt-3 text-2xl font-bold tracking-tight text-zinc-900">
                  One plan. One link. One crew.
                </h2>
              </div>
              <div className="lg:col-span-8">
                <p className="text-base leading-relaxed text-zinc-600">
                  When your crew claims a plan, you share one briefing page so
                  everyone sees the same stops, timing, and map links. No backscroll.
                  No re-explaining.
                </p>
              </div>
            </div>

            <div className="mt-12 grid gap-6 sm:grid-cols-2">
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  Atlanta first
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  We’re starting in Atlanta and expanding city-by-city as we build a
                  high-quality pool of plans and partner venues.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-100 bg-zinc-50/60 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.22em] text-zinc-500">
                  Built for venues too
                </p>
                <p className="mt-3 text-sm leading-relaxed text-zinc-700">
                  We want this to be a new channel for independent spots: pay only
                  when we drive verified group foot traffic.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-100 bg-zinc-50 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-brand shadow-[0_24px_80px_-12px_rgba(43,83,193,0.45)] ring-1 ring-black/5">
            <div className="px-6 py-14 text-center sm:px-10 sm:py-16">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                Ready when your crew is
              </p>
              <h2 className="font-display mt-4 text-3xl font-bold leading-[1.15] tracking-[-0.03em] text-white sm:text-4xl">
                Drop less. Decide faster.
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/80 sm:text-base">
                Live plans for your crew — claim a spot, share one link, go.
              </p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link
                  href="/drop"
                  className="inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-full bg-white px-10 py-4 text-base font-bold text-brand shadow-lg transition hover:bg-zinc-50 sm:w-auto"
                >
                  Get started
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href="/plans"
                  className="inline-flex w-full max-w-xs items-center justify-center rounded-full border border-white/25 bg-transparent px-10 py-4 text-base font-bold text-white/95 shadow-sm transition hover:bg-white/10 sm:w-auto"
                >
                  Explore plans
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}


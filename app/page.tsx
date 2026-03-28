import Link from "next/link";
import { BrowsePlansSection } from "@/components/landing/browse-plans-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="px-4 pb-16 pt-12 sm:px-6 sm:pb-24 sm:pt-16 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand">
              <span className="h-2 w-2 rounded-full bg-brand animate-pulse" aria-hidden />
              Live plans available now
            </p>
            <h1 className="font-display mt-8 text-[2.375rem] font-bold leading-[1.12] tracking-[-0.02em] text-zinc-900 sm:text-5xl sm:leading-[1.1] lg:text-6xl">
              Stop planning.
              <br />
              Start <span className="text-brand">dropping.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-zinc-600 sm:text-lg">
              Ready-made plans for your crew, generated fresh and dropped daily.
              Claim one before someone else does — then just show up and have
              fun.
            </p>
            <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/plans"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-brand/30"
              >
                Browse plans near me
                <span aria-hidden>→</span>
              </Link>
              <span className="text-sm font-medium text-zinc-500">+ No account needed</span>
            </div>

            <div className="mx-auto mt-20 grid max-w-3xl grid-cols-3 gap-6 rounded-3xl bg-zinc-50 p-8 shadow-sm ring-1 ring-zinc-100 sm:p-10">
              {[
                ["48", "Plans live today"],
                ["12", "Cities dropping"],
                ["~2 hr", "Avg plan length"],
              ].map(([n, l]) => (
                <div key={l} className="text-center">
                  <p className="font-display text-2xl font-semibold tabular-nums text-brand sm:text-4xl">
                    {n}
                  </p>
                  <p className="mt-2 text-[11px] font-medium uppercase tracking-wide text-zinc-500 sm:text-xs">
                    {l}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <HowItWorksSection />

        <BrowsePlansSection />

        {/* For groups */}
        <section
          id="for-groups"
          className="scroll-mt-24 border-t border-zinc-100 px-4 py-12 text-center sm:px-6 lg:px-8"
        >
          <p className="text-base font-medium text-zinc-600">
            Built for friend groups, teams, and anyone tired of the group chat
            spiral.
          </p>
          <Link
            href="/for-groups"
            className="mt-4 inline-block text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
          >
            Why PlanDrop works for groups →
          </Link>
        </section>

        {/* Gradient CTA */}
        <section className="px-4 pb-0 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl overflow-hidden rounded-t-[2.5rem] bg-brand px-6 py-20 text-center shadow-2xl sm:px-12 sm:py-24 relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-indigo-400 via-brand to-brand-hover opacity-80" />
            <div className="relative">
              <h2 className="font-display text-3xl font-bold leading-snug tracking-[-0.02em] text-white sm:text-5xl">
                Your group&apos;s next move is waiting.
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-base text-white/90 sm:text-lg">
                Stop the &ldquo;what do you want to do?&rdquo; loop. Drop in now.
              </p>
              <Link
                href="/plans"
                className="mt-10 inline-flex items-center justify-center gap-2 rounded-full bg-white px-10 py-5 text-lg font-bold text-brand shadow-xl transition-all hover:scale-105 hover:bg-zinc-50 hover:shadow-2xl"
              >
                Browse plans near me
                <span aria-hidden>→</span>
              </Link>
              <p className="mt-6 text-sm font-medium text-white/80">
                No sign-up. No payment. Just show up.
              </p>
            </div>
          </div>
        </section>

        <div className="h-3 bg-gradient-to-r from-indigo-400 via-brand to-brand-hover" aria-hidden />
      </main>

      <SiteFooter />
    </>
  );
}

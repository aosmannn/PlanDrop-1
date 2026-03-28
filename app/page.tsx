import Link from "next/link";
import { HeroSearch } from "@/components/landing/hero-search";
import { PlanSpotlightCard } from "@/components/landing/plan-spotlight-card";
import { SiteHeader } from "@/components/landing/site-header";

const spotlights = [
  {
    title: "Golden hour stroll",
    subtitle: "2–4 hrs · Chill",
    meta: "~$25 per person",
    gradient: "from-rose-300 via-orange-200 to-amber-100",
    badge: "Guest favorite",
  },
  {
    title: "Neighborhood food crawl",
    subtitle: "3 hrs · Foodie",
    meta: "~$40 per person",
    gradient: "from-violet-300 via-fuchsia-200 to-pink-100",
    badge: "Trending",
  },
  {
    title: "Park & playlist picnic",
    subtitle: "2 hrs · Outdoors",
    meta: "~$15 per person",
    gradient: "from-emerald-300 via-teal-200 to-cyan-100",
  },
  {
    title: "Late-night dessert hop",
    subtitle: "2 hrs · Sweet tooth",
    meta: "~$20 per person",
    gradient: "from-sky-300 via-indigo-200 to-violet-100",
    badge: "Limited",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="border-b border-zinc-100 px-4 pb-16 pt-10 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8">
          <div className="mx-auto max-w-7xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-brand">
              Hackathon 2026
            </p>
            <h1 className="mx-auto mt-4 max-w-3xl text-4xl font-bold leading-[1.1] tracking-tight text-zinc-900 sm:text-5xl lg:text-6xl">
              Plans drop live.
              <span className="text-brand"> Claim yours.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-zinc-600">
              Skip the &ldquo;what should we do?&rdquo; loop. Browse ready-made
              group outings for your area — each plan is unique. First group to
              claim it locks it in.
            </p>
            <div className="mx-auto mt-10 max-w-[850px]">
              <HeroSearch />
            </div>
          </div>
        </section>

        <section
          id="plans"
          className="scroll-mt-24 px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
                  Plans dropping near you
                </h2>
                <p className="mt-1 text-zinc-500">
                  Sample vibes — real plans load from your area soon.
                </p>
              </div>
              <Link
                href="#plans"
                className="text-sm font-semibold text-zinc-900 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-500"
              >
                Show all
              </Link>
            </div>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {spotlights.map((plan) => (
                <PlanSpotlightCard key={plan.title} {...plan} />
              ))}
            </div>
          </div>
        </section>

        <section
          id="how-it-works"
          className="scroll-mt-24 border-t border-zinc-100 bg-zinc-50/80 px-4 py-16 sm:px-6 lg:px-8"
        >
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              How PlanDrop works
            </h2>
            <p className="mx-auto mt-2 max-w-lg text-center text-zinc-600">
              Airbnb-style ease, flash-sale energy — one group per plan.
            </p>
            <ol className="mx-auto mt-12 grid max-w-4xl gap-8 sm:grid-cols-3 sm:gap-6">
              {[
                {
                  step: "1",
                  title: "Drop your area",
                  body: "Pin where your crew is hanging out tonight or this weekend.",
                },
                {
                  step: "2",
                  title: "Browse & claim",
                  body: "Pick a plan you love and hit claim — it’s yours instantly.",
                },
                {
                  step: "3",
                  title: "Share & go",
                  body: "Send the link. Everyone sees stops, timing, and the vibe.",
                },
              ].map((item) => (
                <li
                  key={item.step}
                  className="relative rounded-2xl border border-zinc-100 bg-white p-6 text-center shadow-sm"
                >
                  <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                    {item.step}
                  </span>
                  <h3 className="mt-4 font-semibold text-zinc-900">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
            <p className="mx-auto mt-12 max-w-md text-center text-sm text-zinc-500">
              Built with Next.js, Supabase & Claude — web-first, no login
              required for the demo.
            </p>
          </div>
        </section>

        <footer className="border-t border-zinc-100 px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm font-semibold text-brand">PlanDrop</p>
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()} PlanDrop · Ready to drop
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}

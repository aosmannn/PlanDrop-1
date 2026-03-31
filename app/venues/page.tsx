import type { Metadata } from "next";
import { SiteHeader } from "@/components/landing/site-header";
import { SiteFooter } from "@/components/landing/site-footer";
import { VenuesForm } from "./venues-form";

export const metadata: Metadata = {
  title: "For venues — PlanDrop",
  description:
    "Atlanta venues: get featured in PlanDrop outings. Pay only for verified group visits — no upfront ad spend.",
};

export default function VenuesPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          {/* Header */}
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            For venue owners
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-zinc-900 sm:text-5xl">
            We send groups. You pay only for verified visits.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">
            PlanDrop is launching in Atlanta with scarcity-based group outings.
            When a crew claims a plan, they get one itinerary and one link — and
            that route can include you. No coupons, no race-to-the-bottom promos.
          </p>
          <p className="mt-4 rounded-xl border border-zinc-100 bg-zinc-50/80 px-4 py-3 text-sm font-medium text-zinc-600">
            <span className="font-semibold text-zinc-800">Verified visit</span>{" "}
            = the crew shows a staff member their PlanDrop code at your venue.{" "}
            <a
              href="/venues/verify"
              className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
            >
              Test venue check-in →
            </a>
          </p>

          {/* How it works for venues */}
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {[
              {
                n: "1",
                title: "We feature you in real plans",
                body: "You’re written into outings for groups nearby (bars, restaurants, experiences). It feels native — not an ad.",
              },
              {
                n: "2",
                title: "A crew shows a quick code",
                body: "When they arrive, they show a short code to a staff member. That’s the verification step.",
              },
              {
                n: "3",
                title: "You pay per verified visit",
                body: "No upfront ad spend. We only charge when you receive verified group foot traffic we drove.",
              },
            ].map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-zinc-900">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600">
                  {s.body}
                </p>
              </div>
            ))}
          </div>

          {/* Trust / Scope */}
          <div className="mt-10 rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-zinc-900">
              Atlanta first — founding partners
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              We’re starting tight to keep quality high. If you’re in (or near)
              these neighborhoods, you’re a great fit:
            </p>
            <ul className="mt-4 list-none space-y-2 pl-0 text-sm text-zinc-700">
              {[
                "Inman Park / Krog Street",
                "Little Five Points",
                "Old Fourth Ward / BeltLine Eastside",
                "Poncey-Highland",
                "Midtown",
              ].map((line) => (
                <li
                  key={line}
                  className="relative pl-4 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand"
                >
                  {line}
                </li>
              ))}
            </ul>
          </div>

          {/* FAQ */}
          <div className="mt-10 rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
            <h2 className="font-display text-lg font-bold text-zinc-900">FAQ</h2>
            <div className="mt-4 space-y-3 text-sm text-zinc-700">
              <details className="rounded-xl bg-white p-4 ring-1 ring-zinc-100">
                <summary className="cursor-pointer font-semibold text-zinc-900">
                  What counts as a “verified visit”?
                </summary>
                <p className="mt-2 leading-relaxed text-zinc-600">
                  A crew arrives and shows a PlanDrop code. A staff member checks it
                  (and optionally notes group size). That’s it.
                </p>
              </details>
              <details className="rounded-xl bg-white p-4 ring-1 ring-zinc-100">
                <summary className="cursor-pointer font-semibold text-zinc-900">
                  Do we need to offer a discount?
                </summary>
                <p className="mt-2 leading-relaxed text-zinc-600">
                  No. This is about routing groups to great spots, not couponing.
                </p>
              </details>
              <details className="rounded-xl bg-white p-4 ring-1 ring-zinc-100">
                <summary className="cursor-pointer font-semibold text-zinc-900">
                  How are venues selected?
                </summary>
                <p className="mt-2 leading-relaxed text-zinc-600">
                  We prioritize independent venues that match common group vibes
                  (chill, foodie, active, adventurous) and that can handle small groups.
                </p>
              </details>
            </div>
          </div>

          {/* Divider */}
          <div className="my-12 border-t border-zinc-100" />

          {/* Form */}
          <div>
            <h2 className="font-display text-2xl font-bold tracking-tight text-zinc-900">
              Raise your hand
            </h2>
            <p className="mt-2 text-zinc-600">
              No commitment. We’ll reach out, confirm fit, and set you up as a founding
              partner.
            </p>
            <VenuesForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

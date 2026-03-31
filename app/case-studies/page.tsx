import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "Case studies — PlanDrop",
  description:
    "Early stories from PlanDrop’s Atlanta launch: how crews claim and how venues get foot traffic.",
};

const STUDIES = [
  {
    title: "Founding partners in Atlanta",
    summary:
      "We’re onboarding a small set of venues around the BeltLine, Krog Street, and Little Five Points to prove verified, pay-per-visit foot traffic.",
    cta: { href: "/venues", label: "Become a founding partner →" },
  },
  {
    title: "One link eliminates the group-chat spiral",
    summary:
      "Crews claim one plan and share one briefing page. No two people booking different places, no last-minute confusion — everyone sees the same stops and timing.",
    cta: { href: "/drop", label: "Try the flow →" },
  },
] as const;

export default function CaseStudiesPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Case studies
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-zinc-900 sm:text-5xl">
            Proof, not promises.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">
            PlanDrop is new. These are early launch stories we’ll keep updating as we
            expand the pool and onboard venues.
          </p>

          <div className="mt-10 grid gap-6">
            {STUDIES.map((s) => (
              <article
                key={s.title}
                className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm"
              >
                <h2 className="font-display text-xl font-bold text-zinc-900">
                  {s.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                  {s.summary}
                </p>
                <Link
                  href={s.cta.href}
                  className="mt-5 inline-flex text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
                >
                  {s.cta.label}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}


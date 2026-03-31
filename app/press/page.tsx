import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

export const metadata: Metadata = {
  title: "Press — PlanDrop",
  description:
    "Press and media kit for PlanDrop: product boilerplate, positioning, and contact.",
};

export default function PressPage() {
  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Press
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-zinc-900 sm:text-5xl">
            Media kit
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">
            PlanDrop is launching in Atlanta with live, scarcity-based group outings:
            browse what’s available, claim one plan, share one link, then go.
          </p>

          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                Boilerplate
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-600">
                PlanDrop helps friend groups decide faster by making plans scarce.
                Each plan is one-of-a-kind for an area; once claimed, it’s gone for
                everyone else. Starting in Atlanta, expanding city-by-city.
              </p>
            </div>
            <div className="rounded-2xl border border-zinc-100 bg-zinc-50 p-6">
              <h2 className="font-display text-lg font-bold text-zinc-900">
                Links
              </h2>
              <ul className="mt-3 list-none space-y-2 pl-0 text-sm">
                <li>
                  <Link href="/" className="font-semibold text-brand underline">
                    Live site
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="font-semibold text-brand underline">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/venues" className="font-semibold text-brand underline">
                    For venues
                  </Link>
                </li>
              </ul>
              <p className="mt-4 text-xs text-zinc-500">
                Assets (logos/screenshots) can be added under <span className="font-mono">public/press</span>.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="font-display text-lg font-bold text-zinc-900">
              Contact
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-zinc-600">
              Email <span className="font-semibold text-zinc-900">hello@plandrop.com</span>.
            </p>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}


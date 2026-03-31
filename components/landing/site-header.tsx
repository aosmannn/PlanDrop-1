import Link from "next/link";
import { BrandLogoMark } from "@/components/brand-logo";
import { ButtonLink } from "@/components/ui/button";

const nav = [
  ["/how-it-works", "How it works"],
  ["/drop", "Get started"],
  ["/plans", "Explore plans"],
  ["/cities", "Locations"],
  ["/venues", "Venues"],
  ["/about", "Our story"],
] as const;

export function SiteHeader() {
  return (
    <header className="pointer-events-none sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="pointer-events-auto min-w-0 shrink-0">
          <BrandLogoMark variant="header" />
        </Link>

        <nav
          className="pointer-events-none hidden min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto sm:flex md:gap-8"
          aria-label="Primary"
        >
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="pointer-events-auto shrink-0 text-sm font-medium text-zinc-700 transition hover:text-zinc-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="pointer-events-none flex shrink-0 items-center gap-2 sm:gap-3">
          <details className="pointer-events-auto relative sm:hidden">
            <summary className="list-none cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 [&::-webkit-details-marker]:hidden">
              Menu
            </summary>
            <div className="absolute right-0 top-full z-50 mt-2 min-w-[11rem] rounded-2xl border border-zinc-100 bg-white p-2 shadow-xl">
              {nav.map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  className="block rounded-xl px-3 py-2 text-sm font-medium text-zinc-800 hover:bg-zinc-50"
                >
                  {label}
                </Link>
              ))}
            </div>
          </details>
          <ButtonLink
            href="/claims"
            className="pointer-events-auto font-bold hover:-translate-y-0.5"
          >
            Your plan
            <span aria-hidden>→</span>
          </ButtonLink>
        </div>
      </div>
    </header>
  );
}

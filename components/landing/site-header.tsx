import Link from "next/link";

function LogoMark({ className }: { className?: string }) {
  return (
    <span className={`flex items-center gap-2 ${className ?? ""}`}>
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-sm">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden
        >
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </span>
      <span className="font-display text-xl font-semibold tracking-[-0.02em] text-brand">
        PlanDrop
      </span>
    </span>
  );
}

const nav = [
  ["/how-it-works", "How it works"],
  ["/plans", "Browse plans"],
  ["/for-groups", "For groups"],
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0 shrink-0">
          <LogoMark />
        </Link>

        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-4 overflow-x-auto sm:flex md:gap-8"
          aria-label="Primary"
        >
          {nav.map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="shrink-0 text-sm font-medium text-zinc-700 transition hover:text-zinc-900"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <details className="relative sm:hidden">
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
          <Link
            href="/plans"
            className="inline-flex items-center gap-1 rounded-full bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition-all hover:-translate-y-0.5 hover:bg-brand-hover hover:shadow-brand/30 sm:px-5"
          >
            Drop in
            <span aria-hidden>→</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

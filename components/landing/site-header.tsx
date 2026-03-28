import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-100 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex items-center gap-1 text-2xl font-bold tracking-tight text-brand"
        >
          <span aria-hidden>📍</span>
          <span>PlanDrop</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="#plans"
            className="text-sm font-medium text-zinc-600 underline decoration-transparent underline-offset-4 transition hover:text-zinc-900 hover:decoration-zinc-300"
          >
            Plans
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium text-zinc-600 underline decoration-transparent underline-offset-4 transition hover:text-zinc-900 hover:decoration-zinc-300"
          >
            How it works
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="#plans"
            className="rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 shadow-sm transition hover:shadow-md"
          >
            Browse plans
          </Link>
        </div>
      </div>
    </header>
  );
}

import { SparklesIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { HugeIcon } from "@/components/ui/huge-icon";

function LogoMark({ light }: { light?: boolean }) {
  return (
    <span className="flex items-center gap-2">
      <span
        className={`flex h-9 w-9 items-center justify-center rounded-full ${light ? "bg-white text-brand" : "bg-brand text-white"}`}
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </span>
      <span className="font-display text-lg font-semibold tracking-[-0.02em] text-white">
        PlanDrop
      </span>
    </span>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-navy-deep px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
        <LogoMark light />
        <nav className="flex flex-wrap gap-x-10 gap-y-3 text-sm font-medium text-white/90">
          <Link href="/how-it-works" className="hover:text-white">
            How it works
          </Link>
          <Link href="/plans" className="hover:text-white">
            Browse plans
          </Link>
          <Link href="/for-groups" className="hover:text-white">
            For groups
          </Link>
        </nav>
        <p className="inline-flex items-center gap-1.5 text-sm text-white/50">
          <span>
            Contact · © {new Date().getFullYear()} PlanDrop · Built in 12 hours
          </span>
          <HugeIcon icon={SparklesIcon} size={14} className="text-white/40" />
        </p>
      </div>
    </footer>
  );
}

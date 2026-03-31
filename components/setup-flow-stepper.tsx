"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
  buildPlansHref,
  getStoredArea,
  getStoredRadiusMiles,
} from "@/lib/claim-storage";

export type JourneyPhase = "discover" | "claim" | "brief";

const PHASES: {
  id: JourneyPhase;
  title: string;
  subtitle: string;
}[] = [
  {
    id: "discover",
    title: "Discover",
    subtitle: "Area & plans",
  },
  {
    id: "claim",
    title: "Claim",
    subtitle: "Make it yours",
  },
  {
    id: "brief",
    title: "Brief",
    subtitle: "Roll with your crew",
  },
];

const PHASE_ORDER: Record<JourneyPhase, number> = {
  discover: 0,
  claim: 1,
  brief: 2,
};

export function SetupFlowStepper({
  phase,
  planId,
  areaHint,
}: {
  phase: JourneyPhase;
  /** When set (claim + brief), claim/go links target this plan */
  planId?: string;
  /** Optional area for browse link when not inferrable from URL */
  areaHint?: string | null;
}) {
  const pathname = usePathname();
  const browseHref = useMemo(() => {
    const r =
      typeof window !== "undefined" ? getStoredRadiusMiles() : undefined;
    if (areaHint != null && areaHint !== "")
      return buildPlansHref(areaHint, r);
    if (typeof window !== "undefined") {
      const q = new URLSearchParams(window.location.search).get("area");
      if (q) return buildPlansHref(q, r);
      const stored = getStoredArea();
      if (stored) return buildPlansHref(stored, r);
    }
    return "/plans";
  }, [areaHint]);

  /** Merged old steps 1–2: prefer plans with area; on /drop with no area, stay in drop flow. */
  const discoverHref = useMemo(() => {
    if (pathname === "/drop" && browseHref === "/plans") return "/drop";
    return browseHref;
  }, [browseHref, pathname]);

  const currentIdx = PHASE_ORDER[phase];

  return (
    <nav
      aria-label="Your journey"
      className="mx-auto w-full max-w-4xl border-b border-zinc-100 bg-white/90 px-4 py-4 sm:px-6"
    >
      <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch sm:justify-between sm:gap-0">
        {PHASES.map((p, i) => {
          const isCurrent = phase === p.id;
          const isPast = currentIdx > i;
          const stepNum = i + 1;

          let href: string;
          if (p.id === "discover") {
            href = discoverHref;
          } else if (p.id === "claim") {
            href = planId ? `/claim/${planId}` : `${browseHref}#plans`;
          } else {
            href = planId ? `/go/${planId}` : `${browseHref}#plans`;
          }

          return (
            <li
              key={p.id}
              className="relative flex min-w-0 flex-1 items-stretch sm:max-w-[34%]"
            >
              {i > 0 ? (
                <div
                  className="hidden h-px w-4 shrink-0 self-center bg-gradient-to-r from-zinc-200 to-transparent sm:block sm:w-5"
                  aria-hidden
                />
              ) : null}
              <Link
                href={href}
                className={`group flex min-w-0 flex-1 items-start gap-2 rounded-xl px-2 py-1.5 transition sm:flex-col sm:items-stretch sm:gap-0.5 sm:px-2 ${
                  isCurrent
                    ? "bg-brand-soft ring-1 ring-brand/20"
                    : "hover:bg-zinc-50"
                }`}
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold tabular-nums ${
                    isCurrent
                      ? "bg-brand text-white"
                      : isPast
                        ? "bg-brand-soft text-brand"
                        : "bg-zinc-100 text-zinc-500"
                  }`}
                >
                  {stepNum}
                </span>
                <span className="min-w-0 sm:pl-0">
                  <span
                    className={`block text-left text-[11px] font-semibold leading-tight sm:text-xs ${
                      isCurrent ? "text-brand" : "text-zinc-800"
                    }`}
                  >
                    {p.title}
                  </span>
                  <span className="mt-0.5 block text-[10px] font-medium leading-snug text-zinc-500 sm:text-[11px]">
                    {p.subtitle}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

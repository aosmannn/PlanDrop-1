"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  buildPlansHref,
  getStoredArea,
  getStoredRadiusMiles,
} from "@/lib/claim-storage";

const STEP_LABELS = [
  { step: 1 as const, title: "Drop a pin", path: "/drop" },
  { step: 2 as const, title: "Browse the drop", path: "/plans" },
  { step: 3 as const, title: "Lock it in", path: "claim" },
  { step: 4 as const, title: "Just show up", path: "go" },
];

type Step = 1 | 2 | 3 | 4;

export function SetupFlowStepper({
  currentStep,
  planId,
  areaHint,
}: {
  currentStep: Step;
  /** When set (steps 3–4), claim/go links target this plan */
  planId?: string;
  /** Optional area for browse link when not inferrable from URL */
  areaHint?: string | null;
}) {
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

  return (
    <nav
      aria-label="Setup steps"
      className="mx-auto w-full max-w-4xl border-b border-zinc-100 bg-white/90 px-4 py-4 sm:px-6"
    >
      <ol className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:gap-2">
        {STEP_LABELS.map((s) => {
          const isCurrent = currentStep === s.step;
          const isPast = currentStep > s.step;

          let href: string;
          if (s.step === 1) {
            const stored =
              typeof window !== "undefined" ? getStoredArea() : null;
            const r =
              typeof window !== "undefined" ? getStoredRadiusMiles() : undefined;
            const fromStored =
              stored && stored.trim() ? buildPlansHref(stored, r) : null;
            href =
              areaHint != null && areaHint !== ""
                ? buildPlansHref(areaHint, r)
                : (fromStored ?? "/drop");
          } else if (s.step === 2) href = browseHref;
          else if (s.step === 3) {
            href = planId ? `/claim/${planId}` : `${browseHref}#plans`;
          } else {
            href = planId ? `/go/${planId}` : `${browseHref}#plans`;
          }

          return (
            <li key={s.step} className="flex min-w-0 flex-1 items-center gap-2 sm:max-w-[24%]">
              <Link
                href={href}
                className={`group flex min-w-0 flex-1 items-start gap-2 rounded-xl px-2 py-1.5 transition sm:flex-col sm:items-stretch sm:gap-1 sm:px-1 ${
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
                  {s.step}
                </span>
                <span
                  className={`min-w-0 text-left text-[11px] font-semibold leading-tight sm:text-xs ${
                    isCurrent ? "text-brand" : "text-zinc-700"
                  }`}
                >
                  {s.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

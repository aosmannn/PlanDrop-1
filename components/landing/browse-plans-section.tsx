"use client";

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock03Icon,
  EyeIcon,
  FilterIcon,
  FireIcon,
  Leaf01Icon,
  Location01Icon,
  MountainIcon,
  Restaurant01Icon,
  RunningShoesIcon,
  UserGroupIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { HugeIcon } from "@/components/ui/huge-icon";

const filters: {
  id: string;
  label: string;
  icon: IconSvgElement;
}[] = [
  { id: "all", label: "All vibes", icon: FilterIcon },
  { id: "chill", label: "Chill", icon: Leaf01Icon },
  { id: "active", label: "Active", icon: RunningShoesIcon },
  { id: "foodie", label: "Foodie", icon: Restaurant01Icon },
  { id: "adv", label: "Adventurous", icon: MountainIcon },
  { id: "p2", label: "2 people", icon: UserMultiple02Icon },
  { id: "p4", label: "4+", icon: UserGroupIcon },
];

type VibeId = "chill" | "active" | "foodie" | "adv";

type Plan = {
  id: string;
  title: string;
  tagline: string;
  price: string;
  meta: string;
  metaClass: string;
  stop: string;
  /** Public path or remote URL for the primary stop cover photo */
  coverImageSrc: string;
  coverImageAlt: string;
  photoCredit: string;
  duration: string;
  groupLabel: string;
  /** Used with filters: vibe category */
  vibe: VibeId;
  /** Inclusive group size range the plan supports */
  minGroup: number;
  maxGroup: number;
  available: boolean;
  viewing?: number;
  /** Highlights for the detail modal — things to do at the primary stop */
  locationDetails: string[];
};

const plans: Plan[] = [
  {
    id: "1",
    title: "Ponce & BeltLine golden hour",
    tagline: "Stroll the Eastside Trail, then settle in at the market.",
    price: "~$42/pp",
    meta: "CHILL · 4–6 PEOPLE · 2.5 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Ponce City Market (6:30 PM)",
    coverImageSrc: "/images/ponce-city-market.png",
    coverImageAlt:
      "Ponce City Market exterior with orange awning and signage in Atlanta",
    photoCredit: "Ponce City Market · Atlanta",
    duration: "2.5 hrs",
    groupLabel: "4–6",
    vibe: "chill",
    minGroup: 4,
    maxGroup: 6,
    available: true,
    viewing: 7,
    locationDetails: [
      "Hop between food stalls, sit-down spots, and shops under the brick arches.",
      "Walk or bike the Eastside Trail right outside for golden-hour views.",
      "Grab drinks on a patio and keep the group loose — no single table required.",
      "Meet at the central courtyard when everyone arrives on their own time.",
    ],
  },
  {
    id: "2",
    title: "Piedmont Park morning loop",
    tagline: "Lake loop, skyline views, cold coffee after.",
    price: "~$18/pp",
    meta: "ACTIVE · 2–4 PEOPLE · 2 HRS",
    metaClass: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100",
    stop: "Piedmont Park — 12th St & Piedmont Ave (8:00 AM)",
    coverImageSrc: "/images/piedmont-park-clara-meer.png",
    coverImageAlt:
      "Lake Clara Meer in Piedmont Park with Midtown Atlanta skyline reflected on the water",
    photoCredit: "Piedmont Park · Atlanta",
    duration: "2 hrs",
    groupLabel: "2–4",
    vibe: "active",
    minGroup: 2,
    maxGroup: 4,
    available: false,
    locationDetails: [
      "Circle Lake Clara Meer for a flat, easy loop with skyline reflections.",
      "Spread out on open lawns or use the active oval for a light jog.",
      "Catch Midtown towers over the treeline — classic Atlanta postcard views.",
      "Use the dog park or sports courts if your crew wants a little extra movement.",
      "Finish with cold coffee from a nearby café on the park edge.",
    ],
  },
  {
    id: "3",
    title: "Krog Street tasting line",
    tagline: "Small plates, shared tables, zero decision fatigue.",
    price: "~$55/pp",
    meta: "FOODIE · 4 PEOPLE · 3 HRS",
    metaClass: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
    stop: "Krog Street Market (7:15 PM)",
    coverImageSrc: "/images/krog-street-market.png",
    coverImageAlt:
      "Krog Street Market exterior at dusk with patio, signage, and parking in front",
    photoCredit: "Krog Street Market · Atlanta",
    duration: "3 hrs",
    groupLabel: "4",
    vibe: "foodie",
    minGroup: 4,
    maxGroup: 4,
    available: true,
    locationDetails: [
      "Share small plates from different vendors so nobody has to pick one restaurant.",
      "Post up on the covered patio or high-top rails for a social, low-pressure dinner.",
      "Browse beer and wine at Hop City–style counters before you commit to food.",
      "Stroll Krog Street Tunnel murals if you want a quick art break between bites.",
      "Easy parking and BeltLine access for late arrivals.",
    ],
  },
  {
    id: "4",
    title: "Mercedes-Benz Stadium circuit",
    tagline: "The pinwheel roof, the plaza, then easy hops to Westside food.",
    price: "~$45/pp",
    meta: "ADVENTUROUS · 2–4 PEOPLE · 3 HRS",
    metaClass: "bg-violet-50 text-violet-800 ring-1 ring-violet-100",
    stop: "Mercedes-Benz Stadium — Northside Dr NW (4:30 PM)",
    coverImageSrc: "/images/mercedes-benz-stadium.png",
    coverImageAlt:
      "Aerial view of Mercedes-Benz Stadium with closed retractable roof and Mercedes star on the facade",
    photoCredit: "Mercedes-Benz Stadium · Atlanta",
    duration: "3 hrs",
    groupLabel: "2–4",
    vibe: "adv",
    minGroup: 2,
    maxGroup: 4,
    available: true,
    locationDetails: [
      "Walk the plaza and take in the pinwheel roof and Mercedes star facade.",
      "On event days, soak up pregame energy; off-days, quiet architecture photos.",
      "Visit the team store for gear if your group wants a shared souvenir stop.",
      "Loop the stadium footprint, then cut toward Westside or GWCC-adjacent dining.",
      "Pair with a short rideshare hop if you want Atlantic Station or Vine City after.",
    ],
  },
];

function PlanDetailModal({
  plan,
  onClose,
}: {
  plan: Plan | null;
  onClose: () => void;
}) {
  const titleId = useId();
  const open = plan != null;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!plan) return null;

  const vibeLabel = plan.meta.split("·")[0].trim();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="Close dialog"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex w-[min(100%,min(96vw,1040px))] max-w-none flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-zinc-200/80 sm:h-[min(80vh,560px)] sm:max-h-[min(80vh,560px)] sm:min-h-0 sm:flex-row"
      >
        {/* Photo strip — short on mobile, full-height column on sm+ */}
        <div className="relative h-36 w-full shrink-0 bg-zinc-100 sm:h-full sm:min-h-0 sm:w-[min(38%,360px)] sm:min-w-[240px]">
          <Image
            src={plan.coverImageSrc}
            alt={plan.coverImageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 380px"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10"
            aria-hidden
          />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-zinc-800 shadow-md ring-1 ring-zinc-200/80 transition hover:bg-white sm:right-3 sm:top-3 sm:h-9 sm:w-9"
            aria-label="Close"
          >
            <HugeIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
          </button>
          <p className="pointer-events-none absolute bottom-1.5 left-2.5 right-2.5 text-[9px] font-medium text-white/90 sm:text-[10px]">
            {plan.photoCredit}
          </p>
        </div>

        {/* Body: grid keeps footer pinned; columns share one full height on sm+ */}
        <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-y-auto sm:overflow-hidden">
          <div className="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)_auto] p-3 sm:p-4">
            <div className="flex min-h-0 flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-4">
              <div className="flex min-h-0 min-w-0 shrink-0 flex-col rounded-lg border border-zinc-200 bg-zinc-50/95 p-3 shadow-sm sm:w-[260px] sm:max-w-[min(46%,280px)]">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p
                  className={`inline-block w-fit rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${plan.metaClass}`}
                >
                  {vibeLabel}
                </p>
                <span
                  className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-bold tabular-nums sm:text-sm ${plan.available ? "bg-white text-zinc-800 ring-1 ring-zinc-200/80" : "bg-zinc-100/80 text-zinc-400"}`}
                >
                  {plan.price}
                </span>
              </div>
              <h2
                id={titleId}
                className="font-display mt-2 text-base font-bold leading-snug tracking-tight text-zinc-900"
              >
                {plan.title}
              </h2>
              <p className="mt-1.5 text-xs leading-snug text-zinc-600 sm:text-[13px]">{plan.tagline}</p>
              <div className="mt-3 space-y-1.5 border-t border-zinc-200/80 pt-2.5 text-[11px] text-zinc-800 sm:text-xs">
                <div className="flex items-start gap-1.5">
                  <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white ring-1 ring-zinc-200/80">
                    <HugeIcon
                      icon={Location01Icon}
                      size={10}
                      className="text-brand"
                      strokeWidth={2}
                    />
                  </div>
                  <span className="leading-snug">{plan.stop}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-white ring-1 ring-zinc-200/80">
                    <HugeIcon icon={Clock03Icon} size={10} className="text-zinc-500" />
                  </div>
                  <span className="font-semibold tabular-nums">{plan.duration}</span>
                </div>
              </div>
              </div>

              <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-zinc-100 pt-3 sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  At this spot
                </p>
                <ul className="mt-1.5 grid min-h-0 flex-1 list-none gap-x-4 gap-y-1 pl-0 text-[11px] leading-snug text-zinc-600 sm:mt-2 sm:grid-cols-2 sm:gap-y-1.5 sm:text-[12px] sm:leading-snug">
                  {plan.locationDetails.map((line, i) => (
                    <li key={`${plan.id}-at-${i}`} className="relative pl-3.5 before:absolute before:left-0 before:text-zinc-400 before:content-['•']">
                      {line}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-3 flex shrink-0 flex-col gap-2 border-t border-zinc-100 pt-3 sm:mt-4 sm:flex-row sm:justify-end sm:gap-3">
              {plan.available ? (
                <button
                  type="button"
                  className="w-full rounded-lg bg-brand px-3 py-2 text-center text-xs font-bold text-white shadow-sm transition hover:bg-brand-hover sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                >
                  Claim plan →
                </button>
              ) : (
                <button
                  type="button"
                  disabled
                  className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-400 sm:w-auto sm:px-4 sm:py-2 sm:text-sm"
                >
                  <HugeIcon icon={CheckmarkCircle02Icon} size={14} />
                  Claimed
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function planMatchesFilter(plan: Plan, filterId: string): boolean {
  switch (filterId) {
    case "all":
      return true;
    case "chill":
      return plan.vibe === "chill";
    case "active":
      return plan.vibe === "active";
    case "foodie":
      return plan.vibe === "foodie";
    case "adv":
      return plan.vibe === "adv";
    case "p2":
      return plan.minGroup <= 2 && plan.maxGroup >= 2;
    case "p4":
      return plan.maxGroup >= 4;
    default:
      return true;
  }
}

export function BrowsePlansSection() {
  const [active, setActive] = useState<string>("all");
  const [detailPlan, setDetailPlan] = useState<Plan | null>(null);

  const filteredPlans = useMemo(
    () => plans.filter((p) => planMatchesFilter(p, active)),
    [active],
  );

  const openTonight = useMemo(
    () => plans.filter((p) => p.available).length,
    [],
  );

  return (
    <>
      <PlanDetailModal plan={detailPlan} onClose={() => setDetailPlan(null)} />
    <section id="plans" className="scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8">
      {/* Live strip */}
      <div className="mx-auto mb-8 max-w-5xl overflow-hidden rounded-2xl bg-gradient-to-r from-navy-card via-[#252347] to-navy px-4 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex min-w-0 items-center gap-2 text-sm font-semibold text-white sm:text-base">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
              <HugeIcon icon={FireIcon} size={18} className="text-amber-300" />
            </span>
            <span className="min-w-0 leading-snug">
              Plans are dropping in{" "}
              <span className="whitespace-nowrap">Atlanta right now</span>
            </span>
          </p>
          <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
            <span className="rounded-full bg-brand px-3 py-1 text-xs font-bold text-white sm:text-sm">
              {openTonight === 0
                ? "All claimed for tonight"
                : `${openTonight} plan${openTonight === 1 ? "" : "s"} open tonight`}
            </span>
            <Link
              href="/plans"
              className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-hover hover:shadow-lg hover:shadow-brand/20"
            >
              Claim yours
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-widest text-brand">
              Live in Atlanta, GA
            </p>
            <h2 className="font-display mt-0.5 text-xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-2xl">
              Available plans tonight
            </h2>
          </div>
          <Link
            href="/plans"
            className="text-sm font-semibold text-zinc-900 underline decoration-zinc-400 underline-offset-4 hover:decoration-brand"
          >
            Show all {plans.length} plan{plans.length === 1 ? "" : "s"} →
          </Link>
        </div>

        <div className="no-scrollbar mb-8 flex gap-1.5 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.id}
              type="button"
              aria-pressed={active === f.id}
              onClick={() => setActive(f.id)}
              className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-semibold transition sm:text-sm ${
                active === f.id
                  ? "border-navy bg-navy text-white"
                  : "border-zinc-200 bg-white text-zinc-800 hover:border-zinc-300"
              }`}
            >
              <HugeIcon
                icon={f.icon}
                size={14}
                className={active === f.id ? "text-white" : "text-zinc-500"}
              />
              {f.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPlans.length === 0 ? (
            <p className="col-span-full rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-600">
              No plans match this filter. Try{" "}
              <button
                type="button"
                onClick={() => setActive("all")}
                className="font-semibold text-brand underline decoration-brand/30 underline-offset-2 hover:decoration-brand"
              >
                all vibes
              </button>{" "}
              or another option.
            </p>
          ) : null}
          {filteredPlans.map((plan) => (
            <article
              key={plan.id}
              className={`group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-card transition-all hover:-translate-y-0.5 hover:shadow-lg ${!plan.available ? "opacity-80 grayscale-[0.35]" : ""}`}
            >
              <div className="relative aspect-[5/3] overflow-hidden bg-zinc-100">
                <Image
                  src={plan.coverImageSrc}
                  alt={plan.coverImageAlt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-black/25"
                  aria-hidden
                />
                <div className="absolute left-2 top-2 flex flex-wrap gap-1.5">
                  {plan.available ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-950/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      <span className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.9)]" />
                      Live
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-zinc-950/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                      <HugeIcon icon={CheckmarkCircle02Icon} size={10} className="text-zinc-300" />
                      Claimed
                    </span>
                  )}
                </div>
                {plan.viewing != null && plan.available ? (
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ring-1 ring-white/35 backdrop-blur-sm">
                    <HugeIcon icon={EyeIcon} size={10} />
                    {plan.viewing}
                  </span>
                ) : null}
                <p className="pointer-events-none absolute bottom-1 left-2 right-2 text-[9px] leading-tight text-white/85">
                  {plan.photoCredit}
                </p>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <p
                    className={`inline-block w-fit rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${plan.metaClass}`}
                  >
                    {plan.meta.split("·")[0].trim()}
                  </p>
                  <span
                    className={`shrink-0 rounded px-1.5 py-0.5 text-[11px] font-bold tabular-nums ${plan.available ? "bg-zinc-100 text-zinc-700" : "bg-zinc-100/60 text-zinc-400"}`}
                  >
                    {plan.price}
                  </span>
                </div>
                <h3
                  className={`font-display text-base font-bold leading-snug tracking-tight ${plan.available ? "text-zinc-900" : "text-zinc-600"}`}
                >
                  {plan.title}
                </h3>
                <p
                  className={`mt-1.5 line-clamp-2 text-xs leading-relaxed ${plan.available ? "text-zinc-500" : "text-zinc-400"}`}
                >
                  {plan.tagline}
                </p>
                <div className="mt-3 flex items-start gap-1.5 text-xs font-medium leading-snug text-zinc-700">
                  <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <HugeIcon
                      icon={Location01Icon}
                      size={9}
                      className={plan.available ? "text-brand" : "text-zinc-400"}
                      strokeWidth={2}
                    />
                  </div>
                  <span className={`line-clamp-2 ${!plan.available ? "text-zinc-500" : ""}`}>{plan.stop}</span>
                </div>
                <div className="mt-4 flex flex-col gap-3 border-t border-zinc-100 pt-3">
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] font-medium text-zinc-500">
                    <span className="inline-flex items-center gap-1">
                      <HugeIcon icon={Clock03Icon} size={12} className="text-zinc-400" />
                      {plan.duration}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <HugeIcon icon={UserGroupIcon} size={12} className="text-zinc-400" />
                      {plan.groupLabel}
                    </span>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setDetailPlan(plan)}
                      className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-center text-xs font-semibold text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 sm:order-1 sm:w-auto"
                    >
                      View
                    </button>
                    {plan.available ? (
                      <button
                        type="button"
                        className="w-full shrink-0 rounded-lg bg-brand px-3 py-2 text-center text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-hover sm:order-2 sm:w-auto"
                      >
                        Claim plan →
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="inline-flex w-full items-center justify-center gap-1 rounded-lg bg-zinc-100 px-3 py-2 text-xs font-bold text-zinc-400 sm:order-2 sm:w-auto"
                      >
                        <HugeIcon icon={CheckmarkCircle02Icon} size={12} />
                        Claimed
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
    </>
  );
}

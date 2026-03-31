"use client";
import { getSessionId } from "@/lib/session-id";
import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock03Icon,
  EyeIcon,
  FilterIcon,
  Leaf01Icon,
  Location01Icon,
  MapsIcon,
  MountainIcon,
  Restaurant01Icon,
  RunningShoesIcon,
  UserGroupIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useId, useMemo, useState } from "react";
import type { IconSvgElement } from "@hugeicons/react";
import { ClaimBanModal } from "@/components/claim-ban-modal";
import { MessageModal } from "@/components/message-modal";
import { UnclaimConfirmModal } from "@/components/unclaim-confirm-modal";
import { HugeIcon } from "@/components/ui/huge-icon";
import { useClaimedPlanId } from "@/hooks/use-claimed-plan-id";
import { usePlanPresenceCount } from "@/hooks/use-plan-presence-count";
import { usePlanClaims } from "@/hooks/usePlanClaims";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import {
  PlanCardReviewTeaser,
  PlanGoogleRatingSummary,
  PlanGoogleReviewsSection,
} from "@/components/plan-google-rating";
import { PlanImageGallery } from "@/components/plan-image-gallery";
import { buildClaimHref, buildGoHref } from "@/lib/claim-links";
import { buildGoogleMapsHref } from "@/lib/maps-links";
import { PlanMapPreview } from "@/components/plan-map-preview";
import { activityBulletsForDisplay } from "@/lib/plan-display";
import {
  formatPoolTimeRemaining,
} from "@/lib/plan-pool-expiry";
import {
  getClaimKey,
  getStoredAiPlan,
  getStoredArea,
  getStoredPin,
  isClaimBanned,
  releaseClaim,
  setStoredAiPlansMap,
  mergeAiPlanIntoStorage,
  setStoredArea,
  setStoredRadiusMiles,
  buildPlansHref,
  getStoredPlanOccasion,
  setStoredPlanOccasion,
} from "@/lib/claim-storage";
import { normalizeOccasionId, type PlanOccasionId } from "@/lib/plan-occasion";
import {
  clampRadiusMiles,
  parseRadiusMilesParam,
} from "@/lib/search-radius";
import type { Plan } from "@/lib/plans-data";
import { PLANS, TOP_PLACES_CATALOG, getPlanById } from "@/lib/plans-data";

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

const RADIUS_OPTIONS_MI = [5, 10, 15, 25, 30] as const;

function PlanDetailModal({
  plan,
  onClose,
  area,
  radiusMiles,
  occasionId,
  claimedId,
  globalClaimed,
  onClaimClick,
  onUnclaimRequest,
}: {
  plan: Plan | null;
  onClose: () => void;
  area: string | null;
  radiusMiles: number;
  occasionId: PlanOccasionId;
  claimedId: string | null;
  globalClaimed: Set<string>;
  onClaimClick: (e: React.MouseEvent) => void;
  onUnclaimRequest: () => void;
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
  const claimHref = buildClaimHref(plan, area, radiusMiles, occasionId);
  const isMine = claimedId === plan.id;
  const goHref = buildGoHref(
    plan,
    area,
    radiusMiles,
    isMine ? getClaimKey() : null,
    occasionId,
  );
  const hasOtherClaim = claimedId !== null && claimedId !== plan.id;
  const isClaimedByAnyone = globalClaimed.has(plan.id);
  const claimedPlanResolved =
    claimedId != null
      ? (getPlanById(claimedId) ?? getStoredAiPlan(claimedId))
      : null;

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
        className="relative z-10 flex max-h-[min(92vh,720px)] min-h-0 w-[min(100%,min(96vw,960px))] flex-col overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-zinc-200/80 sm:max-h-[min(92vh,720px)] sm:flex-row sm:items-stretch"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-zinc-800 shadow-md ring-1 ring-zinc-200/80 transition hover:bg-white sm:right-3 sm:top-3"
          aria-label="Close"
        >
          <HugeIcon icon={Cancel01Icon} size={18} strokeWidth={2} />
        </button>

        <div className="relative flex min-h-0 w-full shrink-0 flex-col overflow-hidden bg-zinc-100 sm:w-[min(56%,580px)] sm:max-w-[600px] sm:min-w-[400px] sm:flex-none sm:self-stretch">
          <div className="relative aspect-[5/3] w-full sm:aspect-auto sm:min-h-0 sm:flex-1">
            <PlanImageGallery plan={plan} variant="modal" priority />
            <p className="pointer-events-none absolute bottom-2 left-2.5 right-20 z-10 text-[9px] font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] sm:bottom-3 sm:right-24 sm:text-[10px]">
              {photoCreditDisplay(plan.photoCredit)}
            </p>
          </div>
        </div>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col border-t border-zinc-100 sm:border-l sm:border-t-0">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 pb-2 pt-3 sm:px-4 sm:pb-3 sm:pt-4">
            <div className="flex flex-col gap-4">
              <div className="flex min-w-0 flex-col rounded-lg border border-zinc-200 bg-zinc-50/95 p-3 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p
                    className={`inline-block w-fit rounded px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${plan.metaClass}`}
                  >
                    {vibeLabel}
                  </p>
                  <div className="flex shrink-0 flex-col items-end gap-0.5">
                    <span
                      className={`rounded px-1.5 py-0.5 text-xs font-bold tabular-nums sm:text-sm ${!isClaimedByAnyone || isMine ? "bg-white text-zinc-800 ring-1 ring-zinc-200/80" : "bg-zinc-100/80 text-zinc-400"}`}
                    >
                      {plan.price}
                    </span>
                    <PlanGoogleRatingSummary plan={plan} />
                  </div>
                </div>
                <h2
                  id={titleId}
                  className="font-display mt-1.5 text-base font-bold leading-snug tracking-tight text-zinc-900"
                >
                  {plan.title}
                </h2>
                <p className="mt-1 text-xs leading-snug text-zinc-600 sm:text-[13px]">{plan.tagline}</p>
                <div className="mt-2 space-y-1.5 border-t border-zinc-200/80 pt-2 text-[11px] text-zinc-800 sm:text-xs">
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
                  {plan.openingHoursLine ? (
                    <p className="pl-6 text-[10px] leading-snug text-zinc-600">
                      Venue: {plan.openingHoursLine}
                    </p>
                  ) : null}
                  <a
                    href={buildGoogleMapsHref(plan)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1.5 pl-6 text-[11px] font-semibold text-brand hover:underline"
                  >
                    <HugeIcon icon={MapsIcon} size={12} strokeWidth={2} aria-hidden />
                    Open in Google Maps
                  </a>
                  <PlanMapPreview plan={plan} className="mt-2.5" variant="modal" />
                  {plan.formattedAddress ? (
                    <p className="mt-1 text-[10px] leading-snug text-zinc-600">
                      {plan.formattedAddress}
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="rounded-lg border border-zinc-200 bg-white p-3 shadow-sm">
                <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
                  At this spot
                </p>
                <ul className="mt-2.5 list-none space-y-2.5 pl-0 text-sm leading-relaxed text-zinc-700">
                  {activityBulletsForDisplay(plan).map((line, i) => (
                    <li
                      key={`${plan.id}-at-${i}`}
                      className="relative pl-4 before:absolute before:left-0 before:top-[0.55em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-brand"
                    >
                      {line}
                    </li>
                  ))}
                </ul>
                <PlanGoogleReviewsSection plan={plan} className="mt-4" />
                {plan.openingHoursWeekday && plan.openingHoursWeekday.length > 0 ? (
                  <details className="mt-3 text-xs text-zinc-600">
                    <summary className="cursor-pointer font-semibold text-zinc-700">
                      Full opening hours
                    </summary>
                    <ul className="mt-2 list-none space-y-1 pl-0">
                      {plan.openingHoursWeekday.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  </details>
                ) : null}
              </div>
            </div>
          </div>

          <div className="shrink-0 border-t border-zinc-100 bg-white px-3 py-3 sm:px-4">
            {isMine ? (
              <div className="flex w-full flex-col gap-2">
                <Link
                  href={goHref}
                  onClick={onClose}
                  className="block w-full rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
                >
                  Your plan →
                </Link>
                <button
                  type="button"
                  onClick={onUnclaimRequest}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                >
                  Release plan
                </button>
              </div>
            ) : hasOtherClaim ? (
              <div className="flex flex-col gap-2">
                <p className="text-center text-xs text-zinc-500">
                  You already have a plan locked.
                </p>
                <Link
                  href={
                    claimedPlanResolved
                      ? buildGoHref(
                          claimedPlanResolved,
                          area,
                          radiusMiles,
                          getClaimKey(),
                          occasionId,
                        )
                      : `/go/${claimedId}`
                  }
                  onClick={onClose}
                  className="block w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-center text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                >
                  Open your plan
                </Link>
                <button
                  type="button"
                  onClick={onUnclaimRequest}
                  className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                >
                  Release plan
                </button>
              </div>
            ) : isClaimedByAnyone ? (
              <button
                type="button"
                disabled
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-bold text-zinc-400"
              >
                <HugeIcon icon={CheckmarkCircle02Icon} size={16} />
                Claimed
              </button>
            ) : (
              <Link
                href={claimHref}
                onClick={(e) => {
                  onClaimClick(e);
                  if (!e.defaultPrevented) onClose();
                }}
                className="block w-full rounded-lg bg-brand px-4 py-2.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
              >
                Claim plan →
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Match reference: "Venue - Atlanta" on image overlay */
function photoCreditDisplay(photoCredit: string): string {
  return photoCredit.replace(/\s*·\s*/g, " - ").replace(/\s*•\s*/g, " - ");
}

/** Title-case area strings from URL or geocode (e.g. "houston texas" → "Houston Texas"). */
function formatAreaDisplay(area: string): string {
  const t = area.trim();
  if (!t) return "your area";
  return t
    .split(/,\s*/)
    .map((segment) =>
      segment
        .split(/\s+/)
        .filter(Boolean)
        .map((w) => {
          if (/^[A-Za-z]{2}$/.test(w)) return w.toUpperCase();
          return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        })
        .join(" "),
    )
    .join(", ");
}

function PlanCardRightBadges({
  plan,
  eligible,
}: {
  plan: Plan;
  eligible: boolean;
}) {
  const [poolNow, setPoolNow] = useState(() => Date.now());
  useEffect(() => {
    const id = window.setInterval(() => setPoolNow(Date.now()), 10_000);
    return () => window.clearInterval(id);
  }, []);

  const viewers = usePlanPresenceCount(plan.id, eligible);

  if (!eligible) return null;

  const poolLeft =
    eligible && plan.poolExpiresAt
      ? formatPoolTimeRemaining(plan.poolExpiresAt, poolNow)
      : null;

  const showViewers = viewers != null;
  const showPool = poolLeft != null;

  if (!showViewers && !showPool) return null;

  const pill =
    "inline-flex items-center gap-1 rounded-full bg-black/45 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white ring-1 ring-white/25 backdrop-blur-sm tabular-nums";

  return (
    <div className="absolute right-2 top-2 z-[1] flex flex-col items-end gap-1.5">
      {showPool ? (
        <span
          className={pill}
          title="Time left before this plan leaves the pool if unclaimed"
        >
          <HugeIcon icon={Clock03Icon} size={10} aria-hidden />
          {poolLeft}
        </span>
      ) : null}
      {showViewers ? (
        <span className={pill} aria-live="polite" aria-atomic="true">
          <HugeIcon icon={EyeIcon} size={10} aria-hidden />
          {viewers}
        </span>
      ) : null}
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

function BrowsePlansSectionInner() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlArea = searchParams.get("area")?.trim() ?? "";
  const urlOccasion = searchParams.get("occasion");
  const radiusMiles = parseRadiusMilesParam(searchParams.get("radius"));
  const isHomePage = pathname === "/";
  const baseOccasionId = useMemo(
    () => normalizeOccasionId(urlOccasion ?? getStoredPlanOccasion()),
    [urlOccasion],
  );
  const [storageArea, setStorageArea] = useState("");

  useEffect(() => {
    if (urlArea) {
      setStoredArea(urlArea);
      setStorageArea("");
      return;
    }
    if (isHomePage) {
      setStorageArea("");
      return;
    }
    setStorageArea(getStoredArea()?.trim() ?? "");
  }, [urlArea, isHomePage]);

  const areaTrim = urlArea || (isHomePage ? "" : storageArea);

  useEffect(() => {
    if (areaTrim) setStoredRadiusMiles(radiusMiles);
  }, [areaTrim, radiusMiles]);

  useEffect(() => {
    if (!areaTrim || isHomePage) return;
    setStoredPlanOccasion(baseOccasionId);
  }, [areaTrim, isHomePage, baseOccasionId]);

  useEffect(() => {
    if (!areaTrim || isHomePage) return;
    if (urlOccasion) return;
    const stored = getStoredPlanOccasion();
    if (stored !== "surprise") {
      router.replace(
        buildPlansHref(areaTrim, radiusMiles, { occasion: stored }),
      );
    }
  }, [areaTrim, radiusMiles, urlOccasion, isHomePage, router]);

  const claimedId = useClaimedPlanId();
  const globalClaimed = usePlanClaims();

  /** /plans with no area — Atlanta demo. Homepage uses TOP_PLACES_CATALOG instead. */
  const isDemoCatalog = !isHomePage && !areaTrim;
  const areaLabel = useMemo(() => {
    if (isHomePage) {
      return "Atlanta (launch city) — more soon";
    }
    if (isDemoCatalog) return formatAreaDisplay("Atlanta, GA");
    return formatAreaDisplay(areaTrim);
  }, [isHomePage, isDemoCatalog, areaTrim]);

  const [active, setActive] = useState<string>("all");
  const [detailPlan, setDetailPlan] = useState<Plan | null>(null);
  const [aiPlans, setAiPlans] = useState<Plan[] | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unclaimOpen, setUnclaimOpen] = useState(false);
  const [releaseNotice, setReleaseNotice] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [poolNow, setPoolNow] = useState(() => Date.now());
  const [staticReviewsLoading, setStaticReviewsLoading] = useState(false);
  const [staticReviewsVersion, setStaticReviewsVersion] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setPoolNow(Date.now()), 10_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (isHomePage || !areaTrim) {
      setAiPlans(null);
      setAiError(null);
      setAiLoading(false);
      return;
    }
    let cancelled = false;
    const run = async () => {
      setAiLoading(true);
      setAiError(null);
      try {
        const pin = getStoredPin();
        const body: {
          area: string;
          lat?: number;
          lng?: number;
          radiusMiles: number;
          occasion: string;
        } = {
          area: areaTrim,
          radiusMiles,
          occasion: baseOccasionId,
        };
        if (pin) {
          body.lat = pin.lat;
          body.lng = pin.lng;
        }
        const res = await fetch("/api/ai-plans", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const j = (await res.json().catch(() => ({}))) as { error?: string };
          throw new Error(j.error ?? "Could not load ideas");
        }
        const data = (await res.json()) as { plans: Plan[] };
        if (!cancelled && data.plans?.length) {
          setStoredAiPlansMap(data.plans);
          setAiPlans(data.plans);
        } else if (!cancelled) {
          setAiPlans(null);
        }
      } catch (e) {
        if (!cancelled) {
          setAiError(e instanceof Error ? e.message : "Something went wrong");
          setAiPlans(null);
        }
      } finally {
        if (!cancelled) setAiLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [areaTrim, radiusMiles, isHomePage, baseOccasionId]);

  const boardPlans = useMemo(() => {
    if (isHomePage) {
      return PLANS;
    }
    if (!areaTrim) {
      return PLANS;
    }
    if (aiLoading) {
      return [];
    }
    if (aiPlans && aiPlans.length > 0) {
      return aiPlans.filter((p) => {
        if (!p.poolExpiresAt) return true;
        if (new Date(p.poolExpiresAt).getTime() > poolNow) return true;
        if (globalClaimed.has(p.id)) return true;
        return false;
      });
    }
    return [];
  }, [isHomePage, areaTrim, aiPlans, aiLoading, poolNow, globalClaimed]);

  /** Globally claimed plans stay in the pool for timers but are hidden from the grid. */
  const enrichedBoardPlans = useMemo(
    () => {
      // Force recompute after we cache enriched static-plan reviews.
      staticReviewsVersion;
      return boardPlans.map((p) => getStoredAiPlan(p.id) ?? p);
    },
    [boardPlans, staticReviewsVersion],
  );

  const visibleBoardPlans = useMemo(
    () => enrichedBoardPlans.filter((p) => !globalClaimed.has(p.id)),
    [enrichedBoardPlans, globalClaimed],
  );

  useEffect(() => {
    // Only enrich the static demo cards (Atlanta / no area query).
    if (!(isHomePage || !areaTrim)) return;
    if (aiLoading) return;
    if (staticReviewsLoading) return;
    if (!boardPlans.length) return;

    const idsToEnrich = boardPlans
      .map((plan) => {
        const stored = getStoredAiPlan(plan.id);
        return { plan, target: stored ?? plan };
      })
      .filter(({ target }) => {
        const hasReviews = (target.placeReviews?.length ?? 0) > 0;
        const hasRating =
          typeof target.placeRating === "number" && Number.isFinite(target.placeRating);
        return !hasReviews && !hasRating;
      })
      .map(({ plan }) => plan.id);

    if (idsToEnrich.length === 0) return;

    let cancelled = false;
    const run = async () => {
      setStaticReviewsLoading(true);
      try {
        const res = await fetch("/api/enrich-plan-reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planIds: idsToEnrich }),
        });
        if (!res.ok) return;
        const data = (await res.json().catch(() => ({}))) as {
          enrichments?: Record<
            string,
            Partial<
              Pick<Plan, "placeRating" | "placeUserRatingsTotal" | "placeReviews">
            >
          >;
        };
        const enrichments = data?.enrichments ?? {};
        for (const [id, fields] of Object.entries(enrichments)) {
          const plan = boardPlans.find((p) => p.id === id);
          if (!plan || !fields) continue;
          mergeAiPlanIntoStorage({ ...plan, ...fields } as Plan);
        }
        if (!cancelled) setStaticReviewsVersion((v) => v + 1);
      } finally {
        if (!cancelled) setStaticReviewsLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [
    isHomePage,
    areaTrim,
    aiLoading,
    boardPlans,
    staticReviewsLoading,
  ]);

  const filteredPlans = useMemo(
    () => visibleBoardPlans.filter((p) => planMatchesFilter(p, active)),
    [visibleBoardPlans, active],
  );

  const openTonight = visibleBoardPlans.length;

  const firstOpenPlan = visibleBoardPlans[0] ?? null;

  const areaForLinks = isHomePage ? null : areaTrim || null;

  const openTonightBanner = useMemo(() => {
    if (!isHomePage && aiLoading && areaTrim) {
      return { mode: "loading" as const };
    }
    if (areaTrim && boardPlans.length === 0) {
      return { mode: "none" as const };
    }
    if (openTonight === 0 && boardPlans.length > 0) {
      return { mode: "all_claimed" as const };
    }
    if (openTonight === 0) {
      return { mode: "none" as const };
    }
    return { mode: "open" as const, n: openTonight };
  }, [isHomePage, aiLoading, areaTrim, boardPlans.length, openTonight]);

  const lockedPlan = useMemo(() => {
    if (!claimedId) return null;
    return getPlanById(claimedId) ?? getStoredAiPlan(claimedId) ?? null;
  }, [claimedId]);

  const lockedPlanGoHref =
    lockedPlan != null
      ? buildGoHref(
          lockedPlan,
          areaForLinks,
          radiusMiles,
          getClaimKey(),
          baseOccasionId,
        )
      : claimedId
        ? `/go/${claimedId}`
        : "#";

  function onRadiusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const r = clampRadiusMiles(Number.parseInt(e.target.value, 10));
    setStoredRadiusMiles(r);
    if (areaTrim) {
      router.replace(
        buildPlansHref(areaTrim, r, { occasion: baseOccasionId }),
      );
    }
  }

  function onClaimClick(e: React.MouseEvent) {
    if (isClaimBanned()) {
      e.preventDefault();
      setBanModalOpen(true);
    }
  }

  async function handleUnclaimConfirm() {
    setUnclaimOpen(false);

    if (claimedId) {
      const supa = getSupabaseBrowser();
      const authed = await supa.auth
        .getUser()
        .catch(() => ({ data: { user: null } }));
      const sid = authed?.data?.user?.id || getSessionId();
      await fetch("/api/unclaim-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          planId: claimedId,
          sessionId: sid,
          claimKey: getClaimKey() ?? undefined,
        }),
      });
    }

    const r = releaseClaim();
    if (r.banned) {
      setBanModalOpen(true);
      setDetailPlan(null);
      return;
    }
    if (r.strikeAfter === 1) {
      setReleaseNotice({
        title: "Got it",
        body:
          "Releasing too many times in a row can temporarily block new claims — we want real plans, not venue scouting.",
      });
    } else if (r.strikeAfter === 2) {
      setReleaseNotice({
        title: "One more release triggers a cooldown",
        body:
          "Second release this session. One more release and new claims pause for 5 minutes to stop repeat scouting.",
      });
    }
    setDetailPlan(null);
  }

  return (
    <>
      <ClaimBanModal open={banModalOpen} onClose={() => setBanModalOpen(false)} />
      <MessageModal
        open={releaseNotice != null}
        title={releaseNotice?.title ?? "Notice"}
        onClose={() => setReleaseNotice(null)}
      >
        {releaseNotice?.body ?? ""}
      </MessageModal>
      <UnclaimConfirmModal
        open={unclaimOpen}
        onClose={() => setUnclaimOpen(false)}
        onConfirm={handleUnclaimConfirm}
      />
      <PlanDetailModal
        plan={detailPlan}
        onClose={() => setDetailPlan(null)}
        area={areaForLinks}
        radiusMiles={radiusMiles}
        occasionId={baseOccasionId}
        claimedId={claimedId}
        globalClaimed={globalClaimed}
        onClaimClick={onClaimClick}
        onUnclaimRequest={() => setUnclaimOpen(true)}
      />
      <section
        id="plans"
        className="scroll-mt-20 bg-white px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      >
        <div className="relative mx-auto max-w-5xl">
          <div className="relative mb-8 overflow-hidden rounded-2xl border border-zinc-200/90 bg-gradient-to-br from-white via-zinc-50/40 to-brand-soft/25 shadow-[0_2px_20px_rgba(15,23,42,0.05)] ring-1 ring-zinc-100/80">
            <div
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/25 to-transparent"
              aria-hidden
            />
            <div className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-start gap-3 sm:items-center">
                <span
                  className="relative mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft ring-1 ring-brand/15 sm:mt-0"
                  aria-hidden
                >
                  <span className="absolute inline-flex h-2.5 w-2.5 animate-ping rounded-full bg-brand/45" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-brand shadow-[0_0_10px_rgba(43,83,193,0.55)]" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm leading-snug text-zinc-800 sm:text-[15px]">
                    <span className="mr-2 inline-flex items-center rounded-full bg-brand-soft px-2 py-0.5 align-middle text-[10px] font-bold uppercase tracking-wider text-brand ring-1 ring-brand/25">
                      Live
                    </span>
                    Plans are dropping in{" "}
                    <span className="font-semibold text-zinc-900">{areaLabel}</span>{" "}
                    right now
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Open spots update in real time as people claim. Each unclaimed
                    plan leaves the pool after a limited window—longer outings and
                    richer stops get a bit more time.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:justify-end sm:gap-3">
                <span
                  aria-live="polite"
                  aria-atomic="true"
                  className={`inline-flex h-10 items-center rounded-full border px-3 text-xs font-semibold tabular-nums sm:px-3.5 sm:text-sm ${
                    openTonightBanner.mode === "open"
                      ? "border-brand/25 bg-brand-soft text-brand"
                      : "border-zinc-200 bg-zinc-100/80 text-zinc-600"
                  }`}
                >
                  {openTonightBanner.mode === "loading"
                    ? "Loading plans…"
                    : openTonightBanner.mode === "none"
                      ? "No plans loaded yet"
                      : openTonightBanner.mode === "all_claimed"
                        ? "Tonight: all claimed"
                        : `${openTonightBanner.n} open tonight`}
                </span>
                <Link
                  href={
                    firstOpenPlan
                      ? buildClaimHref(
                          firstOpenPlan,
                          areaForLinks,
                          radiusMiles,
                          baseOccasionId,
                        )
                      : "#plans"
                  }
                  onClick={firstOpenPlan ? onClaimClick : undefined}
                  className={`inline-flex h-10 items-center justify-center gap-1 rounded-full px-4 text-sm font-bold shadow-sm transition sm:min-w-[8.5rem] ${
                    firstOpenPlan
                      ? "bg-brand text-white hover:bg-brand-hover"
                      : "border border-zinc-200 bg-zinc-100 text-zinc-500 hover:bg-zinc-200/80"
                  }`}
                >
                  Claim yours
                  <span aria-hidden>→</span>
                </Link>
                <Link
                  href={isHomePage ? "/#hero-locate" : "/drop?edit=1"}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-700 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  Change location
                </Link>
              </div>
            </div>
          </div>

          <div className="mb-8 flex flex-col gap-4 sm:mb-10 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-brand">
                Live in {areaLabel}
              </p>
              <h2 className="font-display mt-2 text-3xl font-bold tracking-[-0.03em] text-zinc-900 sm:text-4xl">
                {isHomePage ? "Tonight's picks, ready now" : "Available plans tonight"}
              </h2>
              {aiError ? (
                <p className="mt-2 text-sm font-medium text-amber-800">{aiError}</p>
              ) : null}
              {isHomePage ? (
                <p className="mt-2 max-w-prose text-xs leading-relaxed text-zinc-500 sm:text-sm">
                  Real venues you&apos;ve heard of—no AI on this board. Search your city
                  above or open{" "}
                  <Link
                    href="/plans"
                    className="font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-2 hover:text-brand"
                  >
                    Browse plans
                  </Link>{" "}
                  for fresh ideas generated for your area (short wait while we build
                  them).
                </p>
              ) : isDemoCatalog ? (
                <p className="mt-2 text-xs text-zinc-500">
                  Demo stops are in Atlanta. Search above to generate plans for your
                  city.
                </p>
              ) : null}
            </div>
            {visibleBoardPlans.length > 0 ? (
              <div className="flex flex-wrap items-center gap-3 sm:mt-8">
                <Link
                  href={
                    isHomePage || !areaTrim
                      ? "/plans"
                      : buildPlansHref(areaTrim, radiusMiles, {
                          occasion: baseOccasionId,
                        })
                  }
                  className="shrink-0 self-start text-sm font-semibold text-zinc-900 underline decoration-zinc-400 underline-offset-4 transition hover:decoration-brand hover:text-brand"
                >
                  Show all {visibleBoardPlans.length} plans →
                </Link>
                {areaTrim ? (
                  <label className="inline-flex h-10 items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 text-sm font-semibold text-zinc-700 shadow-sm sm:px-3.5">
                    <span className="hidden text-zinc-500 sm:inline">Within</span>
                    <select
                      value={String(radiusMiles)}
                      onChange={onRadiusChange}
                      aria-label="Search radius in miles"
                      className="max-w-[5.5rem] cursor-pointer border-0 bg-transparent py-1 text-sm font-semibold text-zinc-900 focus:outline-none focus:ring-0"
                    >
                      {RADIUS_OPTIONS_MI.map((mi) => (
                        <option key={mi} value={String(mi)}>
                          {mi} mi
                        </option>
                      ))}
                    </select>
                  </label>
                ) : null}
              </div>
            ) : areaTrim && !aiLoading ? (
              <Link
                href={isHomePage ? "/#hero-locate" : "/drop?edit=1"}
                className="shrink-0 self-start text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-4 transition hover:decoration-brand sm:mt-8"
              >
                Try another location →
              </Link>
            ) : null}
          </div>

          {claimedId ? (
            <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-brand/25 bg-gradient-to-br from-brand-soft/50 to-white px-4 py-4 shadow-sm ring-1 ring-brand/10 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-5 sm:py-4">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-zinc-900">
                  You have a plan locked this session
                </p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                  {lockedPlan ? (
                    <>
                      <span className="font-medium text-zinc-800">
                        {lockedPlan.title}
                      </span>
                      {" · Release it anytime if you want a different spot."}
                    </>
                  ) : (
                    "Release it anytime if you want a different spot."
                  )}
                </p>
              </div>
              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row sm:shrink-0">
                <Link
                  href={lockedPlanGoHref}
                  className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-50 sm:w-auto sm:min-w-[9rem]"
                >
                  Open plan
                </Link>
                <button
                  type="button"
                  onClick={() => setUnclaimOpen(true)}
                  className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-zinc-300 bg-white px-4 text-sm font-bold text-zinc-900 shadow-sm transition hover:bg-zinc-50 sm:w-auto sm:min-w-[9rem]"
                >
                  Release plan
                </button>
              </div>
            </div>
          ) : null}

          <div className="no-scrollbar mb-10 flex flex-wrap gap-2">
            {filters.map((f) => (
              <button
                key={f.id}
                type="button"
                aria-pressed={active === f.id}
                onClick={() => setActive(f.id)}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition sm:text-sm ${
                  active === f.id
                    ? "border-transparent bg-zinc-900 text-white shadow-sm"
                    : "border-zinc-200 bg-white text-zinc-700 shadow-sm hover:border-zinc-300 hover:bg-zinc-50"
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

          <div className="relative grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {!isHomePage && aiLoading && areaTrim ? (
              <div className="col-span-full flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-brand/30 bg-brand-soft/20 px-6 py-12 text-center">
                <span className="h-8 w-8 animate-spin rounded-full border-2 border-brand border-t-transparent" />
                <p className="text-sm font-semibold text-zinc-800">
                  Generating ideas for {areaLabel}…
                </p>
              </div>
            ) : null}
            {!aiLoading && areaTrim && boardPlans.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-600">
                {aiError
                  ? "Fix the issue above, or search again from the top of the page."
                  : "No plans were returned for this area. Try a broader city name or search again."}
              </p>
            ) : null}
            {!aiLoading &&
            visibleBoardPlans.length > 0 &&
            filteredPlans.length === 0 ? (
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
            {!aiLoading && boardPlans.length > 0 && visibleBoardPlans.length === 0 ? (
              <p className="col-span-full rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-10 text-center text-sm text-zinc-600">
                Every visible drop in this pool is claimed right now. When someone releases a
                plan, it reappears here with the same countdown. You can also try another city
                from the top of the page.
              </p>
            ) : null}
            {!aiLoading &&
              filteredPlans.map((plan) => {
                const isMine = claimedId === plan.id;
                const hasOtherClaim = claimedId !== null && claimedId !== plan.id;
                const isClaimedByAnyone = globalClaimed.has(plan.id);
                const lockedByOthers = isClaimedByAnyone && !isMine;

                return (
                  <article
                    key={plan.id}
                    className={`group relative flex flex-col overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition hover:shadow-md ${lockedByOthers ? "opacity-[0.92] grayscale-[0.2]" : ""}`}
                  >
                    <div className="relative overflow-hidden rounded-t-2xl">
                      <PlanImageGallery plan={plan} variant="card" />
                      <div
                        className="pointer-events-none absolute inset-0 rounded-t-2xl bg-gradient-to-t from-black/55 via-transparent to-black/15"
                        aria-hidden
                      />
                      <div className="absolute left-2 top-2 z-[1] flex flex-wrap gap-1.5">
                        {isMine ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                            <HugeIcon icon={CheckmarkCircle02Icon} size={10} />
                            Yours
                          </span>
                        ) : isClaimedByAnyone ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/70 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                            <HugeIcon icon={CheckmarkCircle02Icon} size={10} className="text-zinc-300" />
                            Claimed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-black/75 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_8px_rgba(43,83,193,0.85)]" />
                            Live
                          </span>
                        )}
                      </div>
                      <PlanCardRightBadges plan={plan} eligible={!isClaimedByAnyone && !isMine} />
                      <p className="pointer-events-none absolute bottom-2 left-2 right-2 z-[1] text-[10px] font-medium leading-snug text-white drop-shadow-sm">
                        {photoCreditDisplay(plan.photoCredit)}
                      </p>
                    </div>
                    <div className="flex flex-1 flex-col p-3 sm:p-4">
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <p
                          className={`inline-block w-fit rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${plan.metaClass}`}
                        >
                          {plan.meta.split("·")[0].trim()}
                        </p>
                        <span
                          className={`shrink-0 text-sm font-bold tabular-nums ${!isClaimedByAnyone || isMine ? "text-zinc-900" : "text-zinc-400"}`}
                        >
                          {plan.price}
                        </span>
                      </div>
                      <h3
                        className={`font-display text-base font-bold leading-snug tracking-tight ${!isClaimedByAnyone || isMine ? "text-zinc-900" : "text-zinc-600"}`}
                      >
                        {plan.title}
                      </h3>
                      <p
                        className={`mt-1.5 line-clamp-2 text-xs leading-relaxed ${!isClaimedByAnyone || isMine ? "text-zinc-500" : "text-zinc-400"}`}
                      >
                        {plan.tagline}
                      </p>
                      <div className="mt-1.5">
                        <PlanGoogleRatingSummary plan={plan} />
                      </div>
                      <PlanCardReviewTeaser plan={plan} />
                      {activityBulletsForDisplay(plan).length > 0 ? (
                        <div className="mt-2.5">
                          <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                            At this spot
                          </p>
                          <ul className="mt-1 list-none space-y-1 pl-0">
                            {activityBulletsForDisplay(plan)
                              .slice(0, 2)
                              .map((line) => (
                                <li
                                  key={line}
                                  className="line-clamp-2 text-[11px] leading-snug text-zinc-600"
                                >
                                  <span className="font-medium text-brand">·</span>{" "}
                                  {line}
                                </li>
                              ))}
                          </ul>
                        </div>
                      ) : null}
                      <div className="mt-3 flex items-start gap-1.5 text-xs font-medium leading-snug text-zinc-700">
                        <div className="mt-0.5 flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                          <HugeIcon
                            icon={Location01Icon}
                            size={9}
                            className={!isClaimedByAnyone || isMine ? "text-brand" : "text-zinc-400"}
                            strokeWidth={2}
                          />
                        </div>
                        <span className={`line-clamp-2 ${lockedByOthers ? "text-zinc-500" : ""}`}>{plan.stop}</span>
                      </div>
                      {plan.openingHoursLine ? (
                        <p className="mt-1.5 line-clamp-2 text-[10px] leading-snug text-zinc-500">
                          {plan.openingHoursLine}
                        </p>
                      ) : null}
                      {plan.formattedAddress ? (
                        <a
                          href={buildGoogleMapsHref(plan)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1.5 inline-flex items-center gap-1 text-[10px] font-semibold text-brand hover:underline"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <HugeIcon icon={MapsIcon} size={11} strokeWidth={2} aria-hidden />
                          Open in Maps
                        </a>
                      ) : null}
                      <div className="mt-3 flex flex-col gap-2 border-t border-zinc-100 pt-3">
                        <div className="flex flex-wrap gap-x-4 gap-y-1 text-[11px] font-medium text-zinc-500">
                          <span className="inline-flex items-center gap-1.5">
                            <HugeIcon icon={Clock03Icon} size={12} className="text-zinc-400" />
                            {plan.duration}
                          </span>
                          <span className="inline-flex items-center gap-1.5">
                            <HugeIcon icon={UserGroupIcon} size={12} className="text-zinc-400" />
                            {plan.groupLabel}
                          </span>
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                          <button
                            type="button"
                            onClick={() => setDetailPlan(getStoredAiPlan(plan.id) ?? plan)}
                            className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-center text-xs font-semibold text-zinc-900 transition hover:bg-zinc-50 sm:order-1 sm:w-auto"
                          >
                            View
                          </button>
                          {isMine ? (
                            <div className="flex w-full flex-col gap-2 sm:order-2 sm:w-auto sm:min-w-[200px]">
                              <Link
                                href={buildGoHref(
                                  plan,
                                  areaForLinks,
                                  radiusMiles,
                                  isMine ? getClaimKey() : null,
                                  baseOccasionId,
                                )}
                                className="block w-full shrink-0 rounded-lg bg-brand px-3 py-2.5 text-center text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-hover"
                              >
                                Your plan →
                              </Link>
                              <button
                                type="button"
                                onClick={() => setUnclaimOpen(true)}
                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50"
                              >
                                Release plan
                              </button>
                            </div>
                          ) : hasOtherClaim ? (
                            <div className="flex w-full flex-col gap-2 sm:order-2 sm:w-auto sm:min-w-[200px]">
                              <button
                                type="button"
                                disabled
                                className="w-full shrink-0 rounded-lg bg-zinc-100 px-3 py-2 text-center text-[11px] font-bold text-zinc-400"
                              >
                                Plan locked
                              </button>
                              <button
                                type="button"
                                onClick={() => setUnclaimOpen(true)}
                                className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50"
                              >
                                Release plan
                              </button>
                            </div>
                          ) : isClaimedByAnyone ? (
                            <button
                              type="button"
                              disabled
                              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-zinc-200 bg-zinc-100 px-3 py-2.5 text-xs font-bold text-zinc-500 sm:order-2 sm:w-auto"
                            >
                              <HugeIcon icon={CheckmarkCircle02Icon} size={12} />
                              Claimed
                            </button>
                          ) : (
                            <Link
                              href={buildClaimHref(
                                plan,
                                areaForLinks,
                                radiusMiles,
                                baseOccasionId,
                              )}
                              onClick={onClaimClick}
                              className="w-full shrink-0 rounded-lg bg-brand px-3 py-2.5 text-center text-xs font-bold text-white shadow-sm transition-all hover:bg-brand-hover sm:order-2 sm:w-auto"
                            >
                              Claim plan →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
          </div>
        </div>
      </section>
    </>
  );
}

function BrowsePlansSectionSkeleton() {
  return (
    <section className="scroll-mt-20 px-4 py-12 sm:px-6 lg:px-8" aria-hidden>
      <div className="mx-auto max-w-5xl animate-pulse space-y-6">
        <div className="h-24 rounded-2xl bg-zinc-100" />
        <div className="h-8 w-48 rounded bg-zinc-100" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="h-72 rounded-xl bg-zinc-100" />
          <div className="h-72 rounded-xl bg-zinc-100" />
          <div className="h-72 rounded-xl bg-zinc-100" />
        </div>
      </div>
    </section>
  );
}

export function BrowsePlansSection() {
  return (
    <Suspense fallback={<BrowsePlansSectionSkeleton />}>
      <BrowsePlansSectionInner />
    </Suspense>
  );
}

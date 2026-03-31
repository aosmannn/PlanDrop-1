"use client";

import { getSessionId } from "@/lib/session-id";
import { usePlanClaims } from "@/hooks/usePlanClaims";
import { CheckmarkCircle02Icon, MapsIcon, ZapIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getSupabaseBrowser } from "@/lib/supabase-browser";
import {
  canShowPlanMapPreview,
  PlanMapPreview,
} from "@/components/plan-map-preview";
import { PlanGoogleReviewsSection } from "@/components/plan-google-rating";
import { PlanImageGallery } from "@/components/plan-image-gallery";
import { SetupFlowStepper } from "@/components/setup-flow-stepper";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { HugeIcon } from "@/components/ui/huge-icon";
import { ClaimBanModal } from "@/components/claim-ban-modal";
import { MessageModal } from "@/components/message-modal";
import {
  buildPlansHref,
  getClaimedPlanId,
  getClaimKey,
  getStoredAiPlan,
  getStoredArea,
  getStoredRadiusMiles,
  isClaimBanned,
  mergeAiPlanIntoStorage,
  setClaimedPlanId,
  setStoredPlanOccasion,
  setStoredRadiusMiles,
} from "@/lib/claim-storage";
import { normalizeOccasionId } from "@/lib/plan-occasion";
import { parseRadiusMilesParam } from "@/lib/search-radius";
import { buildGoHref } from "@/lib/claim-links";
import { buildGoogleMapsHref } from "@/lib/maps-links";
import { activityBulletsForDisplay } from "@/lib/plan-display";
import { isPlanPoolExpired } from "@/lib/plan-pool-expiry";
import { planFromUrlPayload } from "@/lib/plan-snapshot";
import type { Plan } from "@/lib/plans-data";
import { getPlanById } from "@/lib/plans-data";

export function ClaimPlanClient({
  planId,
  staticPlan,
  areaFromQuery,
  snapshotFromQuery,
  zFromQuery,
}: {
  planId: string;
  staticPlan: Plan | null;
  areaFromQuery: string | null;
  snapshotFromQuery: string | null;
  zFromQuery: string | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [plan, setPlan] = useState<Plan | null>(staticPlan);
  const [resolved, setResolved] = useState(!!staticPlan);
  const [claiming, setClaiming] = useState(false);
  const [existingClaim, setExistingClaim] = useState<string | null>(null);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [notice, setNotice] = useState<{ title: string; body: string } | null>(
    null,
  );
  const [claimBlocked, setClaimBlocked] = useState(false);
  const [poolNow, setPoolNow] = useState(() => Date.now());

  const globalClaimed = usePlanClaims();
  const isClaimedByAnyone = plan ? globalClaimed.has(plan.id) : false;
  const poolExpired = plan ? isPlanPoolExpired(plan, poolNow) : false;

  useEffect(() => {
    setExistingClaim(getClaimedPlanId());
  }, []);

  useEffect(() => {
    const raw = searchParams.get("radius");
    if (raw != null && raw.trim() !== "") {
      setStoredRadiusMiles(parseRadiusMilesParam(raw));
    }
  }, [searchParams]);

  useEffect(() => {
    const o = searchParams.get("occasion");
    if (o) setStoredPlanOccasion(normalizeOccasionId(o));
  }, [searchParams]);

  useEffect(() => {
    const tick = () => setClaimBlocked(isClaimBanned());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setPoolNow(Date.now()), 5000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (staticPlan) {
      const stored = getStoredAiPlan(staticPlan.id);
      setPlan(stored ?? staticPlan);
      setResolved(true);
      return;
    }
    const fromPayload = planFromUrlPayload(snapshotFromQuery, zFromQuery);
    if (fromPayload && fromPayload.id === planId) {
      setPlan(fromPayload);
      mergeAiPlanIntoStorage(fromPayload);
      setResolved(true);
      return;
    }
    const stored = getStoredAiPlan(planId);
    if (stored) {
      setPlan(stored);
      setResolved(true);
      return;
    }
    setResolved(true);
  }, [planId, staticPlan, snapshotFromQuery, zFromQuery]);

  // Static plans (from the demo seed) don't go through /api/ai-plans enrichment.
  // If we don't yet have Google rating/reviews for them, fetch it once.
  useEffect(() => {
    if (!resolved || !plan) return;
    if (!staticPlan) return; // only when rendering a static demo plan

    const hasReviews = (plan.placeReviews?.length ?? 0) > 0;
    const hasRating =
      typeof plan.placeRating === "number" && Number.isFinite(plan.placeRating);
    if (hasReviews || hasRating) return;

    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/enrich-plan-reviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planIds: [plan.id] }),
        });
        if (!res.ok) return;
        const data = (await res.json().catch(() => ({}))) as {
          enrichments?: Record<string, Partial<Plan>>;
        };
        const fields = data?.enrichments?.[plan.id];
        if (!fields) return;
        const next = { ...plan, ...fields } as Plan;
        mergeAiPlanIntoStorage(next);
        if (!cancelled) setPlan(next);
      } catch (e) {
        console.error("static-review-enrich", e);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [resolved, plan, staticPlan]);


  const area = areaFromQuery ?? getStoredArea() ?? "Atlanta, GA";
  const radiusMiles = getStoredRadiusMiles();
  const plansBack = buildPlansHref(area, radiusMiles);

  const alreadyClaimedThis = existingClaim === planId;
  const alreadyClaimedOther =
    existingClaim != null && existingClaim !== planId;

  function showNotice(title: string, body: string) {
    setNotice({ title, body });
  }

  async function handleClaim() {
    if (!plan || isClaimedByAnyone || alreadyClaimedOther || alreadyClaimedThis) return;
    if (isPlanPoolExpired(plan, poolNow)) {
      showNotice(
        "This plan timed out",
        "This drop left the pool. Head back to browse for fresh plans in your area.",
      );
      return;
    }
    if (isClaimBanned()) {
      setBanModalOpen(true);
      return;
    }
    setClaiming(true);

    try {
      const supa = getSupabaseBrowser();
      const authed = await supa.auth.getUser().catch(() => ({ data: { user: null } }));
      const sessionId = authed?.data?.user?.id || getSessionId();
      if (!sessionId) {
        showNotice(
          "Storage blocked",
          "This browser blocked storage we need to lock a plan. Try a normal window or turn off private browsing, then refresh.",
        );
        return;
      }

      const res = await fetch("/api/claim-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id, sessionId }),
      });

      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        claimKey?: string;
      };

      if (!res.ok) {
        if (data.error === "already_have_claim") {
          showNotice(
            "You already have a plan locked",
            "Release your current plan before claiming a new one.",
          );
        } else if (data.error === "already_claimed") {
          showNotice(
            "Just claimed",
            "Someone else locked this plan a moment ago. Head back to browse and grab another drop.",
          );
        } else {
          const msg =
            typeof data.error === "string" && data.error.trim()
              ? data.error.trim()
              : "Couldn't lock this spot. Try again.";
          showNotice("Couldn’t claim this plan", msg);
        }
        return;
      }

      const claimKey =
        typeof data.claimKey === "string" && data.claimKey.trim()
          ? data.claimKey.trim()
          : null;

      if (!claimKey) {
        showNotice(
          "Claim didn’t save",
          "Something went wrong saving your lock. Refresh the page and try again.",
        );
        return;
      }

      setClaimedPlanId(plan.id, claimKey);
      mergeAiPlanIntoStorage(plan);
      router.push(buildGoHref(plan, area, radiusMiles, claimKey));
    } catch (e) {
      console.error("claim-plan", e);
      showNotice(
        "Connection issue",
        "Couldn’t reach the server. Check your connection and try again.",
      );
    } finally {
      setClaiming(false);
    }
  }

  if (!resolved) {
    return null;
  }

  if (!plan) {
    return (
      <>
        <SiteHeader />
        <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
          <div className="mx-auto max-w-lg text-center">
            <h1 className="font-display text-2xl font-bold text-zinc-900">
              Plan not found
            </h1>
            <p className="mt-3 text-zinc-600">
              Open this link from your browse session, or pick a plan again from
              the drop board.
            </p>
            <Link
              href={plansBack}
              className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
            >
              Back to browse
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  return (
    <>
      <ClaimBanModal open={banModalOpen} onClose={() => setBanModalOpen(false)} />
      <MessageModal
        open={notice != null}
        title={notice?.title ?? "Notice"}
        onClose={() => setNotice(null)}
      >
        {notice?.body ?? ""}
      </MessageModal>
      <SiteHeader />
      <SetupFlowStepper phase="claim" planId={plan.id} areaHint={area} />
      <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Nice pick
          </p>
          <h1 className="font-display mt-3 flex items-center gap-2 text-3xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-4xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <HugeIcon icon={ZapIcon} size={22} strokeWidth={1.5} />
            </span>
            Make it yours
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Photos, map, and the rundown below—then grab this slot for your crew.
            Claims update live, so only one group can lock it. In this demo your
            browser session holds the reservation.
          </p>

          {claimBlocked ? (
            <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              Claiming is paused for a few minutes after repeated
              claim-and-release. This keeps spots from being used just to browse
              venues. You can still view plans; try claiming again when the timer
              on the block screen ends.
            </div>
          ) : null}

          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <PlanImageGallery plan={plan} variant="hero" priority />
            <div className="space-y-4 p-5 sm:p-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  What you&apos;re claiming
                </p>
                <p
                  className={`mt-2 inline-block w-fit rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${plan.metaClass}`}
                >
                  {plan.meta.split("·")[0].trim()}
                </p>
                <h2 className="font-display mt-2 text-2xl font-bold text-zinc-900">
                  {plan.title}
                </h2>
                <p className="mt-2 text-zinc-600">{plan.tagline}</p>
              </div>
              <dl className="grid gap-3 border-t border-zinc-100 pt-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-zinc-800">Meet</dt>
                  <dd className="mt-0.5 text-zinc-600">{plan.stop}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-800">Duration</dt>
                  <dd className="mt-0.5 text-zinc-600">{plan.duration}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-800">Group size</dt>
                  <dd className="mt-0.5 text-zinc-600">{plan.groupLabel} people</dd>
                </div>
                <div>
                  <dt className="font-semibold text-zinc-800">About</dt>
                  <dd className="mt-0.5 text-zinc-600">{plan.price}</dd>
                </div>
                {plan.openingHoursLine ? (
                  <div className="sm:col-span-2">
                    <dt className="font-semibold text-zinc-800">Venue hours</dt>
                    <dd className="mt-0.5 text-zinc-600">{plan.openingHoursLine}</dd>
                  </div>
                ) : null}
              </dl>
              <PlanMapPreview plan={plan} className="mt-2" variant="go" />
              {!canShowPlanMapPreview(plan) &&
              (plan.formattedAddress || plan.mapsUrl || plan.placeLat != null) ? (
                <a
                  href={buildGoogleMapsHref(plan)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                >
                  <HugeIcon icon={MapsIcon} size={16} strokeWidth={2} aria-hidden />
                  Open in Google Maps
                </a>
              ) : null}
              {plan.formattedAddress ? (
                <p className="mt-2 text-sm text-zinc-600">{plan.formattedAddress}</p>
              ) : null}
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  What to expect
                </p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                  {activityBulletsForDisplay(plan).slice(0, 8).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
                <PlanGoogleReviewsSection plan={plan} className="mt-5" />
              </div>
            </div>
          </div>

          {poolExpired && !isClaimedByAnyone ? (
            <div className="mt-8 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-950">
              This drop timed out and left the pool.{" "}
              <Link href={plansBack} className="font-semibold underline">
                Browse fresh plans
              </Link>
            </div>
          ) : null}

          {(isClaimedByAnyone && !alreadyClaimedThis) ? (
            <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              This plan was just claimed by another group.{" "}
              <Link href={plansBack} className="font-semibold underline">
                Browse other plans
              </Link>
            </div>
          ) : null}

          {alreadyClaimedOther ? (
            <div className="mt-8 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-800">
              You already have a plan locked for this session.{" "}
              <Link
                href={(() => {
                  const p = getPlanById(existingClaim!) ?? getStoredAiPlan(existingClaim!);
                  return p
                    ? buildGoHref(p, area, radiusMiles, getClaimKey())
                    : `/go/${existingClaim}`;
                })()}
                className="font-semibold text-brand underline decoration-brand/30"
              >
                Open your plan
              </Link>{" "}
              or{" "}
              <Link href={plansBack} className="font-semibold underline">
                browse the drop
              </Link>
              .
            </div>
          ) : null}

          {!isClaimedByAnyone && !alreadyClaimedOther && !alreadyClaimedThis ? (
            <div className="mt-10 space-y-4">
              {poolExpired ? (
                <Link
                  href={plansBack}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition hover:bg-brand-hover"
                >
                  Browse fresh plans
                  <span aria-hidden>→</span>
                </Link>
              ) : (
                <button
                  type="button"
                  disabled={claiming || claimBlocked}
                  onClick={handleClaim}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition hover:bg-brand-hover disabled:opacity-70"
                >
                  {claiming ? (
                    "Locking…"
                  ) : (
                    <>
                      Lock this spot for my crew
                      <span aria-hidden>→</span>
                    </>
                  )}
                </button>
              )}
              <Link
                href={plansBack}
                className="block text-center text-sm font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
              >
                Back to browse
              </Link>
            </div>
          ) : null}

          {existingClaim === plan.id ? (
            <div className="mt-8 flex items-center gap-2 rounded-xl border border-brand/20 bg-brand-soft px-4 py-3 text-sm text-zinc-900">
              <HugeIcon icon={CheckmarkCircle02Icon} size={18} />
              You&apos;ve already locked this plan.{" "}
              <Link
                href={buildGoHref(plan, area, radiusMiles, getClaimKey())}
                className="font-semibold underline"
              >
                Crew briefing →
              </Link>
            </div>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

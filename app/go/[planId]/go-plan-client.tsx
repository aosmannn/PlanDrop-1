"use client";
import { getSessionId } from "@/lib/session-id";
import { Link01Icon, MapsIcon, PartyIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ClaimBanModal } from "@/components/claim-ban-modal";
import { MessageModal } from "@/components/message-modal";
import { UnclaimConfirmModal } from "@/components/unclaim-confirm-modal";
import {
  canShowPlanMapPreview,
  PlanMapPreview,
} from "@/components/plan-map-preview";
import { PlanImageGallery } from "@/components/plan-image-gallery";
import { SetupFlowStepper } from "@/components/setup-flow-stepper";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { HugeIcon } from "@/components/ui/huge-icon";
import {
  buildPlansHref,
  getClaimedPlanId,
  getStoredAiPlan,
  getStoredArea,
  getStoredRadiusMiles,
  mergeAiPlanIntoStorage,
  releaseClaim,
} from "@/lib/claim-storage";
import { buildGoogleMapsHref } from "@/lib/maps-links";
import { activityBulletsForDisplay } from "@/lib/plan-display";
import { planToSnapshot, snapshotToPlan } from "@/lib/plan-snapshot";
import type { Plan } from "@/lib/plans-data";

export function GoPlanClient({
  planId,
  staticPlan,
  areaHint,
  snapshotFromQuery,
}: {
  planId: string;
  staticPlan: Plan | null;
  areaHint: string | null;
  snapshotFromQuery: string | null;
}) {
  const router = useRouter();
  const [plan, setPlan] = useState<Plan | null>(staticPlan);
  const [resolved, setResolved] = useState(!!staticPlan);
  const [shareUrl, setShareUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [claimId, setClaimId] = useState<string | null>(null);
  const [banModalOpen, setBanModalOpen] = useState(false);
  const [unclaimOpen, setUnclaimOpen] = useState(false);
  const [strikeInfo, setStrikeInfo] = useState<{
    title: string;
    body: string;
  } | null>(null);
  const [postReleaseNav, setPostReleaseNav] = useState<string | null>(null);

  useEffect(() => {
    if (staticPlan) {
      setPlan(staticPlan);
      setResolved(true);
      return;
    }
    const fromSnap = snapshotFromQuery ? snapshotToPlan(snapshotFromQuery) : null;
    if (fromSnap && fromSnap.id === planId) {
      setPlan(fromSnap);
      mergeAiPlanIntoStorage(fromSnap);
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
  }, [planId, staticPlan, snapshotFromQuery]);

  useEffect(() => {
    if (!plan || typeof window === "undefined") return;
    const u = new URL(window.location.href);
    if (plan.id.startsWith("ai-")) {
      u.searchParams.set("snapshot", planToSnapshot(plan));
      if (areaHint?.trim()) u.searchParams.set("area", areaHint.trim());
    }
    setShareUrl(u.toString());
    setClaimId(getClaimedPlanId());
  }, [plan, areaHint]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
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
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="font-display text-2xl font-bold text-zinc-900">
              Plan not found
            </h1>
            <p className="mt-3 text-zinc-600">
              This briefing link may have expired. Browse the drop to pick a new
              plan.
            </p>
            <Link
              href="/plans"
              className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white"
            >
              Browse plans
            </Link>
          </div>
        </main>
        <SiteFooter />
      </>
    );
  }

  const isYours = claimId === plan.id;

  async function confirmRelease() {
    if (!plan) return;
    setUnclaimOpen(false);

    await fetch("/api/unclaim-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        planId: plan.id,
        sessionId: getSessionId(),
      }),
    });

    const r = releaseClaim();
    const area = areaHint?.trim() || getStoredArea() || "Atlanta, GA";
    const rad = getStoredRadiusMiles();
    if (r.banned) {
      setBanModalOpen(true);
      router.push(buildPlansHref(area, rad));
      return;
    }
    const back = buildPlansHref(area, rad);
    if (r.strikeAfter === 1) {
      setStrikeInfo({
        title: "Released",
        body: "Got it. Releasing too many times in a row can temporarily block new claims — we want real plans, not venue scouting.",
      });
      setPostReleaseNav(back);
      return;
    }
    if (r.strikeAfter === 2) {
      setStrikeInfo({
        title: "Heads up",
        body: "Second release this session. One more release and new claims pause for 5 minutes to stop repeat scouting.",
      });
      setPostReleaseNav(back);
      return;
    }
    router.push(back);
  }

  return (
    <>
      <ClaimBanModal open={banModalOpen} onClose={() => setBanModalOpen(false)} />
      <MessageModal
        open={strikeInfo != null}
        title={strikeInfo?.title ?? ""}
        onClose={() => {
          setStrikeInfo(null);
          if (postReleaseNav) {
            router.push(postReleaseNav);
            setPostReleaseNav(null);
          }
        }}
      >
        {strikeInfo?.body ?? ""}
      </MessageModal>
      <UnclaimConfirmModal
        open={unclaimOpen}
        onClose={() => setUnclaimOpen(false)}
        onConfirm={confirmRelease}
      />
      <SiteHeader />
      <SetupFlowStepper currentStep={4} planId={plan.id} areaHint={areaHint} />
      <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Step 4 of 4
          </p>
          <h1 className="font-display mt-3 flex items-center gap-2 text-3xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-4xl">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-soft text-brand">
              <HugeIcon icon={PartyIcon} size={22} strokeWidth={1.5} />
            </span>
            Just show up
          </h1>

          {!isYours ? (
            <p className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
              Preview mode: anyone with this link can see the briefing.{" "}
              <Link
                href={
                  plan.id.startsWith("ai-") && areaHint?.trim()
                    ? `/claim/${plan.id}?area=${encodeURIComponent(areaHint.trim())}&snapshot=${encodeURIComponent(planToSnapshot(plan))}`
                    : `/claim/${plan.id}`
                }
                className="font-semibold text-brand underline"
              >
                Claim it first
              </Link>{" "}
              to lock it for your group in the demo.
            </p>
          ) : null}

          <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
            <PlanImageGallery plan={plan} variant="hero" priority />
            <div className="space-y-4 p-5 sm:p-8">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Your plan
                </p>
                <h2 className="font-display mt-1 text-2xl font-bold text-zinc-900">
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
              <PlanMapPreview plan={plan} className="mt-4" variant="go" />
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
                  {activityBulletsForDisplay(plan).slice(0, 6).map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {isYours ? (
            <div className="mt-8 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <p className="text-sm font-semibold text-zinc-900">
                Change your mind?
              </p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">
                Releasing frees your lock so someone else can claim this spot.
                Repeated claim-and-release can pause your ability to claim
                briefly.
              </p>
              <button
                type="button"
                onClick={() => setUnclaimOpen(true)}
                className="mt-4 w-full rounded-xl border border-zinc-300 bg-white py-3 text-sm font-bold text-zinc-800 transition hover:bg-zinc-50 sm:w-auto sm:px-6"
              >
                Release this plan
              </button>
            </div>
          ) : null}

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50 p-5">
            <p className="text-sm font-semibold text-zinc-900">
              Share with your crew
            </p>
            <p className="mt-1 text-xs text-zinc-600">
              Copy this link into your group chat — it includes everything needed
              to view this plan, even on another device.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="min-w-0 flex-1 truncate rounded-lg border border-zinc-200 bg-white px-3 py-2.5 font-mono text-xs text-zinc-700">
                {shareUrl || "…"}
              </div>
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
              >
                <HugeIcon icon={Link01Icon} size={16} />
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-sm text-zinc-500">
            <Link href="/plans" className="font-semibold text-brand underline">
              Browse more plans
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

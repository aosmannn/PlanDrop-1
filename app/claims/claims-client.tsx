"use client";

import { CheckmarkCircle02Icon, Clock03Icon, MapsIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  canShowPlanMapPreview,
  PlanMapPreview,
} from "@/components/plan-map-preview";
import { PlanImageGallery } from "@/components/plan-image-gallery";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { HugeIcon } from "@/components/ui/huge-icon";
import { useClaimedPlanId } from "@/hooks/use-claimed-plan-id";
import { buildGoHref } from "@/lib/claim-links";
import {
  buildPlansHref,
  getClaimKey,
  getClaimMeta,
  getPastClaims,
  getStoredAiPlan,
  getStoredArea,
  getStoredRadiusMiles,
  type PastClaimRecord,
} from "@/lib/claim-storage";
import { buildGoogleMapsHref } from "@/lib/maps-links";
import { activityBulletsForDisplay } from "@/lib/plan-display";
import { formatPoolTimeRemaining, isPlanPoolExpired } from "@/lib/plan-pool-expiry";
import { snapshotToPlan } from "@/lib/plan-snapshot";
import type { Plan } from "@/lib/plans-data";
import { getPlanById } from "@/lib/plans-data";

type TabId = "itinerary" | "past" | "dashboard";

function resolvePlan(planId: string | null): Plan | null {
  if (!planId) return null;
  return getPlanById(planId) ?? getStoredAiPlan(planId) ?? null;
}

function formatWhen(ms: number): string {
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(ms));
  } catch {
    return new Date(ms).toLocaleString();
  }
}

export function ClaimsClient() {
  const pathname = usePathname();
  const claimedId = useClaimedPlanId();
  const area = getStoredArea() ?? "Atlanta, GA";
  const radiusMiles = getStoredRadiusMiles();
  const plansBack = buildPlansHref(area, radiusMiles);

  const [tab, setTab] = useState<TabId>("itinerary");
  const [poolNow, setPoolNow] = useState(() => Date.now());
  const [past, setPast] = useState<PastClaimRecord[]>(() => getPastClaims());
  const [claimMeta, setClaimMeta] = useState<{
    planId: string;
    claimedAtMs: number;
  } | null>(null);

  const currentPlan = useMemo(() => resolvePlan(claimedId), [claimedId]);

  useEffect(() => {
    const id = window.setInterval(() => setPoolNow(Date.now()), 5000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const sync = () => setPast(getPastClaims());
    sync();
    window.addEventListener("plandrop-past-claims-change", sync);
    window.addEventListener("plandrop-claim-change", sync);
    return () => {
      window.removeEventListener("plandrop-past-claims-change", sync);
      window.removeEventListener("plandrop-claim-change", sync);
    };
  }, [pathname]);

  useEffect(() => {
    setClaimMeta(getClaimMeta());
  }, [claimedId, pathname]);
  const poolLeft = currentPlan
    ? formatPoolTimeRemaining(currentPlan.poolExpiresAt, poolNow)
    : null;
  const poolExpired = currentPlan
    ? isPlanPoolExpired(currentPlan, poolNow)
    : false;

  const tabs: { id: TabId; label: string }[] = [
    { id: "itinerary", label: "Itinerary" },
    { id: "past", label: "Past claims" },
    { id: "dashboard", label: "Dashboard" },
  ];

  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-20 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Your session
          </p>
          <h1 className="font-display mt-2 text-3xl font-bold tracking-[-0.02em] text-zinc-900 sm:text-4xl">
            Your claims
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-600 sm:text-base">
            Everything you&apos;ve locked in this browser—active hold, pool timer, and
            history when you release a plan.
          </p>

          <div
            role="tablist"
            aria-label="Claims sections"
            className="mt-8 flex flex-wrap gap-2 border-b border-zinc-200 pb-3"
          >
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={tab === t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                  tab === t.id
                    ? "bg-zinc-900 text-white shadow-sm"
                    : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "itinerary" ? (
            <section className="mt-8 space-y-6" aria-labelledby="claims-itinerary-heading">
              <h2 id="claims-itinerary-heading" className="sr-only">
                Current itinerary
              </h2>
              {!currentPlan ? (
                <div className="rounded-2xl border border-dashed border-zinc-200 bg-zinc-50 px-5 py-10 text-center">
                  <p className="text-sm font-medium text-zinc-800">
                    No plan locked in this session yet.
                  </p>
                  <p className="mt-2 text-sm text-zinc-600">
                    Browse live drops and claim one to see the full briefing here.
                  </p>
                  <Link
                    href={plansBack}
                    className="mt-6 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-hover"
                  >
                    Browse plans
                  </Link>
                </div>
              ) : (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                        Active claim
                      </p>
                      <p className="mt-1 font-display text-lg font-bold text-zinc-900">
                        {currentPlan.title}
                      </p>
                      {claimMeta && claimMeta.planId === currentPlan.id ? (
                        <p className="mt-1 text-xs text-zinc-500">
                          Locked {formatWhen(claimMeta.claimedAtMs)}
                        </p>
                      ) : null}
                    </div>
                    <div className="flex flex-col items-end gap-1 text-right">
                      {currentPlan.poolExpiresAt ? (
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold tabular-nums ${
                            poolExpired
                              ? "border-red-200 bg-red-50 text-red-900"
                              : "border-brand/25 bg-brand-soft text-brand"
                          }`}
                        >
                          <HugeIcon icon={Clock03Icon} size={14} strokeWidth={2} />
                          {poolExpired
                            ? "Pool window ended"
                            : poolLeft
                              ? `${poolLeft} left in pool`
                              : "Pool"}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-zinc-500">
                          Curated spot (no pool timer)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
                    <PlanImageGallery plan={currentPlan} variant="hero" />
                    <div className="space-y-4 p-5 sm:p-8">
                      <div>
                        <p
                          className={`inline-block w-fit rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${currentPlan.metaClass}`}
                        >
                          {currentPlan.meta.split("·")[0].trim()}
                        </p>
                        <p className="mt-2 text-zinc-600">{currentPlan.tagline}</p>
                      </div>
                      <dl className="grid gap-3 border-t border-zinc-100 pt-4 text-sm sm:grid-cols-2">
                        <div>
                          <dt className="font-semibold text-zinc-800">Meet</dt>
                          <dd className="mt-0.5 text-zinc-600">{currentPlan.stop}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-zinc-800">Duration</dt>
                          <dd className="mt-0.5 text-zinc-600">{currentPlan.duration}</dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-zinc-800">Group size</dt>
                          <dd className="mt-0.5 text-zinc-600">
                            {currentPlan.groupLabel} people
                          </dd>
                        </div>
                        <div>
                          <dt className="font-semibold text-zinc-800">About</dt>
                          <dd className="mt-0.5 text-zinc-600">{currentPlan.price}</dd>
                        </div>
                      </dl>
                      <PlanMapPreview plan={currentPlan} className="mt-2" variant="go" />
                      {!canShowPlanMapPreview(currentPlan) &&
                      (currentPlan.formattedAddress ||
                        currentPlan.mapsUrl ||
                        currentPlan.placeLat != null) ? (
                        <a
                          href={buildGoogleMapsHref(currentPlan)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
                        >
                          <HugeIcon icon={MapsIcon} size={16} strokeWidth={2} aria-hidden />
                          Open in Google Maps
                        </a>
                      ) : null}
                      {currentPlan.formattedAddress ? (
                        <p className="text-sm text-zinc-600">{currentPlan.formattedAddress}</p>
                      ) : null}
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                          What to expect
                        </p>
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-zinc-600">
                          {activityBulletsForDisplay(currentPlan)
                            .slice(0, 8)
                            .map((line) => (
                              <li key={line}>{line}</li>
                            ))}
                        </ul>
                      </div>
                      <Link
                        href={buildGoHref(currentPlan, area, radiusMiles, getClaimKey())}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand/20 transition hover:bg-brand-hover"
                      >
                        Open crew briefing
                        <span aria-hidden>→</span>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </section>
          ) : null}

          {tab === "past" ? (
            <section className="mt-8 space-y-4" aria-labelledby="claims-past-heading">
              <h2 id="claims-past-heading" className="font-display text-xl font-bold text-zinc-900">
                Past claims
              </h2>
              {past.length === 0 ? (
                <p className="rounded-xl border border-dashed border-zinc-200 bg-zinc-50 px-4 py-8 text-center text-sm text-zinc-600">
                  When you release a plan from browse or your briefing, it shows up here
                  with the snapshot from that moment.
                </p>
              ) : (
                <ul className="space-y-4">
                  {past.map((entry) => {
                    const p = snapshotToPlan(entry.snapshot);
                    return (
                      <li
                        key={`${entry.planId}-${entry.releasedAtMs}`}
                        className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                      >
                        {p ? (
                          <>
                            <p className="font-semibold text-zinc-900">{p.title}</p>
                            <p className="mt-1 text-xs text-zinc-500">
                              Claimed {formatWhen(entry.claimedAtMs)} · Released{" "}
                              {formatWhen(entry.releasedAtMs)}
                              {entry.area ? ` · ${entry.area}` : ""}
                            </p>
                            <p className="mt-2 line-clamp-2 text-sm text-zinc-600">
                              {p.stop}
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-zinc-600">
                            Plan {entry.planId} (snapshot could not be loaded)
                          </p>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </section>
          ) : null}

          {tab === "dashboard" ? (
            <section className="mt-8 space-y-8" aria-labelledby="claims-dash-heading">
              <h2 id="claims-dash-heading" className="font-display text-xl font-bold text-zinc-900">
                Dashboard
              </h2>

              <div className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                  Current hold
                </p>
                {!currentPlan ? (
                  <p className="mt-3 text-sm text-zinc-600">Nothing active right now.</p>
                ) : (
                  <>
                    <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
                          <HugeIcon icon={CheckmarkCircle02Icon} size={22} strokeWidth={1.5} />
                        </span>
                        <div className="min-w-0">
                          <p className="font-display text-lg font-bold leading-snug text-zinc-900">
                            {currentPlan.title}
                          </p>
                          <p className="mt-1 text-sm text-zinc-600">{currentPlan.stop}</p>
                        </div>
                      </div>
                      {poolLeft && !poolExpired ? (
                        <span className="shrink-0 rounded-full bg-brand-soft px-3 py-1 text-xs font-bold tabular-nums text-brand ring-1 ring-brand/20">
                          {poolLeft} in pool
                        </span>
                      ) : null}
                    </div>
                    <PlanMapPreview plan={currentPlan} className="mt-4" variant="go" />
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Link
                        href={buildGoHref(currentPlan, area, radiusMiles, getClaimKey())}
                        className="inline-flex rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white transition hover:bg-brand-hover"
                      >
                        Briefing
                      </Link>
                      <Link
                        href={plansBack}
                        className="inline-flex rounded-full border border-zinc-200 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
                      >
                        Browse more
                      </Link>
                    </div>
                  </>
                )}
              </div>

              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                    Past claims
                  </p>
                  <span className="text-xs font-semibold tabular-nums text-zinc-600">
                    {past.length} saved
                  </span>
                </div>
                {past.length === 0 ? (
                  <p className="mt-3 text-sm text-zinc-600">
                    Releases you make this session are listed here for quick reference.
                  </p>
                ) : (
                  <ul className="mt-4 space-y-3">
                    {past.slice(0, 6).map((entry) => {
                      const p = snapshotToPlan(entry.snapshot);
                      return (
                        <li
                          key={`dash-${entry.planId}-${entry.releasedAtMs}`}
                          className="rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm"
                        >
                          <span className="font-medium text-zinc-900">
                            {p?.title ?? entry.planId}
                          </span>
                          <span className="mt-0.5 block text-xs text-zinc-500">
                            Released {formatWhen(entry.releasedAtMs)}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                )}
                {past.length > 6 ? (
                  <button
                    type="button"
                    onClick={() => setTab("past")}
                    className="mt-3 text-sm font-semibold text-brand underline decoration-brand/30 underline-offset-2"
                  >
                    View all past claims
                  </button>
                ) : null}
              </div>
            </section>
          ) : null}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

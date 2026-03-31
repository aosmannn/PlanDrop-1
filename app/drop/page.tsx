"use client";

import { Location01Icon, MapsIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { SetupFlowStepper } from "@/components/setup-flow-stepper";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { HugeIcon } from "@/components/ui/huge-icon";
import {
  buildPlansHref,
  clearSkipDropFromLocation,
  getSkipDropFromLocation,
  getStoredArea,
  getStoredRadiusMiles,
  setStoredArea,
  setStoredPin,
  type StoredPin,
} from "@/lib/claim-storage";
import {
  distanceMeters,
  getCurrentPosition,
  isGeolocationSupported,
  positionErrorMessage,
  watchPosition,
} from "@/lib/geolocation-client";

const DEFAULT_AREA = "Atlanta, GA";

const GEOCODE_MIN_INTERVAL_MS = 3500;
const MIN_MOVE_M = 75;

async function reverseGeocodeLabel(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `/api/reverse-geocode?lat=${encodeURIComponent(String(lat))}&lon=${encodeURIComponent(String(lng))}`,
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as { error?: string }).error ?? "Could not resolve address");
  }
  const data = (await res.json()) as { label: string };
  return data.label;
}

function DropPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [area, setArea] = useState(DEFAULT_AREA);
  const [locStatus, setLocStatus] = useState<
    "idle" | "loading" | "live" | "error"
  >("idle");
  const [locMessage, setLocMessage] = useState<string | null>(null);
  const [accuracyM, setAccuracyM] = useState<number | null>(null);
  const [tracking, setTracking] = useState(false);

  const lastGeocodeAt = useRef(0);
  const lastGeocoded = useRef<{ lat: number; lng: number } | null>(null);
  const stopWatchRef = useRef<(() => void) | null>(null);

  const applyPosition = useCallback(
    async (pos: GeolocationPosition, forceGeocode: boolean) => {
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      setAccuracyM(Number.isFinite(accuracy) ? accuracy : null);

      const pin: StoredPin = {
        lat,
        lng,
        accuracyM: Number.isFinite(accuracy) ? accuracy : undefined,
        at: Date.now(),
      };
      setStoredPin(pin);

      const now = Date.now();
      const prev = lastGeocoded.current;
      const moved =
        !prev || distanceMeters(prev, { lat, lng }) >= MIN_MOVE_M;
      const cooled =
        lastGeocodeAt.current === 0 ||
        now - lastGeocodeAt.current >= GEOCODE_MIN_INTERVAL_MS;

      if (!forceGeocode && !(moved && cooled)) {
        return;
      }

      lastGeocodeAt.current = now;
      lastGeocoded.current = { lat, lng };

      try {
        const label = await reverseGeocodeLabel(lat, lng);
        setArea(label);
        setStoredArea(label);
        setLocStatus("live");
        setLocMessage(null);
      } catch (e) {
        const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setArea(fallback);
        setStoredArea(fallback);
        setLocStatus("live");
        setLocMessage(
          e instanceof Error ? e.message : "Using coordinates as the label.",
        );
      }
    },
    [],
  );

  async function fetchLiveLocationOnce() {
    setLocStatus("loading");
    setLocMessage(null);
    try {
      const pos = await getCurrentPosition();
      await applyPosition(pos, true);
    } catch (e) {
      setLocStatus("error");
      const code =
        e && typeof e === "object" && "code" in e
          ? Number((e as GeolocationPositionError).code)
          : 0;
      setLocMessage(positionErrorMessage(code));
    }
  }

  useEffect(() => {
    if (searchParams.get("edit") === "1") {
      clearSkipDropFromLocation();
      return;
    }
    const stored = getStoredArea();
    if (getSkipDropFromLocation() && stored) {
      clearSkipDropFromLocation();
      router.replace(buildPlansHref(stored, getStoredRadiusMiles()));
    }
  }, [router, searchParams]);

  useEffect(() => {
    if (!tracking || !isGeolocationSupported()) {
      stopWatchRef.current?.();
      stopWatchRef.current = null;
      return;
    }

    const stop = watchPosition(
      (pos) => {
        void applyPosition(pos, false);
      },
      (err) => {
        setLocStatus("error");
        setLocMessage(positionErrorMessage(err.code));
        setTracking(false);
      },
    );
    stopWatchRef.current = stop;
    return () => {
      stop();
      stopWatchRef.current = null;
    };
  }, [tracking, applyPosition]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = area.trim() || DEFAULT_AREA;
    setStoredArea(trimmed);
    router.push(buildPlansHref(trimmed, getStoredRadiusMiles()));
  }

  return (
    <>
      <SiteHeader />
      <SetupFlowStepper phase="discover" />
      <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-lg">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Discover
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold leading-snug tracking-[-0.02em] text-zinc-900 sm:text-4xl">
            Drop a pin
          </h1>
          <p className="mt-4 text-base leading-relaxed text-zinc-600">
            Use live GPS for your exact spot, or type a city or neighborhood.
            Plans stay tailored to your area.
          </p>

          <div className="mt-8 rounded-2xl border border-zinc-200 bg-zinc-50/80 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Real-time location
            </p>
            <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => void fetchLiveLocationOnce()}
                disabled={locStatus === "loading" || !isGeolocationSupported()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-bold text-zinc-900 shadow-sm transition hover:border-brand/40 hover:bg-brand-soft/30 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <HugeIcon icon={MapsIcon} size={18} strokeWidth={1.5} />
                {locStatus === "loading" ? "Getting location…" : "Use my live location"}
              </button>
            </div>
            {isGeolocationSupported() ? (
              <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-lg px-1 py-1">
                <input
                  type="checkbox"
                  className="mt-1 h-4 w-4 rounded border-zinc-300 text-brand focus:ring-brand"
                  checked={tracking}
                  onChange={(e) => setTracking(e.target.checked)}
                />
                <span className="text-sm leading-snug text-zinc-600">
                  <span className="font-semibold text-zinc-800">
                    Keep updating as I move
                  </span>{" "}
                  — refreshes the pin when you move about{" "}
                  {MIN_MOVE_M}m+ (throttled for accuracy and fair API use).
                </span>
              </label>
            ) : (
              <p className="mt-3 text-xs text-amber-800">
                This browser doesn&apos;t expose GPS. Enter an area manually
                below.
              </p>
            )}
            {locStatus === "live" && accuracyM != null ? (
              <p className="mt-3 text-xs text-zinc-500">
                Last fix: ~{Math.round(accuracyM)}m accuracy
                {tracking ? " · tracking on" : ""}
              </p>
            ) : null}
            {locMessage ? (
              <p className="mt-3 text-sm text-amber-800">{locMessage}</p>
            ) : null}
          </div>

          <form onSubmit={onSubmit} className="mt-10 space-y-6">
            <div>
              <label
                htmlFor="area"
                className="block text-sm font-semibold text-zinc-800"
              >
                City or neighborhood
              </label>
              <div className="relative mt-2">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
                  <HugeIcon icon={Location01Icon} size={18} strokeWidth={1.5} />
                </span>
                <input
                  id="area"
                  name="area"
                  type="text"
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  autoComplete="address-level2"
                  placeholder="e.g. Midtown, Atlanta"
                  className="w-full rounded-xl border border-zinc-200 bg-white py-3 pl-11 pr-4 text-base text-zinc-900 shadow-sm ring-brand/0 transition placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <p className="mt-2 text-xs text-zinc-500">
                Demo plan stops are in the Atlanta area; your pin still drives
                labels and the URL.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition hover:bg-brand-hover sm:w-auto"
              >
                Continue to plans
                <span aria-hidden>→</span>
              </button>
              <Link
                href="/plans"
                className="text-center text-sm font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
              >
                Skip to browse (Atlanta)
              </Link>
            </div>
          </form>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

function DropPageFallback() {
  return (
    <>
      <SiteHeader />
      <SetupFlowStepper phase="discover" />
      <main className="px-4 pb-16 pt-8 sm:px-6 sm:pb-24 sm:pt-12 lg:px-8">
        <div className="mx-auto max-w-lg">
          <p className="text-sm text-zinc-500">Loading…</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

export default function DropPage() {
  return (
    <Suspense fallback={<DropPageFallback />}>
      <DropPageInner />
    </Suspense>
  );
}

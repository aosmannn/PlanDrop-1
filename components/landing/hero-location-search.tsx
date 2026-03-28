"use client";

import {
  ArrowDown01Icon,
  Location01Icon,
  MapsIcon,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  buildPlansHref,
  getStoredRadiusMiles,
  setSkipDropFromLocation,
  setStoredArea,
  setStoredPin,
  setStoredRadiusMiles,
  type StoredPin,
} from "@/lib/claim-storage";
import {
  clampRadiusMiles,
  DEFAULT_RADIUS_MILES,
} from "@/lib/search-radius";
import {
  getCurrentPosition,
  isGeolocationSupported,
  positionErrorMessage,
} from "@/lib/geolocation-client";
import { LocationSuggestPanel } from "@/components/location-suggest-panel";
import { HugeIcon } from "@/components/ui/huge-icon";

const RADIUS_OPTIONS_MI = [5, 10, 15, 25, 30] as const;

type PlacePrediction = {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
};

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

function newSessionToken(): string {
  if (typeof globalThis !== "undefined" && globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }
  return `sess-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function HeroLocationSearch() {
  const router = useRouter();
  const listId = useId();
  const sessionRef = useRef(newSessionToken());
  const wrapRef = useRef<HTMLDivElement>(null);
  const radiusPopoverRef = useRef<HTMLDivElement>(null);
  const radiusListId = useId();

  const [zip, setZip] = useState("");
  const [radiusMiles, setRadiusMiles] = useState(DEFAULT_RADIUS_MILES);
  const [radiusMenuOpen, setRadiusMenuOpen] = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<PlacePrediction[]>([]);
  const [suggestPhase, setSuggestPhase] = useState<
    "idle" | "loading" | "results" | "empty" | "error"
  >("idle");
  const [panelDismissed, setPanelDismissed] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [fetchingSuggestions, setFetchingSuggestions] = useState(false);

  useEffect(() => {
    setRadiusMiles(getStoredRadiusMiles());
  }, []);

  const goToPlans = useCallback(
    (area: string) => {
      const trimmed = area.trim();
      if (!trimmed) {
        setError("Enter a city, ZIP code, or use your current location.");
        return;
      }
      setRadiusMenuOpen(false);
      setSkipDropFromLocation();
      setStoredArea(trimmed);
      setStoredRadiusMiles(radiusMiles);
      router.push(buildPlansHref(trimmed, radiusMiles));
    },
    [router, radiusMiles],
  );

  const pickSuggestion = useCallback(
    (p: PlacePrediction) => {
      const label = p.description.trim();
      setSuggestions([]);
      setSuggestPhase("idle");
      setPanelDismissed(true);
      setActiveIdx(-1);
      sessionRef.current = newSessionToken();
      setZip(label);
      setError(null);
      goToPlans(label);
    },
    [goToPlans],
  );

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuggestions([]);
    setSuggestPhase("idle");
    setPanelDismissed(true);
    sessionRef.current = newSessionToken();
    goToPlans(zip);
  }

  async function requestDeviceLocation() {
    if (!isGeolocationSupported()) {
      setError(
        "Location isn’t available in this browser. Enter a city or ZIP instead.",
      );
      return;
    }
    setError(null);
    setLocLoading(true);
    try {
      setSkipDropFromLocation();
      const pos = await getCurrentPosition();
      const { latitude: lat, longitude: lng, accuracy } = pos.coords;
      const pin: StoredPin = {
        lat,
        lng,
        accuracyM: Number.isFinite(accuracy) ? accuracy : undefined,
        at: Date.now(),
      };
      setStoredPin(pin);

      try {
        const label = await reverseGeocodeLabel(lat, lng);
        setStoredArea(label);
        setZip(label);
        setStoredRadiusMiles(radiusMiles);
        router.push(buildPlansHref(label, radiusMiles));
      } catch {
        const fallback = `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
        setStoredArea(fallback);
        setZip(fallback);
        setStoredRadiusMiles(radiusMiles);
        router.push(buildPlansHref(fallback, radiusMiles));
      }
    } catch (e) {
      const code =
        e && typeof e === "object" && "code" in e
          ? Number((e as GeolocationPositionError).code)
          : 0;
      setError(positionErrorMessage(code));
    } finally {
      setLocLoading(false);
    }
  }

  useEffect(() => {
    const q = zip.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setSuggestPhase("idle");
      setActiveIdx(-1);
      setPanelDismissed(false);
      return;
    }

    setPanelDismissed(false);

    const ac = new AbortController();
    const timer = window.setTimeout(async () => {
      setFetchingSuggestions(true);
      setSuggestPhase("loading");
      try {
        const st = sessionRef.current;
        const url = `/api/places-autocomplete?input=${encodeURIComponent(q)}&sessiontoken=${encodeURIComponent(st)}`;
        const res = await fetch(url, { signal: ac.signal });
        if (ac.signal.aborted) return;
        if (!res.ok) {
          setSuggestions([]);
          setSuggestPhase("error");
          return;
        }
        const data = (await res.json()) as { predictions?: PlacePrediction[] };
        const next = data.predictions ?? [];
        setSuggestions(next);
        setSuggestPhase(next.length > 0 ? "results" : "empty");
        setActiveIdx(-1);
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        setSuggestions([]);
        setSuggestPhase("error");
      } finally {
        if (!ac.signal.aborted) setFetchingSuggestions(false);
      }
    }, 260);

    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [zip]);

  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      const el = wrapRef.current;
      if (!el?.contains(e.target as Node)) {
        setPanelDismissed(true);
        setActiveIdx(-1);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => {
    if (!radiusMenuOpen) return;
    function onDocMouseDown(e: MouseEvent) {
      if (!radiusPopoverRef.current?.contains(e.target as Node)) {
        setRadiusMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [radiusMenuOpen]);

  const suggestPanelOpen =
    zip.trim().length >= 2 &&
    !panelDismissed &&
    suggestPhase !== "idle";

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!suggestPanelOpen || suggestions.length === 0) return;

    if (e.key === "Escape") {
      e.preventDefault();
      setPanelDismissed(true);
      setActiveIdx(-1);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => (i + 1) % suggestions.length);
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
      return;
    }
    if (e.key === "Enter" && activeIdx >= 0 && activeIdx < suggestions.length) {
      e.preventDefault();
      pickSuggestion(suggestions[activeIdx]!);
    }
  }

  return (
    <div className="mx-auto mt-8 w-full min-w-0 max-w-xl sm:mt-10">
      <div ref={wrapRef} className="relative min-w-0">
        <form
          onSubmit={onSubmit}
          className="min-w-0 max-w-full rounded-xl border border-zinc-200/80 bg-white p-1.5 shadow-md shadow-zinc-200/40 ring-1 ring-zinc-100/90"
          role="search"
          aria-label="Find plans by location"
        >
          <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-stretch sm:gap-0">
            <label className="group flex min-h-[42px] min-w-0 flex-1 basis-0 cursor-text items-center gap-2.5 rounded-lg px-2.5 py-1.5 transition hover:bg-zinc-50/80 sm:min-h-[44px] sm:px-3">
              <span className="text-zinc-400" aria-hidden>
                <HugeIcon icon={Location01Icon} size={18} strokeWidth={1.5} />
              </span>
              <span className="sr-only">City or ZIP code</span>
              <input
                type="text"
                name="zip"
                role="combobox"
                autoComplete="off"
                placeholder="City or ZIP code"
                value={zip}
                onChange={(e) => {
                  setZip(e.target.value);
                  setError(null);
                }}
                onKeyDown={onInputKeyDown}
                onFocus={() => {
                  setPanelDismissed(false);
                }}
                aria-expanded={suggestPanelOpen}
                aria-controls={listId}
                aria-autocomplete="list"
                aria-busy={fetchingSuggestions}
                className="min-w-0 flex-1 border-0 bg-transparent py-1.5 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:ring-0 sm:text-[15px]"
              />
            </label>

            <div className="hidden h-7 w-px shrink-0 self-center bg-zinc-200/90 sm:block" aria-hidden />

            <div className="flex min-w-0 w-full flex-wrap items-stretch gap-1.5 sm:w-auto sm:max-w-full sm:flex-nowrap sm:shrink-0 sm:pl-1">
              <div ref={radiusPopoverRef} className="relative min-w-0 flex-1 sm:w-[4.85rem] sm:flex-none sm:shrink-0">
                <button
                  type="button"
                  onClick={() => setRadiusMenuOpen((o) => !o)}
                  aria-expanded={radiusMenuOpen}
                  aria-controls={radiusListId}
                  aria-haspopup="listbox"
                  className="inline-flex h-full min-h-[40px] w-full items-center justify-center gap-1 rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-2 text-xs font-semibold text-zinc-800 transition hover:border-brand/25 hover:bg-brand-soft/40 hover:text-zinc-900 sm:w-full sm:px-2.5 sm:text-[13px]"
                >
                  <span className="tabular-nums">{radiusMiles}</span>
                  <span className="text-zinc-500">mi</span>
                  <HugeIcon
                    icon={ArrowDown01Icon}
                    size={14}
                    strokeWidth={2}
                    className={`shrink-0 text-zinc-400 transition ${radiusMenuOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
                {radiusMenuOpen ? (
                  <ul
                    id={radiusListId}
                    role="listbox"
                    aria-label="Search radius in miles"
                    className="absolute left-0 top-[calc(100%+4px)] z-40 min-w-[8.5rem] overflow-hidden rounded-lg border border-zinc-200 bg-white py-1 shadow-lg shadow-zinc-200/50 ring-1 ring-zinc-100/90 sm:left-auto sm:right-0"
                  >
                    {RADIUS_OPTIONS_MI.map((mi) => {
                      const selected = radiusMiles === mi;
                      return (
                        <li key={mi} role="presentation">
                          <button
                            type="button"
                            role="option"
                            aria-selected={selected}
                            onClick={() => {
                              const r = clampRadiusMiles(mi);
                              setRadiusMiles(r);
                              setStoredRadiusMiles(r);
                              setRadiusMenuOpen(false);
                            }}
                            className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm font-semibold transition hover:bg-zinc-50 ${
                              selected ? "bg-brand-soft/60 text-brand" : "text-zinc-800"
                            }`}
                          >
                            <span className="tabular-nums">{mi} miles</span>
                            {selected ? (
                              <span className="text-xs font-bold text-brand">✓</span>
                            ) : null}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => void requestDeviceLocation()}
                disabled={locLoading}
                aria-busy={locLoading}
                className="inline-flex min-h-[40px] min-w-0 flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-200/90 bg-zinc-50/90 px-2.5 text-xs font-semibold text-zinc-700 transition hover:border-brand/25 hover:bg-brand-soft/50 hover:text-zinc-900 disabled:cursor-not-allowed disabled:opacity-60 sm:min-h-[40px] sm:min-w-0 sm:max-w-[11rem] sm:flex-1 sm:px-3 sm:text-[13px]"
              >
                <HugeIcon icon={MapsIcon} size={16} strokeWidth={1.5} aria-hidden />
                <span className="truncate">
                  {locLoading ? "Locating…" : "Use my location"}
                </span>
              </button>
              <button
                type="submit"
                className="inline-flex min-h-[40px] shrink-0 items-center justify-center rounded-lg bg-brand px-3.5 text-xs font-bold text-white shadow-sm shadow-brand/20 transition hover:bg-brand-hover sm:min-h-[40px] sm:min-w-[5rem] sm:px-4 sm:text-[13px]"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        <LocationSuggestPanel
          id={listId}
          open={suggestPanelOpen}
          loading={suggestPhase === "loading"}
          empty={suggestPhase === "empty"}
          error={suggestPhase === "error"}
          suggestions={suggestions}
          activeIndex={activeIdx}
          onSelect={pickSuggestion}
          onHighlight={setActiveIdx}
        />
      </div>

      {error ? (
        <p className="mt-3 text-center text-sm font-medium text-amber-800" role="alert">
          {error}
        </p>
      ) : (
        <p className="mt-3 text-center text-sm text-zinc-500">
          We’ll show plans near you — no account needed.
        </p>
      )}

      <p className="mt-4 text-center text-sm text-zinc-500">
        <Link
          href="/drop?edit=1"
          className="font-semibold text-brand underline decoration-brand/30 underline-offset-4 hover:decoration-brand"
        >
          Full setup
        </Link>{" "}
        <span className="text-zinc-400">·</span>{" "}
        <Link
          href="/plans"
          className="font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
        >
          Browse all (demo)
        </Link>
      </p>
    </div>
  );
}

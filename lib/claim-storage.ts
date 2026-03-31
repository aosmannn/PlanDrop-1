/** Client-only session keys for the demo claim flow (no server yet). */

import { getPlanById, type Plan } from "@/lib/plans-data";
import { planToSnapshot } from "@/lib/plan-snapshot";
import { normalizeOccasionId, type PlanOccasionId } from "@/lib/plan-occasion";
import {
  clampRadiusMiles,
  DEFAULT_RADIUS_MILES,
} from "@/lib/search-radius";

export const AREA_KEY = "plandrop_area";
export const CLAIM_KEY = "plandrop_claim_plan_id";
/** `{ planId, claimedAtMs, claimKey? }` — cleared when the session claim is released. */
export const CLAIM_META_KEY = "plandrop_claim_meta";
export const PIN_KEY = "plandrop_pin";
/** Set when user searches by ZIP/city/location so /drop can skip to browse. */
export const SKIP_DROP_KEY = "plandrop_skip_drop";
export const RADIUS_MILES_KEY = "plandrop_radius_miles";
export const OCCASION_KEY = "plandrop_plan_occasion";
export const AI_PLANS_MAP_KEY = "plandrop_ai_plans_map";
const PAST_CLAIMS_KEY = "plandrop_past_claims";
const MAX_PAST_CLAIMS = 40;

export type PastClaimRecord = {
  planId: string;
  snapshot: string;
  area: string | null;
  claimedAtMs: number;
  releasedAtMs: number;
};
/** Count of “release plan” actions this session (claim → release cycles). */
export const RELEASE_STRIKE_KEY = "plandrop_release_strikes";
export const CLAIM_BAN_UNTIL_KEY = "plandrop_claim_ban_until";

export type StoredPin = {
  lat: number;
  lng: number;
  accuracyM?: number;
  at: number;
};

export function getStoredArea(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(AREA_KEY);
  } catch {
    return null;
  }
}

export function setStoredArea(area: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(AREA_KEY, area.trim());
  } catch {
    /* ignore */
  }
}

export function getStoredRadiusMiles(): number {
  if (typeof window === "undefined") return DEFAULT_RADIUS_MILES;
  try {
    const raw = sessionStorage.getItem(RADIUS_MILES_KEY);
    if (!raw) return DEFAULT_RADIUS_MILES;
    return clampRadiusMiles(Number.parseInt(raw, 10));
  } catch {
    return DEFAULT_RADIUS_MILES;
  }
}

export function setStoredRadiusMiles(miles: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RADIUS_MILES_KEY, String(clampRadiusMiles(miles)));
  } catch {
    /* ignore */
  }
}

export function getClaimedPlanId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return sessionStorage.getItem(CLAIM_KEY);
  } catch {
    return null;
  }
}

function notifyClaimChanged(): void {
  if (typeof window === "undefined") return;
  try {
    window.dispatchEvent(new CustomEvent("plandrop-claim-change"));
  } catch {
    /* ignore */
  }
}

export function setClaimedPlanId(planId: string, claimKey?: string | null): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(CLAIM_KEY, planId);
    sessionStorage.setItem(
      CLAIM_META_KEY,
      JSON.stringify({
        planId,
        claimedAtMs: Date.now(),
        ...(claimKey?.trim() ? { claimKey: claimKey.trim() } : {}),
      }),
    );
    notifyClaimChanged();
  } catch {
    /* ignore */
  }
}

/** Call when opening /go/...?ck=... on a new device — restores release rights without login. */
export function adoptClaimFromUrl(planId: string, claimKey: string): void {
  const ck = claimKey.trim();
  if (!planId.trim() || !ck) return;
  setClaimedPlanId(planId.trim(), ck);
}

export function clearClaimedPlanId(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(CLAIM_KEY);
    sessionStorage.removeItem(CLAIM_META_KEY);
    notifyClaimChanged();
  } catch {
    /* ignore */
  }
}

export function getClaimMeta(): {
  planId: string;
  claimedAtMs: number;
  claimKey?: string;
} | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CLAIM_META_KEY);
    if (!raw) return null;
    const m = JSON.parse(raw) as {
      planId?: string;
      claimedAtMs?: number;
      claimKey?: string;
    };
    if (typeof m.planId !== "string" || typeof m.claimedAtMs !== "number") {
      return null;
    }
    const out: { planId: string; claimedAtMs: number; claimKey?: string } = {
      planId: m.planId,
      claimedAtMs: m.claimedAtMs,
    };
    if (typeof m.claimKey === "string" && m.claimKey.trim()) {
      out.claimKey = m.claimKey.trim();
    }
    return out;
  } catch {
    return null;
  }
}

export function getClaimKey(): string | null {
  return getClaimMeta()?.claimKey ?? null;
}

function readPastClaimsRaw(): PastClaimRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(PAST_CLAIMS_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw) as unknown;
    if (!Array.isArray(arr)) return [];
    return arr.filter(
      (e): e is PastClaimRecord =>
        e != null &&
        typeof e === "object" &&
        typeof (e as PastClaimRecord).planId === "string" &&
        typeof (e as PastClaimRecord).snapshot === "string" &&
        typeof (e as PastClaimRecord).claimedAtMs === "number" &&
        typeof (e as PastClaimRecord).releasedAtMs === "number",
    );
  } catch {
    return [];
  }
}

export function getPastClaims(): PastClaimRecord[] {
  return readPastClaimsRaw().sort((a, b) => b.releasedAtMs - a.releasedAtMs);
}

function appendPastClaim(entry: PastClaimRecord): void {
  if (typeof window === "undefined") return;
  try {
    const prev = readPastClaimsRaw();
    const next = [entry, ...prev].slice(0, MAX_PAST_CLAIMS);
    sessionStorage.setItem(PAST_CLAIMS_KEY, JSON.stringify(next));
    window.dispatchEvent(new CustomEvent("plandrop-past-claims-change"));
  } catch {
    /* ignore */
  }
}

function recordPastClaimBeforeRelease(planId: string): void {
  const plan = getPlanById(planId) ?? getStoredAiPlan(planId);
  if (!plan) return;
  const meta = getClaimMeta();
  const claimedAtMs =
    meta?.planId === planId ? meta.claimedAtMs : Date.now();
  appendPastClaim({
    planId,
    snapshot: planToSnapshot(plan),
    area: getStoredArea(),
    claimedAtMs,
    releasedAtMs: Date.now(),
  });
}

function getReleaseStrikeCount(): number {
  if (typeof window === "undefined") return 0;
  try {
    const v = sessionStorage.getItem(RELEASE_STRIKE_KEY);
    if (!v) return 0;
    const n = parseInt(v, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

function setReleaseStrikeCount(n: number): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(RELEASE_STRIKE_KEY, String(n));
  } catch {
    /* ignore */
  }
}

export function getClaimBanUntilMs(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(CLAIM_BAN_UNTIL_KEY);
    if (!raw) return null;
    const t = parseInt(raw, 10);
    if (!Number.isFinite(t)) return null;
    if (Date.now() >= t) {
      sessionStorage.removeItem(CLAIM_BAN_UNTIL_KEY);
      return null;
    }
    return t;
  } catch {
    return null;
  }
}

export function isClaimBanned(): boolean {
  return getClaimBanUntilMs() != null;
}

export function getRemainingBanMs(): number {
  const t = getClaimBanUntilMs();
  if (!t) return 0;
  return Math.max(0, t - Date.now());
}

export function releaseClaim(): { banned: boolean; strikeAfter: number } {
  const releasingId = getClaimedPlanId();
  if (releasingId) {
    recordPastClaimBeforeRelease(releasingId);
  }
  const next = getReleaseStrikeCount() + 1;
  setReleaseStrikeCount(next);
  clearClaimedPlanId();
  if (next >= 3) {
    if (typeof window !== "undefined") {
      try {
        sessionStorage.setItem(
          CLAIM_BAN_UNTIL_KEY,
          String(Date.now() + 5 * 60 * 1000),
        );
        setReleaseStrikeCount(0);
      } catch {
        /* ignore */
      }
    }
    return { banned: true, strikeAfter: next };
  }
  return { banned: false, strikeAfter: next };
}

export function getStoredPin(): StoredPin | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PIN_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as StoredPin;
    if (
      typeof p.lat !== "number" ||
      typeof p.lng !== "number" ||
      typeof p.at !== "number"
    ) {
      return null;
    }
    return p;
  } catch {
    return null;
  }
}

export function setStoredPin(pin: StoredPin): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(PIN_KEY, JSON.stringify(pin));
  } catch {
    /* ignore */
  }
}

export function clearStoredPin(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(PIN_KEY);
  } catch {
    /* ignore */
  }
}

export function getStoredPlanOccasion(): PlanOccasionId {
  if (typeof window === "undefined") return "surprise";
  try {
    const raw = sessionStorage.getItem(OCCASION_KEY);
    return normalizeOccasionId(raw);
  } catch {
    return "surprise";
  }
}

export function setStoredPlanOccasion(id: string): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(OCCASION_KEY, normalizeOccasionId(id));
  } catch {
    /* ignore */
  }
}

/** Works on server and client when `area` is passed from searchParams. */
export function buildPlansHref(
  area: string | null | undefined,
  radiusMiles?: number | null,
  opts?: { occasion?: string | null },
): string {
  if (!area || !area.trim()) return "/plans";
  const r =
    radiusMiles != null && Number.isFinite(radiusMiles)
      ? clampRadiusMiles(radiusMiles)
      : DEFAULT_RADIUS_MILES;
  const q = new URLSearchParams();
  q.set("area", area.trim());
  q.set("radius", String(r));
  let occ: PlanOccasionId;
  if (opts != null && "occasion" in opts) {
    occ = normalizeOccasionId(opts.occasion);
  } else if (typeof window !== "undefined") {
    occ = getStoredPlanOccasion();
  } else {
    occ = "surprise";
  }
  if (occ !== "surprise") q.set("occasion", occ);
  return `/plans?${q.toString()}`;
}

export function setSkipDropFromLocation(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SKIP_DROP_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function getSkipDropFromLocation(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SKIP_DROP_KEY) === "1";
  } catch {
    return false;
  }
}

export function clearSkipDropFromLocation(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(SKIP_DROP_KEY);
  } catch {
    /* ignore */
  }
}

export function setStoredAiPlansMap(plans: Plan[]): void {
  if (typeof window === "undefined") return;
  try {
    const map: Record<string, Plan> = {};
    for (const p of plans) map[p.id] = p;
    sessionStorage.setItem(AI_PLANS_MAP_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

export function getStoredAiPlan(id: string): Plan | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AI_PLANS_MAP_KEY);
    if (!raw) return null;
    const map = JSON.parse(raw) as Record<string, Plan>;
    const p = map[id];
    if (!p || typeof p.title !== "string") return null;
    return p;
  } catch {
    return null;
  }
}

export function mergeAiPlanIntoStorage(plan: Plan): void {
  if (typeof window === "undefined") return;
  try {
    const raw = sessionStorage.getItem(AI_PLANS_MAP_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, Plan>) : {};
    map[plan.id] = plan;
    sessionStorage.setItem(AI_PLANS_MAP_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

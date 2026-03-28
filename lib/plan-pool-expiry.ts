import type { Plan, VibeId } from "@/lib/plans-data";

/** Parse labels like "2.5 hrs", "90 min", "2h 30m" into minutes. */
export function parseDurationToMinutes(label: string): number {
  const t = label.trim().toLowerCase();
  const mixed = t.match(
    /(\d+(?:\.\d+)?)\s*h(?:rs?|ours?)?\s*(\d+)\s*m(?:in(?:s)?)?/,
  );
  if (mixed) {
    return Math.round(parseFloat(mixed[1]!) * 60 + parseInt(mixed[2]!, 10));
  }
  const hr = t.match(/(\d+(?:\.\d+)?)\s*(?:hr|hrs|hour|hours)\b/);
  if (hr) return Math.round(parseFloat(hr[1]!) * 60);
  const mn = t.match(/(\d+)\s*(?:min|mins|minute|minutes)\b/);
  if (mn) return parseInt(mn[1]!, 10);
  return 120;
}

function computePoolTtlMinutes(input: {
  durationMins: number;
  detailCount: number;
  vibe: VibeId;
}): number {
  const { durationMins, detailCount, vibe } = input;
  const cappedDur = Math.min(Math.max(durationMins, 30), 300);
  const vibeBonus =
    vibe === "foodie" ? 14 : vibe === "chill" ? 10 : vibe === "active" ? 6 : 8;
  const base =
    20 +
    cappedDur * 0.32 +
    Math.min(detailCount, 6) * 9 +
    vibeBonus;
  const jitter = 5 + Math.floor(Math.random() * 18);
  return Math.round(Math.min(180, Math.max(24, base + jitter)));
}

/** ISO timestamp when this plan drops out of the pool if still unclaimed. */
export function computePoolExpiresAtIso(args: {
  durationLabel: string;
  detailCount: number;
  vibe: VibeId;
  nowMs?: number;
}): string {
  const durationMins = parseDurationToMinutes(args.durationLabel);
  const ttl = computePoolTtlMinutes({
    durationMins,
    detailCount: Math.max(1, Math.min(8, args.detailCount)),
    vibe: args.vibe,
  });
  return new Date((args.nowMs ?? Date.now()) + ttl * 60_000).toISOString();
}

export function isPlanPoolExpired(plan: Plan, nowMs = Date.now()): boolean {
  if (!plan.poolExpiresAt) return false;
  return new Date(plan.poolExpiresAt).getTime() <= nowMs;
}

/** Human-readable time until pool expiry, or null if expired / no expiry. */
export function formatPoolTimeRemaining(
  poolExpiresAt: string | undefined,
  nowMs: number,
): string | null {
  if (!poolExpiresAt) return null;
  const end = new Date(poolExpiresAt).getTime();
  const diff = end - nowMs;
  if (diff <= 0) return null;
  if (diff < 60_000) return "<1m";
  if (diff < 3600_000) {
    return `${Math.max(1, Math.ceil(diff / 60_000))}m`;
  }
  const h = Math.floor(diff / 3600_000);
  const m = Math.ceil((diff % 3600_000) / 60_000);
  return m >= 60 ? `${h + 1}h` : `${h}h ${m}m`;
}

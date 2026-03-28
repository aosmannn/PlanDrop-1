/** Search radius for location-biased plan discovery (miles). */

export const DEFAULT_RADIUS_MILES = 25;
export const MIN_RADIUS_MILES = 5;
/** Places Text Search `radius` max ~50_000 m (~31 mi). */
export const MAX_RADIUS_MILES = 30;

export function clampRadiusMiles(n: number): number {
  if (!Number.isFinite(n)) return DEFAULT_RADIUS_MILES;
  return Math.min(MAX_RADIUS_MILES, Math.max(MIN_RADIUS_MILES, Math.round(n)));
}

export function radiusMilesToMeters(miles: number): number {
  return Math.round(clampRadiusMiles(miles) * 1609.344);
}

export function parseRadiusMilesParam(raw: string | null | undefined): number {
  if (raw == null || raw === "") return DEFAULT_RADIUS_MILES;
  const n = Number.parseInt(raw, 10);
  return clampRadiusMiles(n);
}

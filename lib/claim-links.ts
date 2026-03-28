import type { Plan } from "@/lib/plans-data";
import { planToSnapshot } from "@/lib/plan-snapshot";
import { clampRadiusMiles } from "@/lib/search-radius";

export function isAiPlanId(planId: string): boolean {
  return planId.startsWith("ai-");
}

export function buildClaimHref(
  plan: Plan,
  area: string | null | undefined,
  radiusMiles?: number | null,
): string {
  const q = new URLSearchParams();
  const a = area?.trim();
  if (a) q.set("area", a);
  if (radiusMiles != null && Number.isFinite(radiusMiles)) {
    q.set("radius", String(clampRadiusMiles(radiusMiles)));
  }
  if (isAiPlanId(plan.id)) q.set("snapshot", planToSnapshot(plan));
  const qs = q.toString();
  return qs ? `/claim/${plan.id}?${qs}` : `/claim/${plan.id}`;
}

export function buildGoHref(
  plan: Plan,
  area: string | null | undefined,
  radiusMiles?: number | null,
): string {
  const q = new URLSearchParams();
  const a = area?.trim();
  if (a) q.set("area", a);
  if (radiusMiles != null && Number.isFinite(radiusMiles)) {
    q.set("radius", String(clampRadiusMiles(radiusMiles)));
  }
  if (isAiPlanId(plan.id)) q.set("snapshot", planToSnapshot(plan));
  const qs = q.toString();
  return qs ? `/go/${plan.id}?${qs}` : `/go/${plan.id}`;
}

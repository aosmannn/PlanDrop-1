import { NextResponse } from "next/server";
import { findPlaceByText, getPlaceDetails } from "@/lib/google-places";
import { getPlanById, type Plan } from "@/lib/plans-data";

export const runtime = "nodejs";

type EnrichRequest = {
  planIds?: string[];
};

type ReviewEnrichment = Pick<
  Plan,
  "placeRating" | "placeUserRatingsTotal" | "placeReviews"
>;

function extractPrimaryPlaceName(plan: Plan): string | null {
  // Examples in seed data:
  // - "Ponce City Market (6:30 PM)"
  // - "Piedmont Park — 12th St & Piedmont Ave (8:00 AM)"
  // We want the actual venue name, not the time/address.
  const stop = plan.stop?.trim();
  if (stop) {
    const beforeParen = stop.split("(")[0]?.trim();
    if (beforeParen) {
      const beforeEmDash = beforeParen.split("—")[0]?.trim();
      if (beforeEmDash) return beforeEmDash;
      return beforeParen;
    }
  }
  const t = plan.title?.trim();
  return t || null;
}

function extractCityFromFormattedAddress(plan: Plan): string | null {
  const addr = plan.formattedAddress?.trim();
  if (!addr) return null;
  const parts = addr
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  // Heuristic: "street, City, ST ZIP, Country"
  // => parts[1] is usually city.
  if (parts.length >= 2) return parts[1]!;
  return parts[0] ?? null;
}

export async function POST(req: Request) {
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!key?.trim()) {
    return NextResponse.json(
      { error: "Missing GOOGLE_PLACES_API_KEY" },
      { status: 503 },
    );
  }

  let body: EnrichRequest;
  try {
    body = (await req.json()) as EnrichRequest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const planIds = Array.isArray(body?.planIds) ? body.planIds : [];
  const cleaned = planIds.map((x) => String(x || "").trim()).filter(Boolean);

  if (cleaned.length === 0) {
    return NextResponse.json({ error: "Missing planIds" }, { status: 400 });
  }

  const enrichments: Record<string, ReviewEnrichment | undefined> = {};

  // Small batch on purpose: static cards count is tiny (usually 3).
  for (const planId of cleaned) {
    const plan = getPlanById(planId);
    if (!plan) continue;

    const primaryName = extractPrimaryPlaceName(plan);
    if (!primaryName) continue;

    const city = extractCityFromFormattedAddress(plan);
    const query = city ? `${primaryName} ${city}` : primaryName;

    const loc =
      typeof plan.placeLat === "number" &&
      Number.isFinite(plan.placeLat) &&
      typeof plan.placeLng === "number" &&
      Number.isFinite(plan.placeLng)
        ? { lat: plan.placeLat, lng: plan.placeLng, radiusM: 50_000 }
        : undefined;

    try {
      let place = await findPlaceByText(query, loc, primaryName);

      // Fallback: if the biased query didn't match, try the name alone.
      if (!place && primaryName) {
        place = await findPlaceByText(primaryName, loc, primaryName);
      }

      if (!place?.placeId) continue;
      const details = await getPlaceDetails(place.placeId);
      if (!details) continue;

      enrichments[planId] = {
        placeRating: details.rating,
        placeUserRatingsTotal: details.userRatingsTotal,
        placeReviews: details.reviews,
      };
    } catch {
      // Continue enriching the rest even if one plan fails.
    }
  }

  // Only send keys that we actually enriched.
  const out: Record<string, ReviewEnrichment> = {};
  for (const [id, v] of Object.entries(enrichments)) {
    if (v) out[id] = v;
  }

  return NextResponse.json({ enrichments: out });
}


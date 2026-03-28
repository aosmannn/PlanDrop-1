import type { Plan, VibeId } from "@/lib/plans-data";
import {
  findPlaceByText,
  formatPriceFromMaps,
  getPlaceDetails,
  timeFromStop,
} from "@/lib/google-places";
import { coverForVibe, metaClassForVibe } from "@/lib/vibe-assets";

type ClaudePlan = {
  title: string;
  tagline: string;
  priceEstimate: string;
  vibe: string;
  minGroup: number;
  maxGroup: number;
  duration: string;
  meetTime: string;
  primaryPlaceName: string;
  locationDetails: string[];
  photoCredit: string;
};

const VIBES: VibeId[] = ["chill", "active", "foodie", "adv"];

function isVibe(s: string): s is VibeId {
  return (VIBES as string[]).includes(s);
}

function parseJsonFromText(text: string): { plans: ClaudePlan[] } {
  const trimmed = text.trim();
  const codeBlock = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/);
  const jsonStr = codeBlock ? codeBlock[1]!.trim() : trimmed;
  return JSON.parse(jsonStr) as { plans: ClaudePlan[] };
}

function makeId(): string {
  const u =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID().slice(0, 8)
      : Math.random().toString(36).slice(2, 10);
  return `ai-${u}`;
}

function toPlan(raw: ClaudePlan, index: number): Plan {
  const vibe: VibeId = isVibe(raw.vibe) ? raw.vibe : "chill";
  const min = Math.max(2, Math.min(8, Math.floor(raw.minGroup) || 2));
  const max = Math.max(min, Math.min(8, Math.floor(raw.maxGroup) || min));
  const vibeWord =
    vibe === "adv"
      ? "ADVENTUROUS"
      : vibe === "chill"
        ? "CHILL"
        : vibe === "active"
          ? "ACTIVE"
          : "FOODIE";
  const dur = raw.duration || "2 hrs";
  const meta = `${vibeWord} · ${min}–${max} PEOPLE · ${dur}`;
  const cover = coverForVibe(vibe, index);
  const placeName = (raw.primaryPlaceName || "Meetup spot").trim().slice(0, 120);
  const meet = (raw.meetTime || "6:00 PM").trim().slice(0, 40);
  const stop = `${placeName} — ${meet}`;

  const details = Array.isArray(raw.locationDetails)
    ? raw.locationDetails.slice(0, 6).filter((s) => typeof s === "string" && s.trim())
    : [];
  const padded =
    details.length >= 4
      ? details
      : [
          ...details,
          ...Array.from({ length: 4 - details.length }, (_, i) => `Local highlight ${i + 1} at this stop.`),
        ];

  return {
    id: makeId(),
    title: raw.title.slice(0, 120),
    tagline: raw.tagline.slice(0, 200),
    price: raw.priceEstimate || "~$35/pp",
    meta,
    metaClass: metaClassForVibe(vibe),
    stop,
    coverImageSrc: cover.src,
    coverImageAlt: `${placeName} — outing`,
    photoCredit: raw.photoCredit.slice(0, 80),
    duration: raw.duration || "2 hrs",
    groupLabel: min === max ? String(min) : `${min}–${max}`,
    vibe,
    minGroup: min,
    maxGroup: max,
    available: true,
    viewing: 3 + Math.floor(Math.random() * 8),
    locationDetails: padded.slice(0, 6),
  };
}

async function enrichPlanWithGooglePlace(
  plan: Plan,
  primaryPlaceName: string,
  area: string,
  aiPriceEstimate: string,
  lat?: number,
  lng?: number,
): Promise<Plan> {
  if (!process.env.GOOGLE_PLACES_API_KEY?.trim()) {
    return plan;
  }

  const placeQuery = primaryPlaceName.trim();
  if (!placeQuery) return plan;

  const loc =
    lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
      ? { lat, lng, radiusM: 50000 as const }
      : undefined;

  let place = await findPlaceByText(
    `${placeQuery} ${area}`,
    loc,
    placeQuery,
  );
  if (!place?.photoRef) {
    place = await findPlaceByText(placeQuery, loc, placeQuery);
  }

  if (!place) {
    return plan;
  }

  const time = timeFromStop(plan.stop);
  const stop = `${place.name} (${time})`;
  const price = formatPriceFromMaps(place.priceLevel, aiPriceEstimate);

  const cityLine = area.split(",")[0]?.trim() || area;
  const activityBullets = plan.locationDetails.slice(0, 4).filter(Boolean);

  const searchRefs =
    place.photoRefs && place.photoRefs.length > 0
      ? place.photoRefs
      : place.photoRef
        ? [place.photoRef]
        : [];

  let detailsExtra: Awaited<ReturnType<typeof getPlaceDetails>> = null;
  if (place.placeId) {
    try {
      detailsExtra = await getPlaceDetails(place.placeId);
    } catch {
      detailsExtra = null;
    }
  }

  const detailRefs = detailsExtra?.photoReferences ?? [];
  const mergedRefs: string[] = [];
  const seenRef = new Set<string>();
  for (const r of [...searchRefs, ...detailRefs]) {
    const t = r?.trim();
    if (t && !seenRef.has(t)) {
      seenRef.add(t);
      mergedRefs.push(t);
    }
  }
  const refs = mergedRefs.slice(0, 12);

  const formattedAddress =
    detailsExtra?.formattedAddress?.trim() || place.formattedAddress;

  const next: Plan = {
    ...plan,
    stop,
    price,
    photoCredit: `${place.name} - ${cityLine}`,
    coverImageAlt: `${place.name} — ${cityLine}`,
    locationDetails: activityBullets,
    formattedAddress,
    placeId: place.placeId,
    mapsUrl: detailsExtra?.mapsUrl,
    placeLat: detailsExtra?.lat,
    placeLng: detailsExtra?.lng,
    openingHoursLine: detailsExtra?.openingHoursLine,
    openingHoursWeekday: detailsExtra?.weekdayText,
  };

  if (refs.length > 0) {
    next.placePhotoRef = refs[0];
    if (refs.length > 1) {
      next.placePhotoRefs = refs;
    }
  }

  return next;
}

/**
 * Calls Claude + optional Places enrichment. Requires ANTHROPIC_API_KEY.
 */
export async function generateAiPlansForArea(
  area: string,
  lat?: number,
  lng?: number,
): Promise<Plan[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key?.trim()) {
    throw new Error("AI plans are not configured (missing ANTHROPIC_API_KEY).");
  }

  const trimmedArea = area.trim();
  if (!trimmedArea) {
    throw new Error("Missing area");
  }

  const locHint =
    lat != null && lng != null
      ? `User coordinates (bias search): ${lat.toFixed(4)}, ${lng.toFixed(4)}. Use them with the place name to judge how dense the destination is—dense urban cores can support more distinct venues; exurban or rural pins should usually mean fewer plans.`
      : "";

  const prompt = `You are a local outing planner for "${trimmedArea}".
${locHint}

Return ONLY valid JSON (no markdown outside the JSON) with this exact shape:
{"plans":[{"title":"string","tagline":"string","priceEstimate":"string: use \"Free\" for no paid admission (parks, plazas, exterior walks); otherwise a realistic per-person estimate like ~$28/pp or ~$35–50/pp for food halls","vibe":"chill|active|foodie|adv","minGroup":number,"maxGroup":number,"duration":"string like 2.5 hrs","meetTime":"string like 6:30 PM","primaryPlaceName":"string","locationDetails":["string","string","string","string"],"photoCredit":"short label"}]}

STRICT RULES (must follow):
- Output between 2 and 8 plans. Choose how many based on the area: dense cities and major destinations usually support more distinct real venues for one evening; small towns, very suburban, or sparse areas should have fewer—only as many as you can make strong and non-redundant. Never pad with weak plans or duplicate the same kind of night twice.
- Across the plans you include, diversify vibes (chill, active, foodie, adv) as much as the count allows—use each vibe at most once when you have enough plans; if you output fewer than four plans, prioritize variety over covering every vibe.
- Each plan must be anchored to ONE real venue or park that exists in or near "${trimmedArea}" and can be found on Google Maps.
- primaryPlaceName MUST be the official name as listed on Google Maps (e.g. "Ponce City Market", "Piedmont Park", "Krog Street Market", "Mercedes-Benz Stadium"). Not a made-up place name.
- title and tagline MUST describe that same primaryPlaceName only. Do not title a plan after Neighborhood A while primaryPlaceName is a venue in Neighborhood B.
- locationDetails: four bullets about what to do at that exact place or its immediate doorstep (same block / connected trail segment). No contradictory scenes (e.g. do not describe a record shop interior if the place is a stadium).
- meetTime: a single meet time or window (e.g. "6:30 PM" or "10:00 AM").
- priceEstimate: Use the exact word Free when the outing needs no ticket or paid admission. For dining or paid venues, give an approximate per-person range typical for that area (e.g. ~$40/pp or ~$30–45/pp). Maps price level may refine this server-side.
- Do not repeat the same primaryPlaceName in two plans.`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": key,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error("Anthropic error", res.status, errText);
    throw new Error("Could not generate plans. Try again in a moment.");
  }

  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
  };
  const text = data.content?.find((c) => c.type === "text")?.text;
  if (!text) {
    throw new Error("Empty model response");
  }

  let parsed: { plans: ClaudePlan[] };
  try {
    parsed = parseJsonFromText(text);
  } catch (e) {
    console.error("AI plans parse error", e, text.slice(0, 500));
    throw new Error("Could not parse AI response");
  }

  if (!Array.isArray(parsed.plans) || parsed.plans.length === 0) {
    throw new Error("No plans in response");
  }

  if (parsed.plans.length < 2) {
    throw new Error("Expected at least two plans for this area");
  }

  const rawList = parsed.plans.slice(0, 8);
  return Promise.all(
    rawList.map(async (raw, i) => {
      const base = toPlan(raw, i);
      return enrichPlanWithGooglePlace(
        base,
        raw.primaryPlaceName || "",
        trimmedArea,
        raw.priceEstimate || "~$35/pp",
        lat,
        lng,
      );
    }),
  );
}

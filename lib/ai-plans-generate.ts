import type { Plan, VibeId } from "@/lib/plans-data";
import {
  findPlaceByText,
  formatPriceFromMaps,
  getPlaceDetails,
  timeFromStop,
} from "@/lib/google-places";
import { computePoolExpiresAtIso } from "@/lib/plan-pool-expiry";
import {
  clampRadiusMiles,
  DEFAULT_RADIUS_MILES,
  radiusMilesToMeters,
} from "@/lib/search-radius";
import {
  getOccasionDef,
  normalizeOccasionId,
  occasionPlacesBoost,
  type PlanOccasionId,
} from "@/lib/plan-occasion";
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

function sharpenActivityBullets(
  details: string[],
  venueName: string,
  vibe: VibeId,
): string[] {
  const cleaned = (venueName || "")
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim();
  const shortVenue =
    cleaned.split(/[—–-]/)[0]?.trim() || cleaned || "this stop";

  const isPlaceholder = (s: string) =>
    /^local highlight\s+\d+/i.test(s) ||
    /^generic\b/i.test(s) ||
    s.trim().length < 18;

  /** Model often writes scenic but non-specific copy (“many outfitters…”) — tie it to the named place. */
  const isVagueOutdoorCopy = (s: string) =>
    /\bone of the many\b/i.test(s) ||
    /\bfrom one of the many\b/i.test(s) ||
    (/\bmany\b/i.test(s) &&
      /\b(outfitters?|operators?|rentals?|vendors?)\b/i.test(s)) ||
    (/\b(scenic shoreline|quiet coves|designated beach)\b/i.test(s) &&
      !s.toLowerCase().includes(shortVenue.toLowerCase().slice(0, 8)));

  const templates: Record<VibeId, string[]> = {
    chill: [
      `Grab drinks or small plates at ${shortVenue} — order a few things for the table to pass.`,
      `Walk the main public stretch around ${shortVenue} for ~10 minutes, then settle in somewhere quiet.`,
    ],
    foodie: [
      `Order the signature item at ${shortVenue} plus one “wildcard” dish for the group to split.`,
      `If lines are long, split up: one person orders while someone else secures a table nearby.`,
    ],
    active: [
      `Start with an easy loop from ${shortVenue}; add distance only if everyone still has energy.`,
      `Pick a 15‑minute meet‑back point at ${shortVenue} before anyone peels off.`,
    ],
    adv: [
      `Confirm hours, tickets, or gear at ${shortVenue} first — do the headline experience before add‑ons.`,
      `Have a Plan B near ${shortVenue} if crowds or weather spike (same vibe, less friction).`,
    ],
  };

  let tIdx = 0;
  const out = details.map((line) => {
    const rawLine = line.trim();
    if (!rawLine) return rawLine;
    if (isVagueOutdoorCopy(rawLine)) {
      if (vibe === "active" || vibe === "adv") {
        return `At ${shortVenue}: confirm rental hours and group-friendly options (or walk-ins), then pick a simple route everyone can handle.`;
      }
      if (vibe === "foodie") {
        return `Near ${shortVenue}: grab something easy to share, then keep the group within one or two stops so nobody gets split up.`;
      }
      return `Around ${shortVenue}: pick one main thing to do first, then optional extras if the group still has time.`;
    }
    if (isPlaceholder(rawLine)) {
      const alt = templates[vibe][tIdx % templates[vibe].length]!;
      tIdx += 1;
      return alt;
    }
    const hint = shortVenue.slice(0, Math.min(12, shortVenue.length));
    if (hint && !rawLine.toLowerCase().includes(hint.toLowerCase())) {
      return `${rawLine} — focused at ${shortVenue}.`;
    }
    return rawLine;
  });
  return out.slice(0, 6);
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
    ? raw.locationDetails.slice(0, 8).filter((s) => typeof s === "string" && s.trim())
    : [];
  const padded =
    details.length >= 5
      ? details
      : [
          ...details,
          ...Array.from(
            { length: Math.max(0, 5 - details.length) },
            (_, i) => `Local highlight ${i + 1} at this stop.`,
          ),
        ];

  const detailCount = padded.slice(0, 6).filter(Boolean).length;
  const durationLabel = raw.duration || "2 hrs";
  const poolExpiresAt = computePoolExpiresAtIso({
    durationLabel,
    detailCount,
    vibe,
  });

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
    duration: durationLabel,
    groupLabel: min === max ? String(min) : `${min}–${max}`,
    vibe,
    minGroup: min,
    maxGroup: max,
    available: true,
    locationDetails: padded.slice(0, 6),
    poolExpiresAt,
  };
}

function vibeGalleryFallbacks(plan: Plan, planIndex: number): string[] {
  const out: string[] = [];
  const seen = new Set<string>();
  const push = (src: string) => {
    const t = src.trim();
    if (!t || seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  push(plan.coverImageSrc);
  for (let k = 1; k <= 4 && out.length < 4; k++) {
    push(coverForVibe(plan.vibe, planIndex + k).src);
  }
  return out;
}

async function enrichPlanWithGooglePlace(
  plan: Plan,
  primaryPlaceName: string,
  area: string,
  aiPriceEstimate: string,
  planIndex: number,
  lat?: number,
  lng?: number,
  radiusMeters?: number,
  placesSearchBoost?: string,
): Promise<Plan> {
  if (!process.env.GOOGLE_PLACES_API_KEY?.trim()) {
    return { ...plan, galleryImageSrcs: vibeGalleryFallbacks(plan, planIndex) };
  }

  const placeQuery = primaryPlaceName.trim();
  if (!placeQuery) {
    return { ...plan, galleryImageSrcs: vibeGalleryFallbacks(plan, planIndex) };
  }

  const loc =
    lat != null && lng != null && Number.isFinite(lat) && Number.isFinite(lng)
      ? {
          lat,
          lng,
          radiusM:
            radiusMeters != null && Number.isFinite(radiusMeters)
              ? Math.min(50000, Math.max(1000, Math.round(radiusMeters)))
              : 50000,
        }
      : undefined;

  const boost = placesSearchBoost?.trim();
  const primaryQuery = boost
    ? `${placeQuery} ${area} ${boost}`.replace(/\s+/g, " ").trim()
    : `${placeQuery} ${area}`;
  let place = await findPlaceByText(primaryQuery, loc, placeQuery);
  if (!place?.photoRef) {
    place = await findPlaceByText(placeQuery, loc, placeQuery);
  }

  if (!place) {
    return { ...plan, galleryImageSrcs: vibeGalleryFallbacks(plan, planIndex) };
  }

  const time = timeFromStop(plan.stop);
  const stop = `${place.name} (${time})`;
  const price = formatPriceFromMaps(place.priceLevel, aiPriceEstimate);

  const cityLine = area.split(",")[0]?.trim() || area;
  const activityBullets = plan.locationDetails.slice(0, 8).filter(Boolean);

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
  const refs = mergedRefs.slice(0, 15);

  const formattedAddress =
    detailsExtra?.formattedAddress?.trim() || place.formattedAddress;

  const rating =
    detailsExtra?.rating ?? place.rating;
  const userTotals =
    detailsExtra?.userRatingsTotal ?? place.userRatingsTotal;
  const sharpened = sharpenActivityBullets(
    activityBullets,
    place.name,
    plan.vibe,
  );

  const next: Plan = {
    ...plan,
    stop,
    price,
    photoCredit: `${place.name} - ${cityLine}`,
    coverImageAlt: `${place.name} — ${cityLine}`,
    locationDetails: sharpened,
    formattedAddress,
    placeId: place.placeId,
    mapsUrl: detailsExtra?.mapsUrl,
    placeLat: detailsExtra?.lat,
    placeLng: detailsExtra?.lng,
    openingHoursLine: detailsExtra?.openingHoursLine,
    openingHoursWeekday: detailsExtra?.weekdayText,
    placeRating: rating,
    placeUserRatingsTotal: userTotals,
    placeReviews: detailsExtra?.reviews,
  };

  if (refs.length > 0) {
    next.placePhotoRef = refs[0];
    if (refs.length > 1) {
      next.placePhotoRefs = refs;
    }
    const extras = vibeGalleryFallbacks(plan, planIndex)
      .filter((s) => s !== plan.coverImageSrc)
      .slice(0, 3);
    if (extras.length) {
      next.galleryImageSrcs = extras;
    }
  } else {
    next.galleryImageSrcs = vibeGalleryFallbacks(plan, planIndex);
  }

  return next;
}

export type GenerateAiPlansOptions = {
  occasionId?: string;
};

/**
 * Calls Claude + optional Places enrichment. Requires ANTHROPIC_API_KEY.
 */
export async function generateAiPlansForArea(
  area: string,
  lat?: number,
  lng?: number,
  radiusMiles?: number,
  options?: GenerateAiPlansOptions,
): Promise<Plan[]> {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key?.trim()) {
    throw new Error("AI plans are not configured (missing ANTHROPIC_API_KEY).");
  }

  const trimmedArea = area.trim();
  if (!trimmedArea) {
    throw new Error("Missing area");
  }

  const miles =
    radiusMiles != null && Number.isFinite(radiusMiles)
      ? clampRadiusMiles(radiusMiles)
      : DEFAULT_RADIUS_MILES;
  const radiusMetersForPlaces =
    lat != null && lng != null ? radiusMilesToMeters(miles) : undefined;

  const occasionId: PlanOccasionId = normalizeOccasionId(options?.occasionId);
  const occasionDef = getOccasionDef(occasionId);
  const placesBoost =
    occasionId === "surprise" ? "" : occasionPlacesBoost(occasionId);

  const locHint =
    lat != null && lng != null
      ? `User coordinates (bias search): ${lat.toFixed(4)}, ${lng.toFixed(4)}. Prefer venues within roughly ${miles} miles of this point. Use coordinates with the place name to judge density—dense urban cores can support more distinct venues; exurban or rural pins should usually mean fewer plans.`
      : `Prefer venues within about ${miles} miles of "${trimmedArea}".`;

  const model =
    process.env.ANTHROPIC_MODEL?.trim() ||
    "claude-sonnet-4-6";

  const occasionBlock =
    occasionId !== "surprise"
      ? `
USER OCCASION: "${occasionDef.label}" (${occasionId}).
${occasionDef.promptHint}

CRITICAL: Every plan must match this occasion. Do not mix in outings that would feel off-theme for "${occasionDef.label}". Still vary neighborhoods, venue types, and micro-vibes within the same occasion.
- Still output 2–8 plans with distinct real venues on Google Maps within ~${miles} miles; no duplicate primaryPlaceName.
- Set the \`vibe\` field to chill|active|foodie|adv only when it fits the occasion; pick the closest matching vibes when the occasion is narrow.
`
      : "";

  const vibeRule =
    occasionId === "surprise"
      ? `- Across the plans you include, diversify vibes (chill, active, foodie, adv) as much as the count allows—use each vibe at most once when you have enough plans; if you output fewer than four plans, prioritize variety over covering every vibe.`
      : `- All plans must align with the USER OCCASION block above.`;

  const prompt = `You are a local outing planner for "${trimmedArea}".
${locHint}
${occasionBlock}

Return ONLY valid JSON (no markdown outside the JSON) with this exact shape:
{"plans":[{"title":"string","tagline":"string","priceEstimate":"string: use \"Free\" for no paid admission (parks, plazas, exterior walks); otherwise a realistic per-person estimate like ~$28/pp or ~$35–50/pp for food halls","vibe":"chill|active|foodie|adv","minGroup":number,"maxGroup":number,"duration":"string like 2.5 hrs","meetTime":"string like 6:30 PM","primaryPlaceName":"string","locationDetails":["string","string","string","string","string"],"photoCredit":"short label"}]}

STRICT RULES (must follow):
- Output between 2 and 8 plans. Choose how many based on the area: dense cities and major destinations usually support more distinct real venues for one evening; small towns, very suburban, or sparse areas should have fewer—only as many as you can make strong and non-redundant. Never pad with weak plans or duplicate the same kind of night twice.
${vibeRule}
- Each plan must be anchored to ONE real venue or park that exists within ~${miles} miles of the user's area (or their coordinates when given) and can be found on Google Maps.
- primaryPlaceName MUST be the official name as listed on Google Maps (e.g. "Ponce City Market", "Piedmont Park", "Krog Street Market", "Mercedes-Benz Stadium"). Not a made-up place name.
- title and tagline MUST describe that same primaryPlaceName only. Do not title a plan after Neighborhood A while primaryPlaceName is a venue in Neighborhood B.
- locationDetails: **five or six bullets**, each **one clear sentence** about what to do at that exact place or its immediate doorstep (same block / connected trail segment). Mention **primaryPlaceName** in at least **two** bullets. No vague filler (“enjoy the vibes”). No contradictory scenes (e.g. do not describe a record shop interior if the place is a stadium).
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
      model,
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    let apiMessage = errText.slice(0, 500);
    try {
      const j = JSON.parse(errText) as {
        error?: { type?: string; message?: string };
      };
      if (j.error?.message) apiMessage = j.error.message;
    } catch {
      /* keep raw snippet */
    }
    console.error("Anthropic error", model, res.status, errText);
    throw new Error(
      `Could not generate plans (${res.status}). ${apiMessage}`,
    );
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
        i,
        lat,
        lng,
        radiusMetersForPlaces,
        placesBoost || undefined,
      );
    }),
  );
}

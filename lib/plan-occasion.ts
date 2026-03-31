/**
 * User-selected outing intent — drives AI prompt + Google Places text-search bias.
 */

export const PLAN_OCCASIONS = [
  {
    id: "surprise",
    label: "Surprise me",
    promptHint: "",
    placesBoost: "",
  },
  {
    id: "date-night",
    label: "Date night",
    promptHint:
      "Romantic or intimate energy: conversation-friendly seating, drinks or dinner, sunset walks, rooftops, wine bars, or a show — not a loud sports bar unless it is genuinely known for cozy booths.",
    placesBoost: "date night romantic dinner wine cocktail intimate",
  },
  {
    id: "friends-out",
    label: "Friends / group",
    promptHint:
      "Social and group-friendly: shared tables, games, trivia, bowling, food halls, breweries — easy for 4+ people to hang without a formal reservation circus.",
    placesBoost: "group friendly games brewery food hall bowling",
  },
  {
    id: "chill",
    label: "Chill & easy",
    promptHint:
      "Low pressure: cafes, bookish spots, mellow parks, boardwalk strolls, quiet patios — nothing that feels like a workout or a club night.",
    placesBoost: "cafe coffee park lounge patio relaxed",
  },
  {
    id: "active",
    label: "Active & outdoors",
    promptHint:
      "Movement and fresh air: trails, courts, rentals, waterfront paths, climbing, pools — real outdoor or athletic venues, not just 'walk around a mall'.",
    placesBoost: "park trail outdoor recreation sports hiking",
  },
  {
    id: "food-crawl",
    label: "Food & markets",
    promptHint:
      "Flavor-forward: markets, food halls, tasting menus, dessert or coffee crawls — the meal is the main event.",
    placesBoost: "restaurant food hall market tasting bakery",
  },
  {
    id: "night-out",
    label: "Night out",
    promptHint:
      "Late hours: live music, dancing, comedy, cocktail bars, entertainment districts — not daytime-only parks or museums unless they have a clear night program.",
    placesBoost: "nightlife bar live music entertainment comedy club",
  },
  {
    id: "culture",
    label: "Arts & culture",
    promptHint:
      "Museums, galleries, theaters, live performance, historic sites — intellectually interesting and venue-based.",
    placesBoost: "museum theater gallery arts performance historic",
  },
  {
    id: "budget",
    label: "Budget-friendly",
    promptHint:
      "Free or cheap admission where possible: parks, free exhibits, happy hours, walking routes — call out when something is genuinely free.",
    placesBoost: "free park cheap affordable happy hour",
  },
] as const;

export type PlanOccasionId = (typeof PLAN_OCCASIONS)[number]["id"];

const ALLOWED = new Set<string>(PLAN_OCCASIONS.map((o) => o.id));

export function normalizeOccasionId(
  raw: string | null | undefined,
): PlanOccasionId {
  const t = (raw ?? "").trim().toLowerCase().replace(/\s+/g, "-");
  if (ALLOWED.has(t)) return t as PlanOccasionId;
  return "surprise";
}

export function getOccasionDef(
  id: string,
): (typeof PLAN_OCCASIONS)[number] {
  const found = PLAN_OCCASIONS.find((o) => o.id === id);
  return found ?? PLAN_OCCASIONS[0];
}

export function occasionPlacesBoost(id: PlanOccasionId): string {
  return getOccasionDef(id).placesBoost.trim();
}

export type VibeId = "chill" | "active" | "foodie" | "adv";

export type Plan = {
  id: string;
  title: string;
  tagline: string;
  price: string;
  meta: string;
  metaClass: string;
  stop: string;
  coverImageSrc: string;
  coverImageAlt: string;
  photoCredit: string;
  /** When set, cover image is loaded via `/api/place-photo` (Google Places). */
  placePhotoRef?: string;
  /** Multiple Place photo refs (same venue); used on briefings / galleries. */
  placePhotoRefs?: string[];
  /** Extra local images for catalog plans (public paths). */
  galleryImageSrcs?: string[];
  /** Google Place ID from search/details (for enrichment). */
  placeId?: string;
  /** Canonical address from Places (shown + Maps link). */
  formattedAddress?: string;
  /** Google Maps URL for this place (opens in app when tapped). */
  mapsUrl?: string;
  placeLat?: number;
  placeLng?: number;
  /** Short line for cards, e.g. "Open now · 9:00 AM – 9:00 PM" */
  openingHoursLine?: string;
  /** Full weekday lines from Places (modal). */
  openingHoursWeekday?: string[];
  duration: string;
  groupLabel: string;
  vibe: VibeId;
  minGroup: number;
  maxGroup: number;
  /** Seed data: whether this plan is still open in the pool */
  available: boolean;
  viewing?: number;
  locationDetails: string[];
};

/** Venue-only extras (Wikimedia Commons, CC licenses). Keep each plan’s list scoped to that place. */
const PONCE_GALLERY_EXTRAS = [
  "https://upload.wikimedia.org/wikipedia/commons/c/ce/Ponce_City_Market%2C_Atlanta.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/b/b8/Ponce_City_Market_large_neon_sign_Midtown%2C_Atlanta%2C_GA.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/3/35/Central_Food_Hall_of_Ponce_City_Market%2C_seen_from_upper_level_at_night.jpg",
] as const;

const PIEDMONT_GALLERY_EXTRAS = [
  "https://upload.wikimedia.org/wikipedia/commons/8/8a/Piedmont_Park_Atlanta.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/6/6b/Morning_view_from_the_Lake_Clara_Meer_Bridge_and_Piedmont_Park_Gazebo.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/7/7d/999_Peachtree_Building_viewed_from_Lake_Clara_Meer_in_Piedmont_Park%2C_Atlanta.jpg",
] as const;

const KROG_GALLERY_EXTRAS = [
  "https://upload.wikimedia.org/wikipedia/commons/a/a7/Krog_Street_Market.jpg",
] as const;

export const PLANS: Plan[] = [
  {
    id: "1",
    title: "Ponce & BeltLine golden hour",
    tagline: "Stroll the Eastside Trail, then settle in at the market.",
    price: "~$32–48/pp",
    meta: "CHILL · 4–6 PEOPLE · 2.5 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Ponce City Market (6:30 PM)",
    coverImageSrc: "/images/ponce-city-market.png",
    coverImageAlt:
      "Ponce City Market exterior with orange awning and signage in Atlanta",
    photoCredit: "Ponce City Market - Atlanta",
    galleryImageSrcs: [
      "/images/ponce-city-market.png",
      ...PONCE_GALLERY_EXTRAS,
    ],
    placeLat: 33.7721,
    placeLng: -84.3653,
    formattedAddress:
      "675 Ponce De Leon Ave NE, Atlanta, GA 30308, USA",
    duration: "2.5 hrs",
    groupLabel: "4–6",
    vibe: "chill",
    minGroup: 4,
    maxGroup: 6,
    available: true,
    viewing: 7,
    locationDetails: [
      "Hop between food stalls, sit-down spots, and shops under the brick arches.",
      "Walk or bike the Eastside Trail right outside for golden-hour views.",
      "Grab drinks on a patio and keep the group loose — no single table required.",
      "Meet at the central courtyard when everyone arrives on their own time.",
    ],
  },
  {
    id: "2",
    title: "Piedmont Park morning loop",
    tagline: "Lake loop, skyline views, cold coffee after.",
    price: "Free",
    meta: "ACTIVE · 2–4 PEOPLE · 2 HRS",
    metaClass: "bg-brand-soft text-brand ring-1 ring-brand/20",
    stop: "Piedmont Park — 12th St & Piedmont Ave (8:00 AM)",
    coverImageSrc: "/images/piedmont-park-clara-meer.png",
    coverImageAlt:
      "Lake Clara Meer in Piedmont Park with Midtown Atlanta skyline reflected on the water",
    photoCredit: "Piedmont Park - Atlanta",
    galleryImageSrcs: [
      "/images/piedmont-park-clara-meer.png",
      ...PIEDMONT_GALLERY_EXTRAS,
    ],
    placeLat: 33.786,
    placeLng: -84.3732,
    formattedAddress: "400 Park Dr NE, Atlanta, GA 30309, USA",
    duration: "2 hrs",
    groupLabel: "2–4",
    vibe: "active",
    minGroup: 2,
    maxGroup: 4,
    available: true,
    viewing: 8,
    locationDetails: [
      "Circle Lake Clara Meer for a flat, easy loop with skyline reflections.",
      "Spread out on open lawns or use the active oval for a light jog.",
      "Catch Midtown towers over the treeline — classic Atlanta postcard views.",
      "Use the dog park or sports courts if your crew wants a little extra movement.",
      "Finish with cold coffee from a nearby café on the park edge.",
    ],
  },
  {
    id: "3",
    title: "Krog Street tasting line",
    tagline: "Small plates, shared tables, zero decision fatigue.",
    price: "~$45–65/pp",
    meta: "FOODIE · 4 PEOPLE · 3 HRS",
    metaClass: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
    stop: "Krog Street Market (7:15 PM)",
    coverImageSrc: "/images/krog-street-market.png",
    coverImageAlt:
      "Krog Street Market exterior at dusk with patio, signage, and parking in front",
    photoCredit: "Krog Street Market - Atlanta",
    galleryImageSrcs: ["/images/krog-street-market.png", ...KROG_GALLERY_EXTRAS],
    placeLat: 33.752,
    placeLng: -84.3644,
    formattedAddress: "99 Krog St NE, Atlanta, GA 30307, USA",
    duration: "3 hrs",
    groupLabel: "4",
    vibe: "foodie",
    minGroup: 4,
    maxGroup: 4,
    available: true,
    viewing: 9,
    locationDetails: [
      "Share small plates from different vendors so nobody has to pick one restaurant.",
      "Post up on the covered patio or high-top rails for a social, low-pressure dinner.",
      "Browse beer and wine at Hop City–style counters before you commit to food.",
      "Stroll Krog Street Tunnel murals if you want a quick art break between bites.",
      "Easy parking and BeltLine access for late arrivals.",
    ],
  },
];

/** Curated “tonight” board for the homepage — real spots, fixed copy (no AI on first paint). */
export const TONIGHT_CATALOG_PLANS = PLANS;

export function getPlanById(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}

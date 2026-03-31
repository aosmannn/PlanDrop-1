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
  /** AI plans: ISO time when this offer leaves the pool if still unclaimed (based on duration, stops, vibe). */
  poolExpiresAt?: string;
  /** From Google Places (when enriched). */
  placeRating?: number;
  placeUserRatingsTotal?: number;
  placeReviews?: Array<{
    author: string;
    rating: number;
    text: string;
    relativeTime?: string;
  }>;
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

const PONCE_COVER =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Ponce_City_Market,_Atlanta.jpg";
const PIEDMONT_COVER =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Clara_Meer_in_Atlanta,_GA,_USA.jpg";
const KROG_COVER =
  "https://commons.wikimedia.org/wiki/Special:FilePath/Krog_Street_Tunnel_-_Atlanta,_GA_-_Flickr_-_hyku_(31).jpg";

export const PLANS: Plan[] = [
  {
    id: "1",
    title: "Ponce & BeltLine golden hour",
    tagline: "Stroll the Eastside Trail, then settle in at the market.",
    price: "~$32–48/pp",
    meta: "CHILL · 4–6 PEOPLE · 2.5 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Ponce City Market (6:30 PM)",
    coverImageSrc: PONCE_COVER,
    coverImageAlt:
      "Ponce City Market exterior with orange awning and signage in Atlanta",
    photoCredit: "Ponce City Market - Atlanta",
    galleryImageSrcs: [
      PONCE_COVER,
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
    coverImageSrc: PIEDMONT_COVER,
    coverImageAlt:
      "Lake Clara Meer in Piedmont Park with Midtown Atlanta skyline reflected on the water",
    photoCredit: "Piedmont Park - Atlanta",
    galleryImageSrcs: [
      PIEDMONT_COVER,
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
    coverImageSrc: KROG_COVER,
    coverImageAlt:
      "Krog Street Market exterior at dusk with patio, signage, and parking in front",
    photoCredit: "Krog Street Market - Atlanta",
    galleryImageSrcs: [KROG_COVER, ...KROG_GALLERY_EXTRAS],
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
  {
    id: "4",
    title: "BeltLine Eastside Trail sunset",
    tagline: "Golden-hour walk, murals, and choose-your-own stop vibes.",
    price: "Free",
    meta: "ACTIVE · 2–8 PEOPLE · 2 HRS",
    metaClass: "bg-brand-soft text-brand ring-1 ring-brand/20",
    stop: "BeltLine Eastside Trail (6:00 PM)",
    coverImageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Irwin_street_market_o4w_atlanta.JPG",
    coverImageAlt: "Irwin Street Market in Atlanta's Old Fourth Ward",
    photoCredit: "BeltLine - Atlanta",
    galleryImageSrcs: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Irwin_street_market_o4w_atlanta.JPG",
    ],
    formattedAddress: "Atlanta BeltLine Eastside Trail, Atlanta, GA, USA",
    duration: "2 hrs",
    groupLabel: "2–8",
    vibe: "active",
    minGroup: 2,
    maxGroup: 8,
    available: true,
    viewing: 10,
    locationDetails: [
      "Meet at a landmark mural so late arrivals can find you easily.",
      "Walk until the crew picks a drink/food stop that fits the moment.",
      "Flexible pacing—works even if people peel off early.",
    ],
  },
  {
    id: "5",
    title: "Little Five Points night wander",
    tagline: "Dive bars, record shops, and late-night people-watching.",
    price: "~$20–50/pp",
    meta: "ADV · 2–8 PEOPLE · 3 HRS",
    metaClass: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
    stop: "Little Five Points (8:00 PM)",
    coverImageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Little_five_points_shops.jpg",
    coverImageAlt: "Shops in Little Five Points, Atlanta",
    photoCredit: "Little Five Points - Atlanta",
    galleryImageSrcs: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Little_five_points_shops.jpg",
    ],
    formattedAddress: "Little Five Points, Atlanta, GA, USA",
    duration: "3 hrs",
    groupLabel: "2–8",
    vibe: "adv",
    minGroup: 2,
    maxGroup: 8,
    available: true,
    viewing: 12,
    locationDetails: [
      "Start with one anchor bar, then rotate every 45–60 minutes.",
      "Easy for mixed crews—wanderers + sitters both win.",
      "End with a quick late snack nearby.",
    ],
  },
  {
    id: "6",
    title: "Mercedes-Benz Stadium circuit",
    tagline: "Downtown energy, skyline shots, and a fast pregame loop.",
    price: "Free",
    meta: "ADV · 2–6 PEOPLE · 2 HRS",
    metaClass: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
    stop: "Mercedes-Benz Stadium (4:30 PM)",
    coverImageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Stadium_with_the_Georgia_Dome_remains_in_the_foreground_(27663350329).jpg",
    coverImageAlt: "Mercedes-Benz Stadium in Atlanta",
    photoCredit: "Mercedes-Benz Stadium - Atlanta",
    galleryImageSrcs: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Stadium_with_the_Georgia_Dome_remains_in_the_foreground_(27663350329).jpg",
    ],
    formattedAddress: "1 AMB Dr NW, Atlanta, GA 30313, USA",
    duration: "2 hrs",
    groupLabel: "2–6",
    vibe: "adv",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 8,
    locationDetails: [
      "Meet at a clear entrance and do a quick loop for photos.",
      "Works great pre-game/event or as a downtown anchor stop.",
      "Pair with food nearby after the walk.",
    ],
  },
  {
    id: "7",
    title: "Atlantic Station easy night out",
    tagline: "Walkable blocks, simple logistics, quick decisions.",
    price: "~$15–40/pp",
    meta: "CHILL · 2–6 PEOPLE · 2.5 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Atlantic Station (7:00 PM)",
    coverImageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Atlantic_Station_parking_deck_and_shopping_district.jpg",
    coverImageAlt: "Atlantic Station shopping district, Atlanta",
    photoCredit: "Atlantic Station - Atlanta",
    galleryImageSrcs: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Atlantic_Station_parking_deck_and_shopping_district.jpg",
    ],
    formattedAddress: "Atlantic Station, Atlanta, GA, USA",
    duration: "2.5 hrs",
    groupLabel: "2–6",
    vibe: "chill",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 9,
    locationDetails: [
      "Start with a drink/coffee, then decide dinner once everyone’s present.",
      "Compact area so nobody gets lost.",
      "Good fallback when the group needs easy logistics.",
    ],
  },
  {
    id: "8",
    title: "Midtown arts & eats",
    tagline: "One anchor dinner, one nightcap, zero over-planning.",
    price: "~$20–60/pp",
    meta: "FOODIE · 2–6 PEOPLE · 3 HRS",
    metaClass: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
    stop: "Midtown (6:30 PM)",
    coverImageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Midtown_Atlanta_skyline_from_Clara_Meer_in_Piedmont_Park.JPG",
    coverImageAlt: "Midtown Atlanta skyline from Piedmont Park",
    photoCredit: "Midtown - Atlanta",
    galleryImageSrcs: [
      "https://commons.wikimedia.org/wiki/Special:FilePath/Midtown_Atlanta_skyline_from_Clara_Meer_in_Piedmont_Park.JPG",
    ],
    formattedAddress: "Midtown, Atlanta, GA, USA",
    duration: "3 hrs",
    groupLabel: "2–6",
    vibe: "foodie",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 11,
    locationDetails: [
      "Pick one anchor restaurant, then do a second stop for dessert or a nightcap.",
      "Works well for mixed budgets and varied food preferences.",
      "Easy rideshare in/out.",
    ],
  },
];

const PIKE_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/7/7b/Seattle_%28WA%2C_USA%29%2C_Pike_Street%2C_Lampe_--_2022_--_1808.jpg";
const PIKE_GALLERY = [
  PIKE_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/3/35/Maximilien_Restaurant_Sign_in_Pike_Place_Market%2C_Seattle%2C_Washington%2C_2025.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/5e/Pike_Place_Market%2C_Economy_Market_arcade%2C_1968.jpg",
] as const;
const BEAN_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/e/eb/Chicago_from_under_the_Cloud_Gate_%289694666470%29.jpg";
const CHICAGO_GALLERY = [
  BEAN_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/b/ba/Chicago_Grant_Park_night_pano.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/97/Chicago_Theatre_2.jpg",
] as const;
const BROOKLYN_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/0/00/Brooklyn_Bridge_Manhattan.jpg";
const BROOKLYN_GALLERY = [
  BROOKLYN_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/e/e2/Pont_de_Brooklyn_de_nuit_-_Octobre_2008_edit.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/2/28/NYC_Montage_9_by_Jleon.jpg",
] as const;
const EIFFEL_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg";
const PARIS_GALLERY = [
  EIFFEL_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/d/de/Eiffel_Tower_and_Pont_Alexandre_III_at_night.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/6/67/Eiffel_Tower%2C_full-view_looking_toward_the_Trocadero%2C_Exposition_Universal%2C_1900%2C_Paris%2C_France.jpg",
] as const;
const SHIBUYA_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/c/c5/Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg";
const SHIBUYA_GALLERY = [
  SHIBUYA_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/2/22/Kaminarimon_of_Sensoji_Temple_2.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/50/Tokyo_Skytree_at_night_view.jpg",
] as const;
const SYDNEY_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/7/7c/Sydney_Opera_House_-_Dec_2008.jpg";
const SYDNEY_GALLERY = [
  SYDNEY_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/2/23/Sydney_Harbour_Bridge_and_Opera_House_at_dusk.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/ea/Sydney_%28AU%29%2C_Opera_House_--_2019_--_3054.jpg",
] as const;

const MOSCOW_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/2/26/Moscow%27s_Red_Square%2C_Moscow%2C_Russia.jpg";
const MOSCOW_GALLERY = [
  MOSCOW_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/4/40/Sant_Vasily_cathedral_in_Moscow.JPG",
  "https://upload.wikimedia.org/wikipedia/commons/e/e3/View_to_Moscow_river_from_Bolshoy_Moskvoretsky_Bridge.jpg",
] as const;
const DUBAI_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/e/e0/Burj_dubai_3.11.08.jpg";
const DUBAI_GALLERY = [
  DUBAI_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/8/8a/%28UAE%29_The_Dubai_Fountain_at_Dusk_02.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/8c/Marina_Bay_Sands_and_illuminated_polyhedral_building_Louis_Vuitton_over_the_water_at_blue_hour_with_pink_clouds_in_Singapore.jpg",
] as const;
const HK_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/8/87/Panorama_of_Hong_Kong_Harbour_from_The_Peak_dllu.jpg";
const HK_GALLERY = [
  HK_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/2/23/Hong_Kong_Skyline_Restitch_-_Dec_2007.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/5/59/Tsim_Sha_Tsui_Ferry_Pier.jpg",
] as const;
const RIO_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/4/4f/Christ_the_Redeemer_-_Cristo_Redentor.jpg";
const RIO_GALLERY = [
  RIO_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/4/4c/Rio_de_Janeiro_Copacabana-20110505-RM-100139.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/8/86/Rio_de_Janeiro_from_Sugarloaf_mountain%2C_May_2004.jpg",
] as const;
const ROME_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/5/53/Colosseum_in_Rome%2C_Italy_-_April_2007.jpg";
const ROME_GALLERY = [
  ROME_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/d/d7/Forum_romanum_6k_%285760x2097%29.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/e/ee/Sagrada_Familia_01.jpg",
] as const;
const LONDON_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/8/87/Palace_of_Westminster_from_the_dome_on_Methodist_Central_Hall.jpg";
const LONDON_GALLERY = [
  LONDON_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/5/5f/Tower_Bridge_London_Dusk_Feb_2006.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/9/9a/London_Big_Ben_Phone_box.jpg",
] as const;
const BARCELONA_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/e/ee/Sagrada_Familia_01.jpg";
const BARCELONA_GALLERY = [
  BARCELONA_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/a/a9/Mosaics_of_Park_G%C3%BCell_Barcelona_01.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/1b/Exterior_of_Casa_Batl%C3%B3_-_Barcelona_2014.jpg",
] as const;
const SINGAPORE_IMG =
  "https://upload.wikimedia.org/wikipedia/commons/8/8c/Marina_Bay_Sands_and_illuminated_polyhedral_building_Louis_Vuitton_over_the_water_at_blue_hour_with_pink_clouds_in_Singapore.jpg";
const SINGAPORE_GALLERY = [
  SINGAPORE_IMG,
  "https://upload.wikimedia.org/wikipedia/commons/0/07/Merli%C3%B3n%2C_Marina_Bay%2C_Singapur%2C_2023-08-18%2C_DD_45-47_HDR.jpg",
  "https://upload.wikimedia.org/wikipedia/commons/1/16/Supertree_Grove%2C_Gardens_by_the_Bay%2C_Singapore1.jpg",
] as const;

/**
 * Homepage grid: famous, high-traffic places people actually visit—no AI, no geolocation.
 * IDs use `tp-` prefix so they don’t collide with local demo plan ids.
 */
export const TOP_PLACES_CATALOG: Plan[] = [
  {
    id: "tp-pike-place",
    title: "Pike Place & the waterfront",
    tagline: "Fish tosses, craft stalls, and Elliott Bay breeze—a Seattle classic.",
    price: "~$25–45/pp",
    meta: "FOODIE · 4–6 PEOPLE · 2.5 HRS",
    metaClass: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
    stop: "Pike Place Market (5:30 PM)",
    coverImageSrc: PIKE_IMG,
    coverImageAlt: "Pike Street near Pike Place Market, Seattle",
    photoCredit: "Pike Place Market - Seattle",
    galleryImageSrcs: [PIKE_IMG],
    formattedAddress: "85 Pike St, Seattle, WA 98101, USA",
    placeLat: 47.6097,
    placeLng: -122.3425,
    duration: "2.5 hrs",
    groupLabel: "4–6",
    vibe: "foodie",
    minGroup: 4,
    maxGroup: 6,
    available: true,
    viewing: 11,
    locationDetails: [
      "Wander the main arcade and waterfront for the full market energy.",
      "Split up for coffee, pastries, and small bites—reconvene at the pig statue.",
      "Walk down to the piers for ferries and Puget Sound views.",
    ],
  },
  {
    id: "tp-cloud-gate",
    title: "Cloud Gate & Millennium Park",
    tagline: "The Bean, skyline reflections, and an easy loop through downtown green space.",
    price: "Free",
    meta: "ACTIVE · 2–6 PEOPLE · 2 HRS",
    metaClass: "bg-brand-soft text-brand ring-1 ring-brand/20",
    stop: "Millennium Park (12:00 PM)",
    coverImageSrc: BEAN_IMG,
    coverImageAlt: "Cloud Gate sculpture, Chicago",
    photoCredit: "Millennium Park - Chicago",
    galleryImageSrcs: [...CHICAGO_GALLERY],
    formattedAddress: "201 E Randolph St, Chicago, IL 60602, USA",
    placeLat: 41.8826,
    placeLng: -87.6226,
    duration: "2 hrs",
    groupLabel: "2–6",
    vibe: "active",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 14,
    locationDetails: [
      "Snap photos under the Bean, then stroll the park lawns and art installations.",
      "Grab lunch on Michigan Ave or deep-dish a few blocks away.",
      "Loop toward the lakefront if the group wants more steps.",
    ],
  },
  {
    id: "tp-brooklyn-bridge",
    title: "Brooklyn Bridge sunset walk",
    tagline: "Boardwalk views, Manhattan skyline, and Dumbo just on the other side.",
    price: "Free",
    meta: "CHILL · 2–8 PEOPLE · 2 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Manhattan approach (7:00 PM)",
    coverImageSrc: BROOKLYN_IMG,
    coverImageAlt: "Brooklyn Bridge toward Manhattan",
    photoCredit: "Brooklyn Bridge - New York",
    galleryImageSrcs: [...BROOKLYN_GALLERY],
    formattedAddress: "Brooklyn Bridge, New York, NY 10038, USA",
    placeLat: 40.7061,
    placeLng: -73.9969,
    duration: "2 hrs",
    groupLabel: "2–8",
    vibe: "chill",
    minGroup: 2,
    maxGroup: 8,
    available: true,
    viewing: 18,
    locationDetails: [
      "Meet on the Brooklyn side for golden-hour photos toward Manhattan.",
      "Walk the full span—wide enough to spread out and still feel together.",
      "Drop into Dumbo for pizza, ice cream, or waterfront drinks after.",
    ],
  },
  {
    id: "tp-eiffel-trocadero",
    title: "Eiffel view & Seine stroll",
    tagline: "Trocadéro terraces, bridge views, and the tower lit up after dark.",
    price: "~€15–35/pp",
    meta: "CHILL · 2–6 PEOPLE · 3 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Trocadéro (7:45 PM)",
    coverImageSrc: EIFFEL_IMG,
    coverImageAlt: "Eiffel Tower from Trocadéro, Paris",
    photoCredit: "Trocadéro - Paris",
    galleryImageSrcs: [...PARIS_GALLERY],
    formattedAddress: "Pl. du Trocadéro et du 11 Novembre, 75016 Paris, France",
    placeLat: 48.8616,
    placeLng: 2.289,
    duration: "3 hrs",
    groupLabel: "2–6",
    vibe: "chill",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 15,
    locationDetails: [
      "Watch the tower sparkle from the esplanade—no rush to cross the river.",
      "Walk the Seine embankment for cafés and street lamps.",
      "Save room for a late crêpe or wine stop on the way back.",
    ],
  },
  {
    id: "tp-shibuya",
    title: "Shibuya crossing & backstreets",
    tagline: "Scramble crossing energy, neon alleys, and late-night snacks.",
    price: "~¥1–3k/pp",
    meta: "ADV · 2–6 PEOPLE · 3 HRS",
    metaClass: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
    stop: "Shibuya Station (8:30 PM)",
    coverImageSrc: SHIBUYA_IMG,
    coverImageAlt: "Shibuya scramble crossing, Tokyo",
    photoCredit: "Shibuya - Tokyo",
    galleryImageSrcs: [SHIBUYA_IMG],
    formattedAddress: "2 Chome-1 Dogenzaka, Shibuya City, Tokyo 150-0043, Japan",
    placeLat: 35.6595,
    placeLng: 139.7004,
    duration: "3 hrs",
    groupLabel: "2–6",
    vibe: "adv",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 22,
    locationDetails: [
      "Cross the scramble a few times—it never gets old on a first visit.",
      "Duck into Center Gai for arcades, karaoke, and tiny bars.",
      "End with ramen or yakitori when the group needs a reset.",
    ],
  },
  {
    id: "tp-sydney-opera",
    title: "Harbour & Opera House walk",
    tagline: "Sails, ferries, and the bridge—Sydney’s postcard in one stroll.",
    price: "~$20–40/pp",
    meta: "CHILL · 2–8 PEOPLE · 2.5 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Sydney Opera House (6:15 PM)",
    coverImageSrc: SYDNEY_IMG,
    coverImageAlt: "Sydney Opera House and harbour",
    photoCredit: "Sydney Opera House - Sydney",
    galleryImageSrcs: [...SYDNEY_GALLERY],
    formattedAddress: "Bennelong Point, Sydney NSW 2000, Australia",
    placeLat: -33.8568,
    placeLng: 151.2153,
    duration: "2.5 hrs",
    groupLabel: "2–8",
    vibe: "chill",
    minGroup: 2,
    maxGroup: 8,
    available: true,
    viewing: 13,
    locationDetails: [
      "Circle the Opera House forecourt for photos from every angle.",
      "Grab drinks at Circular Quay or walk toward the Botanic Garden.",
      "Ferry hop optional if someone wants harbor breeze without the hike.",
    ],
  },
  {
    id: "tp-moscow-red-square",
    title: "Red Square & Kitay-gorod evening",
    tagline: "St. Basil’s domes, Kremlin walls, and the classic Moscow stroll.",
    price: "~₽1.5–4k/pp",
    meta: "ADV · 2–6 PEOPLE · 3 HRS",
    metaClass: "bg-violet-50 text-violet-800 ring-1 ring-violet-100",
    stop: "Red Square (7:00 PM)",
    coverImageSrc: MOSCOW_IMG,
    coverImageAlt: "Red Square and historic facades, Moscow",
    photoCredit: "Red Square - Moscow",
    galleryImageSrcs: [...MOSCOW_GALLERY],
    formattedAddress: "Red Square, Moscow, Russia",
    placeLat: 55.7539,
    placeLng: 37.6208,
    duration: "3 hrs",
    groupLabel: "2–6",
    vibe: "adv",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 16,
    locationDetails: [
      "Circle the square for St. Basil’s, the Kremlin wall, and GUM’s glass roof.",
      "Walk Kitay-gorod lanes for courtyards, bars, and Soviet mosaics nearby.",
      "End with metro architecture or a late riverside view from a bridge.",
    ],
  },
  {
    id: "tp-dubai-marina",
    title: "Burj Khalifa lights & Marina walk",
    tagline: "World’s tallest tower, fountain shows, and a breezy waterfront promenade.",
    price: "~AED 80–250/pp",
    meta: "FOODIE · 2–8 PEOPLE · 3 HRS",
    metaClass: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
    stop: "Downtown Dubai (8:00 PM)",
    coverImageSrc: DUBAI_IMG,
    coverImageAlt: "Burj Khalifa and downtown Dubai skyline",
    photoCredit: "Burj Khalifa - Dubai",
    galleryImageSrcs: [...DUBAI_GALLERY],
    formattedAddress: "1 Sheikh Mohammed bin Rashid Blvd, Dubai, UAE",
    placeLat: 25.1972,
    placeLng: 55.2744,
    duration: "3 hrs",
    groupLabel: "2–8",
    vibe: "foodie",
    minGroup: 2,
    maxGroup: 8,
    available: true,
    viewing: 19,
    locationDetails: [
      "Catch the Dubai Fountain from the boardwalk, then look up at Burj Khalifa.",
      "Stroll Dubai Mall’s food hall or a rooftop lounge for the group.",
      "Walk Marina Promenade for yachts, neon towers, and late desserts.",
    ],
  },
  {
    id: "tp-hong-kong-harbour",
    title: "Victoria Peak & Star Ferry",
    tagline: "Harbour panoramas, the classic ferry crossing, and Kowloon lights.",
    price: "~HK$150–400/pp",
    meta: "ACTIVE · 2–6 PEOPLE · 3 HRS",
    metaClass: "bg-brand-soft text-brand ring-1 ring-brand/20",
    stop: "Peak Tram Upper Terminus (5:30 PM)",
    coverImageSrc: HK_IMG,
    coverImageAlt: "Hong Kong skyline from Victoria Peak",
    photoCredit: "Victoria Peak - Hong Kong",
    galleryImageSrcs: [...HK_GALLERY],
    formattedAddress: "The Peak, Hong Kong",
    placeLat: 22.2759,
    placeLng: 114.1455,
    duration: "3 hrs",
    groupLabel: "2–6",
    vibe: "active",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 17,
    locationDetails: [
      "Ride or walk up for the classic harbour panorama at blue hour.",
      "Take the Star Ferry across for Symphony of Lights views from Tsim Sha Tsui.",
      "Snack through Temple Street or a harbour-front bar before heading back.",
    ],
  },
  {
    id: "tp-rio-corcovado",
    title: "Christ & Copacabana golden hour",
    tagline: "Corcovado views, beach boardwalk, and bossa-nova energy.",
    price: "~R$40–120/pp",
    meta: "CHILL · 2–8 PEOPLE · 3 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Corcovado access (4:30 PM)",
    coverImageSrc: RIO_IMG,
    coverImageAlt: "Christ the Redeemer statue above Rio de Janeiro",
    photoCredit: "Corcovado - Rio de Janeiro",
    galleryImageSrcs: [...RIO_GALLERY],
    formattedAddress: "Parque Nacional da Tijuca, Rio de Janeiro, Brazil",
    placeLat: -22.9519,
    placeLng: -43.2105,
    duration: "3 hrs",
    groupLabel: "2–8",
    vibe: "chill",
    minGroup: 2,
    maxGroup: 8,
    available: true,
    viewing: 14,
    locationDetails: [
      "Time the monument for soft light over the bay, beaches, and forest.",
      "Drop to Copacabana or Ipanema for a boardwalk stroll and coconut water.",
      "Share petiscos and live music when the group wants to linger late.",
    ],
  },
  {
    id: "tp-rome-antica",
    title: "Colosseum loop & Forum light",
    tagline: "Ancient Rome’s greatest hits—arches, forums, and gelato detours.",
    price: "~€25–55/pp",
    meta: "ACTIVE · 2–6 PEOPLE · 3 HRS",
    metaClass: "bg-brand-soft text-brand ring-1 ring-brand/20",
    stop: "Colosseum (9:30 AM)",
    coverImageSrc: ROME_IMG,
    coverImageAlt: "Colosseum exterior, Rome",
    photoCredit: "Colosseum - Rome",
    galleryImageSrcs: [...ROME_GALLERY],
    formattedAddress: "Piazza del Colosseo, 1, 00184 Roma RM, Italy",
    placeLat: 41.8902,
    placeLng: 12.4922,
    duration: "3 hrs",
    groupLabel: "2–6",
    vibe: "active",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 20,
    locationDetails: [
      "Walk the Colosseum oval and peek at the Forum from the terraces.",
      "Thread Via dei Fori Imperiali toward Piazza Venezia without rushing tickets.",
      "Cool down with gelato toward Monti or a café in the shade.",
    ],
  },
  {
    id: "tp-london-thames",
    title: "Westminster to Tower Bridge",
    tagline: "Parliament, the Thames path, and London icons in one riverside walk.",
    price: "~£20–45/pp",
    meta: "CHILL · 2–8 PEOPLE · 2.5 HRS",
    metaClass: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
    stop: "Westminster Pier (6:00 PM)",
    coverImageSrc: LONDON_IMG,
    coverImageAlt: "Palace of Westminster and Thames, London",
    photoCredit: "Westminster - London",
    galleryImageSrcs: [...LONDON_GALLERY],
    formattedAddress: "Westminster, London SW1A 2JR, UK",
    placeLat: 51.5014,
    placeLng: -0.1245,
    duration: "2.5 hrs",
    groupLabel: "2–8",
    vibe: "chill",
    minGroup: 2,
    maxGroup: 8,
    available: true,
    viewing: 21,
    locationDetails: [
      "Start at Big Ben and Parliament, then follow the South Bank promenade.",
      "Pass the London Eye, street performers, and book stalls toward the bridge.",
      "Finish near Tower Bridge for photos or a pub stop by the water.",
    ],
  },
  {
    id: "tp-barcelona-gaudi",
    title: "Sagrada Família & Park Güell",
    tagline: "Gaudí’s stone forest, mosaic terraces, and Eixample tapas.",
    price: "~€35–70/pp",
    meta: "FOODIE · 2–6 PEOPLE · 3 HRS",
    metaClass: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
    stop: "Sagrada Família (10:00 AM)",
    coverImageSrc: BARCELONA_IMG,
    coverImageAlt: "Sagrada Família basilica, Barcelona",
    photoCredit: "Sagrada Família - Barcelona",
    galleryImageSrcs: [...BARCELONA_GALLERY],
    formattedAddress: "C/ de Mallorca, 401, 08013 Barcelona, Spain",
    placeLat: 41.4036,
    placeLng: 2.1744,
    duration: "3 hrs",
    groupLabel: "2–6",
    vibe: "foodie",
    minGroup: 2,
    maxGroup: 6,
    available: true,
    viewing: 18,
    locationDetails: [
      "Take in the Nativity façade and towers—even from the park outside it wows.",
      "Shuttle or walk to Park Güell for mosaic benches and city views.",
      "Recover with vermut and pintxos closer to Gràcia or Eixample.",
    ],
  },
  {
    id: "tp-singapore-marina",
    title: "Marina Bay & Supertree Grove",
    tagline: "Skyline light shows, LV pavilion reflections, and garden walks.",
    price: "~S$40–90/pp",
    meta: "ADV · 2–8 PEOPLE · 2.5 HRS",
    metaClass: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
    stop: "Marina Bay Sands promenade (7:30 PM)",
    coverImageSrc: SINGAPORE_IMG,
    coverImageAlt: "Marina Bay Sands and bay at dusk, Singapore",
    photoCredit: "Marina Bay - Singapore",
    galleryImageSrcs: [...SINGAPORE_GALLERY],
    formattedAddress: "10 Bayfront Ave, Singapore 018956",
    placeLat: 1.2838,
    placeLng: 103.8607,
    duration: "2.5 hrs",
    groupLabel: "2–8",
    vibe: "adv",
    minGroup: 2,
    maxGroup: 8,
    available: true,
    viewing: 16,
    locationDetails: [
      "Walk the promenade for Sands, ArtScience Museum, and the bay reflections.",
      "Cross to Merlion Park for the postcard shot, then into Gardens by the Bay.",
      "Catch the Supertree light show before a late hawker-centre run.",
    ],
  },
  {
    id: "tp-atl-ponce",
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
    galleryImageSrcs: ["/images/ponce-city-market.png", ...PONCE_GALLERY_EXTRAS],
    placeLat: 33.7721,
    placeLng: -84.3653,
    formattedAddress: "675 Ponce De Leon Ave NE, Atlanta, GA 30308, USA",
    duration: "2.5 hrs",
    groupLabel: "4–6",
    vibe: "chill",
    minGroup: 4,
    maxGroup: 6,
    available: true,
    viewing: 9,
    locationDetails: [
      "Hop between food stalls, sit-down spots, and shops under the brick arches.",
      "Walk or bike the Eastside Trail right outside for golden-hour views.",
      "Meet at the central courtyard when everyone arrives on their own time.",
    ],
  },
  {
    id: "tp-atl-piedmont",
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
    viewing: 10,
    locationDetails: [
      "Circle Lake Clara Meer for a flat, easy loop with skyline reflections.",
      "Spread out on open lawns or use the active oval for a light jog.",
      "Finish with cold coffee from a nearby café on the park edge.",
    ],
  },
  {
    id: "tp-atl-krog",
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
    viewing: 8,
    locationDetails: [
      "Share small plates from different vendors so nobody has to pick one restaurant.",
      "Post up on the covered patio or high-top rails for a social, low-pressure dinner.",
      "Stroll Krog Street Tunnel murals if you want a quick art break between bites.",
    ],
  },
];

/** /plans with no area — same local Atlanta demo as before. */
export const TONIGHT_CATALOG_PLANS = PLANS;

export function getPlanById(id: string): Plan | undefined {
  return (
    PLANS.find((p) => p.id === id) ??
    TOP_PLACES_CATALOG.find((p) => p.id === id)
  );
}

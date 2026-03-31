/**
 * Real venues for the home hero marquee — local demo assets plus Wikimedia Commons
 * photos (each file exists on Commons; query opens the place in Google Maps).
 */

export type HeroMarqueeVibe = "chill" | "active" | "foodie" | "adv";

export type HeroMarqueePlace = {
  id: string;
  title: string;
  stop: string;
  credit: string;
  vibe: HeroMarqueeVibe;
  imageSrc: string;
  imageAlt: string;
  mapsQuery: string;
};

const vibeMetaClass: Record<HeroMarqueeVibe, string> = {
  chill: "bg-indigo-50 text-indigo-700 ring-1 ring-indigo-100",
  active: "bg-brand-soft text-brand ring-1 ring-brand/20",
  foodie: "bg-amber-50 text-amber-800 ring-1 ring-amber-100",
  adv: "bg-emerald-50 text-emerald-800 ring-1 ring-emerald-100",
};

const vibeLabel: Record<HeroMarqueeVibe, string> = {
  chill: "Chill",
  active: "Active",
  foodie: "Foodie",
  adv: "Adventurous",
};

export function marqueeVibeClass(v: HeroMarqueeVibe): string {
  return vibeMetaClass[v];
}

export function marqueeVibeLabel(v: HeroMarqueeVibe): string {
  return vibeLabel[v];
}

/** Atlanta venues for the home hero marquee. */
export const HERO_MARQUEE_PLACES: HeroMarqueePlace[] = [
  {
    id: "m-ponce",
    title: "Ponce & BeltLine golden hour",
    stop: "Ponce City Market (6:30 PM)",
    credit: "Ponce City Market · Atlanta",
    vibe: "chill",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Ponce_City_Market,_Atlanta.jpg",
    imageAlt: "Ponce City Market, Atlanta",
    mapsQuery: "Ponce City Market, Atlanta, GA",
  },
  {
    id: "m-piedmont",
    title: "Piedmont Park morning loop",
    stop: "Piedmont Park — 12th St (8:00 AM)",
    credit: "Piedmont Park · Atlanta",
    vibe: "active",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Lake_Clara_Meer_in_Atlanta,_GA,_USA.jpg",
    imageAlt: "Piedmont Park, Atlanta",
    mapsQuery: "Piedmont Park, Atlanta, GA",
  },
  {
    id: "m-krog",
    title: "Krog Street tasting line",
    stop: "Krog Street Market (7:15 PM)",
    credit: "Krog Street Market · Atlanta",
    vibe: "foodie",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Krog_Street_Tunnel_-_Atlanta,_GA_-_Flickr_-_hyku_(31).jpg",
    imageAlt: "Krog Street Market, Atlanta",
    mapsQuery: "Krog Street Market, Atlanta, GA",
  },
  {
    id: "m-mbs",
    title: "Mercedes-Benz Stadium circuit",
    stop: "Northside Dr NW (4:30 PM)",
    credit: "Mercedes-Benz Stadium · Atlanta",
    vibe: "adv",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Mercedes-Benz_Stadium_with_the_Georgia_Dome_remains_in_the_foreground_(27663350329).jpg",
    imageAlt: "Mercedes-Benz Stadium, Atlanta",
    mapsQuery: "Mercedes-Benz Stadium, Atlanta, GA",
  },
  {
    id: "m-beltline",
    title: "BeltLine Eastside Trail sunset",
    stop: "Old Fourth Ward (6:00 PM)",
    credit: "BeltLine · Atlanta",
    vibe: "active",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Irwin_street_market_o4w_atlanta.JPG",
    imageAlt: "Irwin Street Market in Atlanta's Old Fourth Ward",
    mapsQuery: "Atlanta BeltLine Eastside Trail, Atlanta, GA",
  },
  {
    id: "m-l5p",
    title: "Little Five Points bar crawl",
    stop: "Moreland Ave (8:00 PM)",
    credit: "Little Five Points · Atlanta",
    vibe: "adv",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Little_five_points_shops.jpg",
    imageAlt: "Shops in Little Five Points, Atlanta",
    mapsQuery: "Little Five Points, Atlanta, GA",
  },
  {
    id: "m-atlantic",
    title: "Atlantic Station evening roam",
    stop: "17th St NW (7:00 PM)",
    credit: "Atlantic Station · Atlanta",
    vibe: "chill",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Atlantic_Station_parking_deck_and_shopping_district.jpg",
    imageAlt: "Atlantic Station, Atlanta",
    mapsQuery: "Atlantic Station, Atlanta, GA",
  },
  {
    id: "m-midtown",
    title: "Midtown arts & eats",
    stop: "Peachtree St NE (6:30 PM)",
    credit: "Midtown · Atlanta",
    vibe: "foodie",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Midtown_Atlanta_skyline_from_Clara_Meer_in_Piedmont_Park.JPG",
    imageAlt: "Midtown Atlanta skyline from Piedmont Park",
    mapsQuery: "Midtown Atlanta, GA",
  },
];

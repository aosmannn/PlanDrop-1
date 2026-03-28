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

/** 18 real spots — mix of PlanDrop demo locals + global landmarks. */
export const HERO_MARQUEE_PLACES: HeroMarqueePlace[] = [
  {
    id: "m-ponce",
    title: "Ponce & BeltLine golden hour",
    stop: "Ponce City Market (6:30 PM)",
    credit: "Ponce City Market · Atlanta",
    vibe: "chill",
    imageSrc: "/images/ponce-city-market.png",
    imageAlt: "Ponce City Market, Atlanta",
    mapsQuery: "Ponce City Market, Atlanta, GA",
  },
  {
    id: "m-piedmont",
    title: "Piedmont Park morning loop",
    stop: "Piedmont Park — 12th St (8:00 AM)",
    credit: "Piedmont Park · Atlanta",
    vibe: "active",
    imageSrc: "/images/piedmont-park-clara-meer.png",
    imageAlt: "Piedmont Park, Atlanta",
    mapsQuery: "Piedmont Park, Atlanta, GA",
  },
  {
    id: "m-krog",
    title: "Krog Street tasting line",
    stop: "Krog Street Market (7:15 PM)",
    credit: "Krog Street Market · Atlanta",
    vibe: "foodie",
    imageSrc: "/images/krog-street-market.png",
    imageAlt: "Krog Street Market, Atlanta",
    mapsQuery: "Krog Street Market, Atlanta, GA",
  },
  {
    id: "m-mbs",
    title: "Mercedes-Benz Stadium circuit",
    stop: "Northside Dr NW (4:30 PM)",
    credit: "Mercedes-Benz Stadium · Atlanta",
    vibe: "adv",
    imageSrc: "/images/mercedes-benz-stadium.png",
    imageAlt: "Mercedes-Benz Stadium, Atlanta",
    mapsQuery: "Mercedes-Benz Stadium, Atlanta, GA",
  },
  {
    id: "m-pike",
    title: "Pike Place & the waterfront",
    stop: "Pike Street (5:30 PM)",
    credit: "Pike Place · Seattle",
    vibe: "foodie",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/7/7b/Seattle_%28WA%2C_USA%29%2C_Pike_Street%2C_Lampe_--_2022_--_1808.jpg",
    imageAlt: "Pike Street near Pike Place Market, Seattle",
    mapsQuery: "Pike Place Market, Seattle, WA",
  },
  {
    id: "m-bean",
    title: "Cloud Gate & loop walk",
    stop: "Millennium Park (12:00 PM)",
    credit: "Cloud Gate · Chicago",
    vibe: "active",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/e/eb/Chicago_from_under_the_Cloud_Gate_%289694666470%29.jpg",
    imageAlt: "Cloud Gate, Millennium Park, Chicago",
    mapsQuery: "Cloud Gate, Millennium Park, Chicago, IL",
  },
  {
    id: "m-brooklyn",
    title: "Brooklyn Bridge sunset",
    stop: "Manhattan approach (7:00 PM)",
    credit: "Brooklyn Bridge · NYC",
    vibe: "chill",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/0/00/Brooklyn_Bridge_Manhattan.jpg",
    imageAlt: "Brooklyn Bridge, New York City",
    mapsQuery: "Brooklyn Bridge, New York, NY",
  },
  {
    id: "m-zocalo",
    title: "Zócalo golden hour",
    stop: "Plaza de la Constitución (6:00 PM)",
    credit: "Zócalo · Mexico City",
    vibe: "adv",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/5/51/Monumental_Flag%2C_Zocalo%2C_Mexico_20250907_p1.jpg",
    imageAlt: "Zócalo, Mexico City",
    mapsQuery: "Zócalo, Mexico City, Mexico",
  },
  {
    id: "m-griffith",
    title: "Griffith Observatory trail",
    stop: "East Observatory Rd (5:45 PM)",
    credit: "Griffith Park · Los Angeles",
    vibe: "active",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/9/93/Griffith_Observatory_1990.jpg",
    imageAlt: "Griffith Observatory, Los Angeles",
    mapsQuery: "Griffith Observatory, Los Angeles, CA",
  },
  {
    id: "m-nola",
    title: "French Quarter brass & balconies",
    stop: "Royal Street (8:00 PM)",
    credit: "French Quarter · New Orleans",
    vibe: "foodie",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/2/2f/Genthe_-_Royal_Street_French_Quarter_New_Orleans_1920s_-_View_With_Wagon.jpg",
    imageAlt: "Royal Street, French Quarter, New Orleans",
    mapsQuery: "Royal Street, New Orleans, LA",
  },
  {
    id: "m-stanley",
    title: "Stanley Park seawall",
    stop: "Seawall path (10:00 AM)",
    credit: "Stanley Park · Vancouver",
    vibe: "active",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/3/39/Vancouver_%28BC%2C_Canada%29%2C_Stanley_Park%2C_Stanley_Park_Seawall_Path_--_2022_--_2056.jpg",
    imageAlt: "Stanley Park seawall, Vancouver",
    mapsQuery: "Stanley Park, Vancouver, BC",
  },
  {
    id: "m-shibuya",
    title: "Shibuya crossing & alleys",
    stop: "Shibuya Station (8:30 PM)",
    credit: "Shibuya · Tokyo",
    vibe: "adv",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/c/c5/Tokyo_Shibuya_Scramble_Crossing_2018-10-09.jpg",
    imageAlt: "Shibuya scramble crossing, Tokyo",
    mapsQuery: "Shibuya Crossing, Tokyo, Japan",
  },
  {
    id: "m-sydney",
    title: "Harbour walk & opera house",
    stop: "Opera House (6:15 PM)",
    credit: "Sydney Harbour · Australia",
    vibe: "chill",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/7/7c/Sydney_Opera_House_-_Dec_2008.jpg",
    imageAlt: "Sydney Opera House",
    mapsQuery: "Sydney Opera House, Australia",
  },
  {
    id: "m-camden",
    title: "Camden Market crawl",
    stop: "Camden High St (1:00 PM)",
    credit: "Camden · London",
    vibe: "foodie",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/e/ef/Camden_market.jpg",
    imageAlt: "Camden Market, London",
    mapsQuery: "Camden Market, London, UK",
  },
  {
    id: "m-trocadero",
    title: "Eiffel view & Seine stroll",
    stop: "Trocadéro (7:45 PM)",
    credit: "Paris · France",
    vibe: "chill",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/8/85/Tour_Eiffel_Wikimedia_Commons_%28cropped%29.jpg",
    imageAlt: "Eiffel Tower, Paris",
    mapsQuery: "Trocadéro, Paris, France",
  },
  {
    id: "m-redrocks",
    title: "Red Rocks amphitheater",
    stop: "Red Rocks Park (6:30 PM)",
    credit: "Morrison · Colorado",
    vibe: "adv",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/2/2b/Red_Rocks_Amphitheatre_from_top_of_amphitheatre.jpeg",
    imageAlt: "Red Rocks Amphitheatre, Colorado",
    mapsQuery: "Red Rocks Amphitheatre, Morrison, CO",
  },
  {
    id: "m-marina",
    title: "Marina Bay evening lights",
    stop: "Marina Bay (8:00 PM)",
    credit: "Marina Bay · Singapore",
    vibe: "chill",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/f/f3/ArtScience_Museum%2C_Marina_Bay_Sands%2C_Singapore.jpg",
    imageAlt: "ArtScience Museum and Marina Bay Sands, Singapore",
    mapsQuery: "Marina Bay Sands, Singapore",
  },
  {
    id: "m-campnou",
    title: "Camp Nou match night",
    stop: "Camp Nou (4:00 PM)",
    credit: "Barcelona · Spain",
    vibe: "active",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/commons/e/e7/LFP_-_Barcelona_vs_Mallorca_pre-match_-_Oct_3rd_2010.jpg",
    imageAlt: "Camp Nou stadium, Barcelona",
    mapsQuery: "Camp Nou, Barcelona, Spain",
  },
];

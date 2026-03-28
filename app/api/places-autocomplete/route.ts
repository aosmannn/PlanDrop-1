import { NextRequest, NextResponse } from "next/server";

type GooglePrediction = {
  description?: string;
  place_id?: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

/** Avoid calling Google with `.env` placeholder keys; use Nominatim instead. */
function googlePlacesKeyConfigured(key: string | null | undefined): boolean {
  const t = key?.trim() ?? "";
  if (t.length < 35) return false;
  if (!t.startsWith("AIza")) return false;
  if (/paste|placeholder|example|your_?key/i.test(t)) return false;
  return true;
}

const NOMINATIM_UA = "PlanDrop/1.0 (location search; +https://github.com/aosmannn/PlanDrop-1)";

type NominatimHit = {
  display_name?: string;
  lat?: string;
  lon?: string;
  osm_id?: number;
  osm_type?: string;
  name?: string;
  address?: Record<string, string>;
};

async function nominatimPredictions(query: string) {
  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", query);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("addressdetails", "1");
  url.searchParams.set("limit", "8");

  const res = await fetch(url.toString(), {
    cache: "no-store",
    headers: {
      Accept: "application/json",
      "User-Agent": NOMINATIM_UA,
    },
  });
  if (!res.ok) return [];

  const rows = (await res.json()) as NominatimHit[];
  if (!Array.isArray(rows)) return [];

  return rows.map((item) => {
    const description = (item.display_name ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const name = (item.name ?? "").trim() || description.split(",")[0]?.trim() || description;
    const secondary =
      description.length > name.length
        ? description.slice(name.length).replace(/^,\s*/, "").trim()
        : "";
    const osmId = item.osm_id ?? 0;
    const osmType = (item.osm_type ?? "x").charAt(0);
    return {
      description,
      placeId: `osm:${osmType}:${osmId}`,
      mainText: name,
      secondaryText: secondary,
    };
  });
}

/**
 * Proxies Google Places Autocomplete when a valid server key is set; otherwise
 * OpenStreetMap Nominatim (no API key). Be respectful: ~1 req/s policy for Nominatim.
 */
export async function GET(req: NextRequest) {
  const input = req.nextUrl.searchParams.get("input")?.trim() ?? "";
  const sessiontoken = req.nextUrl.searchParams.get("sessiontoken")?.trim() ?? "";

  if (input.length < 2) {
    return NextResponse.json({ predictions: [] });
  }
  if (input.length > 256) {
    return NextResponse.json({ error: "input too long" }, { status: 400 });
  }

  const key = process.env.GOOGLE_PLACES_API_KEY?.trim();
  if (!googlePlacesKeyConfigured(key)) {
    try {
      const predictions = await nominatimPredictions(input);
      return NextResponse.json({ predictions, source: "nominatim" as const });
    } catch (e) {
      console.warn("Nominatim autocomplete:", e);
      return NextResponse.json({ predictions: [], source: "nominatim" as const });
    }
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("key", key!);
  url.searchParams.set("language", "en");
  if (sessiontoken) {
    url.searchParams.set("sessiontoken", sessiontoken);
  }

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    return NextResponse.json({ predictions: [] });
  }

  const data = (await res.json()) as {
    status: string;
    error_message?: string;
    predictions?: GooglePrediction[];
  };

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    if (data.status !== "INVALID_REQUEST") {
      console.warn("Places autocomplete:", data.status, data.error_message);
    }
    return NextResponse.json({ predictions: [] });
  }

  let predictions = (data.predictions ?? []).map((p) => {
    const description = (p.description ?? "").replace(/\s+/g, " ").trim();
    const mainRaw =
      p.structured_formatting?.main_text?.replace(/\s+/g, " ").trim() ?? "";
    const secondaryRaw =
      p.structured_formatting?.secondary_text?.replace(/\s+/g, " ").trim() ?? "";
    return {
      description,
      placeId: (p.place_id ?? "").trim(),
      mainText: mainRaw || description,
      secondaryText: secondaryRaw,
    };
  });

  if (predictions.length === 0) {
    try {
      const nom = await nominatimPredictions(input);
      if (nom.length > 0) {
        predictions = nom;
        return NextResponse.json({
          predictions,
          source: "nominatim_fallback" as const,
        });
      }
    } catch {
      /* keep empty google results */
    }
  }

  return NextResponse.json({ predictions, source: "google" as const });
}

import { NextResponse } from "next/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin-optional";

export const runtime = "nodejs";

type VenueInterest = {
  business?: string;
  email?: string;
  neighborhood?: string;
  role?: string;
  phone?: string;
  venueType?: string;
  website?: string;
};

export async function POST(req: Request) {
  let body: VenueInterest;
  try {
    body = (await req.json()) as VenueInterest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const business = typeof body.business === "string" ? body.business.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const neighborhood = typeof body.neighborhood === "string" ? body.neighborhood.trim() : "";
  const role = typeof body.role === "string" ? body.role.trim() : "";
  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  const venueType = typeof body.venueType === "string" ? body.venueType.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (!business || !email || !neighborhood) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    console.log("[venue-interest/dev-fallback]", {
      business,
      email,
      neighborhood,
      role: role || null,
      phone: phone || null,
      venue_type: venueType || null,
      website: website || null,
      at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, mode: "dev-fallback" });
  } else {
    const { error } = await supabase.from("venue_interest").insert({
      business,
      email,
      neighborhood,
      role: role || null,
      phone: phone || null,
      venue_type: venueType || null,
      website: website || null,
    });
    if (error) {
      return NextResponse.json({ error: "Could not save interest" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}

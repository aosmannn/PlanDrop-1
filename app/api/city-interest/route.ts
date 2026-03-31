import { NextResponse } from "next/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin-optional";

export const runtime = "nodejs";

type CityInterest = {
  city?: string;
  email?: string;
  kind?: string;
};

export async function POST(req: Request) {
  let body: CityInterest;
  try {
    body = (await req.json()) as CityInterest;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const city = typeof body.city === "string" ? body.city.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const kind = typeof body.kind === "string" ? body.kind.trim() : "";

  if (!city) {
    return NextResponse.json({ error: "Missing city" }, { status: 400 });
  }

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    console.log("[city-interest/dev-fallback]", {
      city,
      email: email || null,
      kind: kind || null,
      at: new Date().toISOString(),
    });
    return NextResponse.json({ ok: true, mode: "dev-fallback" });
  } else {
    const { error } = await supabase.from("city_interest").insert({
      city,
      email: email || null,
      kind: kind || null,
    });
    if (error) {
      return NextResponse.json({ error: "Could not save interest" }, { status: 500 });
    }
  }

  return NextResponse.json({ ok: true });
}


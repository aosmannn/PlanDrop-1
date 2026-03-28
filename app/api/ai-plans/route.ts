import { NextResponse } from "next/server";
import { generateAiPlansForArea } from "@/lib/ai-plans-generate";
import { clampRadiusMiles } from "@/lib/search-radius";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: { area?: string; lat?: number; lng?: number; radiusMiles?: number };
  try {
    body = (await req.json()) as {
      area?: string;
      lat?: number;
      lng?: number;
      radiusMiles?: number;
    };
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const area = typeof body.area === "string" ? body.area.trim() : "";
  if (!area) {
    return NextResponse.json({ error: "Missing area" }, { status: 400 });
  }

  const lat =
    typeof body.lat === "number" && Number.isFinite(body.lat)
      ? body.lat
      : undefined;
  const lng =
    typeof body.lng === "number" && Number.isFinite(body.lng)
      ? body.lng
      : undefined;
  const radiusMiles =
    typeof body.radiusMiles === "number" && Number.isFinite(body.radiusMiles)
      ? clampRadiusMiles(body.radiusMiles)
      : undefined;

  try {
    const plans = await generateAiPlansForArea(area, lat, lng, radiusMiles);
    return NextResponse.json({ plans });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("ANTHROPIC_API_KEY")) {
      return NextResponse.json(
        { error: "AI plans are not configured (missing ANTHROPIC_API_KEY)." },
        { status: 503 },
      );
    }
    if (msg.includes("Could not generate") || msg.includes("parse") || msg.includes("Empty")) {
      return NextResponse.json({ error: msg }, { status: 502 });
    }
    return NextResponse.json(
      { error: "Could not generate plans. Try again in a moment." },
      { status: 502 },
    );
  }
}

import { NextResponse } from "next/server";

export const runtime = "nodejs";

/**
 * Proxies Google Place Photos so the browser never sees the API key.
 * GET /api/place-photo?ref=<photo_reference>&pid=<plan_id> (pid is cache-only; ignored upstream)
 */
export async function GET(req: Request) {
  const ref = new URL(req.url).searchParams.get("ref");
  const key = process.env.GOOGLE_PLACES_API_KEY;
  if (!ref?.trim() || !key?.trim()) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const url = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1200&photo_reference=${encodeURIComponent(ref.trim())}&key=${encodeURIComponent(key)}`;

  const res = await fetch(url, { redirect: "follow" });
  if (!res.ok) {
    return NextResponse.json({ error: "Photo unavailable" }, { status: 502 });
  }

  const contentType = res.headers.get("content-type") ?? "image/jpeg";
  const buf = await res.arrayBuffer();

  return new Response(buf, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

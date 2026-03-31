import { NextResponse } from "next/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin-optional";

export const runtime = "nodejs";

type Body = {
  planId?: string;
  sessionId?: string;
  claimKey?: string;
};

function makeCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < 6; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const planId = typeof body.planId === "string" ? body.planId.trim() : "";
  const sessionId =
    typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  const claimKey = typeof body.claimKey === "string" ? body.claimKey.trim() : "";

  // For per-claim codes, we key issuance by claimKey when available.
  // We store it in the existing `session_id` column to avoid a schema change.
  const issuerId = claimKey || sessionId;
  if (!planId || !issuerId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    // Dev fallback: deterministic-ish code per plan+session in memory.
    const g = globalThis as unknown as {
      __plandrop_venue_codes?: Map<string, string>;
    };
    if (!g.__plandrop_venue_codes) g.__plandrop_venue_codes = new Map();
    const key = `${planId}:${issuerId}`;
    const existing = g.__plandrop_venue_codes.get(key);
    if (existing) return NextResponse.json({ code: existing, mode: "dev-fallback" });
    const code = makeCode();
    g.__plandrop_venue_codes.set(key, code);
    console.log("[venue-code/issue/dev-fallback]", { planId, issuerId, code });
    return NextResponse.json({ code, mode: "dev-fallback" });
  }

  // Reuse an existing active code for this plan+session if present.
  const { data: existing } = await supabase
    .from("venue_code_issues")
    .select("code")
    .eq("plan_id", planId)
    .eq("session_id", issuerId)
    .is("redeemed_at", null)
    .order("issued_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existing?.code) {
    return NextResponse.json({ code: existing.code });
  }

  // Try a few times to avoid code collisions.
  for (let i = 0; i < 5; i++) {
    const code = makeCode();
    const { error } = await supabase.from("venue_code_issues").insert({
      plan_id: planId,
      session_id: issuerId,
      code,
    });
    if (!error) {
      return NextResponse.json({ code });
    }
  }

  return NextResponse.json({ error: "Could not issue code" }, { status: 500 });
}


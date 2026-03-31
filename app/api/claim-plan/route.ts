import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin-optional";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let planId: string;
  let sessionId: string;
  try {
    const body = (await req.json()) as { planId?: string; sessionId?: string };
    planId = typeof body.planId === "string" ? body.planId.trim() : "";
    sessionId = typeof body.sessionId === "string" ? body.sessionId.trim() : "";
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!planId || !sessionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    // Dev fallback: allow local UX without Supabase configured.
    // This does NOT provide global scarcity; it's only to unblock local development.
    const claimKey = randomUUID();
    console.log("[claim-plan/dev-fallback]", {
      planId,
      sessionId,
      claimKey,
      at: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, claimKey, mode: "dev-fallback" });
  }

  const claimKey = randomUUID();
  const nowIso = new Date().toISOString();
  const expiresAtIso = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString();

  // Best-effort cleanup so old/stale claims don’t block new ones.
  await supabase.from("plan_claims").delete().lt("expires_at", nowIso);

  const { error } = await supabase.from("plan_claims").insert({
    plan_id: planId,
    session_id: sessionId,
    claim_key: claimKey,
    expires_at: expiresAtIso,
  });

  if (error) {
    if (error.code === "23505") {
      const msg = (error.message ?? "").toLowerCase();
      const details = (error.details ?? "").toLowerCase();
      const isSessionConflict =
        msg.includes("plan_claims_session_id_uniq") || details.includes("session_id");
      return NextResponse.json(
        { error: isSessionConflict ? "already_have_claim" : "already_claimed" },
        { status: 409 },
      );
    }
    console.error("claim-plan insert", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, claimKey });
}

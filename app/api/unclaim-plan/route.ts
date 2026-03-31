import { NextResponse } from "next/server";
import { tryCreateAdminClient } from "@/lib/supabase/admin-optional";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let planId: string;
  let sessionId: string | undefined;
  let claimKey: string | undefined;
  try {
    const body = (await req.json()) as {
      planId?: string;
      sessionId?: string;
      claimKey?: string;
    };
    planId = typeof body.planId === "string" ? body.planId.trim() : "";
    sessionId =
      typeof body.sessionId === "string" ? body.sessionId.trim() : undefined;
    claimKey =
      typeof body.claimKey === "string" ? body.claimKey.trim() : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!planId) {
    return NextResponse.json({ error: "Missing planId" }, { status: 400 });
  }

  if (!claimKey && !sessionId) {
    return NextResponse.json(
      { error: "Missing sessionId or claimKey" },
      { status: 400 },
    );
  }

  const supabase = tryCreateAdminClient();
  if (!supabase) {
    // Dev fallback: allow local UX without Supabase configured.
    console.log("[unclaim-plan/dev-fallback]", {
      planId,
      sessionId: sessionId ?? null,
      claimKey: claimKey ?? null,
      at: new Date().toISOString(),
    });
    return NextResponse.json({ success: true, mode: "dev-fallback" });
  }

  let q = supabase.from("plan_claims").delete().eq("plan_id", planId);
  if (claimKey) {
    q = q.eq("claim_key", claimKey);
  } else if (sessionId) {
    q = q.eq("session_id", sessionId);
  }

  const { error } = await q;
  if (error) {
    console.error("unclaim-plan delete", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

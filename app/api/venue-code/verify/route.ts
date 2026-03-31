import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";

type Body = {
  code?: string;
  venueName?: string;
  groupSize?: number;
  note?: string;
};

export async function POST(req: Request) {
  try {
    let body: Body;
    try {
      body = (await req.json()) as Body;
    } catch {
      return NextResponse.json({ error: "invalid_json" }, { status: 400 });
    }

    const code = typeof body.code === "string" ? body.code.trim().toUpperCase() : "";
    const venueName = typeof body.venueName === "string" ? body.venueName.trim() : "";
    const groupSize =
      typeof body.groupSize === "number" && Number.isFinite(body.groupSize)
        ? Math.floor(body.groupSize)
        : null;
    const note = typeof body.note === "string" ? body.note.trim() : "";

    if (!code || !venueName) {
      return NextResponse.json({ error: "missing_fields" }, { status: 400 });
    }

    let supabase: ReturnType<typeof createAdminClient>;
    try {
      supabase = createAdminClient();
    } catch {
      // Dev fallback: allow local testing without Supabase keys.
      console.log("[venue-code/verify/dev-fallback]", {
        code,
        venue_name: venueName,
        group_size: groupSize,
        note: note || null,
        at: new Date().toISOString(),
      });
      return NextResponse.json({ ok: true, mode: "dev-fallback" });
    }

    // Prefer an atomic DB function when present (prevents "redeemed but not logged" states).
    const { data: rpcData, error: rpcErr } = await supabase.rpc("redeem_venue_code", {
      p_code: code,
      p_venue_name: venueName,
      p_group_size: groupSize,
      p_note: note || null,
    });

    if (!rpcErr) {
      const status = (rpcData as unknown as { status?: string } | null)?.status;
      if (status === "ok") return NextResponse.json({ ok: true });
      if (status === "invalid_code") {
        return NextResponse.json({ error: "invalid_code" }, { status: 404 });
      }
      if (status === "already_verified") {
        return NextResponse.json({ error: "already_verified" }, { status: 409 });
      }
      return NextResponse.json({ error: "verify_failed" }, { status: 500 });
    }

    // If the RPC doesn't exist yet (older DB), fall back to legacy flow.
    const rpcMissing =
      typeof rpcErr.message === "string" &&
      (rpcErr.message.includes("function redeem_venue_code") ||
        rpcErr.message.includes("does not exist"));
    if (!rpcMissing) {
      return NextResponse.json({ error: "verify_failed" }, { status: 500 });
    }

    const { data: issue, error: readErr } = await supabase
      .from("venue_code_issues")
      .select("id, plan_id, session_id, redeemed_at")
      .eq("code", code)
      .order("issued_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (readErr || !issue) {
      return NextResponse.json({ error: "invalid_code" }, { status: 404 });
    }
    if (issue.redeemed_at) {
      return NextResponse.json({ error: "already_verified" }, { status: 409 });
    }

    // Legacy (non-atomic): keep as last resort for older DBs.
    const now = new Date().toISOString();
    const { error: updErr } = await supabase
      .from("venue_code_issues")
      .update({ redeemed_at: now })
      .eq("id", issue.id);
    if (updErr) {
      return NextResponse.json({ error: "verify_failed" }, { status: 500 });
    }

    const { error: insErr } = await supabase.from("venue_verifications").insert({
      code,
      plan_id: issue.plan_id,
      session_id: issue.session_id,
      venue_name: venueName,
      group_size: groupSize,
      note: note || null,
    });
    if (insErr) {
      // This is usually “relation does not exist” when migrations weren't applied.
      const msg = insErr.message ?? "";
      if (typeof msg === "string" && msg.includes("venue_verifications")) {
        return NextResponse.json({ error: "server_missing_migration" }, { status: 500 });
      }
      return NextResponse.json({ error: "verify_failed" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch {
    // Ensure we always return JSON (prevents the UI from collapsing into a generic error).
    return NextResponse.json({ error: "verify_failed" }, { status: 500 });
  }
}


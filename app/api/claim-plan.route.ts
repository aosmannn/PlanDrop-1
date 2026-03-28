import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { planId, sessionId } = await req.json() as {
    planId: string;
    sessionId: string;
  };

  if (!planId || !sessionId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  const { error } = await supabase
    .from("plan_claims")
    .insert({ plan_id: planId, session_id: sessionId });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "already_claimed" }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const { planId, sessionId } = await req.json() as {
    planId: string;
    sessionId: string;
  };

  const cookieStore = cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } }
  );

  await supabase
    .from("plan_claims")
    .delete()
    .eq("plan_id", planId)
    .eq("session_id", sessionId);

  return NextResponse.json({ success: true });
}
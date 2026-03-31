import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Apple Wallet passes require a Pass Type ID certificate and signing keys.
// This endpoint is a stub so the client can link to it without exposing secrets.
export async function GET() {
  return NextResponse.json(
    {
      error:
        "Apple Wallet pass not configured. Add pass signing credentials to enable .pkpass downloads.",
    },
    { status: 501 },
  );
}


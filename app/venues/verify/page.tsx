"use client";

import { useState } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";

type FormState = "idle" | "submitting" | "success" | "error";

export default function VenueVerifyPage() {
  const [state, setState] = useState<FormState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [successSummary, setSuccessSummary] = useState<{
    venueName: string;
    groupSize?: number;
  } | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setError(null);

    const form = e.currentTarget;
    const code = (form.elements.namedItem("code") as HTMLInputElement).value.trim();
    const venueName = (form.elements.namedItem("venueName") as HTMLInputElement).value.trim();
    const groupSizeRaw = (form.elements.namedItem("groupSize") as HTMLInputElement).value.trim();
    const note = (form.elements.namedItem("note") as HTMLInputElement).value.trim();
    const groupSize = groupSizeRaw ? Number.parseInt(groupSizeRaw, 10) : undefined;

    try {
      const res = await fetch("/api/venue-code/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, venueName, groupSize, note }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? "verify_failed");
      }
      setSuccessSummary({
        venueName,
        ...(typeof groupSize === "number" && Number.isFinite(groupSize)
          ? { groupSize }
          : {}),
      });
      setState("success");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            Venue check-in
          </p>
          <h1 className="font-display mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-zinc-900 sm:text-5xl">
            Verify a PlanDrop crew
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-zinc-600">
            Enter the code a crew shows you. This logs a verified visit for our Atlanta
            founding partner program.
          </p>

          <div className="mt-10 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            {state === "success" && successSummary ? (
              <div className="text-center">
                <p className="text-2xl">✓</p>
                <p className="mt-3 font-display text-lg font-semibold text-zinc-900">
                  Verified — visit logged.
                </p>
                <p className="mt-2 text-sm text-zinc-600">
                  <span className="font-semibold text-zinc-800">
                    {successSummary.venueName}
                  </span>
                  {successSummary.groupSize != null ? (
                    <>
                      {" "}
                      · group of {successSummary.groupSize}
                    </>
                  ) : null}
                </p>
                <p className="mt-2 text-xs text-zinc-500">
                  Thanks — this helps us match real foot traffic to real plans.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setState("idle");
                    setError(null);
                    setSuccessSummary(null);
                  }}
                  className="mt-6 inline-flex items-center justify-center rounded-full bg-brand px-8 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-hover"
                >
                  Verify another code →
                </button>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="code" className="block text-sm font-semibold text-zinc-800">
                      Code
                    </label>
                    <input
                      id="code"
                      name="code"
                      type="text"
                      required
                      placeholder="AB12CD"
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 font-mono text-base font-bold tracking-[0.2em] text-zinc-900 shadow-sm placeholder:tracking-normal placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                  <div>
                    <label htmlFor="groupSize" className="block text-sm font-semibold text-zinc-800">
                      Group size <span className="text-zinc-400">(optional)</span>
                    </label>
                    <input
                      id="groupSize"
                      name="groupSize"
                      type="number"
                      min={1}
                      placeholder="4"
                      className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="venueName" className="block text-sm font-semibold text-zinc-800">
                    Venue name
                  </label>
                  <input
                    id="venueName"
                    name="venueName"
                    type="text"
                    required
                    placeholder="Your venue"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                <div>
                  <label htmlFor="note" className="block text-sm font-semibold text-zinc-800">
                    Note <span className="text-zinc-400">(optional)</span>
                  </label>
                  <input
                    id="note"
                    name="note"
                    type="text"
                    placeholder="Anything helpful (time, table, etc.)"
                    className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
                  />
                </div>

                {state === "error" && error ? (
                  <p className="text-sm font-medium text-red-700">
                    {error === "invalid_code"
                      ? "That code wasn’t found."
                      : error === "already_verified"
                        ? "That code was already verified."
                        : error === "server_misconfigured"
                          ? "Server is missing its Supabase service key. Fix env vars and try again."
                          : error === "server_missing_migration"
                            ? "Server database is missing the verification tables. Apply the Supabase migrations and try again."
                            : error === "verify_failed"
                              ? "We couldn’t complete verification. Check your connection and try again."
                              : "Couldn’t verify right now. Try again."}
                  </p>
                ) : null}

                <button
                  type="submit"
                  disabled={state === "submitting"}
                  className="inline-flex w-full items-center justify-center rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition hover:bg-brand-hover disabled:opacity-60 sm:w-auto"
                >
                  {state === "submitting" ? "Verifying…" : "Verify code →"}
                </button>
              </form>
            )}
          </div>

          <p className="mt-10 text-center text-sm text-zinc-500">
            Looking for the venue pitch?{" "}
            <Link href="/venues" className="font-semibold text-brand underline">
              For venues
            </Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}

"use client";

import { useMemo, useState } from "react";

export function CitiesClient() {
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");
  const [kind, setKind] = useState<"group" | "venue" | "other">("group");
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const canSubmit = useMemo(() => city.trim().length >= 2 && status !== "loading", [city, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setError(null);
    try {
      const res = await fetch("/api/city-interest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city: city.trim(),
          email: email.trim() || undefined,
          kind,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Could not save your request.");
      }
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save your request.");
    }
  }

  return (
    <main className="px-4 pb-24 pt-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <p className="text-sm font-bold uppercase tracking-widest text-brand">
          Cities
        </p>
        <h1 className="font-display mt-4 text-4xl font-bold leading-[1.1] tracking-[-0.03em] text-zinc-900 sm:text-5xl">
          Atlanta is live. More cities coming soon.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-zinc-600">
          We’re focused on Atlanta right now so the plan pool stays high quality.
          We’ll expand city-by-city as we grow.
        </p>

        <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
          <div className="border-b border-zinc-100 px-6 py-5">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Request your city
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-600">
              Drop your city and we’ll prioritize launches where demand is loudest.
              No spam.
            </p>
          </div>
          <form onSubmit={onSubmit} className="space-y-4 px-6 py-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  City
                </span>
                <input
                  value={city}
                  onChange={(e) => {
                    setCity(e.target.value);
                    if (status !== "idle") setStatus("idle");
                    setError(null);
                  }}
                  placeholder="e.g. Austin, TX"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm font-semibold text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-brand/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Email (optional)
                </span>
                <input
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (status !== "idle") setStatus("idle");
                    setError(null);
                  }}
                  inputMode="email"
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-4 py-3 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-brand/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                You are a…
              </span>
              <select
                value={kind}
                onChange={(e) => {
                  setKind(e.target.value as typeof kind);
                  if (status !== "idle") setStatus("idle");
                  setError(null);
                }}
                className="mt-2 w-full cursor-pointer rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-900 shadow-sm focus:border-brand/40 focus:outline-none focus:ring-2 focus:ring-brand/20"
              >
                <option value="group">Group / friends</option>
                <option value="venue">Venue / business</option>
                <option value="other">Other</option>
              </select>
            </label>

            {status === "success" ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-900">
                You’re on the list. We’ll announce your city when it’s ready.
              </div>
            ) : null}
            {status === "error" ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-900">
                {error ?? "Could not save your request."}
              </div>
            ) : null}

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="submit"
                disabled={!canSubmit}
                className="inline-flex h-11 items-center justify-center rounded-xl bg-brand px-6 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "loading" ? "Saving…" : "Request this city"}
              </button>
              <p className="text-xs leading-relaxed text-zinc-500">
                Want faster launch? Share PlanDrop with friends in your city.
              </p>
            </div>
          </form>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-emerald-800">
              Live now
            </p>
            <p className="mt-2 font-display text-xl font-bold text-zinc-900">
              Atlanta, GA
            </p>
            <p className="mt-2 text-sm text-zinc-700">
              Claim-and-share outings with real-time availability.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
              Coming soon
            </p>
            <p className="mt-3 text-sm leading-relaxed text-zinc-700">
              More cities are on the way. We’ll announce new drops as soon as they’re
              ready.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


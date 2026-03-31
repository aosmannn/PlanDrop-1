"use client";

import { useState } from "react";

type FormState = "idle" | "submitting" | "success" | "error";

export function VenuesForm() {
  const [state, setState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("submitting");
    setErrorMsg("");

    const form = e.currentTarget;
    const data = {
      business: (form.elements.namedItem("business") as HTMLInputElement).value.trim(),
      email: (form.elements.namedItem("email") as HTMLInputElement).value.trim(),
      neighborhood: (form.elements.namedItem("neighborhood") as HTMLInputElement).value.trim(),
      role: (form.elements.namedItem("role") as HTMLInputElement).value.trim(),
      phone: (form.elements.namedItem("phone") as HTMLInputElement).value.trim(),
      venueType: (form.elements.namedItem("venueType") as HTMLSelectElement).value.trim(),
      website: (form.elements.namedItem("website") as HTMLInputElement).value.trim(),
    };

    try {
      const res = await fetch("/api/venue-interest", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("submit_failed");
      setState("success");
    } catch {
      setState("error");
      setErrorMsg("Something went wrong. Email us directly at hello@plandrop.com");
    }
  }

  if (state === "success") {
    return (
      <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 px-8 py-10 text-center">
        <p className="text-2xl">✓</p>
        <p className="mt-3 font-display text-lg font-semibold text-zinc-900">
          Got it — we&apos;ll be in touch.
        </p>
        <p className="mt-2 text-sm text-zinc-600">
          We&apos;re onboarding a small set of Atlanta founding partners. Expect to
          hear from us soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="business"
          className="block text-sm font-semibold text-zinc-800"
        >
          Business name
        </label>
        <input
          id="business"
          name="business"
          type="text"
          required
          placeholder="Krog Street Tavern"
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-zinc-800"
        >
          Contact email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          placeholder="owner@yourvenue.com"
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div>
        <label
          htmlFor="neighborhood"
          className="block text-sm font-semibold text-zinc-800"
        >
          Neighborhood
        </label>
        <input
          id="neighborhood"
          name="neighborhood"
          type="text"
          required
          placeholder="Krog Street, Little Five Points, Old Fourth Ward…"
          className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="role" className="block text-sm font-semibold text-zinc-800">
            Your role <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="role"
            name="role"
            type="text"
            placeholder="Owner, GM, Marketing…"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-zinc-800">
            Phone <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="(404) 555-0123"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="venueType" className="block text-sm font-semibold text-zinc-800">
            Venue type <span className="text-zinc-400">(optional)</span>
          </label>
          <select
            id="venueType"
            name="venueType"
            defaultValue=""
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base font-medium text-zinc-900 shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="">Select…</option>
            <option value="bar">Bar</option>
            <option value="restaurant">Restaurant</option>
            <option value="coffee">Coffee</option>
            <option value="activity">Activity / experience</option>
            <option value="event">Live event / venue</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div>
          <label htmlFor="website" className="block text-sm font-semibold text-zinc-800">
            Website / Instagram <span className="text-zinc-400">(optional)</span>
          </label>
          <input
            id="website"
            name="website"
            type="text"
            placeholder="https://… or @handle"
            className="mt-2 w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-base text-zinc-900 shadow-sm placeholder:text-zinc-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </div>
      </div>

      {state === "error" && (
        <p className="text-sm font-medium text-red-700">{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={state === "submitting"}
        className="inline-flex w-full items-center justify-center rounded-full bg-brand px-8 py-4 text-base font-bold text-white shadow-xl shadow-brand/20 transition hover:bg-brand-hover disabled:opacity-60 sm:w-auto"
      >
        {state === "submitting" ? "Sending…" : "We'll reach out →"}
      </button>

      <p className="text-xs text-zinc-400">
        No pricing, no commitment, no spam.
      </p>
    </form>
  );
}

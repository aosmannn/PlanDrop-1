"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function AuthControls() {
  const enabled = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
  const supabase = useMemo(() => (enabled ? createClient() : null), [enabled]);

  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!mounted) return;
      setUserEmail(data.user?.email ?? null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  async function sendLink() {
    if (!supabase) return;
    const e = email.trim();
    if (!e) return;
    setSending(true);
    setError(null);
    setSent(false);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: e,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/claims`
              : undefined,
        },
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send link.");
    } finally {
      setSending(false);
    }
  }

  async function signOut() {
    if (!supabase) return;
    await supabase.auth.signOut().catch(() => {});
  }

  if (!enabled) return null;

  if (userEmail) {
    return (
      <div className="pointer-events-auto flex items-center gap-2">
        <span className="hidden max-w-[10rem] truncate text-xs font-medium text-zinc-500 sm:inline">
          {userEmail}
        </span>
        <button
          type="button"
          onClick={() => void signOut()}
          className="rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <details className="pointer-events-auto relative">
      <summary className="list-none cursor-pointer rounded-full border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 transition hover:bg-zinc-50 [&::-webkit-details-marker]:hidden">
        Sign in
      </summary>
      <div className="absolute right-0 top-full z-50 mt-2 w-[18rem] rounded-2xl border border-zinc-100 bg-white p-3 shadow-xl">
        <p className="text-xs font-semibold text-zinc-900">
          Optional sign-in
        </p>
        <p className="mt-1 text-[11px] leading-snug text-zinc-500">
          Get a magic link. Helps keep claims consistent across devices.
        </p>
        <label className="mt-3 block">
          <span className="sr-only">Email</span>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError(null);
              setSent(false);
            }}
            inputMode="email"
            placeholder="you@example.com"
            className="w-full rounded-xl border border-zinc-200 bg-zinc-50/60 px-3 py-2.5 text-sm font-medium text-zinc-900 placeholder:text-zinc-400 focus:border-brand/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand/20"
          />
        </label>
        {sent ? (
          <p className="mt-2 text-[11px] font-semibold text-emerald-700">
            Link sent. Check your inbox.
          </p>
        ) : null}
        {error ? (
          <p className="mt-2 text-[11px] font-semibold text-amber-700">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => void sendLink()}
          disabled={sending || email.trim().length === 0}
          className="mt-3 w-full rounded-xl bg-zinc-900 py-2.5 text-sm font-bold text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Sending…" : "Email me a link"}
        </button>
      </div>
    </details>
  );
}


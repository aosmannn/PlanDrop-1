import type { Metadata } from "next";
import { SiteFooter } from "@/components/landing/site-footer";
import { SiteHeader } from "@/components/landing/site-header";
import { tryCreateAdminClient } from "@/lib/supabase/admin-optional";

export const metadata: Metadata = {
  title: "Venue dashboard — PlanDrop",
  robots: { index: false, follow: false },
};

function fmt(ts: string | null | undefined) {
  if (!ts) return "—";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

export default async function VenueDashboardPage() {
  const supabase = tryCreateAdminClient();

  const issues =
    supabase
      ? (
          await supabase
            .from("venue_code_issues")
            .select("id, code, plan_id, session_id, issued_at, redeemed_at")
            .order("issued_at", { ascending: false })
            .limit(50)
        ).data ?? []
      : [];

  const verifications =
    supabase
      ? (
          await supabase
            .from("venue_verifications")
            .select(
              "id, code, plan_id, session_id, venue_name, group_size, note, verified_at",
            )
            .order("verified_at", { ascending: false })
            .limit(50)
        ).data ?? []
      : [];

  const redeemedCount = issues.filter((x) => Boolean(x.redeemed_at)).length;

  return (
    <>
      <SiteHeader />
      <main className="px-4 pb-24 pt-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-brand">
            Venues
          </p>
          <h1 className="font-display mt-3 text-3xl font-bold tracking-[-0.03em] text-zinc-900 sm:text-4xl">
            Venue dashboard
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-600">
            Recent check-in codes and verifications. This page is intentionally
            not indexed.
          </p>

          {!supabase ? (
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
              Supabase admin keys aren’t configured here, so the dashboard is in
              dev-fallback mode.
            </div>
          ) : (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Codes issued (shown)
                </p>
                <p className="font-display mt-2 text-3xl font-bold tabular-nums text-zinc-900">
                  {issues.length}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Codes redeemed (shown)
                </p>
                <p className="font-display mt-2 text-3xl font-bold tabular-nums text-zinc-900">
                  {redeemedCount}
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-widest text-zinc-500">
                  Verifications (shown)
                </p>
                <p className="font-display mt-2 text-3xl font-bold tabular-nums text-zinc-900">
                  {verifications.length}
                </p>
              </div>
            </div>
          )}

          <section className="mt-10">
            <h2 className="font-display text-lg font-bold text-zinc-900">
              Recent verifications
            </h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-zinc-50 text-xs font-bold uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Verified</th>
                      <th className="px-4 py-3">Venue</th>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Group</th>
                      <th className="px-4 py-3">Note</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {verifications.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-4 py-6 text-center text-zinc-500"
                        >
                          No verifications yet.
                        </td>
                      </tr>
                    ) : (
                      verifications.map((v) => (
                        <tr key={String(v.id)} className="text-zinc-800">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {fmt(v.verified_at)}
                          </td>
                          <td className="px-4 py-3 font-semibold">
                            {v.venue_name}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {v.code}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {v.plan_id}
                          </td>
                          <td className="px-4 py-3 tabular-nums">
                            {v.group_size ?? "—"}
                          </td>
                          <td className="px-4 py-3 max-w-[18rem] truncate text-zinc-600">
                            {v.note || "—"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-lg font-bold text-zinc-900">
              Recent issued codes
            </h2>
            <div className="mt-3 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="bg-zinc-50 text-xs font-bold uppercase tracking-wide text-zinc-500">
                    <tr>
                      <th className="px-4 py-3">Issued</th>
                      <th className="px-4 py-3">Redeemed</th>
                      <th className="px-4 py-3">Code</th>
                      <th className="px-4 py-3">Plan</th>
                      <th className="px-4 py-3">Session</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {issues.length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-center text-zinc-500"
                        >
                          No codes issued yet.
                        </td>
                      </tr>
                    ) : (
                      issues.map((x) => (
                        <tr key={String(x.id)} className="text-zinc-800">
                          <td className="px-4 py-3 whitespace-nowrap">
                            {fmt(x.issued_at)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap">
                            {fmt(x.redeemed_at)}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {x.code}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {x.plan_id}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">
                            {x.session_id}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}


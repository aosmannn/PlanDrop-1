import type { Plan } from "@/lib/plans-data";
import { buildGoogleMapsHref } from "@/lib/maps-links";

export function PlanGoogleRatingSummary({ plan }: { plan: Plan }) {
  const r = plan.placeRating;
  const n = plan.placeUserRatingsTotal;
  if (r == null && !(typeof n === "number" && n > 0)) return null;
  return (
    <p className="inline-flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-zinc-700 sm:text-xs">
      <span className="text-amber-500" aria-hidden>
        ★
      </span>
      <span className="tabular-nums">
        {r != null ? r.toFixed(1) : "—"}
        {typeof n === "number" && n > 0 ? (
          <span className="font-medium text-zinc-500">
            {" "}
            · {n.toLocaleString()} Google reviews
          </span>
        ) : null}
      </span>
    </p>
  );
}

/** One truncated review on grid cards (full list stays in modal / claim / go). */
export function PlanCardReviewTeaser({ plan }: { plan: Plan }) {
  const rev = plan.placeReviews?.[0];
  const text = rev?.text?.trim();
  if (!rev || !text) return null;
  return (
    <div className="mt-2 rounded-lg bg-zinc-50 px-2.5 py-2 ring-1 ring-zinc-100">
      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
        Google review
      </p>
      <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-zinc-700">
        &ldquo;{text}&rdquo;
      </p>
      <p className="mt-0.5 text-[10px] font-medium text-zinc-500">
        {rev.author}
        {rev.rating ? ` · ${rev.rating}★` : ""}
        {rev.relativeTime ? ` · ${rev.relativeTime}` : ""}
      </p>
    </div>
  );
}

export function PlanGoogleReviewsSection({
  plan,
  className = "",
}: {
  plan: Plan;
  className?: string;
}) {
  const list = plan.placeReviews ?? [];
  if (list.length === 0) return null;
  const maps = buildGoogleMapsHref(plan);
  return (
    <div className={className}>
      <p className="text-[11px] font-bold uppercase tracking-widest text-zinc-500">
        Google reviews
      </p>
      <ul className="mt-2.5 list-none space-y-3 pl-0 text-sm text-zinc-700">
        {list.map((rev, i) => (
          <li
            key={`${rev.author}-${i}`}
            className="rounded-lg border border-zinc-100 bg-zinc-50/80 p-3"
          >
            <p className="leading-relaxed">{rev.text}</p>
            <p className="mt-1.5 text-[11px] font-medium text-zinc-500">
              {rev.author}
              {rev.rating ? ` · ${rev.rating}★` : ""}
              {rev.relativeTime ? ` · ${rev.relativeTime}` : ""}
            </p>
          </li>
        ))}
      </ul>
      <a
        href={maps}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-block text-xs font-semibold text-brand hover:underline"
      >
        Open listing on Google Maps →
      </a>
    </div>
  );
}

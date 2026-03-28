type PlanSpotlightCardProps = {
  title: string;
  subtitle: string;
  meta: string;
  gradient: string;
  badge?: string;
};

export function PlanSpotlightCard({
  title,
  subtitle,
  meta,
  gradient,
  badge,
}: PlanSpotlightCardProps) {
  return (
    <article className="group cursor-pointer">
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-card transition duration-300 group-hover:shadow-lg group-hover:ring-2 group-hover:ring-zinc-200">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
          aria-hidden
        />
        {badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-zinc-900 shadow-sm backdrop-blur-sm">
            {badge}
          </span>
        ) : null}
        <button
          type="button"
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/90 text-zinc-700 backdrop-blur-sm transition hover:scale-105"
          aria-label="Save plan"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-zinc-900">{title}</h3>
          <p className="text-sm text-zinc-500">{subtitle}</p>
          <p className="mt-1 text-sm font-medium text-zinc-800">{meta}</p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-zinc-900">
          <span className="text-amber-500" aria-hidden>
            ★
          </span>
          <span>New</span>
        </div>
      </div>
    </article>
  );
}

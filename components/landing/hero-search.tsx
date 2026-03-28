export function HeroSearch() {
  return (
    <div
      className="mx-auto flex max-w-[850px] flex-col items-stretch rounded-full border border-zinc-200 bg-white py-2 pl-6 pr-2 shadow-search sm:flex-row sm:items-center"
      role="search"
      aria-label="Find plans"
    >
      <button
        type="button"
        className="group flex flex-1 flex-col border-b border-zinc-100 py-3 text-left sm:border-b-0 sm:border-r sm:py-0 sm:pr-6"
      >
        <span className="text-xs font-semibold text-zinc-900">Where</span>
        <span className="text-sm text-zinc-500 group-hover:text-zinc-700">
          Search your area
        </span>
      </button>
      <button
        type="button"
        className="group flex flex-1 flex-col border-b border-zinc-100 py-3 text-left sm:border-b-0 sm:border-r sm:py-0 sm:px-6"
      >
        <span className="text-xs font-semibold text-zinc-900">Vibe</span>
        <span className="text-sm text-zinc-500 group-hover:text-zinc-700">
          Chill, foodie, active…
        </span>
      </button>
      <button
        type="button"
        className="group flex flex-1 flex-col py-3 text-left sm:py-0 sm:pl-6 sm:pr-4"
      >
        <span className="text-xs font-semibold text-zinc-900">Group</span>
        <span className="text-sm text-zinc-500 group-hover:text-zinc-700">
          Add group size
        </span>
      </button>
      <div className="flex shrink-0 justify-end pb-2 sm:pb-0">
        <a
          href="#plans"
          className="flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white shadow-md transition hover:bg-brand-hover hover:shadow-lg"
          aria-label="Search plans"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </a>
      </div>
    </div>
  );
}

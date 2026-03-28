"use client";

import { Location01Icon } from "@hugeicons/core-free-icons";
import { HugeIcon } from "@/components/ui/huge-icon";

export type LocationSuggestion = {
  description: string;
  placeId: string;
  mainText: string;
  secondaryText: string;
};

function cleanLine(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

export function LocationSuggestPanel({
  id,
  open,
  loading,
  empty,
  error,
  suggestions,
  activeIndex,
  onSelect,
  onHighlight,
}: {
  id: string;
  open: boolean;
  loading: boolean;
  empty: boolean;
  error: boolean;
  suggestions: LocationSuggestion[];
  activeIndex: number;
  onSelect: (p: LocationSuggestion) => void;
  onHighlight: (index: number) => void;
}) {
  if (!open) return null;

  const showList = suggestions.length > 0;
  const showLoading = loading && !showList && !empty && !error;
  const showEmpty = !loading && empty && !showList && !error;
  const showError = !loading && error && !showList;

  return (
    <div
      id={id}
      className="absolute left-0 right-0 top-[calc(100%+6px)] z-40 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.04]"
    >
      <div className="border-b border-zinc-100/90 bg-zinc-50/80 px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
          Suggested places
        </p>
      </div>

      <ul
        role="listbox"
        aria-label="Location suggestions"
        className="max-h-[min(16rem,50vh)] overflow-y-auto overscroll-contain py-1 no-scrollbar"
      >
        {showLoading ? (
          <li className="px-3 py-3" role="presentation" aria-live="polite">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-100 text-zinc-400">
                <HugeIcon icon={Location01Icon} size={16} strokeWidth={1.5} aria-hidden />
              </span>
              <div className="min-w-0 flex-1 space-y-2">
                <div className="h-2.5 w-3/5 max-w-[12rem] animate-pulse rounded-full bg-zinc-200/90" />
                <div className="h-2 w-4/5 max-w-[16rem] animate-pulse rounded-full bg-zinc-100" />
              </div>
            </div>
            <p className="mt-2 pl-12 text-xs font-medium text-zinc-400">Searching…</p>
          </li>
        ) : null}

        {showEmpty ? (
          <li className="px-3 py-4 text-center" role="presentation">
            <p className="text-sm font-medium text-zinc-600">No places matched.</p>
            <p className="mt-1 text-xs text-zinc-500">Try another spelling or press Search.</p>
          </li>
        ) : null}

        {showError ? (
          <li className="px-3 py-4 text-center" role="presentation">
            <p className="text-sm font-medium text-amber-800">Couldn’t load suggestions.</p>
            <p className="mt-1 text-xs text-zinc-500">You can still type an address and press Search.</p>
          </li>
        ) : null}

        {showList
          ? suggestions.map((p, i) => {
              const main = cleanLine(p.mainText) || cleanLine(p.description);
              const sub = cleanLine(p.secondaryText);
              const active = i === activeIndex;
              return (
                <li key={p.placeId || `${p.description}-${i}`} role="presentation">
                  <button
                    type="button"
                    role="option"
                    aria-selected={active}
                    className={`flex w-full items-start gap-3 px-3 py-2.5 text-left transition ${
                      active
                        ? "bg-brand-soft/70 ring-1 ring-inset ring-brand/15"
                        : "hover:bg-zinc-50/90"
                    }`}
                    onMouseDown={(e) => e.preventDefault()}
                    onMouseEnter={() => onHighlight(i)}
                    onClick={() => onSelect(p)}
                  >
                    <span
                      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                        active ? "bg-white text-brand shadow-sm ring-1 ring-brand/10" : "bg-zinc-100 text-zinc-400"
                      }`}
                      aria-hidden
                    >
                      <HugeIcon icon={Location01Icon} size={16} strokeWidth={1.5} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold leading-snug text-zinc-900">
                        {main}
                      </span>
                      {sub ? (
                        <span className="mt-0.5 block text-[13px] leading-snug text-zinc-500">
                          {sub}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              );
            })
          : null}

      </ul>
    </div>
  );
}

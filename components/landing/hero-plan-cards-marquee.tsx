"use client";

import Image from "next/image";
import {
  HERO_MARQUEE_PLACES,
  marqueeVibeClass,
  marqueeVibeLabel,
  type HeroMarqueePlace,
} from "@/lib/hero-marquee-places";

function mapsHref(query: string): string {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function MiniPlanCardMock({ place }: { place: HeroMarqueePlace }) {
  const vibe = marqueeVibeLabel(place.vibe);
  const href = mapsHref(place.mapsQuery);
  const isRemote = place.imageSrc.startsWith("https://");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="hero-marquee-card group/card w-[11rem] shrink-0 overflow-hidden rounded-2xl border border-zinc-200/90 bg-white shadow-md ring-1 ring-zinc-100/80 transition hover:shadow-lg hover:ring-brand/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 sm:w-[12.5rem]"
      aria-label={`${place.title} — open in Google Maps`}
    >
      <div className="relative aspect-[5/3] w-full bg-zinc-100">
        <Image
          src={place.imageSrc}
          alt={place.imageAlt}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 11rem, 12.5rem"
          unoptimized={isRemote}
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-black/20"
          aria-hidden
        />
        <div className="absolute left-1.5 top-1.5 z-[1] flex flex-wrap gap-1">
          <span className="inline-flex items-center gap-0.5 rounded-full bg-black/75 px-1.5 py-0.5 text-[7px] font-bold uppercase tracking-wider text-white backdrop-blur-sm">
            <span className="h-1 w-1 rounded-full bg-brand shadow-[0_0_6px_rgba(43,83,193,0.9)]" />
            Live
          </span>
        </div>
        <p className="pointer-events-none absolute bottom-1.5 left-1.5 right-2 z-[1] line-clamp-2 text-[8px] font-medium leading-snug text-white drop-shadow-sm">
          {place.credit}
        </p>
      </div>
      <div className="space-y-1 p-2">
        <p
          className={`inline-block max-w-full rounded px-1 py-0.5 text-[7px] font-bold uppercase tracking-wide ${marqueeVibeClass(place.vibe)}`}
        >
          {vibe}
        </p>
        <h3 className="line-clamp-2 text-left font-display text-[11px] font-bold leading-snug tracking-tight text-zinc-900 sm:text-xs">
          {place.title}
        </h3>
        <p className="line-clamp-2 text-left text-[9px] font-medium text-zinc-500">{place.stop}</p>
        <p className="text-left text-[8px] font-semibold text-brand">Maps →</p>
      </div>
    </a>
  );
}

/**
 * Scrolling strip of real venues — hover or focus a card to pause; click opens Maps.
 */
export function HeroPlanCardsMarquee() {
  const loop = [...HERO_MARQUEE_PLACES, ...HERO_MARQUEE_PLACES].filter(
    (p, i, arr) => {
      const prev = i === 0 ? arr[arr.length - 1] : arr[i - 1];
      return !prev || prev.id !== p.id;
    },
  );

  return (
    <section
      className="border-b border-zinc-100 bg-gradient-to-b from-zinc-50/90 to-white py-3 sm:py-4"
      aria-label="Real places — click a card to open in Google Maps"
    >
      <p className="mx-auto mb-2 max-w-4xl px-4 text-center text-[11px] font-medium text-zinc-500 sm:px-6 lg:px-8">
        Real spots, real photos — hover to pause, tap for Maps
      </p>
      <div className="hero-marquee-mask relative overflow-hidden">
        <div className="hero-marquee-track flex w-max items-stretch gap-3 px-3 sm:gap-4 sm:px-4">
          {loop.map((place, i) => (
            <MiniPlanCardMock key={`${place.id}-marquee-${i}`} place={place} />
          ))}
        </div>
      </div>
    </section>
  );
}

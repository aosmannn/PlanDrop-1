"use client";

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { HugeIcon } from "@/components/ui/huge-icon";
import { planGalleryImageUrls } from "@/lib/plan-cover";
import type { Plan } from "@/lib/plans-data";

type Variant = "card" | "hero" | "modal";

const wrapClass: Record<Variant, string> = {
  card:
    "relative isolate z-0 aspect-[5/3] w-full overflow-hidden rounded-t-2xl bg-zinc-100",
  hero: "relative aspect-[21/9] w-full bg-zinc-100 sm:aspect-[2.5/1]",
  modal:
    "relative h-full min-h-0 w-full overflow-hidden bg-zinc-100",
};

const btnClass: Record<Variant, string> = {
  card: "h-7 w-7",
  hero: "h-9 w-9",
  modal: "h-10 w-10 sm:h-11 sm:w-11",
};

const iconSize: Record<Variant, number> = {
  card: 14,
  hero: 18,
  modal: 18,
};

export function PlanImageGallery({
  plan,
  variant,
  priority,
}: {
  plan: Plan;
  variant: Variant;
  priority?: boolean;
}) {
  const images = useMemo(() => planGalleryImageUrls(plan), [plan]);
  const imgSig = useMemo(
    () => images.map((i) => i.src).join("|"),
    [images],
  );
  const [active, setActive] = useState(0);
  const [failedSrcs, setFailedSrcs] = useState<Set<string>>(() => new Set());
  const n = images.length;

  useEffect(() => {
    setActive(0);
    setFailedSrcs(new Set());
  }, [plan.id, imgSig]);

  if (n === 0) {
    return (
      <div className={wrapClass[variant]}>
        <div className="flex h-full min-h-[8rem] w-full flex-col items-center justify-center gap-1 px-4 text-center">
          <p
            className={
              variant === "card"
                ? "text-xs font-medium text-zinc-500"
                : "text-sm font-medium text-zinc-500"
            }
          >
            No image found
          </p>
          <p className="text-[10px] leading-snug text-zinc-400">
            No photo for this place yet.
          </p>
        </div>
      </div>
    );
  }

  const current = images[Math.min(active, Math.max(0, n - 1))] ?? images[0];
  if (!current) return null;

  const currentFailed = failedSrcs.has(current.src);
  const showNav = n > 1;
  const sizes =
    variant === "card"
      ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      : variant === "modal"
        ? "(max-width: 640px) 100vw, 460px"
        : "(max-width: 768px) 100vw, 672px";

  const isProxyPhoto = current.src.includes("/api/place-photo");

  const placeholderCopy =
    variant === "card"
      ? "text-xs font-medium text-zinc-500"
      : "text-sm font-medium text-zinc-500";

  return (
    <div className={wrapClass[variant]}>
      {currentFailed ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1 bg-zinc-100 px-4 text-center">
          <p className={placeholderCopy}>No image found</p>
          <p className="text-[10px] leading-snug text-zinc-400">
            This photo could not be loaded.
          </p>
        </div>
      ) : (
        <Image
          key={`${plan.id}:${current.src}`}
          src={current.src}
          alt={current.alt}
          fill
          className={`object-cover ${variant === "card" ? "transition-transform duration-500 group-hover:scale-[1.02]" : ""}`}
          sizes={sizes}
          priority={priority ?? active === 0}
          unoptimized={isProxyPhoto}
          onError={() =>
            setFailedSrcs((prev) => new Set(prev).add(current.src))
          }
        />
      )}
      {showNav ? (
        <>
          {variant === "modal" ? (
            <span
              className="absolute right-2 top-2 z-20 rounded-full bg-black/55 px-2 py-1 text-[10px] font-semibold tabular-nums text-white shadow-md ring-1 ring-white/15 backdrop-blur-sm"
              aria-live="polite"
            >
              {active + 1} / {n}
            </span>
          ) : null}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10"
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 z-20 flex items-center px-1 sm:px-2">
            <button
              type="button"
              onClick={() => setActive((i) => (i - 1 + n) % n)}
              className={`pointer-events-auto inline-flex ${btnClass[variant]} items-center justify-center rounded-full bg-black/45 text-white shadow-md ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-black/55`}
              aria-label="Previous photo"
            >
              <HugeIcon
                icon={ArrowLeft01Icon}
                size={iconSize[variant]}
                strokeWidth={2}
              />
            </button>
          </div>
          <div className="absolute inset-y-0 right-0 z-20 flex items-center px-1 sm:px-2">
            <button
              type="button"
              onClick={() => setActive((i) => (i + 1) % n)}
              className={`pointer-events-auto inline-flex ${btnClass[variant]} items-center justify-center rounded-full bg-black/45 text-white shadow-md ring-1 ring-white/20 backdrop-blur-sm transition hover:bg-black/55`}
              aria-label="Next photo"
            >
              <HugeIcon
                icon={ArrowRight01Icon}
                size={iconSize[variant]}
                strokeWidth={2}
              />
            </button>
          </div>
          <div
            className={`absolute left-0 right-0 flex justify-center gap-1.5 px-1.5 ${
              variant === "modal"
                ? "bottom-2.5 z-20 gap-2 sm:bottom-3"
                : "bottom-1.5 sm:bottom-2"
            }`}
            role="tablist"
            aria-label="Place photos"
          >
            {images.map((img, idx) => (
              <button
                key={`${img.src}-${idx}`}
                type="button"
                role="tab"
                aria-selected={idx === active}
                aria-label={`Photo ${idx + 1} of ${n}`}
                onClick={() => setActive(idx)}
                className={`rounded-full transition-all ${
                  variant === "modal"
                    ? idx === active
                      ? "h-2 w-6 bg-white shadow-sm"
                      : "h-2 w-2 bg-white/45 hover:bg-white/75"
                    : idx === active
                      ? "h-1 w-4 bg-white shadow-sm sm:w-5"
                      : "h-1 w-1 bg-white/50 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

import type { Plan } from "@/lib/plans-data";

/** Disambiguates Next/Image and CDN caches so each card stays tied to its plan. */
function placePhotoSrc(planId: string, ref: string): string {
  const r = ref.trim();
  return `/api/place-photo?ref=${encodeURIComponent(r)}&pid=${encodeURIComponent(planId)}`;
}

/** Resolved image URL for plan cards (local asset or Places photo proxy). */
export function planCoverImageUrl(plan: Plan): string {
  const ref =
    plan.placePhotoRefs?.find((r) => r?.trim())?.trim() ??
    plan.placePhotoRef?.trim();
  if (ref) {
    return placePhotoSrc(plan.id, ref);
  }
  return plan.coverImageSrc;
}

/** All images to show on the plan briefing (Places refs, then local fallbacks). */
export function planGalleryImageUrls(plan: Plan): { src: string; alt: string }[] {
  const out: { src: string; alt: string }[] = [];
  const seen = new Set<string>();

  const canonicalKey = (src: string): string => {
    const s = src.trim();
    if (!s) return "";
    // Treat Place Photo proxy URLs as the same image if the `ref` matches,
    // regardless of cache-busting parameters like `pid`.
    if (s.startsWith("/api/place-photo")) {
      try {
        const u = new URL(s, "http://local");
        const ref = u.searchParams.get("ref")?.trim() ?? "";
        return ref ? `place-photo:${ref}` : s;
      } catch {
        return s;
      }
    }
    // For remote URLs, ignore query/hash so resized variants don't duplicate slides.
    if (s.startsWith("https://") || s.startsWith("http://")) {
      return s.split("#")[0]!.split("?")[0]!.trim();
    }
    return s;
  };

  const push = (src: string, alt: string) => {
    const raw = src.trim();
    const k = canonicalKey(raw);
    if (!raw || !k || seen.has(k)) return;
    seen.add(k);
    out.push({ src: raw, alt });
  };

  const refs = plan.placePhotoRefs?.filter((r) => r?.trim()) ?? [];
  if (refs.length > 0) {
    refs.forEach((ref, i) => {
      push(
        placePhotoSrc(plan.id, ref),
        i === 0 ? plan.coverImageAlt : `${plan.coverImageAlt} (${i + 1})`,
      );
    });
  } else if (plan.placePhotoRef?.trim()) {
    push(placePhotoSrc(plan.id, plan.placePhotoRef), plan.coverImageAlt);
  }

  const locals = plan.galleryImageSrcs?.filter((s) => s?.trim()) ?? [];
  locals.forEach((src) => {
    const idx = out.length;
    push(
      src.trim(),
      idx === 0 ? plan.coverImageAlt : `${plan.coverImageAlt} (${idx + 1})`,
    );
  });

  if (out.length === 0) {
    push(plan.coverImageSrc, plan.coverImageAlt);
  }
  return out;
}

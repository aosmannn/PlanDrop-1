import type { Plan } from "@/lib/plans-data";

function planHasGooglePlacePhotos(plan: Plan): boolean {
  const refs = plan.placePhotoRefs?.filter((r) => r?.trim()) ?? [];
  if (refs.length > 0) return true;
  return Boolean(plan.placePhotoRef?.trim());
}

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
  const refs = plan.placePhotoRefs?.filter((r) => r?.trim()) ?? [];
  if (refs.length > 0) {
    return refs.map((ref, i) => ({
      src: placePhotoSrc(plan.id, ref),
      alt: i === 0 ? plan.coverImageAlt : `${plan.coverImageAlt} (${i + 1})`,
    }));
  }
  if (plan.placePhotoRef?.trim()) {
    return [
      {
        src: placePhotoSrc(plan.id, plan.placePhotoRef),
        alt: plan.coverImageAlt,
      },
    ];
  }
  const locals = plan.galleryImageSrcs?.filter((s) => s?.trim()) ?? [];
  if (locals.length > 0) {
    return locals.map((src, i) => ({
      src: src.trim(),
      alt: i === 0 ? plan.coverImageAlt : `${plan.coverImageAlt} (${i + 1})`,
    }));
  }
  if (plan.id.startsWith("ai-") && !planHasGooglePlacePhotos(plan)) {
    return [];
  }
  return [{ src: plan.coverImageSrc, alt: plan.coverImageAlt }];
}

/** Count of gallery images (for badges). */
export function planPhotoCount(plan: Plan): number {
  if (plan.placePhotoRefs?.length) return plan.placePhotoRefs.length;
  if (plan.placePhotoRef?.trim()) return 1;
  if (plan.galleryImageSrcs?.length) return plan.galleryImageSrcs.length;
  if (plan.id.startsWith("ai-") && !planHasGooglePlacePhotos(plan)) return 0;
  return 1;
}

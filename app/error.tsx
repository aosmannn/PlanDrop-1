"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-brand">
        Something went wrong
      </p>
      <h1 className="font-display mt-4 text-2xl font-bold text-zinc-900 sm:text-3xl">
        We couldn&apos;t load this page
      </h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-600">
        {error.message || "An unexpected error occurred. Try again, or head home."}
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-hover"
        >
          Try again
        </button>
        <Link
          href="/"
          className="text-sm font-semibold text-zinc-600 underline decoration-zinc-300 underline-offset-4 hover:text-zinc-900"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}

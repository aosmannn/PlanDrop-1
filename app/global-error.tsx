"use client";

import "./globals.css";

/**
 * Catches errors in the root layout. Must define its own <html> and <body>.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/error#global-error
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en" className="font-sans">
      <body className="min-h-screen bg-white px-4 py-16 text-zinc-900 antialiased">
        <div className="mx-auto max-w-md text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-brand">
            PlanDrop
          </p>
          <h1 className="font-display mt-4 text-2xl font-bold">Something went wrong</h1>
          <p className="mt-3 text-sm text-zinc-600">
            {error.message || "Please refresh the page or try again in a moment."}
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 inline-flex rounded-full bg-brand px-6 py-3 text-sm font-bold text-white hover:bg-brand-hover"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

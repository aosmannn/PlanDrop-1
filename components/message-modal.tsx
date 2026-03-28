"use client";

export function MessageModal({
  open,
  title,
  children,
  onClose,
  confirmLabel = "OK",
}: {
  open: boolean;
  title: string;
  children: React.ReactNode;
  onClose: () => void;
  confirmLabel?: string;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-sm"
        aria-label="Dismiss"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="message-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl"
      >
        <h2
          id="message-modal-title"
          className="font-display text-xl font-bold text-zinc-900"
        >
          {title}
        </h2>
        <div className="mt-3 text-sm leading-relaxed text-zinc-700">{children}</div>
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl bg-zinc-900 py-3 text-sm font-bold text-white transition hover:bg-zinc-800"
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  );
}

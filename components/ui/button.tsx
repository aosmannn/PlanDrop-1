import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-1.5 font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/25 disabled:opacity-60 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand text-white shadow-lg shadow-brand/20 hover:bg-brand-hover hover:shadow-brand/30",
  secondary:
    "border border-zinc-200 bg-white text-zinc-900 shadow-sm hover:border-zinc-300 hover:bg-zinc-50",
  ghost: "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-50",
};

const sizes: Record<Size, string> = {
  sm: "h-9 rounded-full px-4 text-sm",
  md: "h-10 rounded-full px-5 text-sm",
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Omit<ComponentProps<"button">, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <button
      {...props}
      className={cx(base, variants[variant], sizes[size], className)}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Omit<ComponentProps<typeof Link>, "className"> & {
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  return (
    <Link
      {...props}
      className={cx(base, variants[variant], sizes[size], className)}
    />
  );
}


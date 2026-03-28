import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

type Props = {
  icon: IconSvgElement;
  size?: number;
  className?: string;
  strokeWidth?: number;
};

export function HugeIcon({ icon, size = 20, className, strokeWidth = 1.5 }: Props) {
  return (
    <HugeiconsIcon
      icon={icon}
      size={size}
      strokeWidth={strokeWidth}
      className={className}
      aria-hidden
    />
  );
}

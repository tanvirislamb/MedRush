import { cn } from "@/Utils/cn";
import type { StatusPresentation, Tone } from "@/Utils/presentation";

const TONE_CLASS: Record<Tone, string> = {
  critical: "bg-critical-soft text-critical",
  warning: "bg-warning-soft text-high",
  info: "bg-medium-soft text-medium",
  success: "bg-success-soft text-success",
  neutral: "bg-neutral-soft text-ink-muted",
  brand: "bg-brand-100 text-brand-800",
};

interface StatusTagProps {
  presentation: StatusPresentation;
  className?: string;
  pulse?: boolean;
}

/** Renders the label/tone pairs defined in Utils/presentation. */
export function StatusTag({ presentation, className, pulse = false }: StatusTagProps) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
        TONE_CLASS[presentation.tone],
        className,
      )}
    >
      {pulse ? (
        <span className="relative flex h-1.5 w-1.5 shrink-0" aria-hidden="true">
          <span className="animate-alarm absolute inset-0 rounded-full bg-current" />
        </span>
      ) : null}
      {presentation.label}
    </span>
  );
}
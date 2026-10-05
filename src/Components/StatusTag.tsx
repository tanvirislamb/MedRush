import { cn } from "@/Utils/cn";
import type { StatusPresentation, Tone } from "@/Utils/presentation";

const TONE_CLASS: Record<Tone, string> = {
  critical: "bg-critical-soft text-critical",
  warning: "bg-high-soft text-high",
  info: "bg-medium-soft text-medium",
  success: "bg-success-soft text-success",
  neutral: "bg-surface-sunken text-ink-muted",
  brand: "bg-brand-50 text-brand-700",
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
        "inline-flex shrink-0 items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium leading-4",
        TONE_CLASS[presentation.tone],
        className,
      )}
    >
      {pulse ? (
        <span
          className="animate-pulse-dot h-1.5 w-1.5 shrink-0 rounded-full bg-current"
          aria-hidden="true"
        />
      ) : null}
      {presentation.label}
    </span>
  );
}
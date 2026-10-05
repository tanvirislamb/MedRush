import { Check } from "lucide-react";

import { cn } from "@/Utils/cn";
import { TRIP_SEQUENCE, TRIP_STATUS } from "@/Utils/presentation";
import type { TripStatus } from "@/Types/domain";

/**
 * Horizontal progress for a trip. Mirrors the backend state machine, so a
 * CANCELLED trip never appears as though it were progressing.
 */
export function TripProgress({ status }: { status: TripStatus }) {
  if (status === "CANCELLED") {
    return (
      <p className="rounded-md bg-surface-sunken px-3 py-2 text-sm text-ink-muted">
        This trip was cancelled.
      </p>
    );
  }

  const currentIndex = TRIP_SEQUENCE.indexOf(status);
  const lastIndex = TRIP_SEQUENCE.length - 1;

  return (
    <ol className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:gap-0">
      {TRIP_SEQUENCE.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;

        return (
          <li key={step} className="flex items-center gap-2.5 sm:flex-1">
            <span
              className={cn(
                "flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold",
                done && "bg-brand-600 text-ink-invert",
                active && "bg-surface text-brand-700 ring-1 ring-brand-600",
                !done && !active && "bg-surface-sunken text-ink-subtle",
              )}
              aria-hidden="true"
            >
              {done ? <Check className="h-3 w-3" /> : index + 1}
            </span>

            <span
              className={cn(
                "text-xs leading-4",
                active ? "font-semibold text-ink" : done ? "text-ink-muted" : "text-ink-subtle",
              )}
            >
              {TRIP_STATUS[step].label}
            </span>

            {index < lastIndex ? (
              <span
                className={cn(
                  "hidden h-px flex-1 sm:block",
                  done ? "bg-brand-300" : "bg-line",
                )}
                aria-hidden="true"
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
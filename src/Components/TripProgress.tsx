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
      <p className="rounded-lg bg-neutral-soft px-3 py-2 text-sm font-medium text-ink-muted">
        This trip was cancelled.
      </p>
    );
  }

  const currentIndex = TRIP_SEQUENCE.indexOf(status);

  return (
    <ol className="flex flex-col gap-3 sm:flex-row sm:items-start">
      {TRIP_SEQUENCE.map((step, index) => {
        const done = index < currentIndex;
        const active = index === currentIndex;
        return (
          <li key={step} className="flex flex-1 items-center gap-3 sm:flex-col sm:items-start">
            <div className="flex w-full items-center gap-2 sm:w-auto">
              <span
                className={cn(
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                  done && "bg-brand-800 text-ink-invert",
                  active && "bg-brand-800 text-ink-invert ring-4 ring-brand-100",
                  !done && !active && "border border-line bg-surface text-ink-subtle",
                )}
                aria-hidden="true"
              >
                {done ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </span>
              {index < TRIP_SEQUENCE.length - 1 ? (
                <span
                  className={cn(
                    "hidden h-px flex-1 sm:block sm:w-full",
                    done ? "bg-brand-400" : "bg-line",
                  )}
                />
              ) : null}
            </div>
            <span
              className={cn(
                "text-xs font-medium sm:mt-1",
                active ? "text-ink" : done ? "text-ink-muted" : "text-ink-subtle",
              )}
            >
              {TRIP_STATUS[step].label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
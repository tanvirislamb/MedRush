import type { ReactNode } from "react";

import { cn } from "@/Utils/cn";
import type { Tone } from "@/Utils/presentation";

/* -------------------------------------------------------------------------- */
/* Surfaces                                                                    */
/* -------------------------------------------------------------------------- */

export function Panel({
  children,
  className,
  raised = false,
}: {
  children: ReactNode;
  className?: string;
  raised?: boolean;
}) {
  return <div className={cn(raised ? "panel-raised" : "panel", className)}>{children}</div>;
}

export function PanelHeader({
  title,
  description,
  actions,
  className,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-3.5",
        className,
      )}
    >
      <div className="min-w-0">
        <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
        {description ? (
          <p className="mt-1 text-[13px] leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Page chrome                                                                 */
/* -------------------------------------------------------------------------- */

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "mb-6 flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5",
        className,
      )}
    >
      <div className="min-w-0">
        {eyebrow ? <p className="text-label">{eyebrow}</p> : null}
        <h1 className="text-display mt-1.5 text-2xl leading-tight text-ink">{title}</h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-muted">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/* Metrics                                                                     */
/* -------------------------------------------------------------------------- */

export type MetricTone = "neutral" | "critical" | "warning" | "success" | "brand";

/**
 * Colour is only meaningful for values that need attention — neutral and brand
 * stay ink so a row of metrics reads as one calm block.
 */
const METRIC_VALUE_TONE: Record<MetricTone, string> = {
  neutral: "text-ink",
  brand: "text-ink",
  success: "text-ink",
  warning: "text-high",
  critical: "text-critical",
};

const METRIC_ICON_TONE: Record<MetricTone, string> = {
  neutral: "text-ink-subtle",
  brand: "text-brand-600",
  success: "text-success",
  warning: "text-high",
  critical: "text-critical",
};

export function MetricGrid({
  children,
  columns = 4,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  const layout = {
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  }[columns];

  return <div className={cn("grid gap-3 sm:gap-4", layout, className)}>{children}</div>;
}

export function StatCard({
  label,
  value,
  tone = "neutral",
  hint,
  icon,
}: {
  label: string;
  value: ReactNode;
  tone?: MetricTone;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <Panel className="p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-label">{label}</p>
        {icon ? (
          <span className={cn("-mt-0.5 shrink-0", METRIC_ICON_TONE[tone])} aria-hidden="true">
            {icon}
          </span>
        ) : null}
      </div>
      <p
        className={cn(
          "mt-2 text-2xl font-semibold tracking-tight tabular-nums",
          METRIC_VALUE_TONE[tone],
        )}
      >
        {value}
      </p>
      {hint ? <p className="mt-1 text-xs text-ink-muted">{hint}</p> : null}
    </Panel>
  );
}

/* -------------------------------------------------------------------------- */
/* Detail lists & bars                                                         */
/* -------------------------------------------------------------------------- */

/** One row of a <dl>. The caller owns the wrapper so dividers stay consistent. */
export function KeyValue({
  label,
  value,
  icon,
}: {
  label: ReactNode;
  value: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-2.5">
      <dt className="flex min-w-0 items-center gap-2 text-sm text-ink-muted">
        {icon}
        {label}
      </dt>
      <dd className="shrink-0 text-sm font-semibold tabular-nums text-ink">{value}</dd>
    </div>
  );
}

const BAR_TONE: Record<Tone, string> = {
  critical: "bg-critical",
  warning: "bg-high",
  info: "bg-medium",
  success: "bg-success",
  neutral: "bg-line-strong",
  brand: "bg-brand-600",
};

export function ProgressBar({
  value,
  tone = "brand",
  className,
}: {
  /** Percentage 0-100; clamped so a bad ratio can never overflow the track. */
  value: number;
  tone?: Tone;
  className?: string;
}) {
  const width = Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));

  return (
    <div className={cn("h-1.5 w-full overflow-hidden rounded-full bg-surface-sunken", className)}>
      <div
        className={cn("h-full rounded-full transition-[width]", BAR_TONE[tone])}
        style={{ width: `${width}%` }}
      />
    </div>
  );
}
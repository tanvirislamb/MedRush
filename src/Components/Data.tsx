"use client";

import { AlertTriangle, ChevronLeft, ChevronRight, Inbox, Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/Components/Button";
import { cn } from "@/Utils/cn";
import { formatRelativeTime } from "@/Utils/format";

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-2.5 px-6 py-16 text-sm text-ink-muted">
      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken text-ink-subtle">
        {icon ?? <Inbox className="h-5 w-5" aria-hidden="true" />}
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">{title}</p>
        {description ? <p className="mt-1 max-w-sm text-sm text-ink-muted">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-14 text-center">
      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-critical-soft text-critical">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">Something went wrong</p>
        <p className="mt-1 max-w-md whitespace-pre-line text-sm text-ink-muted">{message}</p>
      </div>
      {onRetry ? (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onChange: (page: number) => void;
}

/** A 0 totalPages means "nothing found", not "page 1 of 0". */
export function Pagination({ page, totalPages, total, onChange }: PaginationProps) {
  if (total === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
      <p className="text-xs text-ink-muted">
        Page <span className="font-semibold text-ink">{page}</span> of{" "}
        <span className="font-semibold text-ink">{Math.max(totalPages, 1)}</span> ·{" "}
        {total} {total === 1 ? "record" : "records"}
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(page - 1)}
          disabled={page <= 1}
          icon={<ChevronLeft className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Previous
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onChange(page + 1)}
          disabled={totalPages === 0 || page >= totalPages}
          icon={<ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export function TableShell({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <th
      scope="col"
      className={cn(
        "whitespace-nowrap border-b border-line bg-surface-sunken px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink-subtle",
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({ children, className }: { children?: ReactNode; className?: string }) {
  return <td className={cn("px-4 py-3 align-middle text-ink", className)}>{children}</td>;
}

export function Timestamp({ value }: { value: string | null | undefined }) {
  if (!value) return <span className="text-ink-subtle">-</span>;
  return (
    <time dateTime={value} title={new Date(value).toLocaleString()} className="whitespace-nowrap text-sm">
      {formatRelativeTime(value)}
    </time>
  );
}
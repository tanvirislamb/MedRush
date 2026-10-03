"use client";

import { useState } from "react";

import type { PaginationMeta } from "@/Types/api";

export const DEFAULT_PAGE_SIZE = 10;

/**
 * Page cursor plus the meta returned by the backend. Pages are 1-based, and
 * `totalPages` of 0 means "nothing found" rather than "page one of zero".
 */
export function usePagination() {
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);

  const applyMeta = (next: PaginationMeta | undefined) => {
    if (next) setMeta(next);
  };

  return {
    page,
    limit: DEFAULT_PAGE_SIZE,
    meta,
    applyMeta,
    setPage,
    goToPage: (next: number) => setPage(Math.max(1, next)),
    next: () => setPage((current) => current + 1),
    previous: () => setPage((current) => Math.max(1, current - 1)),
    reset: () => setPage(1),
    totalPages: meta?.totalPages ?? 0,
    total: meta?.total ?? 0,
  };
}

"use client";

import { useQuery } from "@tanstack/react-query";
import { Route } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { EmptyState, ErrorState, LoadingState, Pagination, TableShell, Td, Th } from "@/Components/Data";
import { PageHeader, Panel, PanelHeader, StatCard } from "@/Components/Layout";
import { StatusTag } from "@/Components/StatusTag";
import { usePagination } from "@/Hooks/usePagination";
import { tripService } from "@/Services/tripService";
import { formatCurrency, formatDistance, formatDateTime } from "@/Utils/format";
import { TRIP_STATUS } from "@/Utils/presentation";
import type { TripStatus } from "@/Types/domain";

const FILTERS: Array<{ value: TripStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All trips" },
  { value: "DISPATCHED", label: "Dispatched" },
  { value: "EN_ROUTE", label: "En route" },
  { value: "AT_PICKUP", label: "At pickup" },
  { value: "TRANSPORTING", label: "Transporting" },
  { value: "ARRIVED", label: "Arrived" },
  { value: "COMPLETED", label: "Completed" },
  { value: "CANCELLED", label: "Cancelled" },
];

export default function TripsPage() {
  const { page, limit, meta, applyMeta, setPage } = usePagination();
  const [status, setStatus] = useState<TripStatus | "ALL">("ALL");

  const trips = useQuery({
    queryKey: ["trips", "viewer", page, status],
    queryFn: () =>
      tripService.listForViewer({ page, limit, ...(status === "ALL" ? {} : { status }) }),
  });

  useEffect(() => {
    applyMeta(trips.data?.meta);
  }, [trips.data?.meta, applyMeta]);

  const rows = trips.data?.data ?? [];
  const active = rows.filter((t) =>
    ["DISPATCHED", "EN_ROUTE", "AT_PICKUP", "TRANSPORTING", "ARRIVED"].includes(t.status),
  ).length;

  return (
    <>
      <PageHeader
        eyebrow="Trips"
        title="Trips"
        description="Every dispatched ride. Open one to advance its status or assign a hospital."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Total trips" value={trips.data?.meta.total ?? 0} tone="brand" />
        <StatCard label="Active on this page" value={active} tone={active ? "warning" : "success"} />
        <StatCard
          label="Completed"
          value={rows.filter((t) => t.status === "COMPLETED").length}
          tone="success"
        />
      </div>

      <Panel>
        <PanelHeader
          title="Trip log"
          actions={
            <select
              value={status}
              onChange={(e) => {
                setStatus(e.target.value as TripStatus | "ALL");
                setPage(1);
              }}
              aria-label="Filter by status"
              className="h-9 cursor-pointer rounded-lg border border-line bg-surface px-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none"
            >
              {FILTERS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          }
        />

        {trips.isLoading ? (
          <LoadingState />
        ) : trips.isError ? (
          <ErrorState message={(trips.error as Error).message} onRetry={() => trips.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No trips found"
            description="Trips appear once an ambulance has been dispatched against a request."
            icon={<Route className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Pickup</Th>
                  <Th>Crew</Th>
                  <Th>Status</Th>
                  <Th>Distance</Th>
                  <Th>Fare</Th>
                  <Th>Started</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((trip) => (
                  <tr key={trip.id} className="hover:bg-surface-sunken/60">
                    <Td>
                      <Link
                        href={`/trips/${trip.id}`}
                        className="font-medium text-brand-700 hover:underline"
                      >
                        {trip.request?.pickupLocation ?? "Trip"}
                      </Link>
                    </Td>
                    <Td className="text-sm">
                      <p>{trip.ambulance?.vehicleNumber ?? "—"}</p>
                      <p className="text-xs text-ink-subtle">{trip.driver?.name ?? "—"}</p>
                    </Td>
                    <Td>
                      <StatusTag
                        presentation={TRIP_STATUS[trip.status]}
                        pulse={!["COMPLETED", "CANCELLED"].includes(trip.status)}
                      />
                    </Td>
                    <Td className="tabular-nums text-ink-muted">{formatDistance(trip.distanceKm)}</Td>
                    <Td className="tabular-nums text-ink-muted">{formatCurrency(trip.fare)}</Td>
                    <Td className="whitespace-nowrap text-xs text-ink-muted">
                      {formatDateTime(trip.startedAt ?? trip.createdAt)}
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableShell>
            <Pagination
              page={page}
              totalPages={meta?.totalPages ?? 0}
              total={meta?.total ?? 0}
              onChange={setPage}
            />
          </>
        )}
      </Panel>
    </>
  );
}
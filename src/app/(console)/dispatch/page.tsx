"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Send } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "@/Components/Button";
import { EmptyState, ErrorState, LoadingState, Pagination, TableShell, Td, Th } from "@/Components/Data";
import { FormBanner, Select } from "@/Components/Form";
import { PageHeader, Panel, PanelHeader, StatCard } from "@/Components/Layout";
import { RequireRole } from "@/Components/RequireRole";
import { StatusTag } from "@/Components/StatusTag";
import { useDebouncedValue } from "@/Hooks/useDebouncedValue";
import { usePagination } from "@/Hooks/usePagination";
import { useToast } from "@/Hooks/useToast";
import { crewService } from "@/Services/crewService";
import { emergencyRequestService } from "@/Services/emergencyRequestService";
import { fleetService } from "@/Services/fleetService";
import { tripService } from "@/Services/tripService";
import { ApiError } from "@/Services/httpClient";
import { formatRelativeTime } from "@/Utils/format";
import { PRIORITY, REQUEST_STATUS, TRIP_STATUS } from "@/Utils/presentation";
import type { RequestStatus } from "@/Types/domain";

const STATUS_FILTERS: Array<{ value: RequestStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All" },
  { value: "PENDING", label: "Awaiting crew" },
  { value: "DISPATCHED", label: "Crew assigned" },
  { value: "CANCELLED", label: "Cancelled" },
];

function DispatchScreen() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { page, limit, meta, applyMeta, setPage } = usePagination();

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<RequestStatus | "ALL">("PENDING");
  const [openDispatch, setOpenDispatch] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  const queue = useQuery({
    queryKey: ["requests", "queue", page, status, debouncedSearch],
    queryFn: () =>
      emergencyRequestService.search({
        page,
        limit,
        ...(status === "ALL" ? {} : { status }),
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      }),
  });

  const ambulances = useQuery({
    queryKey: ["fleet", "available"],
    queryFn: () => fleetService.list({ availability: "AVAILABLE", limit: 50 }),
    enabled: openDispatch !== null,
  });
  const drivers = useQuery({
    queryKey: ["crew", "available"],
    queryFn: () => crewService.list({ availability: "AVAILABLE", limit: 50 }),
    enabled: openDispatch !== null,
  });

  const dispatch = useMutation({
    mutationFn: ({ requestId, ambulanceId, driverId }: { requestId: string; ambulanceId?: string; driverId?: string }) =>
      tripService.dispatch(
        requestId,
        {
          ...(ambulanceId ? { ambulanceId } : {}),
          ...(driverId ? { driverId } : {}),
        },
      ),
    onSuccess: async () => {
      notify({ title: "Crew dispatched", description: "The ambulance and driver are now assigned.", tone: "success" });
      setOpenDispatch(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["requests"] }),
        queryClient.invalidateQueries({ queryKey: ["trips"] }),
        queryClient.invalidateQueries({ queryKey: ["fleet"] }),
        queryClient.invalidateQueries({ queryKey: ["crew"] }),
      ]);
    },
    onError: (error) =>
      notify({
        title: "Dispatch failed",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  useEffect(() => {
    applyMeta(queue.data?.meta);
  }, [queue.data?.meta, applyMeta]);

  const rows = queue.data?.data ?? [];
  const pendingTotal = queue.data?.meta.total ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Dispatcher"
        title="Dispatch queue"
        description="Search incoming requests and send an ambulance. Leaving both crew fields blank auto-assigns the first available crew."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Matching requests" value={pendingTotal} tone={pendingTotal ? "warning" : "success"} />
        <StatCard label="Ambulances free" value={ambulances.data?.meta.total ?? "—"} tone="brand" />
        <StatCard label="Drivers free" value={drivers.data?.meta.total ?? "—"} tone="brand" />
      </div>

      <Panel>
        <PanelHeader
          title="Incoming requests"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search
                  className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
                  aria-hidden="true"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search name, location…"
                  aria-label="Search requests"
                  className="h-9 w-56 rounded-lg border border-line bg-surface pl-8 pr-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as RequestStatus | "ALL");
                  setPage(1);
                }}
                aria-label="Filter by status"
                className="h-9 cursor-pointer rounded-lg border border-line bg-surface px-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none"
              >
                {STATUS_FILTERS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        {queue.isLoading ? (
          <LoadingState />
        ) : queue.isError ? (
          <ErrorState message={(queue.error as Error).message} onRetry={() => queue.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="Nothing in the queue"
            description={
              debouncedSearch || status !== "ALL"
                ? "No requests match your filters."
                : "Every request has been handled. New ones appear here automatically."
            }
            icon={<Send className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Caller</Th>
                  <Th>Pickup</Th>
                  <Th>Priority</Th>
                  <Th>Status</Th>
                  <Th>Raised</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((request) => (
                  <tr key={request.id} className="align-top hover:bg-surface-sunken/60">
                    <Td>
                      <p className="font-medium">{request.patientName}</p>
                      <p className="mt-0.5 text-xs text-ink-subtle">{request.contact}</p>
                    </Td>
                    <Td>
                      <p className="max-w-64">{request.pickupLocation}</p>
                      {request.note ? (
                        <p className="mt-0.5 max-w-64 line-clamp-2 text-xs text-ink-subtle">{request.note}</p>
                      ) : null}
                    </Td>
                    <Td>
                      <StatusTag
                        presentation={PRIORITY[request.priority]}
                        pulse={request.priority === "CRITICAL" && request.status === "PENDING"}
                      />
                    </Td>
                    <Td>
                      <div className="flex flex-col items-start gap-1.5">
                        <StatusTag presentation={REQUEST_STATUS[request.status]} />
                        {request.trip ? (
                          <StatusTag presentation={TRIP_STATUS[request.trip.status]} />
                        ) : null}
                      </div>
                    </Td>
                    <Td className="whitespace-nowrap text-xs text-ink-muted">
                      {formatRelativeTime(request.createdAt)}
                    </Td>
                    <Td className="text-right">
                      {request.status === "PENDING" ? (
                        <Button
                          size="sm"
                          onClick={() => setOpenDispatch((current) => (current === request.id ? null : request.id))}
                        >
                          Dispatch
                        </Button>
                      ) : (
                        <span className="text-xs text-ink-subtle">—</span>
                      )}

                      {openDispatch === request.id ? (
                        <DispatchForm
                          ambulances={ambulances.data?.data ?? []}
                          drivers={drivers.data?.data ?? []}
                          isLoadingCrew={ambulances.isLoading || drivers.isLoading}
                          isSubmitting={dispatch.isPending}
                          onCancel={() => setOpenDispatch(null)}
                          onSubmit={(ambulanceId, driverId) =>
                            dispatch.mutate({ requestId: request.id, ambulanceId, driverId })
                          }
                        />
                      ) : null}
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

function DispatchForm({
  ambulances,
  drivers,
  isLoadingCrew,
  isSubmitting,
  onCancel,
  onSubmit,
}: {
  ambulances: Array<{ id: string; vehicleNumber: string; type: string; stationZone: string }>;
  drivers: Array<{ id: string; name: string; phone: string }>;
  isLoadingCrew: boolean;
  isSubmitting: boolean;
  onCancel: () => void;
  onSubmit: (ambulanceId?: string, driverId?: string) => void;
}) {
  const [ambulanceId, setAmbulanceId] = useState("");
  const [driverId, setDriverId] = useState("");

  if (isLoadingCrew) {
    return (
      <div className="mt-3 w-72 rounded-lg border border-line bg-surface-sunken p-3 text-xs text-ink-muted">
        Checking crew availability…
      </div>
    );
  }

  const noCrew = ambulances.length === 0 || drivers.length === 0;

  return (
    <div className="mt-3 w-80 space-y-3 rounded-lg border border-line bg-surface-sunken p-4 text-left">
      {noCrew ? (
        <FormBanner>
          {ambulances.length === 0 && drivers.length === 0
            ? "No crew is available right now. Free an ambulance or driver first."
            : ambulances.length === 0
              ? "No ambulance is available."
              : "No driver is available."}
        </FormBanner>
      ) : null}

      <Select
        label="Ambulance"
        name="ambulanceId"
        value={ambulanceId}
        onChange={(e) => setAmbulanceId(e.target.value)}
        hint="Leave blank to auto-assign."
      >
        <option value="">Auto-assign</option>
        {ambulances.map((ambulance) => (
          <option key={ambulance.id} value={ambulance.id}>
            {ambulance.vehicleNumber} · {ambulance.type} · {ambulance.stationZone}
          </option>
        ))}
      </Select>

      <Select
        label="Driver"
        name="driverId"
        value={driverId}
        onChange={(e) => setDriverId(e.target.value)}
        hint="Leave blank to auto-assign."
      >
        <option value="">Auto-assign</option>
        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.name} · {driver.phone}
          </option>
        ))}
      </Select>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          isLoading={isSubmitting}
          disabled={noCrew}
          // Both fields blank is valid: the backend auto-assigns the first available crew.
          onClick={() => onSubmit(ambulanceId || undefined, driverId || undefined)}
        >
          Send
        </Button>
        <Button size="sm" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}

export default function DispatchPage() {
  return (
    <RequireRole allow={["DISPATCHER", "ADMIN"]}>
      <DispatchScreen />
    </RequireRole>
  );
}
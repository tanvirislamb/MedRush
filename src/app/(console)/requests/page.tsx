"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Siren, X } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/Components/Button";
import { EmptyState, ErrorState, LoadingState, Pagination, TableShell, Td, Th } from "@/Components/Data";
import { Field, FormBanner, Select, Textarea } from "@/Components/Form";
import { PageHeader, Panel, PanelHeader, StatCard } from "@/Components/Layout";
import { RequireRole } from "@/Components/RequireRole";
import { StatusTag } from "@/Components/StatusTag";
import { usePagination } from "@/Hooks/usePagination";
import { useToast } from "@/Hooks/useToast";
import { emergencyRequestService } from "@/Services/emergencyRequestService";
import { ApiError } from "@/Services/httpClient";
import { formatDateTime } from "@/Utils/format";
import { PRIORITY, PRIORITY_ORDER, REQUEST_STATUS, TRIP_STATUS } from "@/Utils/presentation";
import type { Priority, RequestStatus } from "@/Types/domain";

const STATUS_FILTERS: Array<{ value: RequestStatus | "ALL"; label: string }> = [
  { value: "ALL", label: "All statuses" },
  { value: "PENDING", label: "Awaiting crew" },
  { value: "DISPATCHED", label: "Crew assigned" },
  { value: "CANCELLED", label: "Cancelled" },
];

function RequestsScreen() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { page, limit, meta, applyMeta, setPage, reset } = usePagination();

  const [status, setStatus] = useState<RequestStatus | "ALL">("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [contact, setContact] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [priority, setPriority] = useState<Priority>("HIGH");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const list = useQuery({
    queryKey: ["requests", "mine", page, status],
    queryFn: () =>
      emergencyRequestService.listMine({ page, limit, ...(status === "ALL" ? {} : { status }) }),
  });

  // Feed the backend's meta into the pagination hook.
  useEffect(() => {
    applyMeta(list.data?.meta);
  }, [list.data?.meta, applyMeta]);

  const create = useMutation({
    mutationFn: emergencyRequestService.create,
    onSuccess: async () => {
      notify({ title: "Request sent", description: "A dispatcher will assign a crew shortly.", tone: "success" });
      setIsFormOpen(false);
      setPatientName("");
      setContact("");
      setPickupLocation("");
      setNote("");
      setPriority("HIGH");
      setFormError(null);
      setFieldErrors({});
      reset();
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        setFormError(error.message);
        setFieldErrors(error.fieldErrors);
      } else {
        setFormError("Could not send your request.");
      }
    },
  });

  const cancel = useMutation({
    mutationFn: emergencyRequestService.cancel,
    onSuccess: async () => {
      notify({ title: "Request cancelled", tone: "info" });
      await queryClient.invalidateQueries({ queryKey: ["requests"] });
    },
    onError: (error) =>
      notify({
        title: "Could not cancel",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    create.mutate({
      patientName: patientName.trim(),
      contact: contact.trim(),
      pickupLocation: pickupLocation.trim(),
      priority,
      ...(note.trim() ? { note: note.trim() } : {}),
    });
  }

  const rows = list.data?.data ?? [];
  const pendingCount = rows.filter((r) => r.status === "PENDING").length;
  const assignedCount = rows.filter((r) => r.status === "DISPATCHED").length;

  return (
    <>
      <PageHeader
        eyebrow="Patient"
        title="My requests"
        description="Every ambulance request you have raised, newest first."
        actions={
          <Button
            onClick={() => setIsFormOpen((open) => !open)}
            icon={<Plus className="h-4 w-4" aria-hidden="true" />}
          >
            {isFormOpen ? "Close form" : "Request an ambulance"}
          </Button>
        }
      />

      {isFormOpen ? (
        <Panel raised className="mb-6 p-5">
          <h2 className="mb-4 text-base font-semibold text-ink">New emergency request</h2>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {formError ? <FormBanner>{formError}</FormBanner> : null}

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Patient name"
                name="patientName"
                placeholder="Who needs help?"
                required
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                error={fieldErrors.patientName}
              />
              <Field
                label="Contact number"
                name="contact"
                type="tel"
                placeholder="+880 1700 000000"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                error={fieldErrors.contact}
              />
            </div>

            <Field
              label="Pickup location"
              name="pickupLocation"
              placeholder="Street address, landmark or area"
              required
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              error={fieldErrors.pickupLocation}
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Priority"
                name="priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                hint="Choose CRITICAL only for life-threatening situations."
              >
                {PRIORITY_ORDER.map((level) => (
                  <option key={level} value={level}>
                    {level.charAt(0) + level.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
              <Textarea
                label="Notes"
                name="note"
                placeholder="Symptoms, number of patients, access details"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                error={fieldErrors.note}
              />
            </div>

            <Button type="submit" isLoading={create.isPending}>
              Send request
            </Button>
          </form>
        </Panel>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <StatCard label="Awaiting a crew" value={pendingCount} tone={pendingCount ? "warning" : "neutral"} />
        <StatCard label="Crew assigned" value={assignedCount} tone="brand" />
      </div>

      <Panel>
        <PanelHeader
          title="Request history"
          actions={
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
          }
        />

        {list.isLoading ? (
          <LoadingState />
        ) : list.isError ? (
          <ErrorState message={(list.error as Error).message} onRetry={() => list.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title={status === "ALL" ? "No requests yet" : "Nothing matches this filter"}
            description="Use “Request an ambulance” to raise your first request."
            icon={<Siren className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Pickup</Th>
                  <Th>Priority</Th>
                  <Th>Status</Th>
                  <Th>Trip</Th>
                  <Th>Raised</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((request) => (
                  <tr key={request.id} className="hover:bg-surface-sunken/60">
                    <Td>
                      <p className="font-medium">{request.pickupLocation}</p>
                      {request.note ? (
                        <p className="mt-0.5 line-clamp-1 text-xs text-ink-subtle">{request.note}</p>
                      ) : null}
                    </Td>
                    <Td>
                      <StatusTag
                        presentation={PRIORITY[request.priority]}
                        pulse={request.priority === "CRITICAL" && request.status === "PENDING"}
                      />
                    </Td>
                    <Td>
                      <StatusTag presentation={REQUEST_STATUS[request.status]} />
                    </Td>
                    <Td>
                      {request.trip ? (
                        <StatusTag presentation={TRIP_STATUS[request.trip.status]} />
                      ) : (
                        <span className="text-xs text-ink-subtle">—</span>
                      )}
                    </Td>
                    <Td className="whitespace-nowrap text-xs text-ink-muted">
                      {formatDateTime(request.createdAt)}
                    </Td>
                    <Td className="text-right">
                      {request.status === "PENDING" ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          icon={<X className="h-3.5 w-3.5" aria-hidden="true" />}
                          isLoading={cancel.isPending}
                          onClick={() => cancel.mutate(request.id)}
                        >
                          Cancel
                        </Button>
                      ) : (
                        <span className="text-xs text-ink-subtle">—</span>
                      )}
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

export default function RequestsPage() {
  return (
    <RequireRole allow={["PATIENT"]}>
      <RequestsScreen />
    </RequireRole>
  );
}
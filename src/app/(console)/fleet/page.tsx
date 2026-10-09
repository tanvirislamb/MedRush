"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ambulance, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/Components/Button";
import { EmptyState, ErrorState, LoadingState, Pagination, TableShell, Td, Th } from "@/Components/Data";
import { Field, FormBanner, Select } from "@/Components/Form";
import { PageHeader, Panel, PanelHeader, StatCard } from "@/Components/Layout";
import { RequireRole } from "@/Components/RequireRole";
import { StatusTag } from "@/Components/StatusTag";
import { usePagination } from "@/Hooks/usePagination";
import { useToast } from "@/Hooks/useToast";
import { fleetService } from "@/Services/fleetService";
import { ApiError } from "@/Services/httpClient";
import { AVAILABILITY } from "@/Utils/presentation";
import type { AmbulanceWithUsage, Availability } from "@/Types/domain";

const AVAILABILITY_OPTIONS: Availability[] = ["AVAILABLE", "BUSY", "OFFLINE"];

function FleetScreen() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { page, limit, meta, applyMeta, setPage } = usePagination();

  const [availability, setAvailability] = useState<Availability | "ALL">("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [vehicleNumber, setVehicleNumber] = useState("");
  const [type, setType] = useState("BASIC");
  const [capacity, setCapacity] = useState("2");
  const [stationZone, setStationZone] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const fleet = useQuery({
    queryKey: ["fleet", "list", page, availability],
    queryFn: () => fleetService.list({ page, limit, ...(availability === "ALL" ? {} : { availability }) }),
  });

  useEffect(() => {
    applyMeta(fleet.data?.meta);
  }, [fleet.data?.meta, applyMeta]);

  const resetForm = () => {
    setEditingId(null);
    setVehicleNumber("");
    setType("BASIC");
    setCapacity("2");
    setStationZone("");
    setFormError(null);
    setFieldErrors({});
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (ambulance: AmbulanceWithUsage) => {
    setEditingId(ambulance.id);
    setVehicleNumber(ambulance.vehicleNumber);
    setType(ambulance.type);
    setCapacity(String(ambulance.capacity));
    setStationZone(ambulance.stationZone);
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const create = useMutation({
    mutationFn: fleetService.create,
    onSuccess: async () => {
      notify({ title: "Ambulance registered", tone: "success" });
      setIsFormOpen(false);
      resetForm();
      setPage(1);
      await queryClient.invalidateQueries({ queryKey: ["fleet"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        setFormError(error.message);
        setFieldErrors(error.fieldErrors);
      } else setFormError("Could not register the ambulance.");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof fleetService.update>[1] }) =>
      fleetService.update(id, body),
    onSuccess: async () => {
      notify({ title: "Ambulance updated", tone: "success" });
      closeForm();
      await queryClient.invalidateQueries({ queryKey: ["fleet"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        setFormError(error.message);
        setFieldErrors(error.fieldErrors);
      } else setFormError("Could not update the ambulance.");
    },
  });

  const setAvailabilityMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: Availability }) => fleetService.setAvailability(id, next),
    onSuccess: async () => {
      notify({ title: "Availability updated", tone: "success" });
      await queryClient.invalidateQueries({ queryKey: ["fleet"] });
    },
    onError: (error) =>
      notify({
        title: "Could not update",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  const retire = useMutation({
    mutationFn: fleetService.retire,
    onSuccess: async () => {
      notify({ title: "Ambulance retired", tone: "info" });
      await queryClient.invalidateQueries({ queryKey: ["fleet"] });
    },
    onError: (error) =>
      notify({
        title: "Could not retire",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    if (editingId) {
      update.mutate({
        id: editingId,
        body: {
          type,
          capacity: Number(capacity) || 2,
          stationZone: stationZone.trim(),
        },
      });
      return;
    }
    create.mutate({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
      type,
      capacity: Number(capacity) || 2,
      stationZone: stationZone.trim(),
    });
  }

  const rows = fleet.data?.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Fleet"
        title="Ambulances"
        description="Register vehicles and control whether they can be dispatched."
        actions={
          <Button
            onClick={() => (isFormOpen ? closeForm() : openCreateForm())}
            icon={<Plus className="h-4 w-4" aria-hidden="true" />}
          >
            {isFormOpen ? "Close form" : "Add ambulance"}
          </Button>
        }
      />

      {isFormOpen ? (
        <Panel raised className="mb-6 p-5">
          <h2 className="mb-4 text-base font-semibold text-ink">
            {editingId ? "Edit ambulance" : "Register an ambulance"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {formError ? <FormBanner>{formError}</FormBanner> : null}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Field
                label="Vehicle number"
                name="vehicleNumber"
                placeholder="AMB-101"
                required
                value={vehicleNumber}
                disabled={Boolean(editingId)}
                onChange={(e) => setVehicleNumber(e.target.value)}
                hint={editingId ? "Vehicle numbers can't be changed." : undefined}
                error={fieldErrors.vehicleNumber}
              />
              <Select label="Type" name="type" value={type} onChange={(e) => setType(e.target.value)}>
                {["BASIC", "ADVANCED", "NEONATAL", "MORTUA"].map((option) => (
                  <option key={option} value={option}>
                    {option.charAt(0) + option.slice(1).toLowerCase()}
                  </option>
                ))}
              </Select>
              <Field
                label="Capacity"
                name="capacity"
                type="number"
                min={1}
                max={10}
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                error={fieldErrors.capacity}
              />
              <Field
                label="Station zone"
                name="stationZone"
                placeholder="Dhanmondi"
                required
                value={stationZone}
                onChange={(e) => setStationZone(e.target.value)}
                error={fieldErrors.stationZone}
              />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" isLoading={create.isPending || update.isPending}>
                {editingId ? "Save changes" : "Register ambulance"}
              </Button>
              {editingId ? (
                <Button type="button" variant="ghost" onClick={closeForm}>
                  Cancel
                </Button>
              ) : null}
            </div>
          </form>
        </Panel>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {AVAILABILITY_OPTIONS.map((option) => (
          <StatCard
            key={option}
            label={AVAILABILITY[option].label}
            value={option === availability ? (fleet.data?.meta.total ?? 0) : "—"}
            tone={option === "AVAILABLE" ? "success" : option === "BUSY" ? "warning" : "neutral"}
          />
        ))}
      </div>

      <Panel>
        <PanelHeader
          title="Fleet"
          actions={
            <select
              value={availability}
              onChange={(e) => {
                setAvailability(e.target.value as Availability | "ALL");
                setPage(1);
              }}
              aria-label="Filter by availability"
              className="h-9 cursor-pointer rounded-lg border border-line bg-surface px-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none"
            >
              <option value="ALL">All availability</option>
              {AVAILABILITY_OPTIONS.map((option) => (
                <option key={option} value={option}>
                  {AVAILABILITY[option].label}
                </option>
              ))}
            </select>
          }
        />

        {fleet.isLoading ? (
          <LoadingState />
        ) : fleet.isError ? (
          <ErrorState message={(fleet.error as Error).message} onRetry={() => fleet.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No ambulances"
            description="Register your first vehicle to start dispatching."
            icon={<Ambulance className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Vehicle</Th>
                  <Th>Type</Th>
                  <Th>Zone</Th>
                  <Th>Capacity</Th>
                  <Th>Trips</Th>
                  <Th>Availability</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((ambulance) => (
                  <tr key={ambulance.id} className="hover:bg-surface-sunken/60">
                    <Td className="font-medium">{ambulance.vehicleNumber}</Td>
                    <Td className="text-ink-muted">{ambulance.type}</Td>
                    <Td className="text-ink-muted">{ambulance.stationZone}</Td>
                    <Td className="tabular-nums text-ink-muted">{ambulance.capacity}</Td>
                    <Td className="tabular-nums text-ink-muted">{ambulance._count.trips}</Td>
                    <Td>
                      {ambulance.deletedAt ? (
                        <StatusTag presentation={{ label: "Retired", tone: "neutral" }} />
                      ) : (
                        <StatusTag presentation={AVAILABILITY[ambulance.availability]} />
                      )}
                    </Td>
                    <Td className="text-right">
                      {ambulance.deletedAt ? (
                        <span className="text-xs text-ink-subtle">—</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Edit ${ambulance.vehicleNumber}`}
                            icon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
                            onClick={() => openEditForm(ambulance)}
                          />
                          <Select
                            aria-label={`Set availability for ${ambulance.vehicleNumber}`}
                            name={`availability-${ambulance.id}`}
                            value={ambulance.availability}
                            className="h-8 w-32"
                            disabled={
                              setAvailabilityMutation.isPending &&
                              setAvailabilityMutation.variables?.id === ambulance.id
                            }
                            onChange={(e) =>
                              setAvailabilityMutation.mutate({
                                id: ambulance.id,
                                next: e.target.value as Availability,
                              })
                            }
                          >
                            {AVAILABILITY_OPTIONS.map((option) => (
                              <option key={option} value={option}>
                                {AVAILABILITY[option].label}
                              </option>
                            ))}
                          </Select>
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Retire ${ambulance.vehicleNumber}`}
                            isLoading={retire.isPending && retire.variables === ambulance.id}
                            onClick={() => retire.mutate(ambulance.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        </div>
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

export default function FleetPage() {
  return (
    <RequireRole allow={["DISPATCHER", "ADMIN"]}>
      <FleetScreen />
    </RequireRole>
  );
}
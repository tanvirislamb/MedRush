"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Search, Users } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/Components/Button";
import { EmptyState, ErrorState, LoadingState, Pagination, TableShell, Td, Th } from "@/Components/Data";
import { Field, FormBanner, Select } from "@/Components/Form";
import { PageHeader, Panel, PanelHeader } from "@/Components/Layout";
import { RequireRole } from "@/Components/RequireRole";
import { StatusTag } from "@/Components/StatusTag";
import { useDebouncedValue } from "@/Hooks/useDebouncedValue";
import { usePagination } from "@/Hooks/usePagination";
import { useToast } from "@/Hooks/useToast";
import { crewService } from "@/Services/crewService";
import { administrationService } from "@/Services/administrationService";
import { ApiError } from "@/Services/httpClient";
import { useSession } from "@/Hooks/useSession";
import { AVAILABILITY } from "@/Utils/presentation";
import type { Availability, DriverWithAccount } from "@/Types/domain";

const AVAILABILITY_OPTIONS: Availability[] = ["AVAILABLE", "BUSY", "OFFLINE"];

function CrewScreen() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { role } = useSession();
  const { page, limit, meta, applyMeta, setPage } = usePagination();

  const [search, setSearch] = useState("");
  const [availability, setAvailability] = useState<Availability | "ALL">("ALL");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [licenseNo, setLicenseNo] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const debouncedSearch = useDebouncedValue(search);

  const crew = useQuery({
    queryKey: ["crew", "list", page, availability, debouncedSearch],
    queryFn: () =>
      crewService.list({
        page,
        limit,
        ...(availability === "ALL" ? {} : { availability }),
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      }),
  });

  // A driver profile must hang off an existing account, so admins need the user list
  // to pick from. Dispatchers do not have /admin/users access.
  const isAdmin = role === "ADMIN";
  const users = useQuery({
    queryKey: ["admin", "users", "for-driver"],
    queryFn: () => administrationService.listUsers({ limit: 100 }),
    enabled: isAdmin && isFormOpen,
  });

  useEffect(() => {
    applyMeta(crew.data?.meta);
  }, [crew.data?.meta, applyMeta]);

  const resetForm = () => {
    setEditingId(null);
    setUserId("");
    setName("");
    setPhone("");
    setLicenseNo("");
    setFormError(null);
    setFieldErrors({});
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (driver: DriverWithAccount) => {
    setEditingId(driver.id);
    setName(driver.name);
    setPhone(driver.phone);
    setLicenseNo(driver.licenseNo);
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const create = useMutation({
    mutationFn: crewService.create,
    onSuccess: async () => {
      notify({ title: "Driver profile created", tone: "success" });
      setIsFormOpen(false);
      resetForm();
      setPage(1);
      await queryClient.invalidateQueries({ queryKey: ["crew"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        setFormError(error.message);
        setFieldErrors(error.fieldErrors);
      } else setFormError("Could not create the driver profile.");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof crewService.update>[1] }) =>
      crewService.update(id, body),
    onSuccess: async () => {
      notify({ title: "Driver profile updated", tone: "success" });
      closeForm();
      await queryClient.invalidateQueries({ queryKey: ["crew"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        setFormError(error.message);
        setFieldErrors(error.fieldErrors);
      } else setFormError("Could not update the driver profile.");
    },
  });

  const setAvailabilityMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: Availability }) => crewService.setAvailability(id, next),
    onSuccess: async () => {
      notify({ title: "Availability updated", tone: "success" });
      await queryClient.invalidateQueries({ queryKey: ["crew"] });
    },
    onError: (error) =>
      notify({
        title: "Could not update",
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
          name: name.trim(),
          phone: phone.trim(),
          licenseNo: licenseNo.trim(),
        },
      });
      return;
    }
    create.mutate({
      userId,
      name: name.trim(),
      phone: phone.trim(),
      licenseNo: licenseNo.trim(),
    });
  }

  const rows = crew.data?.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Crew"
        title="Drivers"
        description="Driver profiles, their linked accounts and current availability."
        actions={
          <Button
            onClick={() => (isFormOpen ? closeForm() : openCreateForm())}
            icon={<Plus className="h-4 w-4" aria-hidden="true" />}
          >
            {isFormOpen ? "Close form" : "Add driver"}
          </Button>
        }
      />

      {isFormOpen ? (
        <Panel raised className="mb-6 p-5">
          <h2 className="mb-4 text-base font-semibold text-ink">
            {editingId ? "Edit driver profile" : "Create a driver profile"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {formError ? <FormBanner>{formError}</FormBanner> : null}

            {editingId ? (
              <FormBanner tone="info">
                The linked account can&apos;t be changed; only the profile details below.
              </FormBanner>
            ) : isAdmin ? (
              <Select
                label="Linked account"
                name="userId"
                required
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                hint={
                  users.isLoading
                    ? "Loading accounts…"
                    : "The driver needs an existing user account to attach to."
                }
                error={fieldErrors.userId}
              >
                <option value="">Choose an account…</option>
                {users.data?.data
                  .filter((user) => !user.deletedAt)
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} · {user.email} · {user.role}
                    </option>
                  ))}
              </Select>
            ) : (
              <FormBanner tone="info">
                Only administrators can attach a driver profile to a user account. Ask an admin to
                create the profile for you.
              </FormBanner>
            )}

            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Full name"
                name="name"
                placeholder="John Doe"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
              />
              <Field
                label="Phone"
                name="phone"
                type="tel"
                placeholder="+880 1700 000000"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                error={fieldErrors.phone}
              />
              <Field
                label="Licence number"
                name="licenseNo"
                placeholder="DL-2024-8891"
                required
                value={licenseNo}
                onChange={(e) => setLicenseNo(e.target.value)}
                error={fieldErrors.licenseNo}
              />
            </div>

            <div className="flex items-center gap-2">
              <Button type="submit" isLoading={create.isPending || update.isPending} disabled={!editingId && !isAdmin}>
                {editingId ? "Save changes" : "Create profile"}
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

      <Panel>
        <PanelHeader
          title="Driver roster"
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
                  placeholder="Name, phone, licence…"
                  aria-label="Search drivers"
                  className="h-9 w-56 rounded-lg border border-line bg-surface pl-8 pr-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
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
            </div>
          }
        />

        {crew.isLoading ? (
          <LoadingState />
        ) : crew.isError ? (
          <ErrorState message={(crew.error as Error).message} onRetry={() => crew.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No drivers"
            description="Create a driver profile so ambulances can be crewed."
            icon={<Users className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Driver</Th>
                  <Th>Phone</Th>
                  <Th>Licence</Th>
                  <Th>Account</Th>
                  <Th>Availability</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((driver) => (
                  <tr key={driver.id} className="hover:bg-surface-sunken/60">
                    <Td className="font-medium">{driver.name}</Td>
                    <Td className="text-ink-muted">{driver.phone}</Td>
                    <Td className="text-ink-muted">{driver.licenseNo}</Td>
                    <Td className="text-xs text-ink-muted">{driver.user?.email ?? "—"}</Td>
                    <Td>
                      <StatusTag presentation={AVAILABILITY[driver.availability]} />
                    </Td>
                    <Td className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label={`Edit ${driver.name}`}
                          icon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
                          onClick={() => openEditForm(driver)}
                        />
                        <Select
                          aria-label={`Set availability for ${driver.name}`}
                          name={`driver-availability-${driver.id}`}
                          value={driver.availability}
                          className="ml-auto h-8 w-32"
                          disabled={
                            setAvailabilityMutation.isPending &&
                            setAvailabilityMutation.variables?.id === driver.id
                          }
                          onChange={(e) =>
                            setAvailabilityMutation.mutate({
                              id: driver.id,
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
                      </div>
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

export default function CrewPage() {
  return (
    <RequireRole allow={["DISPATCHER", "ADMIN"]}>
      <CrewScreen />
    </RequireRole>
  );
}
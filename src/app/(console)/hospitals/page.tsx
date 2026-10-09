"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Building2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/Components/Button";
import { EmptyState, ErrorState, LoadingState, Pagination, TableShell, Td, Th } from "@/Components/Data";
import { Field, FormBanner, Textarea } from "@/Components/Form";
import { PageHeader, Panel, PanelHeader } from "@/Components/Layout";
import { RequireRole } from "@/Components/RequireRole";
import { useDebouncedValue } from "@/Hooks/useDebouncedValue";
import { usePagination } from "@/Hooks/usePagination";
import { useToast } from "@/Hooks/useToast";
import { hospitalService } from "@/Services/hospitalService";
import { ApiError } from "@/Services/httpClient";
import type { HospitalWithUsage } from "@/Types/domain";

function HospitalsScreen() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { page, limit, meta, applyMeta, setPage } = usePagination();

  const [search, setSearch] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [contact, setContact] = useState("");
  const [services, setServices] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const debouncedSearch = useDebouncedValue(search);

  const hospitals = useQuery({
    queryKey: ["hospitals", "list", page, debouncedSearch],
    queryFn: () =>
      hospitalService.list({ page, limit, ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}) }),
  });

  useEffect(() => {
    applyMeta(hospitals.data?.meta);
  }, [hospitals.data?.meta, applyMeta]);

  const resetForm = () => {
    setEditingId(null);
    setName("");
    setAddress("");
    setContact("");
    setServices("");
    setFormError(null);
    setFieldErrors({});
  };

  const openCreateForm = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const openEditForm = (hospital: HospitalWithUsage) => {
    setEditingId(hospital.id);
    setName(hospital.name);
    setAddress(hospital.address);
    setContact(hospital.contact);
    setServices(hospital.services ?? "");
    setFormError(null);
    setFieldErrors({});
    setIsFormOpen(true);
  };

  const closeForm = () => {
    resetForm();
    setIsFormOpen(false);
  };

  const create = useMutation({
    mutationFn: hospitalService.create,
    onSuccess: async () => {
      notify({ title: "Hospital added", tone: "success" });
      setIsFormOpen(false);
      resetForm();
      setPage(1);
      await queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        setFormError(error.message);
        setFieldErrors(error.fieldErrors);
      } else setFormError("Could not add the hospital.");
    },
  });

  const update = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Parameters<typeof hospitalService.update>[1] }) =>
      hospitalService.update(id, body),
    onSuccess: async () => {
      notify({ title: "Hospital updated", tone: "success" });
      closeForm();
      await queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
    onError: (error) => {
      if (error instanceof ApiError) {
        setFormError(error.message);
        setFieldErrors(error.fieldErrors);
      } else setFormError("Could not update the hospital.");
    },
  });

  const retire = useMutation({
    mutationFn: hospitalService.retire,
    onSuccess: async () => {
      notify({ title: "Hospital removed", tone: "info" });
      await queryClient.invalidateQueries({ queryKey: ["hospitals"] });
    },
    onError: (error) =>
      notify({
        title: "Could not remove",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFieldErrors({});
    const body = {
      name: name.trim(),
      address: address.trim(),
      contact: contact.trim(),
      services: services.trim(),
    };
    if (editingId) update.mutate({ id: editingId, body });
    else
      create.mutate({
        name: body.name,
        address: body.address,
        contact: body.contact,
        ...(body.services ? { services: body.services } : {}),
      });
  }

  const rows = hospitals.data?.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Referral network"
        title="Hospitals"
        description="Hospitals that trips can be routed to on arrival."
        actions={
          <Button
            onClick={() => (isFormOpen ? closeForm() : openCreateForm())}
            icon={<Plus className="h-4 w-4" aria-hidden="true" />}
          >
            {isFormOpen ? "Close form" : "Add hospital"}
          </Button>
        }
      />

      {isFormOpen ? (
        <Panel raised className="mb-6 p-5">
          <h2 className="mb-4 text-base font-semibold text-ink">
            {editingId ? "Edit hospital" : "Add a hospital"}
          </h2>
          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            {formError ? <FormBanner>{formError}</FormBanner> : null}
            <div className="grid gap-4 sm:grid-cols-3">
              <Field
                label="Name"
                name="name"
                placeholder="MedRush General"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                error={fieldErrors.name}
              />
              <Field
                label="Address"
                name="address"
                placeholder="House 12, Green Road"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                error={fieldErrors.address}
              />
              <Field
                label="Contact"
                name="contact"
                type="tel"
                placeholder="+880 1800 000000"
                required
                value={contact}
                onChange={(e) => setContact(e.target.value)}
                error={fieldErrors.contact}
              />
            </div>
            <Textarea
              label="Services"
              name="services"
              placeholder="Emergency, ICU, trauma, maternity…"
              value={services}
              onChange={(e) => setServices(e.target.value)}
              error={fieldErrors.services}
            />
            <div className="flex items-center gap-2">
              <Button type="submit" isLoading={create.isPending || update.isPending}>
                {editingId ? "Save changes" : "Add hospital"}
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
          title="Hospital directory"
          actions={
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
                placeholder="Name, address, service…"
                aria-label="Search hospitals"
                className="h-9 w-56 rounded-lg border border-line bg-surface pl-8 pr-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
          }
        />

        {hospitals.isLoading ? (
          <LoadingState />
        ) : hospitals.isError ? (
          <ErrorState message={(hospitals.error as Error).message} onRetry={() => hospitals.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No hospitals"
            description="Add receiving hospitals so dispatchers can route arrivals."
            icon={<Building2 className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>Name</Th>
                  <Th>Address</Th>
                  <Th>Contact</Th>
                  <Th>Services</Th>
                  <Th>Trips</Th>
                  <Th className="text-right">Action</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((hospital) => (
                  <tr key={hospital.id} className="hover:bg-surface-sunken/60">
                    <Td className="font-medium">
                      {hospital.name}
                      {hospital.deletedAt ? (
                        <span className="ml-2 text-xs font-normal text-ink-subtle">(removed)</span>
                      ) : null}
                    </Td>
                    <Td className="max-w-56 text-ink-muted">{hospital.address}</Td>
                    <Td className="text-ink-muted">{hospital.contact}</Td>
                    <Td className="max-w-56 text-xs text-ink-muted">{hospital.services ?? "—"}</Td>
                    <Td className="tabular-nums text-ink-muted">{hospital._count.trips}</Td>
                    <Td className="text-right">
                      {hospital.deletedAt ? (
                        <span className="text-xs text-ink-subtle">—</span>
                      ) : (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Edit ${hospital.name}`}
                            icon={<Pencil className="h-3.5 w-3.5" aria-hidden="true" />}
                            onClick={() => openEditForm(hospital)}
                          />
                          <Button
                            variant="ghost"
                            size="sm"
                            aria-label={`Remove ${hospital.name}`}
                            isLoading={retire.isPending && retire.variables === hospital.id}
                            onClick={() => retire.mutate(hospital.id)}
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

export default function HospitalsPage() {
  return (
    <RequireRole allow={["DISPATCHER", "ADMIN"]}>
      <HospitalsScreen />
    </RequireRole>
  );
}
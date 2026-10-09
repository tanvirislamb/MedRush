"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Users } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState, ErrorState, LoadingState, Pagination, TableShell, Td, Th } from "@/Components/Data";
import { PageHeader, Panel, PanelHeader } from "@/Components/Layout";
import { RequireRole } from "@/Components/RequireRole";
import { StatusTag } from "@/Components/StatusTag";
import { useDebouncedValue } from "@/Hooks/useDebouncedValue";
import { usePagination } from "@/Hooks/usePagination";
import { useSession } from "@/Hooks/useSession";
import { useToast } from "@/Hooks/useToast";
import { administrationService } from "@/Services/administrationService";
import { ApiError } from "@/Services/httpClient";
import { formatDateTime } from "@/Utils/format";
import { ROLE_LABEL, USER_STATUS } from "@/Utils/presentation";
import type { Role, UserStatus } from "@/Types/domain";

const ROLES: Role[] = ["PATIENT", "DISPATCHER", "ADMIN"];
const STATUSES: UserStatus[] = ["ACTIVE", "SUSPENDED"];

function UsersScreen() {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { user: currentUser } = useSession();
  const { page, limit, meta, applyMeta, setPage } = usePagination();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "ALL">("ALL");
  const [status, setStatus] = useState<UserStatus | "ALL">("ALL");

  const debouncedSearch = useDebouncedValue(search);

  const users = useQuery({
    queryKey: ["admin", "users", page, role, status, debouncedSearch],
    queryFn: () =>
      administrationService.listUsers({
        page,
        limit,
        ...(role === "ALL" ? {} : { role }),
        ...(status === "ALL" ? {} : { status }),
        ...(debouncedSearch.trim() ? { search: debouncedSearch.trim() } : {}),
      }),
  });

  useEffect(() => {
    applyMeta(users.data?.meta);
  }, [users.data?.meta, applyMeta]);

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    await queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
  };

  const setStatusMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: UserStatus }) =>
      administrationService.setUserStatus(id, next),
    onSuccess: async () => {
      notify({ title: "User updated", tone: "success" });
      await invalidate();
    },
    onError: (error) =>
      notify({
        title: "Could not update",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  const setRoleMutation = useMutation({
    mutationFn: ({ id, next }: { id: string; next: Role }) => administrationService.setUserRole(id, next),
    onSuccess: async () => {
      notify({ title: "Role changed", tone: "success" });
      await invalidate();
    },
    onError: (error) =>
      notify({
        title: "Could not change role",
        description: error instanceof ApiError ? error.message : undefined,
        tone: "error",
      }),
  });

  const rows = users.data?.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Users"
        description="Suspend or activate accounts and change roles. You cannot modify your own account."
      />

      <Panel>
        <PanelHeader
          title="All users"
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
                  placeholder="Name or email…"
                  aria-label="Search users"
                  className="h-9 w-52 rounded-lg border border-line bg-surface pl-8 pr-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
                />
              </div>
              <select
                value={role}
                onChange={(e) => {
                  setRole(e.target.value as Role | "ALL");
                  setPage(1);
                }}
                aria-label="Filter by role"
                className="h-9 cursor-pointer rounded-lg border border-line bg-surface px-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none"
              >
                <option value="ALL">All roles</option>
                {ROLES.map((option) => (
                  <option key={option} value={option}>
                    {ROLE_LABEL[option]}
                  </option>
                ))}
              </select>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value as UserStatus | "ALL");
                  setPage(1);
                }}
                aria-label="Filter by status"
                className="h-9 cursor-pointer rounded-lg border border-line bg-surface px-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none"
              >
                <option value="ALL">All statuses</option>
                {STATUSES.map((option) => (
                  <option key={option} value={option}>
                    {USER_STATUS[option].label}
                  </option>
                ))}
              </select>
            </div>
          }
        />

        {users.isLoading ? (
          <LoadingState />
        ) : users.isError ? (
          <ErrorState message={(users.error as Error).message} onRetry={() => users.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState title="No users match" icon={<Users className="h-5 w-5" aria-hidden="true" />} />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>User</Th>
                  <Th>Role</Th>
                  <Th>Status</Th>
                  <Th>Joined</Th>
                  <Th className="text-right">Change role</Th>
                  <Th className="text-right">Toggle status</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((user) => {
                  const isSelf = user.id === currentUser?.id;
                  return (
                    <tr key={user.id} className="hover:bg-surface-sunken/60">
                      <Td>
                        <p className="font-medium">{user.name}</p>
                        <p className="mt-0.5 text-xs text-ink-subtle">{user.email}</p>
                      </Td>
                      <Td>
                        <StatusTag
                          presentation={{ label: ROLE_LABEL[user.role], tone: user.role === "ADMIN" ? "brand" : "neutral" }}
                        />
                      </Td>
                      <Td>
                        <StatusTag presentation={USER_STATUS[user.status]} />
                      </Td>
                      <Td className="whitespace-nowrap text-xs text-ink-muted">
                        {formatDateTime(user.createdAt)}
                      </Td>
                      <Td className="text-right">
                        {isSelf ? (
                          <span className="text-xs text-ink-subtle">—</span>
                        ) : (
                          <select
                            aria-label={`Change role for ${user.name}`}
                            value={user.role}
                            disabled={
                              setRoleMutation.isPending &&
                              setRoleMutation.variables?.id === user.id
                            }
                            onChange={(e) =>
                              setRoleMutation.mutate({ id: user.id, next: e.target.value as Role })
                            }
                            className="ml-auto h-8 w-32 cursor-pointer rounded-lg border border-line bg-surface px-2 text-sm text-ink focus:border-brand-500 focus:outline-none"
                          >
                            {ROLES.map((option) => (
                              <option key={option} value={option}>
                                {ROLE_LABEL[option]}
                              </option>
                            ))}
                          </select>
                        )}
                      </Td>
                      <Td className="text-right">
                        {isSelf ? (
                          <span className="text-xs text-ink-subtle">—</span>
                        ) : (
                          <select
                            aria-label={`Change status for ${user.name}`}
                            value={user.status}
                            disabled={
                              setStatusMutation.isPending &&
                              setStatusMutation.variables?.id === user.id
                            }
                            onChange={(e) =>
                              setStatusMutation.mutate({
                                id: user.id,
                                next: e.target.value as UserStatus,
                              })
                            }
                            className="ml-auto h-8 w-32 cursor-pointer rounded-lg border border-line bg-surface px-2 text-sm text-ink focus:border-brand-500 focus:outline-none"
                          >
                            {STATUSES.map((option) => (
                              <option key={option} value={option}>
                                {USER_STATUS[option].label}
                              </option>
                            ))}
                          </select>
                        )}
                      </Td>
                    </tr>
                  );
                })}
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

export default function AdminUsersPage() {
  return (
    <RequireRole allow={["ADMIN"]}>
      <UsersScreen />
    </RequireRole>
  );
}
"use client";

import { useQuery } from "@tanstack/react-query";
import { ScrollText } from "lucide-react";
import { useEffect, useState } from "react";

import { EmptyState, ErrorState, LoadingState, Pagination, TableShell, Td, Th } from "@/Components/Data";
import { PageHeader, Panel, PanelHeader } from "@/Components/Layout";
import { RequireRole } from "@/Components/RequireRole";
import { StatusTag } from "@/Components/StatusTag";
import { usePagination } from "@/Hooks/usePagination";
import { administrationService } from "@/Services/administrationService";
import { formatDateTime } from "@/Utils/format";
import { ROLE_LABEL, humaniseAuditAction } from "@/Utils/presentation";

const ENTITIES = ["TRIP", "USER", "DISPATCH_REQUEST", "HOSPITAL", "AMBULANCE"];

function AuditScreen() {
  const { page, limit, meta, applyMeta, setPage } = usePagination();
  const [entity, setEntity] = useState("");
  const [action, setAction] = useState("");

  const logs = useQuery({
    queryKey: ["admin", "audit", page, entity, action],
    queryFn: () =>
      administrationService.auditLogs({
        page,
        limit,
        ...(entity ? { entity } : {}),
        ...(action.trim() ? { action: action.trim() } : {}),
      }),
  });

  useEffect(() => {
    applyMeta(logs.data?.meta);
  }, [logs.data?.meta, applyMeta]);

  const rows = logs.data?.data ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Administration"
        title="Audit log"
        description="Immutable trail of every important action taken in the system."
      />

      <Panel>
        <PanelHeader
          title="Activity"
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={entity}
                onChange={(e) => {
                  setEntity(e.target.value);
                  setPage(1);
                }}
                aria-label="Filter by entity"
                className="h-9 cursor-pointer rounded-lg border border-line bg-surface px-2.5 text-sm text-ink focus:border-brand-500 focus:outline-none"
              >
                <option value="">All entities</option>
                {ENTITIES.map((option) => (
                  <option key={option} value={option}>
                    {option.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <input
                value={action}
                onChange={(e) => {
                  setAction(e.target.value);
                  setPage(1);
                }}
                placeholder="e.g. TRIP_STATUS_EN_ROUTE"
                aria-label="Filter by action"
                className="h-9 w-56 rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-subtle focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
              />
            </div>
          }
        />

        {logs.isLoading ? (
          <LoadingState />
        ) : logs.isError ? (
          <ErrorState message={(logs.error as Error).message} onRetry={() => logs.refetch()} />
        ) : rows.length === 0 ? (
          <EmptyState
            title="No audit entries"
            description="Actions such as dispatching a crew or changing a role are recorded here."
            icon={<ScrollText className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <>
            <TableShell>
              <thead>
                <tr>
                  <Th>When</Th>
                  <Th>Actor</Th>
                  <Th>Action</Th>
                  <Th>Entity</Th>
                  <Th>Record</Th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {rows.map((log) => (
                  <tr key={log.id} className="hover:bg-surface-sunken/60">
                    <Td className="whitespace-nowrap text-xs text-ink-muted">
                      {formatDateTime(log.createdAt)}
                    </Td>
                    <Td>
                      <p className="font-medium">{log.user?.name ?? "Unknown"}</p>
                      <p className="mt-0.5 text-xs text-ink-subtle">
                        {log.user ? ROLE_LABEL[log.user.role] : ROLE_LABEL[log.actorRole]}
                      </p>
                    </Td>
                    <Td>{humaniseAuditAction(log.action)}</Td>
                    <Td>
                      <StatusTag presentation={{ label: log.entity.replace(/_/g, " "), tone: "neutral" }} />
                    </Td>
                    <Td className="max-w-40 truncate font-mono text-xs text-ink-subtle">
                      {log.entityId ?? "—"}
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

export default function AuditPage() {
  return (
    <RequireRole allow={["ADMIN"]}>
      <AuditScreen />
    </RequireRole>
  );
}
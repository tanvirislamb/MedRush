"use client";

import { useQuery } from "@tanstack/react-query";
import { Ambulance, CreditCard, Route, Siren, Users } from "lucide-react";
import Link from "next/link";

import { EmptyState, ErrorState, LoadingState, Timestamp } from "@/Components/Data";
import { PageHeader, Panel, PanelHeader, StatCard } from "@/Components/Layout";
import { StatusTag } from "@/Components/StatusTag";
import { TripProgress } from "@/Components/TripProgress";
import { useSession } from "@/Hooks/useSession";
import { administrationService } from "@/Services/administrationService";
import { emergencyRequestService } from "@/Services/emergencyRequestService";
import { paymentService } from "@/Services/paymentService";
import { tripService } from "@/Services/tripService";
import { PRIORITY, REQUEST_STATUS, TRIP_STATUS } from "@/Utils/presentation";

export default function DashboardPage() {
  const { user, role } = useSession();

  if (role === "ADMIN") return <AdminOverview />;
  if (role === "DISPATCHER") return <DispatcherOverview name={user?.name ?? ""} />;
  return <PatientOverview name={user?.name ?? ""} />;
}

/* -------------------------------------------------------------------------- */
/* Patient                                                                    */
/* -------------------------------------------------------------------------- */

function PatientOverview({ name }: { name: string }) {
  const requests = useQuery({
    queryKey: ["requests", "mine"],
    queryFn: () => emergencyRequestService.listMine({ page: 1, limit: 5 }),
  });
  const trips = useQuery({
    queryKey: ["trips", "mine"],
    queryFn: () => tripService.listForViewer({ page: 1, limit: 5 }),
  });
  const payments = useQuery({ queryKey: ["payments"], queryFn: () => paymentService.list() });

  const activeTrip = trips.data?.data.find((trip) =>
    ["DISPATCHED", "EN_ROUTE", "AT_PICKUP", "TRANSPORTING", "ARRIVED"].includes(trip.status),
  );
  const openRequests = requests.data?.data.filter((r) => r.status === "PENDING").length ?? 0;
  const outstanding = payments.data
    ?.filter((payment) => payment.status !== "COMPLETED")
    .reduce((total, payment) => total + payment.amount, 0);

  return (
    <>
      <PageHeader
        eyebrow="Patient"
        title={`Hello, ${name.split(" ")[0]}`}
        description="Request an ambulance, then follow the crew all the way to the hospital."
        actions={
          <Link
            href="/requests"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-800 px-4 text-sm font-semibold text-ink-invert transition-colors hover:bg-brand-700"
          >
            <Siren className="h-4 w-4" aria-hidden="true" />
            New request
          </Link>
        }
      />

      {activeTrip ? (
        <Panel raised className="mb-6 p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                Active trip
              </p>
              <p className="mt-1 text-lg font-semibold text-ink">
                {activeTrip.ambulance?.vehicleNumber ?? "Crew assigned"}
                {activeTrip.driver?.name ? ` · ${activeTrip.driver.name}` : ""}
              </p>
            </div>
            <StatusTag presentation={TRIP_STATUS[activeTrip.status]} pulse />
          </div>
          <TripProgress status={activeTrip.status} />
          <Link
            href={`/trips/${activeTrip.id}`}
            className="mt-5 inline-block text-sm font-semibold text-brand-700 hover:underline"
          >
            View trip details
          </Link>
        </Panel>
      ) : null}

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard label="Open requests" value={openRequests} tone={openRequests > 0 ? "warning" : "neutral"} />
        <StatCard label="Trips" value={trips.data?.meta.total ?? 0} tone="brand" />
        <StatCard
          label="Outstanding"
          value={outstanding ? `$${outstanding.toFixed(2)}` : "$0.00"}
          tone={outstanding ? "critical" : "success"}
          hint="Unpaid trip fares"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader
            title="My recent requests"
            actions={
              <Link href="/requests" className="text-sm font-semibold text-brand-700 hover:underline">
                View all
              </Link>
            }
          />
          {requests.isLoading ? (
            <LoadingState />
          ) : requests.isError ? (
            <ErrorState message={(requests.error as Error).message} onRetry={() => requests.refetch()} />
          ) : requests.data?.data.length === 0 ? (
            <EmptyState
              title="No requests yet"
              description="When you need an ambulance, create a request and a dispatcher will assign a crew."
              icon={<Siren className="h-5 w-5" aria-hidden="true" />}
            />
          ) : (
            <ul className="divide-y divide-line">
              {requests.data?.data.map((request) => (
                <li key={request.id} className="flex items-start justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{request.pickupLocation}</p>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      <Timestamp value={request.createdAt} />
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-col items-end gap-1.5">
                    <StatusTag presentation={REQUEST_STATUS[request.status]} />
                    <StatusTag presentation={PRIORITY[request.priority]} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel>
          <PanelHeader
            title="My recent trips"
            actions={
              <Link href="/trips" className="text-sm font-semibold text-brand-700 hover:underline">
                View all
              </Link>
            }
          />
          {trips.isLoading ? (
            <LoadingState />
          ) : trips.isError ? (
            <ErrorState message={(trips.error as Error).message} onRetry={() => trips.refetch()} />
          ) : trips.data?.data.length === 0 ? (
            <EmptyState
              title="No trips yet"
              description="Trips appear here once a crew has been dispatched."
              icon={<Route className="h-5 w-5" aria-hidden="true" />}
            />
          ) : (
            <ul className="divide-y divide-line">
              {trips.data?.data.map((trip) => (
                <li key={trip.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
                  <div className="min-w-0">
                    <Link
                      href={`/trips/${trip.id}`}
                      className="truncate text-sm font-medium text-ink hover:underline"
                    >
                      {trip.request?.pickupLocation ?? "Trip"}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink-subtle">
                      <Timestamp value={trip.createdAt} />
                    </p>
                  </div>
                  <StatusTag presentation={TRIP_STATUS[trip.status]} />
                </li>
              ))}
            </ul>
          )}
        </Panel>
      </div>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Dispatcher                                                                 */
/* -------------------------------------------------------------------------- */

function DispatcherOverview({ name }: { name: string }) {
  const queue = useQuery({
    queryKey: ["requests", "queue"],
    queryFn: () => emergencyRequestService.search({ page: 1, limit: 6, status: "PENDING" }),
  });

  const pending = queue.data?.meta.total ?? 0;

  return (
    <>
      <PageHeader
        eyebrow="Dispatcher"
        title={`On shift, ${name.split(" ")[0]}`}
        description="Work the incoming queue, then assign an ambulance and driver to each request."
        actions={
          <Link
            href="/dispatch"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-brand-800 px-4 text-sm font-semibold text-ink-invert transition-colors hover:bg-brand-700"
          >
            <Siren className="h-4 w-4" aria-hidden="true" />
            Open queue
            {pending > 0 ? (
              <span className="rounded-full bg-ink-invert px-1.5 text-xs font-bold text-brand-800">
                {pending}
              </span>
            ) : null}
          </Link>
        }
      />

      <Panel>
        <PanelHeader
          title="Awaiting dispatch"
          description="Oldest requests first — critical cases are shown by priority."
        />
        {queue.isLoading ? (
          <LoadingState />
        ) : queue.isError ? (
          <ErrorState message={(queue.error as Error).message} onRetry={() => queue.refetch()} />
        ) : queue.data?.data.length === 0 ? (
          <EmptyState
            title="Queue is clear"
            description="No requests are waiting for a crew right now."
            icon={<Siren className="h-5 w-5" aria-hidden="true" />}
          />
        ) : (
          <ul className="divide-y divide-line">
            {queue.data?.data.map((request) => (
              <li key={request.id} className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-ink">{request.pickupLocation}</p>
                  <p className="mt-0.5 text-xs text-ink-subtle">
                    {request.patientName} · {request.contact} · <Timestamp value={request.createdAt} />
                  </p>
                </div>
                <StatusTag presentation={PRIORITY[request.priority]} pulse={request.priority === "CRITICAL"} />
              </li>
            ))}
          </ul>
        )}
      </Panel>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* Admin                                                                      */
/* -------------------------------------------------------------------------- */

function AdminOverview() {
  const stats = useQuery({ queryKey: ["admin", "stats"], queryFn: () => administrationService.stats() });

  if (stats.isLoading) return <LoadingState label="Loading statistics…" />;
  if (stats.isError) {
    return <ErrorState message={(stats.error as Error).message} onRetry={() => stats.refetch()} />;
  }

  const data = stats.data;
  if (!data) return null;

  return (
    <>
      <PageHeader eyebrow="Administration" title="System overview" description="Live figures across users, fleet and operations." />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total users" value={data.users.totalUsers} hint={`${data.users.totalPatients} patients`} tone="brand" />
        <StatCard
          label="Available ambulances"
          value={`${data.fleet.availableAmbulances}/${data.fleet.totalAmbulances}`}
          hint={`${data.fleet.availableDrivers}/${data.fleet.totalDrivers} drivers free`}
          tone="success"
        />
        <StatCard label="Pending requests" value={data.operations.pendingRequests} tone="warning" />
        <StatCard label="Active trips" value={data.operations.activeTrips} tone="critical" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <PanelHeader title="Priority breakdown" description="Open and historical requests by urgency." />
          {data.priorityBreakdown.length === 0 ? (
            <EmptyState title="No requests recorded" icon={<Siren className="h-5 w-5" aria-hidden="true" />} />
          ) : (
            <ul className="space-y-3 p-5">
              {data.priorityBreakdown.map((entry) => {
                const total = data.priorityBreakdown.reduce((sum, e) => sum + e._count._all, 0) || 1;
                const pct = Math.round((entry._count._all / total) * 100);
                return (
                  <li key={entry.priority}>
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <StatusTag presentation={PRIORITY[entry.priority]} />
                      <span className="font-medium tabular-nums text-ink-muted">{entry._count._all}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-surface-sunken">
                      <div className="h-full rounded-full bg-brand-700" style={{ width: `${pct}%` }} />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Panel>

        <div className="space-y-6">
          <Panel>
            <PanelHeader title="Operations" />
            <dl className="divide-y divide-line">
              {[
                ["Requests", data.operations.totalRequests, Siren],
                ["Trips", data.operations.totalTrips, Route],
                ["Completed", data.operations.completedTrips, Ambulance],
                ["Hospitals", data.fleet.totalHospitals, Users],
              ].map(([label, value, Icon]) => {
                const RowIcon = Icon as typeof Siren;
                return (
                  <div key={String(label)} className="flex items-center justify-between gap-3 px-5 py-3">
                    <dt className="flex items-center gap-2 text-sm text-ink-muted">
                      <RowIcon className="h-4 w-4" aria-hidden="true" />
                      {label as string}
                    </dt>
                    <dd className="text-sm font-semibold tabular-nums text-ink">{value as number}</dd>
                  </div>
                );
              })}
            </dl>
          </Panel>

          <Panel>
            <PanelHeader title="Revenue" />
            <div className="flex items-center gap-3 px-5 py-5">
              <CreditCard className="h-5 w-5 text-success" aria-hidden="true" />
              <p className="text-2xl font-semibold tabular-nums text-ink">
                ${data.revenue.toFixed(2)}
              </p>
            </div>
          </Panel>
        </div>
      </div>
    </>
  );
}